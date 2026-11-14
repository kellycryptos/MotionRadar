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
  const timeAgo = formatTimeAgo(lastUpdated);

  return (
    <header className="border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & MOGATHON Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-zinc-300" />
            <span className="font-bold tracking-tight text-white text-base">
              MotionRadar
            </span>
          </div>

          <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
            MOGATHON
          </span>
        </div>

        {/* Status Pill, Refresh & Share */}
        <div className="flex items-center gap-2">
          {/* Status badge with integrated refresh button */}
          <div className="flex items-center bg-[#121215] border border-white/[0.08] rounded-xl pl-2.5 pr-1 py-1 text-xs font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div
              className="flex items-center gap-2 pr-2"
              title={`Captured: ${formatUtcDateTime(lastUpdated)}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive
                    ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-zinc-400 text-xs font-sans">
                {isLive ? `Updated ${timeAgo}` : `Cached ${timeAgo}`}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh leaderboard"
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshing ? "animate-spin text-emerald-400" : ""
                }`}
              />
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121215] hover:bg-white/[0.06] text-zinc-200 border border-white/[0.08] text-xs font-medium transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
