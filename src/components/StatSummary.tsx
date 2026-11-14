"use client";

import React from "react";
import { TrendingUp, TrendingDown, Users, Flame } from "lucide-react";
import { LeaderboardStats } from "@/types/leaderboard";

interface StatSummaryProps {
  stats: LeaderboardStats;
  onSelectCreator?: (name: string) => void;
}

export function StatSummary({ stats, onSelectCreator }: StatSummaryProps) {
  const cultureCount = Math.max(0, stats.total - stats.cryptoCount);
  const activePercent =
    stats.total > 0 ? Math.round((stats.moversCount / stats.total) * 100) : 0;

  const totalMoves = stats.gainersCount + stats.losersCount || 1;
  const gainersRatio = (stats.gainersCount / totalMoves) * 100;
  const losersRatio = (stats.losersCount / totalMoves) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Creators Tracked */}
      <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] min-h-[120px]">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
          <span>Creators Tracked</span>
          <Users className="w-4 h-4 text-zinc-500" />
        </div>

        <div className="my-2 flex items-baseline gap-2.5">
          <span className="text-3xl font-bold font-mono text-zinc-100 tabular-nums">
            {stats.total}
          </span>
          <span className="text-xs text-zinc-400 font-mono bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-full">
            +{stats.cryptoCount} CT
          </span>
        </div>

        {/* 4px horizontal split progress bar: Culture vs CT */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(cultureCount / (stats.total || 1)) * 100}%` }}
            className="h-full bg-zinc-600"
            title={`Culture: ${cultureCount}`}
          />
          <div
            style={{ width: `${(stats.cryptoCount / (stats.total || 1)) * 100}%` }}
            className="h-full bg-emerald-500/80"
            title={`Crypto / CT: ${stats.cryptoCount}`}
          />
        </div>
      </div>

      {/* 2. Active Movers */}
      <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] min-h-[120px]">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
          <span>Active Movers</span>
          <Flame className="w-4 h-4 text-zinc-500" />
        </div>

        <div className="my-2 flex items-baseline gap-2.5">
          <span className="text-3xl font-bold font-mono text-zinc-100 tabular-nums">
            {stats.moversCount}
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            {activePercent}% active
          </span>
        </div>

        {/* 4px horizontal split progress bar: Gainers vs Drops */}
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${gainersRatio}%` }}
            className="h-full bg-emerald-500"
            title={`Gainers: ${stats.gainersCount}`}
          />
          <div
            style={{ width: `${losersRatio}%` }}
            className="h-full bg-rose-500"
            title={`Drops: ${stats.losersCount}`}
          />
        </div>
      </div>

      {/* 3. Top Gainer */}
      <div
        onClick={() => stats.topGainer && onSelectCreator?.(stats.topGainer.name)}
        className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] relative overflow-hidden cursor-pointer group hover:border-white/[0.15] transition min-h-[120px]"
      >
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/[0.05] rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium relative z-10">
          <span>Top Gainer</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="my-2 flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-baseline gap-2 truncate">
            {stats.topGainer && (
              <span className="text-xs font-mono text-zinc-500">
                #{stats.topGainer.position}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-zinc-100 truncate group-hover:text-emerald-300 transition">
              {stats.topGainer ? stats.topGainer.name : "—"}
            </span>
          </div>

          {stats.topGainer && (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-xs font-mono font-bold shrink-0">
              +{stats.topGainer.delta}
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-zinc-500">
          {stats.topGainer
            ? `prev #${stats.topGainer.position + stats.topGainer.delta} → #${stats.topGainer.position}`
            : "No gainers yet"}
        </div>
      </div>

      {/* 4. Biggest Drop */}
      <div
        onClick={() => stats.topLoser && onSelectCreator?.(stats.topLoser.name)}
        className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] relative overflow-hidden cursor-pointer group hover:border-white/[0.15] transition min-h-[120px]"
      >
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/[0.05] rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium relative z-10">
          <span>Biggest Drop</span>
          <TrendingDown className="w-4 h-4 text-rose-400" />
        </div>

        <div className="my-2 flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-baseline gap-2 truncate">
            {stats.topLoser && (
              <span className="text-xs font-mono text-zinc-500">
                #{stats.topLoser.position}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-zinc-100 truncate group-hover:text-rose-300 transition">
              {stats.topLoser ? stats.topLoser.name : "—"}
            </span>
          </div>

          {stats.topLoser && (
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md text-xs font-mono font-bold shrink-0">
              {stats.topLoser.delta}
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-zinc-500">
          {stats.topLoser
            ? `prev #${stats.topLoser.position + stats.topLoser.delta} → #${stats.topLoser.position}`
            : "No drops yet"}
        </div>
      </div>
    </div>
  );
}
