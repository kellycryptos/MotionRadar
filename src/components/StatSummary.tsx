"use client";

import React from "react";
import { TrendingUp, TrendingDown, Users, Flame } from "lucide-react";
import { LeaderboardStats } from "@/types/leaderboard";

interface StatSummaryProps {
  stats: LeaderboardStats;
  onSelectCreator?: (name: string) => void;
}

export function StatSummary({ stats, onSelectCreator }: StatSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Total Tracked */}
      <div className="bg-surface border border-surface-border rounded-lg p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
          <span>Creators Tracked</span>
          <Users className="w-3.5 h-3.5 text-neutral-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-white">{stats.total}</span>
          <span className="text-[11px] text-neutral-400 font-mono">
            {stats.cryptoCount} CT
          </span>
        </div>
      </div>

      {/* Active Movers */}
      <div className="bg-surface border border-surface-border rounded-lg p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
          <span>Active Movers</span>
          <Flame className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-white">{stats.moversCount}</span>
          <span className="text-[11px] text-neutral-400 font-mono">
            {stats.total > 0 ? Math.round((stats.moversCount / stats.total) * 100) : 0}% active
          </span>
        </div>
      </div>

      {/* Top Gainer */}
      <div
        onClick={() => stats.topGainer && onSelectCreator?.(stats.topGainer.name)}
        className="bg-surface border border-surface-border rounded-lg p-3.5 flex flex-col justify-between cursor-pointer hover:border-emerald-500/40 transition group"
      >
        <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
          <span>Top Gainer</span>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-white truncate max-w-[120px] group-hover:text-emerald-400 transition">
            {stats.topGainer ? stats.topGainer.name : "—"}
          </span>
          {stats.topGainer && (
            <span className="text-xs font-bold font-mono text-emerald-400">
              +{stats.topGainer.delta}
            </span>
          )}
        </div>
      </div>

      {/* Top Dip / Loser */}
      <div
        onClick={() => stats.topLoser && onSelectCreator?.(stats.topLoser.name)}
        className="bg-surface border border-surface-border rounded-lg p-3.5 flex flex-col justify-between cursor-pointer hover:border-red-500/40 transition group"
      >
        <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
          <span>Biggest Drop</span>
          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-white truncate max-w-[120px] group-hover:text-red-400 transition">
            {stats.topLoser ? stats.topLoser.name : "—"}
          </span>
          {stats.topLoser && (
            <span className="text-xs font-bold font-mono text-red-400">
              {stats.topLoser.delta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
