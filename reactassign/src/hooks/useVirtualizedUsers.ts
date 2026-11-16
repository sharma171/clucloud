import { useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUsers } from '../api/userApi';
import type { UserRecord } from '../types/user';

export interface UseVirtualizedUsersOptions {
  search?: string;
  location?: string;
  skill?: string;
  ageMin?: number;
  ageMax?: number;
  sortBy?: 'id' | 'name' | 'age';
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
}

const PAGE_SIZE = 100;

/**
 * Single Responsibility: Data cache management and infinite query pagination.
 * Avoids runaway loops by appending pages naturally without premature sliding-window eviction.
 */
export function useVirtualizedUsers({
  search,
  location,
  skill,
  ageMin,
  ageMax,
  sortBy,
  sortOrder,
  pageSize = PAGE_SIZE
}: UseVirtualizedUsersOptions = {}) {
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => [
      'users',
      {
        search: search?.trim() || '',
        location: location || 'ALL',
        skill: skill || 'ALL',
        ageMin: ageMin !== undefined ? ageMin : null,
        ageMax: ageMax !== undefined ? ageMax : null,
        sortBy: sortBy || 'id',
        sortOrder: sortOrder || 'asc'
      }
    ],
    [search, location, skill, ageMin, ageMax, sortBy, sortOrder]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0, signal }) => {
      return fetchUsers({
        offset: pageParam,
        limit: pageSize,
        search,
        location,
        skill,
        ageMin,
        ageMax,
        sortBy,
        sortOrder,
        signal
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.nextOffset : undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  // Flatten currently retained user records
  const allUsers = useMemo<UserRecord[]>(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data?.pages]);

  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  // Immediate Velocity Request Ejection: aborts pending HTTP queries during rapid scroll fling
  const cancelInFlightQueries = useCallback(() => {
    queryClient.cancelQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    users: allUsers,
    totalCount,
    fetchNextPage,
    hasNextPage: Boolean(hasNextPage),
    isFetching,
    isFetchingNextPage,
    status,
    error,
    cancelInFlightQueries
  };
}
