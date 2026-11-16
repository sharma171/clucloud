import React, { useEffect, useTransition, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UserRow } from './UserRow';
import { SkeletonRow, FullPageSkeleton } from './SkeletonRow';
import { Loader2 } from 'lucide-react';
import type { UserRecord } from '../types/user';

interface VirtualListProps {
  users: UserRecord[];
  totalCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  filterResetKey?: string;
}

const ROW_HEIGHT = 72;
const OVERSCAN = 6;
const SKELETON_BUFFER_COUNT = 6; // 6 skeleton rows facade while loading upcoming 100-item chunk

/**
 * Single Responsibility: Virtualization list orchestration.
 * Configured with exact ROW_HEIGHT = 72px arithmetic.
 * Unlimited smooth infinite scrolling with 100-item chunks and bottom skeleton facades.
 * Never renders an empty screen: incorporates initialRect and synchronous fallback rows.
 */
export const VirtualList: React.FC<VirtualListProps> = ({
  users,
  totalCount,
  containerRef,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  filterResetKey
}) => {
  const [, startTransition] = useTransition();

  // Extra slots allocated at the bottom for upcoming skeletons
  const extraRows = hasNextPage ? SKELETON_BUFFER_COUNT : 0;
  const count = users.length + extraRows;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    initialRect: { width: 1200, height: 800 }
  });

  const rawVirtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  // Bulletproof Fallback: If virtualizer has not computed items yet (e.g. frame 0) but we have users,
  // generate fallback items so user NEVER sees an empty white screen!
  const virtualItems = useMemo(() => {
    if (rawVirtualItems.length > 0) return rawVirtualItems;
    if (users.length === 0) return [];
    // Fallback to first visible items for initial viewport
    const fallbackCount = Math.min(users.length, 14);
    return Array.from({ length: fallbackCount }, (_, index) => ({
      key: index,
      index,
      start: index * ROW_HEIGHT,
      size: ROW_HEIGHT,
      end: (index + 1) * ROW_HEIGHT,
      lane: 0
    }));
  }, [rawVirtualItems, users.length]);

  const lastItemIndex = virtualItems.length > 0 ? virtualItems[virtualItems.length - 1].index : -1;

  // Whenever user approaches the bottom of current records, trigger next 100 items smoothly
  useEffect(() => {
    if (lastItemIndex === -1) return;

    // Trigger when user is within 10 items of the current loaded end
    const fetchThreshold = users.length - 10;

    if (lastItemIndex >= fetchThreshold && hasNextPage && !isFetchingNextPage) {
      startTransition(() => {
        fetchNextPage();
      });
    }
  }, [lastItemIndex, users.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset scroll to top if filterResetKey changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [filterResetKey, containerRef]);

  if (users.length === 0) {
    if (hasNextPage || isFetchingNextPage) {
      return <FullPageSkeleton count={12} />;
    }
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-400 font-mono text-sm py-16">
        No records found matching query.
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      style={{
        height: `${totalHeight}px`
      }}
    >
      {virtualItems.map((virtualItem) => {
        // Render skeleton card facade for upcoming items while scrolling
        const isSkeleton = virtualItem.index >= users.length;
        if (isSkeleton) {
          const isFirstSkeleton = virtualItem.index === users.length;
          return (
            <React.Fragment key={`skeleton-${virtualItem.index}`}>
              <SkeletonRow offsetY={virtualItem.start} />
              {isFirstSkeleton && isFetchingNextPage && (
                <div
                  className="user-row-container pointer-events-none px-3 py-1 flex items-center justify-center z-10"
                  style={{
                    transform: `translate3d(0, ${virtualItem.start}px, 0)`
                  }}
                >
                  <div className="bg-indigo-600/95 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 border border-indigo-400/40 animate-pulse">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Loading 100 items... ({users.length.toLocaleString()} of {totalCount.toLocaleString()})</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        }

        const user = users[virtualItem.index];
        if (!user) return null;

        return (
          <UserRow
            key={user.id}
            id={user.id}
            name={user.name}
            age={user.age}
            location={user.location}
            skillsLabel={user.skillsLabel}
            avatarSeed={user.avatarSeed}
            offsetY={virtualItem.start}
          />
        );
      })}
    </div>
  );
};
