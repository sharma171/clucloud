import { useState, useRef, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useVirtualizedUsers } from './hooks/useVirtualizedUsers';
import { useScrollDeltaAnchor } from './hooks/useScrollDeltaAnchor';
import { fetchFilterMeta } from './api/userApi';
import { VirtualScroller } from './components/VirtualScroller';
import { VirtualList } from './components/VirtualList';
import { VirtualHeader } from './components/VirtualHeader';
import { ScrollControls } from './components/ScrollControls';
import { FullPageSkeleton } from './components/SkeletonRow';
import { AlertCircle, UserX } from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Search filter with debouncing
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebouncedValue(searchInput, 250);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  const [ageRange, setAgeRange] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'age'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Convert age range string to numeric bounds
  const { ageMin, ageMax } = useMemo(() => {
    switch (ageRange) {
      case 'UNDER_30':
        return { ageMin: undefined, ageMax: 29 };
      case '30_TO_45':
        return { ageMin: 30, ageMax: 45 };
      case 'OVER_45':
        return { ageMin: 46, ageMax: undefined };
      default:
        return { ageMin: undefined, ageMax: undefined };
    }
  }, [ageRange]);

  // Load filter metadata (locations & skills list)
  const { data: filterMeta } = useQuery({
    queryKey: ['filterMeta'],
    queryFn: fetchFilterMeta,
    staleTime: Infinity
  });

  // Unique key identifying current filter configuration
  const filterResetKey = useMemo(
    () => `${debouncedSearch}|${selectedLocation}|${selectedSkill}|${ageRange}|${sortBy}|${sortOrder}`,
    [debouncedSearch, selectedLocation, selectedSkill, ageRange, sortBy, sortOrder]
  );

  // Data fetching via TanStack Query infinite query (100 items per chunk, unlimited scrolling)
  const {
    users,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
    cancelInFlightQueries
  } = useVirtualizedUsers({
    search: debouncedSearch,
    location: selectedLocation,
    skill: selectedSkill,
    ageMin,
    ageMax,
    sortBy,
    sortOrder,
    pageSize: 100
  });

  // Rapid scroll fling callback -> cancel in-flight queries immediately
  const handleHighVelocity = useCallback(() => {
    cancelInFlightQueries();
  }, [cancelInFlightQueries]);

  // Telemetry & upward scroll delta anchoring
  useScrollDeltaAnchor({
    containerRef,
    totalLoadedItems: users.length,
    filterResetKey,
    onHighVelocity: handleHighVelocity
  });

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setSelectedLocation('ALL');
    setSelectedSkill('ALL');
    setAgeRange('ALL');
    setSortBy('id');
    setSortOrder('asc');
  }, []);

  // Show full-page skeleton while filtering or initial loading
  const isFilterLoading = status === 'pending' || (isFetching && users.length === 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Clean Light-Theme Header with Search & Multi-Filters */}
      <VirtualHeader
        search={searchInput}
        onSearchChange={setSearchInput}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedSkill={selectedSkill}
        onSkillChange={setSelectedSkill}
        ageRange={ageRange}
        onAgeRangeChange={setAgeRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalCount={totalCount}
        loadedCount={users.length}
        isFetching={isFetching || isFetchingNextPage}
        locations={filterMeta?.locations || []}
        skills={filterMeta?.skills || []}
        onResetFilters={handleResetFilters}
      />

      {/* Main Viewport: VirtualScroller is PERMANENTLY mounted so containerRef is never destroyed */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 relative w-full h-full max-w-6xl mx-auto px-3 sm:px-4 py-2">
          <VirtualScroller containerRef={containerRef}>
            {isFilterLoading ? (
              /* Shimmering Skeletons while loading/filtering */
              <FullPageSkeleton count={12} />
            ) : status === 'error' ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-red-600 py-16">
                <AlertCircle className="h-8 w-8 text-rose-500" />
                <p className="font-semibold text-base">Failed to connect to API server</p>
                <p className="text-xs text-slate-500">
                  Ensure Express server is active on port 5001. ({error?.message})
                </p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-400 py-24">
                <UserX className="h-10 w-10 text-slate-300 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-600">No users match your filters</p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <VirtualList
                users={users}
                totalCount={totalCount}
                containerRef={containerRef}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                filterResetKey={filterResetKey}
              />
            )}
          </VirtualScroller>

          {/* Smooth scroll jump controls */}
          <ScrollControls containerRef={containerRef} />
        </div>
      </main>
    </div>
  );
}
