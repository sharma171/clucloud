import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface UserRecord {
  id: string;
  name: string;
  age: number;
  location: string;
  skillsLabel: string;
  avatarSeed: string;
  createdAt: string;
}

export interface UserFilterOptions {
  offset?: number;
  limit?: number;
  search?: string;
  location?: string;
  skill?: string;
  ageMin?: number;
  ageMax?: number;
  sortBy?: 'id' | 'name' | 'age' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedUsersResponse {
  items: UserRecord[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
    nextOffset: number | null;
    prevOffset: number | null;
  };
}

export interface FilterMetaResponse {
  locations: string[];
  skills: string[];
}

class UserService {
  private users: UserRecord[] = [];
  private isLoaded = false;
  private locationsCache: string[] = [];
  private skillsCache: string[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const dataPath = path.resolve(__dirname, '../../data/users.json');
    if (!fs.existsSync(dataPath)) {
      console.warn(`[UserService] Data file not found at ${dataPath}. Run npm run seed first.`);
      return;
    }
    console.log(`[UserService] Loading 50,000 users into memory from ${dataPath}...`);
    const raw = fs.readFileSync(dataPath, 'utf-8');
    this.users = JSON.parse(raw);
    this.isLoaded = true;

    // Pre-calculate filter metadata
    const locationsSet = new Set<string>();
    const skillsSet = new Set<string>();

    for (let i = 0; i < this.users.length; i++) {
      const u = this.users[i];
      locationsSet.add(u.location);
      const skills = u.skillsLabel.split(' • ');
      for (const s of skills) {
        skillsSet.add(s);
      }
    }

    this.locationsCache = Array.from(locationsSet).sort();
    this.skillsCache = Array.from(skillsSet).sort();

    console.log(
      `[UserService] Loaded ${this.users.length} users (${this.locationsCache.length} locations, ${this.skillsCache.length} unique skills).`
    );
  }

  public getUsers(options: UserFilterOptions = {}): PaginatedUsersResponse {
    if (!this.isLoaded) {
      this.loadData();
    }

    const {
      offset = 0,
      limit = 50,
      search,
      location,
      skill,
      ageMin,
      ageMax,
      sortBy = 'id',
      sortOrder = 'asc'
    } = options;

    const safeLimit = Math.max(1, Math.min(250, limit));
    const safeOffset = Math.max(0, offset);

    let filtered = this.users;

    // Text search (matches name, location, or skills)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q) ||
          u.skillsLabel.toLowerCase().includes(q)
      );
    }

    // Specific Location filter
    if (location && location.trim() !== '' && location !== 'ALL') {
      const loc = location.trim().toLowerCase();
      filtered = filtered.filter((u) => u.location.toLowerCase() === loc);
    }

    // Specific Skill filter
    if (skill && skill.trim() !== '' && skill !== 'ALL') {
      const sk = skill.trim().toLowerCase();
      filtered = filtered.filter((u) => u.skillsLabel.toLowerCase().includes(sk));
    }

    // Age range filters
    if (ageMin !== undefined && !isNaN(ageMin)) {
      filtered = filtered.filter((u) => u.age >= ageMin);
    }
    if (ageMax !== undefined && !isNaN(ageMax)) {
      filtered = filtered.filter((u) => u.age <= ageMax);
    }

    // Sorting (if specified and not default id asc)
    if (sortBy && (sortBy !== 'id' || sortOrder !== 'asc')) {
      filtered = [...filtered].sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string' && typeof valB === 'string') {
          const comp = valA.localeCompare(valB);
          return sortOrder === 'desc' ? -comp : comp;
        }

        if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    const total = filtered.length;
    const items = filtered.slice(safeOffset, safeOffset + safeLimit);
    const hasMore = safeOffset + safeLimit < total;
    const nextOffset = hasMore ? safeOffset + safeLimit : null;
    const prevOffset = safeOffset > 0 ? Math.max(0, safeOffset - safeLimit) : null;

    return {
      items,
      pagination: {
        total,
        offset: safeOffset,
        limit: safeLimit,
        hasMore,
        nextOffset,
        prevOffset
      }
    };
  }

  public getFilterMeta(): FilterMetaResponse {
    if (!this.isLoaded) {
      this.loadData();
    }
    return {
      locations: this.locationsCache,
      skills: this.skillsCache
    };
  }

  public getTotalCount(): number {
    return this.users.length;
  }
}

export const userService = new UserService();
