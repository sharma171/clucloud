import React from 'react';
import { MapPin, Sparkles, User as UserIcon } from 'lucide-react';

export interface UserRowProps {
  id: string;
  name: string;
  age: number;
  location: string;
  skillsLabel: string;
  avatarSeed: string;
  offsetY: number;
}

/**
 * Single Responsibility: Pure primitive leaf row presentation.
 * Clean, modern white theme styling with strict ROW_HEIGHT = 72px contract.
 * Wrapped in React.memo with strictly primitive props to ensure shallow equality checks never fail.
 */
function UserRowComponent({
  id,
  name,
  age,
  location,
  skillsLabel,
  avatarSeed,
  offsetY
}: UserRowProps) {
  return (
    <div
      className="user-row-container px-3 py-1"
      style={{
        transform: `translate3d(0, ${offsetY}px, 0)`
      }}
    >
      <div className="h-full w-full rounded-xl bg-white border border-slate-200/90 px-3.5 py-2 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xs transition-all">
        {/* Line 1: Name, ID, Location */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              title={avatarSeed}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs border border-indigo-200/70"
            >
              {name.charAt(0)}
            </div>
            <span className="font-semibold text-sm text-slate-900 truncate tracking-tight">
              {name}
            </span>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              #{id.replace('usr-', '')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-slate-600 text-xs">
            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
            <span className="truncate max-w-[150px] font-medium">{location}</span>
          </div>
        </div>

        {/* Line 2: Skills label badges and Age */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 min-w-0 text-slate-700">
            <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
            <span className="truncate text-slate-600 font-mono text-[11px]">
              {skillsLabel}
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 border border-slate-200">
            <UserIcon className="h-2.5 w-2.5 text-slate-400" />
            <span>{age} yrs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom comparator enforcing strict primitive shallow equality
function arePropsEqual(prev: UserRowProps, next: UserRowProps): boolean {
  return (
    prev.id === next.id &&
    prev.name === next.name &&
    prev.age === next.age &&
    prev.location === next.location &&
    prev.skillsLabel === next.skillsLabel &&
    prev.avatarSeed === next.avatarSeed &&
    prev.offsetY === next.offsetY
  );
}

export const UserRow = React.memo(UserRowComponent, arePropsEqual);
