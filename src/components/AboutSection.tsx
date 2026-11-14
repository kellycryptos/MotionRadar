import React from "react";
import { Compass, Flame, Shield, TrendingUp, Layers, HelpCircle, ExternalLink } from "lucide-react";

export function AboutSection() {
  return (
    <section className="space-y-6 pt-10 border-t border-surface-border/70 text-neutral-300">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs uppercase font-mono font-semibold tracking-wider text-emerald-400">
            Methodology & Guide
          </h2>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          About MotionRadar
        </h3>
        <p className="text-sm text-neutral-400 max-w-3xl">
          A real-time momentum radar designed for players, scouts, and creators competing on Motion.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: What is Motion? */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-3 hover:border-neutral-700 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">What is Motion?</h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Motion is a fantasy sports game built around internet culture and creators.
            Players collect digital creator cards (spanning streamers, tech founders, crypto thinkers, and media personalities),
            draft a 5-person weekly lineup, and compete based on creator performance scores.
          </p>
        </div>

        {/* Card 2: The Attention Velocity Metric */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-3 hover:border-neutral-700 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Attention Velocity vs Raw Followers</h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Motion does not simply rank raw follower tallies. Instead, the scoring engine quantifies
            the <span className="text-neutral-200 font-medium">rate of change</span> in cultural relevance,
            combining real-time attention and sentiment shifts across X, Instagram, TikTok, and YouTube.
          </p>
        </div>

        {/* Card 3: Understanding Leaderboard Deltas */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-3 hover:border-neutral-700 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Ranks, Deltas & Baselines</h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every creator carries a live <span className="font-mono text-neutral-200">Position</span> and
            a <span className="font-mono text-neutral-200">Delta (Δ)</span> calculated against the previous capture baseline.
            A delta of <span className="font-mono text-emerald-400">+6</span> indicates a 6-rank jump up the board,
            highlighting explosive momentum runs in creator relevance.
          </p>
        </div>

        {/* Card 4: Lineup Scouting Strategy */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 space-y-3 hover:border-neutral-700 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">Lineup Scouting Strategy</h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Winning weekly lineups requires identifying breakout creators before they peak.
            Use MotionRadar&apos;s <span className="text-neutral-200 font-medium">Biggest Movers</span> and{" "}
            <span className="text-neutral-200 font-medium">Crypto/CT filter</span> to uncover early volume,
            contrarian dips, or newly minted entries before competition locks.
          </p>
        </div>
      </div>

      {/* Technical Specifications Bar */}
      <div className="bg-surface/60 border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-neutral-500">Data Model:</span>
          <span className="text-neutral-200 font-medium">Live + Offline Resilient Fixture</span>
        </div>

        <a
          href="https://seats.motion.game"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition shrink-0"
        >
          <span>Claim Motion Seat</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
