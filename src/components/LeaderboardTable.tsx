"use client";

import React from "react";
import { ArrowUp, ArrowDown, ExternalLink, Sparkles } from "lucide-react";
import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator, getCryptoCreatorInfo } from "@/lib/crypto-creators";
import { SortOption } from "./LeaderboardControls";

interface LeaderboardTableProps {
  creators: LeaderboardCreator[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectCreator: (name: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarGradient(name: string): string {
  const gradients = [
    "from-zinc-700 to-zinc-900",
    "from-slate-700 to-slate-900",
    "from-neutral-700 to-neutral-900",
    "from-stone-700 to-stone-900",
    "from-zinc-800 to-neutral-950",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function LeaderboardTable({
  creators,
  sortOption,
  onSortChange,
  onSelectCreator,
}: LeaderboardTableProps) {
  if (creators.length === 0) {
    return (
      <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-12 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <p className="text-zinc-400 text-sm">No creators matched your criteria</p>
        <p className="text-zinc-600 text-xs mt-1">
          Try resetting the search or filter tabs
        </p>
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
    <div className="bg-[#121215] border border-white/[0.07] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
      <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-10 bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.08]">
            <tr className="h-10 text-[11px] font-medium tracking-wider uppercase text-zinc-500 font-mono">
              <th
                onClick={handleRankHeaderClick}
                className="py-0 px-4 font-semibold cursor-pointer hover:text-zinc-200 transition w-20 align-middle"
              >
                <div className="flex items-center gap-1">
                  <span>Rank</span>
                  {sortOption === "rank-asc" && (
                    <span className="text-emerald-400">↑</span>
                  )}
                  {sortOption === "rank-desc" && (
                    <span className="text-emerald-400">↓</span>
                  )}
                </div>
              </th>

              <th
                onClick={handleNameHeaderClick}
                className="py-0 px-4 font-semibold cursor-pointer hover:text-zinc-200 transition align-middle"
              >
                <div className="flex items-center gap-1">
                  <span>Creator</span>
                  {sortOption === "name-asc" && (
                    <span className="text-emerald-400">↑</span>
                  )}
                </div>
              </th>

              <th
                onClick={handleDeltaHeaderClick}
                className="py-0 px-4 font-semibold cursor-pointer hover:text-zinc-200 transition text-right w-36 align-middle"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change (Δ)</span>
                  {sortOption === "delta-desc" && (
                    <span className="text-emerald-400">↓</span>
                  )}
                  {sortOption === "delta-asc" && (
                    <span className="text-emerald-400">↑</span>
                  )}
                </div>
              </th>

              <th className="py-0 px-4 font-semibold text-right w-28 hidden sm:table-cell align-middle">
                Previous
              </th>

              <th className="py-0 px-4 font-semibold text-right w-32 hidden md:table-cell align-middle">
                Category
              </th>
            </tr>
          </thead>

          {/* High-Density Body with Uniform 52px Row Height */}
          <tbody className="divide-y divide-white/[0.05] text-sm">
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
                  className="h-[52px] hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Rank Column */}
                  <td className="py-0 px-4 font-mono font-medium align-middle">
                    <div className="flex items-center">
                      {isTop1 ? (
                        <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                          #1
                        </span>
                      ) : isTop2 ? (
                        <span className="bg-zinc-300/10 text-zinc-300 border border-zinc-300/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                          #2
                        </span>
                      ) : isTop3 ? (
                        <span className="bg-amber-700/10 text-amber-500 border border-amber-600/20 px-2 py-0.5 rounded text-xs font-mono font-bold">
                          #3
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-zinc-400 px-2 py-0.5">
                          #{creator.position}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Creator Column: 28px Avatar + Name + Inline CT & Bio */}
                  <td className="py-0 px-4 align-middle">
                    <div className="flex items-center gap-2.5 max-w-xl">
                      {/* 28px Circular Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${getAvatarGradient(
                          creator.name
                        )} border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-200 shrink-0 font-mono`}
                      >
                        {getInitials(creator.name)}
                      </div>

                      {/* Name and Inline Badges/Subtitles */}
                      <div className="flex items-center gap-2 truncate min-w-0">
                        <button
                          onClick={() => onSelectCreator(creator.name)}
                          className="font-medium text-white group-hover:text-zinc-200 transition text-left truncate shrink-0"
                        >
                          {creator.name}
                        </button>

                        {creator.isNew && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 shrink-0">
                            <Sparkles className="w-2.5 h-2.5" />
                            NEW
                          </span>
                        )}

                        {isCT && (
                          <span
                            title={ctInfo?.tag || "Crypto / CT"}
                            className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0"
                          >
                            CT
                          </span>
                        )}

                        {/* Bio Subtitle inline on same line to preserve 52px height */}
                        {ctInfo?.tag && (
                          <span className="text-xs text-zinc-500 truncate hidden lg:inline">
                            · {ctInfo.tag}
                          </span>
                        )}

                        {ctInfo?.handle && (
                          <a
                            href={`https://x.com/${ctInfo.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`@${ctInfo.handle} on X`}
                            className="text-zinc-600 hover:text-zinc-400 transition shrink-0 ml-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Change (Δ) Column */}
                  <td className="py-0 px-4 text-right align-middle">
                    <div className="inline-flex items-center justify-end">
                      {isUp ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-xs font-mono font-bold inline-flex items-center gap-1">
                          <ArrowUp className="w-3 h-3" />
                          <span>+{creator.delta}</span>
                        </span>
                      ) : isDown ? (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md text-xs font-mono font-bold inline-flex items-center gap-1">
                          <ArrowDown className="w-3 h-3" />
                          <span>{creator.delta}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600 font-mono text-sm">
                          —
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Previous Position */}
                  <td className="py-0 px-4 text-right font-mono text-xs text-zinc-500 hidden sm:table-cell align-middle">
                    #{prevPos}
                  </td>

                  {/* Category */}
                  <td className="py-0 px-4 text-right text-xs font-mono text-zinc-500 hidden md:table-cell align-middle">
                    {isCT ? (
                      <span className="text-purple-400">Crypto / CT</span>
                    ) : (
                      <span className="text-zinc-500">Culture</span>
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
