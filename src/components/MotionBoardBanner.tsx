"use client";

import React from "react";
import { LayoutGrid, Sparkles, ArrowRight } from "lucide-react";
import { MotionBoardState, countTotalPicks } from "@/lib/board";

interface MotionBoardBannerProps {
  board: MotionBoardState;
  onOpenBoard: () => void;
  onLoadExample: () => void;
}

export function MotionBoardBanner({
  board,
  onOpenBoard,
  onLoadExample,
}: MotionBoardBannerProps) {
  const totalPicks = countTotalPicks(board);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/[0.07] via-[#121215] to-[#121215] border border-emerald-500/20 p-3.5 sm:p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-sm">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Build your Motion Board
              </span>
              <span className="font-mono text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MOGATHON TIER MAKER
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              Tier Must-Haves, Value Picks, Sleepers & Pass from live leaderboard momentum with one-line theses.
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {totalPicks === 0 ? (
            <button
              onClick={onLoadExample}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              title="One-click load an intelligent example board using live data"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Example Board</span>
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.06]">
              <span>🔥 {board["must-haves"].length}</span>
              <span>•</span>
              <span>💎 {board["value-picks"].length}</span>
              <span>•</span>
              <span>⚡ {board["sleepers"].length}</span>
              <span>•</span>
              <span>⚠️ {board["pass"].length}</span>
            </div>
          )}

          <button
            onClick={onOpenBoard}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <span>{totalPicks > 0 ? `Open Board (${totalPicks}/16)` : "Build Board"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MotionBoardBanner;
