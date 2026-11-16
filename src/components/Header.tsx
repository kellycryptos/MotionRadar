"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Radio, Share2, BookOpen, LayoutGrid } from "lucide-react";
import { formatTimeAgo, formatUtcDateTime } from "@/lib/utils";

interface HeaderProps {
  lastUpdated: string;
  isLive: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenShareModal: () => void;
  onOpenBoardModal?: () => void;
  boardPicksCount?: number;
}

export function Header({
  lastUpdated,
  isLive,
  isRefreshing,
  onRefresh,
  onOpenShareModal,
  onOpenBoardModal,
  boardPicksCount = 0,
}: HeaderProps) {
  // Live auto-refresh ticker every 3 seconds for dynamic "Xs ago" updates
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const timeAgo = formatTimeAgo(lastUpdated, now);

  return (
    <header className="border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-30 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & MOGATHON Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Radio className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="font-bold tracking-tight text-white text-base sm:text-lg shrink-0">
              MotionRadar
            </span>
          </Link>

          <span className="hidden sm:inline-flex text-[9px] uppercase font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/[0.08] shrink-0">
            MOGATHON
          </span>
        </div>

        {/* Action Controls: Board CTA, Status Pill, How it Works, Refresh & Share */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Motion Board Header CTA */}
          {onOpenBoardModal && (
            <button
              onClick={onOpenBoardModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 text-xs font-medium transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] shrink-0 cursor-pointer"
              title="Build your tiered Motion Board (Must-Haves, Value, Sleepers, Pass)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden xs:inline sm:inline">Motion Board</span>
              <span className="xs:hidden sm:hidden">Board</span>
              {boardPicksCount > 0 && (
                <span className="font-mono text-[10px] bg-emerald-500/25 text-emerald-200 px-1.5 py-0.5 rounded-full border border-emerald-500/40 font-semibold leading-none">
                  {boardPicksCount}
                </span>
              )}
            </button>
          )}

          <Link
            href="/how-it-works"
            className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.06]"
            title="How Motion Works"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How it works</span>
          </Link>

          {/* Status badge with integrated refresh button */}
          <div className="flex items-center bg-[#121215] border border-white/[0.08] rounded-xl pl-2 sm:pl-2.5 pr-1 py-1 text-xs font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] shrink-0">
            <div
              className="flex items-center gap-1.5 sm:gap-2 pr-1.5 sm:pr-2 whitespace-nowrap"
              title={`Captured: ${formatUtcDateTime(lastUpdated)}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isLive
                    ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-zinc-400 text-[11px] sm:text-xs font-sans whitespace-nowrap">
                {isLive ? `Live ${timeAgo}` : `Cached ${timeAgo}`}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh leaderboard"
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50 shrink-0 cursor-pointer"
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
            className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#121215] hover:bg-white/[0.06] text-zinc-200 border border-white/[0.08] text-xs font-medium transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] shrink-0 cursor-pointer"
            title="Share MotionRadar on X"
          >
            <Share2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
