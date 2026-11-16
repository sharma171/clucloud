import type { UsersResponse, QueryUsersParams, FilterMetaResponse } from '../types/user';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

/**
 * Pure HTTP transport layer.
 * Passes AbortSignal directly to native fetch() for immediate velocity request ejection.
 */
export async function fetchUsers({
  offset,
  limit,
  search,
  location,
  skill,
  ageMin,
  ageMax,
  sortBy,
  sortOrder,
  signal
}: QueryUsersParams): Promise<UsersResponse> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit)
  });

  if (search && search.trim() !== '') {
    params.set('search', search.trim());
  }

  if (location && location !== 'ALL') {
    params.set('location', location);
  }

  if (skill && skill !== 'ALL') {
    params.set('skill', skill);
  }

  if (ageMin !== undefined && !isNaN(ageMin)) {
    params.set('ageMin', String(ageMin));
  }

  if (ageMax !== undefined && !isNaN(ageMax)) {
    params.set('ageMax', String(ageMax));
  }

  if (sortBy) {
    params.set('sortBy', sortBy);
  }

  if (sortOrder) {
    params.set('sortOrder', sortOrder);
  }

  const response = await fetch(`${API_BASE_URL}/api/users?${params.toString()}`, {
    signal,
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: Failed to fetch users`);
  }

  return response.json();
}

/**
 * Fetch available filter metadata (unique locations & skills)
 */
export async function fetchFilterMeta(): Promise<FilterMetaResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/filters`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: Failed to fetch filter metadata`);
  }

  return response.json();
}
