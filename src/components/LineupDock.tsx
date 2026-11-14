"use client";

import React, { useState } from "react";
import { Copy, Check, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LeaderboardCreator } from "@/types/leaderboard";
import {
  computeLineupNetDelta,
  generateLineupShareTweet,
  getScoutSignal,
} from "@/lib/scout-signals";

interface LineupDockProps {
  lineup: LeaderboardCreator[];
  onRemove: (creatorId: string) => void;
  onClear: () => void;
  onAutoScout: () => void;
}

function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function LineupDock({
  lineup,
  onRemove,
  onClear,
  onAutoScout,
}: LineupDockProps) {
  const [copied, setCopied] = useState(false);

  // If lineup is empty, we don't float or we show a clean compact teaser bar
  if (lineup.length === 0) return null;

  const totalDelta = computeLineupNetDelta(lineup);
  const formattedTotalDelta = totalDelta > 0 ? `+${totalDelta}` : `${totalDelta}`;

  const handleShareToX = () => {
    const tweet = generateLineupShareTweet(lineup);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopy = () => {
    const tweet = generateLineupShareTweet(lineup);
    navigator.clipboard.writeText(tweet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-[#121215]/95 backdrop-blur-xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.12)] rounded-2xl p-3 sm:px-5 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Left: Header + 5 Slots */}
      <div className="flex flex-col gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            MY WEEKLY SCOUT LINEUP ({lineup.length}/5)
          </span>

          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              totalDelta > 0
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : totalDelta < 0
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-white/[0.05] text-zinc-400 border-white/[0.08]"
            }`}
          >
            Net Velocity: {formattedTotalDelta} Δ
          </span>
        </div>

        {/* 5 Roster Slots */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((slotIndex) => {
            const creator = lineup[slotIndex];

            if (!creator) {
              return (
                <div
                  key={slotIndex}
                  className="h-9 px-3 rounded-lg border border-dashed border-white/[0.12] bg-white/[0.02] flex items-center justify-center text-[11px] font-mono text-zinc-600 select-none"
                >
                  + Slot {slotIndex + 1}
                </div>
              );
            }

            const signal = getScoutSignal(creator);

            return (
              <div
                key={creator.id}
                className="h-9 px-2.5 rounded-lg bg-[#18181C] border border-white/[0.1] flex items-center justify-between gap-1.5 text-xs text-zinc-100 shadow-sm"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-mono text-[10px] text-zinc-500">
                    #{creator.position}
                  </span>
                  <span
                    className="truncate font-medium max-w-[80px]"
                    title={`${creator.name} ${signal ? `(${signal.badge})` : ""}`}
                  >
                    {creator.name.split(" ")[0]}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      creator.delta > 0
                        ? "text-emerald-400"
                        : creator.delta < 0
                        ? "text-rose-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {creator.delta > 0 ? `+${creator.delta}` : creator.delta}
                  </span>

                  <button
                    onClick={() => onRemove(creator.id)}
                    className="text-zinc-500 hover:text-zinc-200 ml-0.5 text-xs leading-none p-0.5 rounded hover:bg-white/10 transition"
                    title={`Remove ${creator.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
        <button
          onClick={onAutoScout}
          className="px-3 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-white/[0.08] text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-sm"
          title="Auto-draft 2 Gainers, 2 CT Movers, and 1 Contrarian Dip"
        >
          <Zap className="w-3 h-3 text-emerald-400" />
          <span>Auto-Scout 5</span>
        </button>

        <button
          onClick={handleCopy}
          className="px-2.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] text-xs transition cursor-pointer flex items-center gap-1"
          title="Copy formatted tweet to clipboard"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>

        {lineup.length > 0 && (
          <button
            onClick={onClear}
            className="px-2 py-2 rounded-lg text-zinc-500 hover:text-zinc-300 text-xs transition cursor-pointer"
            title="Reset lineup"
          >
            Clear
          </button>
        )}

        <button
          onClick={handleShareToX}
          disabled={lineup.length === 0}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          <XIcon className="w-3.5 h-3.5" />
          <span>Share Lineup on X ↗</span>
        </button>
      </div>
    </div>
  );
}
