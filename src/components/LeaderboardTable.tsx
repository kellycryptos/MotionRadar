"use client";

import React from "react";
import { ArrowUp, ArrowDown, Minus, ExternalLink, Sparkles, Trophy } from "lucide-react";
import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator, getCryptoCreatorInfo } from "@/lib/crypto-creators";
import { SortOption } from "./LeaderboardControls";

interface LeaderboardTableProps {
  creators: LeaderboardCreator[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectCreator: (name: string) => void;
}

export function LeaderboardTable({
  creators,
  sortOption,
  onSortChange,
  onSelectCreator,
}: LeaderboardTableProps) {
  if (creators.length === 0) {
    return (
      <div className="bg-surface border border-surface-border rounded-lg p-12 text-center">
        <p className="text-neutral-400 text-sm">No creators matched your criteria</p>
        <p className="text-neutral-600 text-xs mt-1">Try resetting the search or filter tabs</p>
      </div>
    );
  }

  const handleRankHeaderClick = () => {
    onSortChange(sortOption === "rank-asc" ? "rank-desc" : "rank-asc");
  };

  const handleDeltaHeaderClick = () => {
    onSortChange(sortOption === "delta-desc" ? "delta-asc" : "delta-desc");
  };

  const handleNameHeaderClick = () => {
    onSortChange(sortOption === "name-asc" ? "rank-asc" : "name-asc");
  };

  return (
    <div className="bg-surface border border-surface-border rounded-lg overflow-hidden shadow-xl">
      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-surface-hover/50 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              <th
                onClick={handleRankHeaderClick}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition w-20"
              >
                <div className="flex items-center gap-1">
                  <span>Rank</span>
                  {sortOption === "rank-asc" && <span className="text-emerald-400">↑</span>}
                  {sortOption === "rank-desc" && <span className="text-emerald-400">↓</span>}
                </div>
              </th>
              <th
                onClick={handleNameHeaderClick}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition"
              >
                <div className="flex items-center gap-1">
                  <span>Creator</span>
                  {sortOption === "name-asc" && <span className="text-emerald-400">↑</span>}
                </div>
              </th>
              <th
                onClick={handleDeltaHeaderClick}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition text-right w-36"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change (Δ)</span>
                  {sortOption === "delta-desc" && <span className="text-emerald-400">↓</span>}
                  {sortOption === "delta-asc" && <span className="text-emerald-400">↑</span>}
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right w-28 hidden sm:table-cell">
                Previous
              </th>
              <th className="py-3 px-4 font-semibold text-right w-32 hidden md:table-cell">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50 text-sm">
            {creators.map((creator) => {
              const isUp = creator.delta > 0;
              const isDown = creator.delta < 0;
              const isNeutral = creator.delta === 0;
              const prevPos = creator.position + creator.delta;
              const isCT = isCryptoCreator(creator.name);
              const ctInfo = getCryptoCreatorInfo(creator.name);

              const isTop1 = creator.position === 1;
              const isTop2 = creator.position === 2;
              const isTop3 = creator.position === 3;

              return (
                <tr
                  key={creator.id}
                  className="hover:bg-surface-hover/70 transition-colors group"
                >
                  {/* Rank Column */}
                  <td className="py-3.5 px-4 font-mono font-medium">
                    <div className="flex items-center gap-1.5">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 text-xs">
                          1
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-300/20 text-slate-200 font-bold border border-slate-300/40 text-xs">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-700/20 text-amber-500 font-bold border border-amber-600/40 text-xs">
                          3
                        </span>
                      ) : (
                        <span className="inline-block w-6 text-center text-neutral-400 text-xs">
                          {creator.position}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Creator Name & Badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCreator(creator.name)}
                        className="font-medium text-white group-hover:text-emerald-300 transition text-left"
                      >
                        {creator.name}
                      </button>

                      {creator.isNew && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          <Sparkles className="w-2.5 h-2.5" />
                          NEW
                        </span>
                      )}

                      {isCT && (
                        <span
                          title={ctInfo?.tag || "Crypto / CT Creator"}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        >
                          CT
                        </span>
                      )}

                      {ctInfo?.handle && (
                        <a
                          href={`https://x.com/${ctInfo.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`@${ctInfo.handle} on X`}
                          className="text-neutral-500 hover:text-neutral-300 transition"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {ctInfo?.tag && (
                      <div className="text-[11px] text-neutral-500 mt-0.5 truncate max-w-xs hidden sm:block">
                        {ctInfo.tag}
                      </div>
                    )}
                  </td>

                  {/* Delta / Movement */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-bold ${
                          isUp
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : isDown
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-surface-border/50 text-neutral-400"
                        }`}
                      >
                        {isUp && <ArrowUp className="w-3 h-3" />}
                        {isDown && <ArrowDown className="w-3 h-3" />}
                        {isNeutral && <Minus className="w-3 h-3" />}
                        <span>{isUp ? `+${creator.delta}` : creator.delta}</span>
                      </span>
                    </div>
                  </td>

                  {/* Previous Position */}
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-neutral-400 hidden sm:table-cell">
                    #{prevPos}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-right text-xs font-mono text-neutral-400 hidden md:table-cell">
                    {isCT ? (
                      <span className="text-purple-400">Crypto / CT</span>
                    ) : (
                      <span className="text-neutral-400">Culture</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
