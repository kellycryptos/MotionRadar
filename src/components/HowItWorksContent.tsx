"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Star,
  Sparkles,
  Users,
  Calendar,
  Share2,
  Copy,
  Check,
  Radio,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { CreatorAvatar } from "./CreatorAvatar";

interface RarityOption {
  name: string;
  tier: string;
  multiplier: number;
  color: string;
  border: string;
  badgeBg: string;
}

const RARITY_TIERS: RarityOption[] = [
  {
    name: "Common",
    tier: "1.0x",
    multiplier: 1.0,
    color: "text-zinc-300",
    border: "border-white/10",
    badgeBg: "bg-white/[0.05]",
  },
  {
    name: "Rare",
    tier: "1.25x",
    multiplier: 1.25,
    color: "text-blue-400",
    border: "border-blue-500/30",
    badgeBg: "bg-blue-500/10",
  },
  {
    name: "Epic",
    tier: "1.5x",
    multiplier: 1.5,
    color: "text-purple-400",
    border: "border-purple-500/30",
    badgeBg: "bg-purple-500/10",
  },
  {
    name: "Legendary",
    tier: "2.0x",
    multiplier: 2.0,
    color: "text-amber-400",
    border: "border-amber-500/30",
    badgeBg: "bg-amber-500/10",
  },
  {
    name: "Mythic",
    tier: "3.0x",
    multiplier: 3.0,
    color: "text-rose-400",
    border: "border-rose-500/30",
    badgeBg: "bg-rose-500/10",
  },
];

const SAMPLE_ROSTER = [
  { name: "John Coogan", handle: "johncoogan", rank: 64, delta: 6, stars: 2, rarity: "Rare", boost: "1.25x" },
  { name: "Coffeezilla", handle: "coffeebreak_YT", rank: 42, delta: 3, stars: 3, rarity: "Epic", boost: "1.5x" },
  { name: "Flood", handle: "ThinkingUSD", rank: 47, delta: 2, stars: 2, rarity: "Rare", boost: "1.25x" },
  { name: "Taiki Maeda", handle: "TaikiMaeda2", rank: 60, delta: 1, stars: 2, rarity: "Legendary", boost: "2.0x" },
  { name: "Garry Tan", handle: "garrytan", rank: 39, delta: -2, stars: 3, rarity: "Common", boost: "1.0x" },
];

export function HowItWorksContent() {
  const [selectedRarity, setSelectedRarity] = useState<RarityOption>(RARITY_TIERS[2]); // Default Epic (1.5x)
  const [baseScore, setBaseScore] = useState<number>(80);
  const [copied, setCopied] = useState(false);

  const boostedScore = Math.round(baseScore * selectedRarity.multiplier);
  const bonusPoints = boostedScore - baseScore;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareToX = () => {
    const text = encodeURIComponent(
      `Master the @motiongame_ meta in under 60 seconds: Stars, Score Boosts, and Attention Velocity 📡⚡\n\nhttps://motionradar.vercel.app/how-it-works\ncc @callmogbot #Mogathon`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col justify-between">
      {/* Top Sticky Header */}
      <header className="border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Radar</span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121215] border border-white/[0.08] hover:bg-white/[0.06] text-xs font-mono text-zinc-300 transition"
              title="Copy page link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleShareToX}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition"
              title="Share on X"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10 sm:space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>1-Minute Strategy Primer • Mogathon Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How Motion Works
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Understand the game mechanics in under 60 seconds: Attention Velocity, Stars, Score Boosts, and the optimal lineup meta.
          </p>
        </div>

        {/* 5 Core Step Cards */}
        <div className="space-y-5">
          {/* Step 1: Motion Score */}
          <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">01</span>
                    <h2 className="text-lg font-semibold text-white">Motion Score</h2>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono font-medium">Attention Velocity, Not Follower Counts</p>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Motion does not measure static follower counts. Instead, the scoring engine quantifies how fast a creator&apos;s cultural relevance is accelerating or decelerating across X, Instagram, TikTok, and YouTube.
                </p>

                {/* Micro Visual Comparison */}
                <div className="bg-[#09090B] border border-white/[0.06] rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Raw Followers</span>
                      <span>Flat</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-zinc-600 rounded-full" />
                    </div>
                    <p className="text-[10px] text-zinc-500">Scores 0 bonus if attention is stagnant.</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-semibold">
                      <span>Attention Velocity Δ</span>
                      <span>Surging</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-emerald-500 rounded-full" />
                    </div>
                    <p className="text-[10px] text-emerald-400/90 font-medium">High rate of change = high fantasy points.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Stars */}
          <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">02</span>
                    <h2 className="text-lg font-semibold text-white">Stars & Star Cap</h2>
                  </div>
                  <p className="text-xs text-amber-400 font-mono font-medium">Trailing 14-Day Heat Budget</p>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Stars reflect how hot a creator has been over the past ~14 days. Higher-star creators cost more against your weekly Star Cap budget (typically 15 Stars total). You cannot simply stack the five most popular creators.
                </p>

                {/* Micro Visual Stars Bar */}
                <div className="bg-[#09090B] border border-white/[0.06] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <span>★ 1 Star (Value Pick)</span>
                    <span className="text-zinc-600">→</span>
                    <span>★★★★★ 5 Stars (Expensive Superstar)</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    Max Star Cap: 15
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Rarity & Boosts with Interactive Multiplier Lab */}
          <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">03</span>
                    <h2 className="text-lg font-semibold text-white">Rarity & Score Boosts</h2>
                  </div>
                  <p className="text-xs text-purple-400 font-mono font-medium">Card Multipliers Multiply Points</p>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Every creator card comes with a rarity tier. The rarer the card, the higher the Score Boost multiplier applied to that creator&apos;s base Motion Score.
                </p>

                {/* Interactive Multiplier Lab */}
                <div className="bg-[#09090B] border border-white/[0.08] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>INTERACTIVE BOOST CALCULATOR</span>
                    <span className="text-emerald-400">Try clicking tiers:</span>
                  </div>

                  {/* Tier Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {RARITY_TIERS.map((tier) => (
                      <button
                        key={tier.name}
                        onClick={() => setSelectedRarity(tier)}
                        className={`p-2 rounded-lg border text-xs font-mono transition text-center ${
                          selectedRarity.name === tier.name
                            ? `${tier.border} ${tier.badgeBg} ${tier.color} font-bold ring-1 ring-white/20`
                            : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        <div>{tier.name}</div>
                        <div className="text-[10px] opacity-80">{tier.tier}</div>
                      </button>
                    ))}
                  </div>

                  {/* Interactive Result Card */}
                  <div className="pt-2 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Base Motion Score:</span>
                      <input
                        type="range"
                        min="20"
                        max="150"
                        value={baseScore}
                        onChange={(e) => setBaseScore(Number(e.target.value))}
                        className="w-28 accent-emerald-500 cursor-pointer"
                      />
                      <span className="font-mono text-xs font-bold text-white">{baseScore} pts</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-zinc-500">{baseScore} × {selectedRarity.multiplier}x =</span>
                      <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {boostedScore} pts
                      </span>
                      <span className="text-[10px] text-zinc-500">(+{bonusPoints} bonus)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Build a Lineup with Sample Visual Roster */}
          <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">04</span>
                    <h2 className="text-lg font-semibold text-white">Build a 5-Creator Lineup</h2>
                  </div>
                  <p className="text-xs text-cyan-400 font-mono font-medium">Low-Star + High-Rarity Arbitrage</p>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Draft 5 distinct creators while staying under the 15-star cap. The winning meta is finding breakout creators with low stars (2★–3★) and equipping them with high rarity boosts.
                </p>

                {/* Sample Roster Card */}
                <div className="bg-[#09090B] border border-white/[0.08] rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">SAMPLE WINNING 5-MAN LINEUP</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">
                      Total: 12 / 15 Stars (Under Cap)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {SAMPLE_ROSTER.map((c, i) => (
                      <div
                        key={i}
                        className="bg-[#121215] border border-white/[0.08] rounded-xl p-2.5 flex sm:flex-col items-center justify-between sm:justify-center gap-2 text-center"
                      >
                        <div className="flex items-center sm:flex-col gap-2">
                          <CreatorAvatar handle={c.handle} name={c.name} className="w-7 h-7 sm:w-8 sm:h-8" />
                          <div className="text-left sm:text-center truncate">
                            <div className="text-xs font-semibold text-white truncate max-w-[100px] sm:max-w-none">
                              {c.name.split(" ")[0]}
                            </div>
                            <div className="text-[10px] font-mono text-emerald-400">+{c.delta} Δ</div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end sm:items-center gap-1 font-mono text-[10px]">
                          <span className="text-amber-400">{"★".repeat(c.stars)}</span>
                          <span className="text-zinc-400 bg-white/[0.05] px-1.5 py-0.2 rounded border border-white/[0.08]">
                            {c.boost}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Weekly Loop Timeline */}
          <div className="bg-[#121215] border border-white/[0.07] rounded-2xl p-5 sm:p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-teal-400" />
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">05</span>
                    <h2 className="text-lg font-semibold text-white">The Weekly Loop</h2>
                  </div>
                  <p className="text-xs text-teal-400 font-mono font-medium">Monday Lock to Friday Settlement</p>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  Lineups lock every Monday. Creator scores update continuously every 4 hours throughout the week. Everything finalizes on Friday, paying out rewards and releasing cards for the next week.
                </p>

                {/* Timeline Bar */}
                <div className="bg-[#09090B] border border-white/[0.06] rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center text-xs">
                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-zinc-500 text-[10px]">MONDAY</div>
                    <div className="text-rose-400 font-semibold">🔒 Lineups Lock</div>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-zinc-500 text-[10px]">TUE - THU</div>
                    <div className="text-emerald-400 font-semibold">⚡ 4h Pulse Sync</div>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-zinc-500 text-[10px]">FRIDAY</div>
                    <div className="text-amber-400 font-semibold">🏆 Final Scoring</div>
                  </div>
                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-zinc-500 text-[10px]">WEEKEND</div>
                    <div className="text-cyan-400 font-semibold">📡 Scout Radar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Callout Banner */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 space-y-2 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wider font-mono">
              The Winning Formula
            </h3>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Never just stack five 5-star creators. Instead, use MotionRadar to spot low-star creators entering high-velocity catalyst weeks (like a podcast tour, viral stream, or project launch), and pair them with high-rarity Score Boost cards. That is how you dominate the weekly leaderboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition text-center shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Launch MotionRadar Terminal</span>
          </Link>

          <a
            href="https://seats.motion.game"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121215] border border-white/10 text-sm font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white transition text-center flex items-center justify-center gap-2"
          >
            <span>Claim Motion Seat</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-xs text-zinc-500 font-mono">
        Built for Mogathon by{" "}
        <a
          href="https://github.com/kellycryptos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 underline"
        >
          @kellycryptos
        </a>{" "}
        • Companion for{" "}
        <a
          href="https://x.com/motiongame_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-200"
        >
          @motiongame_
        </a>
      </footer>
    </div>
  );
}

export default HowItWorksContent;
