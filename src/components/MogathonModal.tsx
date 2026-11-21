"use client";

import React, { useState } from "react";
import { X, Copy, Check, Zap } from "lucide-react";
import { LeaderboardStats, LeaderboardCreator } from "@/types/leaderboard";
import { generateMogathonTweet } from "@/lib/utils";

interface MogathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: LeaderboardStats;
  topMovers: LeaderboardCreator[];
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

export function MogathonModal({
  isOpen,
  onClose,
  stats,
  topMovers,
}: MogathonModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tweetText = generateMogathonTweet(stats, topMovers);

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostToTwitter = () => {
    const encoded = encodeURIComponent(tweetText);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#121215] border border-white/[0.08] rounded-2xl shadow-2xl p-5 space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Mogathon Submission Assistant</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-zinc-400 leading-relaxed">
          Submit MotionRadar to Mogathon by sharing on X and tagging{" "}
          <span className="text-emerald-400 font-mono font-medium">@callmogbot</span>.
          Use this ready-to-post market pulse draft:
        </p>

        {/* Pre-written Tweet Box */}
        <div className="relative p-3.5 bg-[#09090B] border border-white/[0.08] rounded-xl text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed select-all">
          {tweetText}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Text"}</span>
          </button>

          <button
            onClick={handlePostToTwitter}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition"
          >
            <XIcon className="w-3.5 h-3.5" />
            <span>Post on X</span>
          </button>
        </div>

        {/* Footer links */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Tags: @callmogbot @motiongame_</span>
          <span>#MotionSeats #Mogathon</span>
        </div>
      </div>
    </div>
  );
}
