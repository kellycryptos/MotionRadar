"use client";

import React, { useState } from "react";
import {
  Users,
  X,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LeaderboardCreator } from "@/types/leaderboard";
import {
  computeLineupNetDelta,
  generateLineupShareTweet,
  getScoutSignal,
} from "@/lib/scout-signals";

interface LineupDockProps {
  lineup: LeaderboardCreator[];
  onRemoveFromLineup: (creatorId: string) => void;
  onClearLineup: () => void;
  onAutoDraftMovers: () => void;
  onAutoDraftCrypto: () => void;
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
  onRemoveFromLineup,
  onClearLineup,
  onAutoDraftMovers,
  onAutoDraftCrypto,
}: LineupDockProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  if (lineup.length === 0) return null;

  const count = lineup.length;
  const isFull = count >= 5;
  const netDelta = computeLineupNetDelta(lineup);
  const netDeltaSign = netDelta > 0 ? `+${netDelta}` : `${netDelta}`;

  const handleShareToX = () => {
    const text = generateLineupShareTweet(lineup);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    const text = generateLineupShareTweet(lineup);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-6 pb-3 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <AnimatePresence mode="wait">
          {isMinimized ? (
            /* Minimized Pill View */
            <motion.div
              key="minimized"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-[#121215]/95 backdrop-blur-xl border border-white/[0.12] rounded-full px-4 py-2 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.6)] cursor-pointer hover:border-white/20 transition mx-auto w-fit gap-3"
              onClick={() => setIsMinimized(false)}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  Lineup ({count}/5)
                </span>
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    netDelta > 0
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : netDelta < 0
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                      : "bg-white/[0.05] text-zinc-400 border border-white/[0.08]"
                  }`}
                >
                  {netDeltaSign} Δ
                </span>
              </div>

              <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
                <span>Expand</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ) : (
            /* Full Floating Dock View */
            <motion.div
              key="expanded"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[#121215]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.7)] space-y-3"
            >
              {/* Dock Top Header */}
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] pb-2.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Weekly Scout Lineup
                    </span>
                  </div>

                  {/* Pick Counter Pill */}
                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                      isFull
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-white/[0.06] text-zinc-300 border-white/[0.08]"
                    }`}
                  >
                    {count}/5 Picked
                  </span>

                  {/* Net Combined Momentum Pill */}
                  <span
                    title="Combined Momentum Score of your 5 drafted creators"
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                      netDelta > 0
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : netDelta < 0
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        : "bg-white/[0.06] text-zinc-400 border-white/[0.08]"
                    }`}
                  >
                    {netDeltaSign} Δ Combined Velocity
                  </span>
                </div>

                {/* Header Controls (Auto Presets & Min/Close) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onAutoDraftMovers}
                    title="Auto-draft top 5 velocity movers"
                    className="hidden md:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition"
                  >
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Auto Movers</span>
                  </button>

                  <button
                    onClick={onAutoDraftCrypto}
                    title="Auto-draft top 5 Crypto/CT momentum creators"
                    className="hidden md:flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.06] transition"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Auto CT</span>
                  </button>

                  <button
                    onClick={onClearLineup}
                    title="Clear lineup"
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsMinimized(true)}
                    title="Minimize dock"
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 5 Creator Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((index) => {
                  const creator = lineup[index];

                  if (creator) {
                    const signal = getScoutSignal(creator);
                    const isUp = creator.delta > 0;
                    const isDown = creator.delta < 0;

                    return (
                      <div
                        key={creator.id}
                        className="relative bg-[#09090B] border border-white/[0.08] rounded-xl p-2.5 flex flex-col justify-between group hover:border-white/20 transition shadow-inner"
                      >
                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveFromLineup(creator.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 border border-white/20 text-zinc-400 hover:text-white hover:bg-rose-600 transition flex items-center justify-center text-xs shadow"
                          aria-label={`Remove ${creator.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>

                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-mono text-zinc-400 font-semibold">
                              #{creator.position}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-1 rounded ${
                                isUp
                                  ? "text-emerald-400 bg-emerald-500/10"
                                  : isDown
                                  ? "text-rose-400 bg-rose-500/10"
                                  : "text-zinc-400"
                              }`}
                            >
                              {creator.delta > 0
                                ? `+${creator.delta}`
                                : creator.delta}
                            </span>
                          </div>

                          <div className="font-semibold text-xs text-white truncate">
                            {creator.name}
                          </div>
                        </div>

                        {/* Scout Signal or Category */}
                        <div className="mt-2 pt-1 border-t border-white/[0.04]">
                          {signal ? (
                            <span
                              title={signal.thesis}
                              className={`inline-flex items-center gap-1 text-[9px] font-mono font-medium px-1.5 py-0.2 rounded border ${signal.tagColor} truncate max-w-full`}
                            >
                              <span>{signal.emoji}</span>
                              <span className="truncate">{signal.badge}</span>
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-zinc-400">
                              Slot #{index + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Empty Slot Placeholder
                  return (
                    <div
                      key={`empty-${index}`}
                      className="border border-dashed border-white/[0.12] rounded-xl p-2.5 flex flex-col items-center justify-center text-center min-h-[78px] bg-white/[0.01]"
                    >
                      <span className="text-[10px] font-mono text-zinc-400">
                        Slot {index + 1}
                      </span>
                      <span className="text-[11px] text-zinc-400 mt-0.5">
                        + Click to draft
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar: Share to X & Copy */}
              <div className="flex items-center justify-between gap-2.5 pt-1">
                <div className="text-[11px] text-zinc-400 hidden sm:block">
                  {isFull
                    ? "Lineup complete — ready for weekly lock."
                    : `Add ${5 - count} more creator${5 - count > 1 ? "s" : ""} to complete your 5-creator scout lineup.`}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium border border-white/[0.08] transition"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleShareToX}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold shadow-lg shadow-emerald-500/20 transition"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                    <span>Share Lineup to X</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
