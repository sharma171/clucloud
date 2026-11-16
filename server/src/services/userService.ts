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

const FIRST_NAMES = [
  'Aaliyah', 'Aaron', 'Abigail', 'Adam', 'Adrian', 'Aiden', 'Alex', 'Alexander', 'Alexis', 'Alice',
  'Alina', 'Amara', 'Amber', 'Amelia', 'Andrew', 'Angel', 'Anna', 'Anthony', 'Aria', 'Ariana',
  'Asher', 'Ashley', 'Austin', 'Ava', 'Benjamin', 'Blake', 'Bradley', 'Brandon', 'Brianna', 'Brooke',
  'Caleb', 'Cameron', 'Carlos', 'Caroline', 'Carter', 'Chloe', 'Christian', 'Claire', 'Colin', 'Connor',
  'Daniel', 'David', 'Derek', 'Dominic', 'Dylan', 'Elena', 'Eli', 'Elijah', 'Elizabeth', 'Ella',
  'Emily', 'Emma', 'Ethan', 'Eva', 'Evan', 'Evelyn', 'Felix', 'Gabriel', 'Grace', 'Hailey',
  'Hannah', 'Harper', 'Henry', 'Hunter', 'Ian', 'Isaac', 'Isabella', 'Isaiah', 'Jack', 'Jackson',
  'Jacob', 'James', 'Jasmine', 'Jason', 'Jayden', 'Jordan', 'Joseph', 'Joshua', 'Julia', 'Justin',
  'Kai', 'Kayla', 'Kendra', 'Kevin', 'Kira', 'Landon', 'Laura', 'Layla', 'Leo', 'Liam',
  'Lily', 'Logan', 'Lucas', 'Lucy', 'Luke', 'Madeline', 'Marcus', 'Mason', 'Maya', 'Mia',
  'Michael', 'Mila', 'Miles', 'Naomi', 'Nathan', 'Nicholas', 'Noah', 'Nolan', 'Nora', 'Oliver',
  'Olivia', 'Owen', 'Paige', 'Penelope', 'Quinn', 'Rachel', 'Riley', 'Ryan', 'Samantha', 'Samuel',
  'Sarah', 'Sebastian', 'Sienna', 'Sophia', 'Thomas', 'Tyler', 'Victoria', 'Wyatt', 'Xavier', 'Zoe'
];

const LAST_NAMES = [
  'Adams', 'Alexander', 'Allen', 'Anderson', 'Armstrong', 'Bailey', 'Baker', 'Barnes', 'Bell', 'Bennett',
  'Black', 'Bowen', 'Boyd', 'Brooks', 'Brown', 'Burns', 'Butler', 'Campbell', 'Carter', 'Chapman',
  'Clark', 'Cole', 'Coleman', 'Collins', 'Cook', 'Cooper', 'Cox', 'Crawford', 'Cruz', 'Cunningham',
  'Daniels', 'Davies', 'Davis', 'Diaz', 'Dixon', 'Edwards', 'Ellis', 'Evans', 'Ferguson', 'Fisher',
  'Flores', 'Ford', 'Foster', 'Fox', 'Garcia', 'Gibson', 'Gomez', 'Gonzales', 'Gordon', 'Graham',
  'Grant', 'Gray', 'Green', 'Griffin', 'Hall', 'Hamilton', 'Harris', 'Harrison', 'Hayes', 'Henderson',
  'Hernandez', 'Hill', 'Holmes', 'Howard', 'Hughes', 'Hunt', 'Hunter', 'Jackson', 'James', 'Jenkins',
  'Johnson', 'Jones', 'Jordan', 'Kelly', 'Kennedy', 'King', 'Knight', 'Lambert', 'Lane', 'Lawrence',
  'Lee', 'Lewis', 'Long', 'Lopez', 'Marshall', 'Martin', 'Mason', 'Matthews', 'Miller', 'Mitchell',
  'Moore', 'Morgan', 'Morris', 'Murphy', 'Myers', 'Nelson', 'Nguyen', 'Nichols', 'Oliver', 'Palmer',
  'Parker', 'Patterson', 'Perez', 'Perry', 'Peterson', 'Phillips', 'Powell', 'Price', 'Ramirez', 'Reed',
  'Reynolds', 'Richardson', 'Rivera', 'Roberts', 'Robertson', 'Robinson', 'Rodriguez', 'Rogers', 'Ross', 'Russell',
  'Sanchez', 'Sanders', 'Scott', 'Shaw', 'Simmons', 'Simpson', 'Smith', 'Snyder', 'Stephens', 'Stewart',
  'Sullivan', 'Taylor', 'Thomas', 'Thompson', 'Torres', 'Tucker', 'Turner', 'Walker', 'Wallace', 'Ward',
  'Washington', 'Watson', 'Webb', 'Wells', 'West', 'White', 'Williams', 'Wilson', 'Wood', 'Wright', 'Young'
];

const CITIES = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA',
  'Denver, CO', 'Chicago, IL', 'Toronto, ON', 'Vancouver, BC', 'London, UK',
  'Berlin, DE', 'Amsterdam, NL', 'Sydney, AU', 'Atlanta, GA', 'Portland, OR',
  'San Diego, CA', 'Los Angeles, CA', 'Miami, FL', 'Salt Lake City, UT', 'Raleigh, NC',
  'Dallas, TX', 'Phoenix, AZ', 'Minneapolis, MN', 'Boulder, CO', 'Pittsburgh, PA'
];

const SKILLS_POOL = [
  'React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Docker',
  'Kubernetes', 'Go', 'Python', 'AWS', 'Rust', 'Redis', 'Kafka', 'GCP', 'Linux',
  'MongoDB', 'Elasticsearch', 'CI/CD', 'Jest', 'Playwright', 'Terraform', 'WebSockets', 'gRPC',
  'Microservices', 'FastAPI', 'Vite', 'TanStack Query', 'Express', 'Prisma', 'Drizzle',
  'Remix', 'Supabase', 'Cypress', 'RabbitMQ', 'Snowflake', 'DynamoDB', 'OAuth2', 'WebAssembly'
];

function generateDeterministicUsers(count: number): UserRecord[] {
  const users: UserRecord[] = new Array(count);
  let seed = 42;
  function random(): number {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  const startDate = new Date(2023, 0, 1).getTime();
  const endDate = new Date(2026, 10, 1).getTime();

  for (let i = 0; i < count; i++) {
    const fn = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    const name = `${fn} ${ln}`;
    const age = Math.floor(random() * 48) + 20;
    const location = CITIES[Math.floor(random() * CITIES.length)];

    const numSkills = Math.floor(random() * 3) + 3;
    const skillsSet = new Set<string>();
    while (skillsSet.size < numSkills) {
      skillsSet.add(SKILLS_POOL[Math.floor(random() * SKILLS_POOL.length)]);
    }

    const skillsLabel = Array.from(skillsSet).join(' • ');
    const randomTimestamp = startDate + random() * (endDate - startDate);
    const createdAt = new Date(randomTimestamp).toISOString().split('T')[0];
    const padId = String(i + 1).padStart(5, '0');

    users[i] = {
      id: `usr-${padId}`,
      name,
      age,
      location,
      skillsLabel,
      avatarSeed: `${fn.toLowerCase()}-${ln.toLowerCase()}`,
      createdAt
    };
  }

  return users;
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
    const possiblePaths = [
      path.resolve(__dirname, '../../data/users.json'),
      path.resolve(__dirname, '../data/users.json'),
      path.resolve(process.cwd(), 'data/users.json'),
      path.resolve(process.cwd(), 'server/data/users.json')
    ];

    const dataPath = possiblePaths.find((p) => fs.existsSync(p));

    if (dataPath) {
      console.log(`[UserService] Loading 50,000 users into memory from ${dataPath}...`);
      const raw = fs.readFileSync(dataPath, 'utf-8');
      this.users = JSON.parse(raw);
    } else {
      console.warn(`[UserService] Data file not found on disk. Generating 50,000 deterministic records in-memory...`);
      this.users = generateDeterministicUsers(50000);
    }

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
