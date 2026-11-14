"use client";

import React from "react";
import { RefreshCw, Radio, Share2 } from "lucide-react";
import { formatTimeAgo, formatUtcDateTime } from "@/lib/utils";

interface HeaderProps {
  lastUpdated: string;
  isLive: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenShareModal: () => void;
}

export function Header({
  lastUpdated,
  isLive,
  isRefreshing,
  onRefresh,
  onOpenShareModal,
}: HeaderProps) {
  return (
    <header className="border-b border-surface-border bg-[#090a0f]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-surface-border overflow-hidden">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="absolute inset-0 rounded-lg ring-1 ring-emerald-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base">MotionRadar</span>
              <span className="text-[10px] uppercase font-mono font-medium tracking-wider px-1.5 py-0.5 rounded bg-surface-accent text-neutral-300 border border-surface-border">
                Mogathon
              </span>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Status indicator */}
          <div
            title={`Baseline updated: ${formatUtcDateTime(lastUpdated)}`}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface border border-surface-border text-xs font-mono"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"
              }`}
            />
            <span className="text-neutral-300 hidden sm:inline">
              {isLive ? "Live" : "Cached"}
            </span>
            <span className="text-neutral-500 text-[11px]">
              {formatTimeAgo(lastUpdated)}
            </span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh leaderboard"
            className="p-1.5 rounded-md bg-surface border border-surface-border text-neutral-400 hover:text-white hover:border-neutral-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          {/* Mogathon / Share Action */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
