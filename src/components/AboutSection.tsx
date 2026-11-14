"use client";

import React from "react";
import { Compass, Flame, Shield, TrendingUp, Layers, ExternalLink } from "lucide-react";

interface AboutSectionProps {
  onFilterMovers?: () => void;
  onFilterCrypto?: () => void;
}

export function AboutSection({ onFilterMovers, onFilterCrypto }: AboutSectionProps) {
  return (
    <section className="space-y-6 pt-10 border-t border-white/[0.08] text-zinc-300">
      {/* 1. Section Header Refinement */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Methodology & Guide</span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-100">
          About MotionRadar
        </h3>
        <p className="text-sm text-zinc-400 max-w-3xl">
          A real-time momentum radar designed for players, scouts, and creators competing on Motion.
        </p>
      </div>

      {/* 2. Visual Micro-UI Inside the 4 Guide Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: What is Motion? */}
        <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-white/[0.15] transition flex flex-col justify-between">
          <div>
            {/* Visual Micro-Box */}
            <div className="bg-[#09090B]/60 border border-white/[0.05] rounded-xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center -space-x-1.5">
                {["VR", "AN", "CO", "VB", "TY"].map((initials, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-[#121215] flex items-center justify-center text-[9px] font-mono font-bold text-zinc-200"
                  >
                    {initials}
                  </div>
                ))}
                <span className="text-[10px] font-mono text-zinc-500 ml-2">Lineup</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>5/5 Lineup Locked</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">What is Motion?</h4>
            </div>

            <p className="text-sm leading-relaxed text-zinc-400">
              Motion is a fantasy sports game built around internet culture and creators.
              Players collect digital creator cards (spanning streamers, tech founders, crypto thinkers, and media personalities),
              draft a 5-person weekly lineup, and compete based on creator performance scores.
            </p>
          </div>
        </div>

        {/* Card 2: Attention Velocity vs Raw Followers */}
        <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-white/[0.15] transition flex flex-col justify-between">
          <div>
            {/* Visual Micro-Box */}
            <div className="bg-[#09090B]/60 border border-white/[0.05] rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">Raw Followers</span>
                  <span className="text-zinc-500 text-[9px]">Static</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-3/5 h-full bg-zinc-600 rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                  <span className="text-emerald-400 font-semibold">Velocity Δ</span>
                  <span className="text-emerald-400 text-[9px] font-bold">+62%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <div className="flex gap-1">
                  <span className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05]">X</span>
                  <span className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05]">IG</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05]">TikTok</span>
                  <span className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05]">YT</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Flame className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Attention Velocity vs Raw Followers</h4>
            </div>

            <p className="text-sm leading-relaxed text-zinc-400">
              Motion does not simply rank raw follower tallies. Instead, the scoring engine quantifies
              the <span className="text-zinc-200 font-medium">rate of change</span> in cultural relevance,
              combining real-time attention and sentiment shifts across X, Instagram, TikTok, and YouTube.
            </p>
          </div>
        </div>

        {/* Card 3: Ranks, Deltas & Baselines */}
        <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-white/[0.15] transition flex flex-col justify-between">
          <div>
            {/* Visual Micro-Box */}
            <div className="bg-[#09090B]/60 border border-white/[0.05] rounded-xl p-3 mb-4 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-center">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Position</div>
                  <div className="text-xs font-mono font-bold text-white">#12</div>
                </div>
                <span className="text-zinc-600 text-xs">→</span>
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono">Delta (Δ)</div>
                  <div className="text-xs font-mono font-bold text-emerald-400">↑ +6</div>
                </div>
                <span className="text-zinc-600 text-xs">←</span>
                <div className="px-2 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-center">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Baseline</div>
                  <div className="text-xs font-mono font-bold text-zinc-400">prev #18</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Ranks, Deltas & Baselines</h4>
            </div>

            <p className="text-sm leading-relaxed text-zinc-400">
              Every creator carries a live <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-200 font-mono text-xs">Position</span> and
              a <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-200 font-mono text-xs">Delta (Δ)</span> calculated against the previous capture baseline.
              A delta of <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-semibold">+6</span> indicates a 6-rank jump up the board,
              highlighting explosive momentum runs in creator relevance.
            </p>
          </div>
        </div>

        {/* Card 4: Lineup Scouting Strategy */}
        <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-white/[0.15] transition flex flex-col justify-between">
          <div>
            {/* Visual Micro-Box with Quick Action Chips */}
            <div className="bg-[#09090B]/60 border border-white/[0.05] rounded-xl p-3 mb-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onFilterMovers}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-emerald-500/30 text-zinc-200 hover:text-emerald-400 text-xs font-mono transition group"
              >
                <span>⚡ View Biggest Movers ↑</span>
              </button>
              <button
                type="button"
                onClick={onFilterCrypto}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-purple-500/30 text-zinc-200 hover:text-purple-300 text-xs font-mono transition group"
              >
                <span>💎 Filter Crypto/CT ↑</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Lineup Scouting Strategy</h4>
            </div>

            <p className="text-sm leading-relaxed text-zinc-400">
              Winning weekly lineups requires identifying breakout creators before they peak.
              Use MotionRadar&apos;s <span className="text-zinc-200 font-medium">Biggest Movers</span> and{" "}
              <span className="text-zinc-200 font-medium">Crypto/CT filter</span> to uncover early volume,
              contrarian dips, or newly minted entries before competition locks.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Sleek Full-Width CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-500/[0.07] via-[#121215] to-[#121215] border border-white/[0.08] rounded-2xl p-5 my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <div className="space-y-0.5">
          <h4 className="text-sm font-medium text-zinc-100">
            Scout breakout creators before lineups lock
          </h4>
          <p className="text-xs text-zinc-400">
            Draft your 5-person weekly creator lineup on Motion.
          </p>
        </div>

        <a
          href="https://seats.motion.game"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 shrink-0"
        >
          <span>Claim Motion Seat</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
