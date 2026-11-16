import React from 'react';

interface SkeletonRowProps {
  offsetY?: number;
  isAbsolute?: boolean;
}

/**
 * Single Responsibility: Pure presentation skeleton facade.
 * Matches exact ROW_HEIGHT = 72px geometry to ensure ZERO layout shift when real records arrive.
 */
export const SkeletonRow: React.FC<SkeletonRowProps> = ({ offsetY, isAbsolute = true }) => {
  const containerStyle = isAbsolute && offsetY !== undefined
    ? { transform: `translate3d(0, ${offsetY}px, 0)` }
    : undefined;

  return (
    <div
      className={isAbsolute ? 'user-row-container px-3 py-1' : 'w-full h-[72px] px-3 py-1'}
      style={containerStyle}
      aria-hidden="true"
    >
      <div className="h-full w-full rounded-xl bg-white border border-slate-200/70 px-3.5 py-2 flex flex-col justify-between shadow-2xs animate-pulse">
        {/* Line 1: Avatar circle, Name, ID, Location placeholders */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 shrink-0 rounded-full bg-slate-200" />
            <div className="h-4 w-32 sm:w-44 rounded bg-slate-200" />
            <div className="h-3 w-10 rounded bg-slate-100" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
            <div className="h-3 w-20 sm:w-28 rounded bg-slate-200" />
          </div>
        </div>

        {/* Line 2: Skills label bar and Age badge placeholders */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-3 w-40 sm:w-64 rounded bg-slate-100" />
          </div>

          <div className="shrink-0 h-4 w-14 rounded-md bg-slate-100 border border-slate-200/60" />
        </div>
      </div>
    </div>
  );
};

interface FullPageSkeletonProps {
  count?: number;
}

/**
 * Skeleton facade displayed while filtering or loading initial dataset.
 */
export const FullPageSkeleton: React.FC<FullPageSkeletonProps> = ({ count = 12 }) => {
  return (
    <div className="w-full flex flex-col gap-0 select-none py-1">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} isAbsolute={false} />
      ))}
    </div>
  );
};
