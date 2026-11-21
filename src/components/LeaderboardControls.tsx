"use client";

import React from "react";
import { Search, X, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

export type FilterCategory =
  | "all"
  | "signals"
  | "movers"
  | "gainers"
  | "losers"
  | "crypto"
  | "new";

export type SortOption =
  | "rank-asc"
  | "rank-desc"
  | "delta-desc"
  | "delta-asc"
  | "abs-delta-desc"
  | "name-asc";

interface LeaderboardControlsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onExportCsv: () => void;
  totalFiltered: number;
  totalRaw: number;
  onApplyPreset: (
    preset: "all" | "ct-elite" | "top-10" | "high-volatility" | "contrarian-dips" | "seat-meta"
  ) => void;
  activePreset: string | null;
}

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "signals", label: "Signals" },
  { id: "movers", label: "Movers" },
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Drops" },
  { id: "crypto", label: "Crypto / CT" },
  { id: "new", label: "New" },
] as const;

export function LeaderboardControls({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onSelectFilter,
  sortOption,
  onSortChange,
  onExportCsv,
  totalFiltered,
  totalRaw,
  onApplyPreset,
  activePreset,
}: LeaderboardControlsProps) {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Top Bar: Search Input (left) & Sort / CSV Export (right) */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            id="creator-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search creator (Ansem, Valkyrae, Druski)..."
            className="w-full pl-9 pr-12 py-2 bg-[#121215] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="text-zinc-400 hover:text-white p-0.5"
                title="Clear search (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-white/[0.04] border border-white/[0.08] rounded select-none pointer-events-none">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Sort dropdown and CSV export button on a clean 2-column row on mobile */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="relative flex-1 sm:flex-none flex items-center bg-[#121215] border border-white/[0.08] rounded-xl px-2.5 sm:px-3 py-2 text-xs text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 sm:mr-2 text-zinc-500 shrink-0" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1 w-full"
            >
              <option value="rank-asc" className="bg-[#121215]">
                Rank (1 → 80)
              </option>
              <option value="rank-desc" className="bg-[#121215]">
                Rank (80 → 1)
              </option>
              <option value="delta-desc" className="bg-[#121215]">
                Highest Jump (+Δ)
              </option>
              <option value="delta-asc" className="bg-[#121215]">
                Biggest Drop (-Δ)
              </option>
              <option value="abs-delta-desc" className="bg-[#121215]">
                Volatility (|Δ|)
              </option>
              <option value="name-asc" className="bg-[#121215]">
                Alphabetical (A-Z)
              </option>
            </select>
          </div>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-xs font-mono text-zinc-300 transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] shrink-0"
            title="Download visible creators as CSV"
          >
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar: Categorical Filter Tabs + Quick Presets + Counter */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 pt-0.5">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full pb-1 lg:pb-0 whitespace-nowrap w-full lg:w-auto">
          {/* Main Filter Tabs */}
          <div className="flex items-center bg-[#121215] border border-white/[0.08] p-1 rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] shrink-0">
            {FILTER_TABS.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectFilter(tab.id)}
                  className={`relative px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute inset-0 bg-zinc-800 rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider between Filter Tabs and Presets */}
          <div className="h-4 w-[1px] bg-white/10 mx-1.5 shrink-0" />

          {/* Inline Preset Chips */}
          <div className="flex items-center gap-1 text-[11px] font-mono shrink-0 whitespace-nowrap">
            <button
              onClick={() => onApplyPreset("ct-elite")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg border transition ${
                activePreset === "ct-elite"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              CT Elite
            </button>
            <button
              onClick={() => onApplyPreset("high-volatility")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg border transition ${
                activePreset === "high-volatility"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              |Δ| ≥ 2
            </button>
            <button
              onClick={() => onApplyPreset("top-10")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg border transition ${
                activePreset === "top-10"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              Top 10
            </button>
            <button
              onClick={() => onApplyPreset("contrarian-dips")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg border transition ${
                activePreset === "contrarian-dips"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              Contrarian Dips
            </button>
            <button
              onClick={() => onApplyPreset("seat-meta")}
              className={`px-2 sm:px-2.5 py-1 rounded-lg border transition ${
                activePreset === "seat-meta"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
              title="Creators with positive breakout velocity (Δ ≥ 2)"
            >
              Seat Meta
            </button>
          </div>
        </div>

        {/* Total Count Indicator */}
        <div className="text-[11px] sm:text-xs text-zinc-500 font-mono shrink-0">
          Showing {totalFiltered} of {totalRaw} creators
        </div>
      </div>
    </div>
  );
}
