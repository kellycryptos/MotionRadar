"use client";

import React from "react";
import { Search, X, Download, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

export type FilterCategory =
  | "all"
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
    preset: "all" | "ct-elite" | "top-10" | "high-volatility"
  ) => void;
  activePreset: string | null;
}

const FILTER_TABS = [
  { id: "all", label: "All" },
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
    <div className="space-y-3">
      {/* Top Bar: Search Input (left) & Sort / CSV Export (right) */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search creator (e.g. Ansem, Druski, Cobie)..."
            className="w-full pl-9 pr-8 py-2 bg-[#121215] border border-white/[0.08] rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort dropdown and CSV export button */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-[#121215] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-zinc-500" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer pr-1"
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
                Most Volatile (|Δ|)
              </option>
              <option value="name-asc" className="bg-[#121215]">
                Name (A-Z)
              </option>
            </select>
          </div>

          <button
            onClick={onExportCsv}
            title="Export filtered leaderboard as CSV"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs font-medium text-zinc-300 transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Segmented Pill Track with Inline Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center bg-[#121215] p-1 rounded-xl border border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          {/* Segmented Category Pills */}
          <div className="flex items-center gap-0.5">
            {FILTER_TABS.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectFilter(tab.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition ${
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
          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          {/* Inline Preset Chips */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => onApplyPreset("ct-elite")}
              className={`px-2.5 py-1 rounded-lg border transition ${
                activePreset === "ct-elite"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              CT Elite
            </button>
            <button
              onClick={() => onApplyPreset("high-volatility")}
              className={`px-2.5 py-1 rounded-lg border transition ${
                activePreset === "high-volatility"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              |Δ| ≥ 2
            </button>
            <button
              onClick={() => onApplyPreset("top-10")}
              className={`px-2.5 py-1 rounded-lg border transition ${
                activePreset === "top-10"
                  ? "bg-white/10 text-white border-white/20 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              Top 10
            </button>
          </div>
        </div>

        {/* Total Count Indicator */}
        <div className="text-xs text-zinc-500 font-mono">
          Showing {totalFiltered} of {totalRaw} creators
        </div>
      </div>
    </div>
  );
}
