"use client";

import React from "react";
import { Search, X, Download, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { isCryptoCreator } from "@/lib/crypto-creators";

export type FilterCategory = "all" | "movers" | "gainers" | "losers" | "crypto" | "new";
export type SortOption = "rank-asc" | "rank-desc" | "delta-desc" | "delta-asc" | "abs-delta-desc" | "name-asc";

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
  onApplyPreset: (preset: "all" | "ct-elite" | "top-10" | "high-volatility") => void;
  activePreset: string | null;
}

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
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search creator (e.g. Ansem, Druski, Cobie)..."
            className="w-full pl-9 pr-8 py-2 bg-surface border border-surface-border rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 transition font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Export controls */}
        <div className="flex items-center gap-2">
          {/* Sort selector */}
          <div className="relative flex items-center bg-surface border border-surface-border rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="rank-asc" className="bg-[#12141c]">Rank (1 → 80)</option>
              <option value="rank-desc" className="bg-[#12141c]">Rank (80 → 1)</option>
              <option value="delta-desc" className="bg-[#12141c]">Highest Jump (+Δ)</option>
              <option value="delta-asc" className="bg-[#12141c]">Biggest Drop (-Δ)</option>
              <option value="abs-delta-desc" className="bg-[#12141c]">Most Volatile (|Δ|)</option>
              <option value="name-asc" className="bg-[#12141c]">Name (A-Z)</option>
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={onExportCsv}
            title="Export filtered leaderboard as CSV"
            className="flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-surface-hover border border-surface-border rounded-lg text-xs font-medium text-neutral-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Quick Presets */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-surface-border/60">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: "all", label: "All" },
              { id: "movers", label: "Movers" },
              { id: "gainers", label: "Gainers" },
              { id: "losers", label: "Drops" },
              { id: "crypto", label: "Crypto / CT" },
              { id: "new", label: "New" },
            ] as const
          ).map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectFilter(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  isActive
                    ? "bg-neutral-200 text-neutral-900 font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-surface-hover"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 90-Second Judge Presets */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-neutral-500 mr-1 hidden md:inline">Presets:</span>
          <button
            onClick={() => onApplyPreset("ct-elite")}
            className={`px-2 py-0.5 rounded border transition ${
              activePreset === "ct-elite"
                ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                : "border-surface-border text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
            }`}
          >
            CT Elite
          </button>
          <button
            onClick={() => onApplyPreset("high-volatility")}
            className={`px-2 py-0.5 rounded border transition ${
              activePreset === "high-volatility"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "border-surface-border text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
            }`}
          >
            |Δ| ≥ 2
          </button>
          <button
            onClick={() => onApplyPreset("top-10")}
            className={`px-2 py-0.5 rounded border transition ${
              activePreset === "top-10"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                : "border-surface-border text-neutral-400 hover:text-neutral-200 hover:border-neutral-600"
            }`}
          >
            Top 10
          </button>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
        <span>
          Showing {totalFiltered} of {totalRaw} creators
        </span>
        {searchQuery && (
          <span>
            Filtered by &quot;{searchQuery}&quot;
          </span>
        )}
      </div>
    </div>
  );
}
