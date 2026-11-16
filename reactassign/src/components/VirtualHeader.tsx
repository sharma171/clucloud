import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, MapPin, Sparkles, ArrowUpDown } from 'lucide-react';

interface VirtualHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  ageRange: string;
  onAgeRangeChange: (range: string) => void;
  sortBy: 'id' | 'name' | 'age';
  onSortByChange: (sort: 'id' | 'name' | 'age') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalCount: number;
  loadedCount: number;
  isFetching: boolean;
  locations: string[];
  skills: string[];
  onResetFilters: () => void;
}

const QUICK_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Docker', 'Kubernetes', 'AWS'];

/**
 * Single Responsibility: Clean, modern light-theme Search & Filter controls.
 */
export const VirtualHeader: React.FC<VirtualHeaderProps> = ({
  search,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  selectedSkill,
  onSkillChange,
  ageRange,
  onAgeRangeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalCount,
  loadedCount,
  isFetching,
  locations,
  skills,
  onResetFilters
}) => {
  const hasActiveFilters =
    search !== '' ||
    selectedLocation !== 'ALL' ||
    selectedSkill !== 'ALL' ||
    ageRange !== 'ALL' ||
    sortBy !== 'id';

  return (
    <header className="shrink-0 bg-white border-b border-slate-200/80 shadow-xs z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2.5">
        {/* Row 1: Search bar, Scroll Limit Selector, and Counter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, location, or skill..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/70 transition-colors"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Live Count & Reset */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
            {/* Live Count Badge */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 border border-slate-200/70 px-3 py-1.5 rounded-lg shadow-2xs font-mono">
              <span className="font-semibold text-slate-900">{loadedCount.toLocaleString()}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-600">{totalCount.toLocaleString()}</span>
              {isFetching && (
                <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse ml-1" />
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-1.5 rounded-lg hover:bg-rose-100/70 transition-colors cursor-pointer font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Filter Selectors (Location, Skill, Age Range, Sort) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400 mr-1 shrink-0 font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span>Filters:</span>
          </div>

          {/* Location Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Skill Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedSkill}
              onChange={(e) => onSkillChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Skills</option>
              {skills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
            <Sparkles className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Age Range Selector */}
          <div className="relative shrink-0">
            <select
              value={ageRange}
              onChange={(e) => onAgeRangeChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">All Ages</option>
              <option value="UNDER_30">Under 30 yrs</option>
              <option value="30_TO_45">30 to 45 yrs</option>
              <option value="OVER_45">45+ yrs</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative shrink-0 ml-auto">
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('_') as ['id' | 'name' | 'age', 'asc' | 'desc'];
                onSortByChange(sb);
                onSortOrderChange(so);
              }}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-7 pr-7 py-1.5 text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs font-medium"
            >
              <option value="id_asc">Sort: Default ID</option>
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="age_asc">Age (Youngest)</option>
              <option value="age_desc">Age (Oldest)</option>
            </select>
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>
        </div>

        {/* Row 3: Quick Skill Tag Filter Chips */}
        <div className="hidden sm:flex items-center gap-1.5 flex-wrap pt-0.5 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 mr-1">Popular:</span>
          {QUICK_SKILLS.map((sk) => {
            const isSelected = selectedSkill === sk;
            return (
              <button
                key={sk}
                onClick={() => onSkillChange(isSelected ? 'ALL' : sk)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {sk}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
