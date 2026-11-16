export interface UserRecord {
  id: string;
  name: string;
  age: number;
  location: string;
  skillsLabel: string;
  avatarSeed: string;
  createdAt: string;
}

export interface UsersPagination {
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
  prevOffset: number | null;
}

export interface UsersResponse {
  items: UserRecord[];
  pagination: UsersPagination;
}

export interface QueryUsersParams {
  offset: number;
  limit: number;
  search?: string;
  location?: string;
  skill?: string;
  ageMin?: number;
  ageMax?: number;
  sortBy?: 'id' | 'name' | 'age';
  sortOrder?: 'asc' | 'desc';
  signal?: AbortSignal;
}

export interface FilterMetaResponse {
  locations: string[];
  skills: string[];
}
