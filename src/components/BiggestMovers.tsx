"use client";

import React from "react";
import { Zap } from "lucide-react";
import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator } from "@/lib/crypto-creators";

interface BiggestMoversProps {
  movers: LeaderboardCreator[];
  onSelectCreator: (name: string) => void;
}

function MoverSparkline({
  isUp,
  isHero = false,
}: {
  isUp: boolean;
  isHero?: boolean;
}) {
  const id = React.useId();
  const strokeColor = isUp ? "#10b981" : "#f43f5e";
  const stopColor = isUp ? "#10b981" : "#f43f5e";

  if (isHero) {
    const pathD = isUp
      ? "M 0 65 Q 25 60 45 45 T 90 40 T 130 18 T 160 8"
      : "M 0 10 Q 30 25 60 30 T 100 50 T 135 60 T 160 65";
    const areaD = isUp
      ? "M 0 65 Q 25 60 45 45 T 90 40 T 130 18 T 160 8 L 160 80 L 0 80 Z"
      : "M 0 10 Q 30 25 60 30 T 100 50 T 135 60 T 160 65 L 160 80 L 0 80 Z";

    return (
      <svg
        viewBox="0 0 160 80"
        fill="none"
        className="absolute right-0 bottom-0 w-36 h-20 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stopColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={stopColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${id})`} />
        <path
          d={pathD}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Compact 2x2 sparkline
  const pathD = isUp
    ? "M 0 35 Q 20 30 35 22 T 70 18 T 100 6"
    : "M 0 8 Q 20 15 40 22 T 75 30 T 100 35";
  const areaD = isUp
    ? "M 0 35 Q 20 30 35 22 T 70 18 T 100 6 L 100 45 L 0 45 Z"
    : "M 0 8 Q 20 15 40 22 T 75 30 T 100 35 L 100 45 L 0 45 Z";

  return (
    <svg
      viewBox="0 0 100 45"
      fill="none"
      className="absolute right-0 bottom-0 w-24 h-12 pointer-events-none opacity-80 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stopColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={stopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${id})`} />
      <path
        d={pathD}
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BiggestMovers({ movers, onSelectCreator }: BiggestMoversProps) {
  if (movers.length === 0) return null;

  // Separate top gainer & top drop for hero cards
  const topGainer = movers.find((m) => m.delta > 0);
  const topLoser = movers.find((m) => m.delta < 0);

  let heroMovers: LeaderboardCreator[] = [];
  let remainingMovers: LeaderboardCreator[] = [];

  if (topGainer && topLoser) {
    heroMovers = [topGainer, topLoser];
    remainingMovers = movers
      .filter((m) => m.id !== topGainer.id && m.id !== topLoser.id)
      .slice(0, 4);
  } else {
    heroMovers = movers.slice(0, 2);
    remainingMovers = movers.slice(2, 6);
  }

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-zinc-300" />
          <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-300 font-mono">
            Biggest Movers
          </h2>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Sorted by |Δ|</span>
      </div>

      {/* 12-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left 6 Columns: 2 Taller Hero Mover Cards */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {heroMovers.map((creator) => {
            const isUp = creator.delta > 0;
            const isDown = creator.delta < 0;
            const isCT = isCryptoCreator(creator.name);
            const prevPosition = creator.position + creator.delta;

            return (
              <div
                key={creator.id}
                onClick={() => onSelectCreator(creator.name)}
                className="group relative bg-[#121215] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-5 flex flex-col justify-between h-[180px] sm:h-[195px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition cursor-pointer overflow-hidden"
              >
                {/* Top Row: Rank & Delta Badge */}
                <div className="flex items-center justify-between z-10">
                  <span className="font-mono text-xs text-zinc-500">
                    #{creator.position}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                      isUp
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : isDown
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-white/[0.05] text-zinc-400"
                    }`}
                  >
                    {isUp ? `+${creator.delta}` : creator.delta}
                  </span>
                </div>

                {/* Middle: Creator Name & Inline CT Badge */}
                <div className="z-10 my-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-lg sm:text-xl font-bold text-white group-hover:text-zinc-200 transition truncate">
                      {creator.name}
                    </span>
                    {isCT && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        CT
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Rank Progression */}
                <div className="text-xs font-mono text-zinc-500 z-10">
                  prev #{prevPosition}
                </div>

                {/* Minimalist SVG Sparkline */}
                <MoverSparkline isUp={isUp} isHero={true} />
              </div>
            );
          })}
        </div>

        {/* Right 6 Columns: Compact 2x2 Grid */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {remainingMovers.map((creator) => {
            const isUp = creator.delta > 0;
            const isDown = creator.delta < 0;
            const isCT = isCryptoCreator(creator.name);
            const prevPosition = creator.position + creator.delta;

            return (
              <div
                key={creator.id}
                onClick={() => onSelectCreator(creator.name)}
                className="group relative bg-[#121215] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-4 flex flex-col justify-between h-[85px] sm:h-[92px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition cursor-pointer overflow-hidden"
              >
                {/* Top Row: Rank & Delta */}
                <div className="flex items-center justify-between z-10">
                  <span className="font-mono text-xs text-zinc-500">
                    #{creator.position}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-zinc-400"
                    }`}
                  >
                    {isUp ? `+${creator.delta}` : creator.delta}
                  </span>
                </div>

                {/* Middle: Creator Name & CT Badge */}
                <div className="flex items-center gap-1.5 z-10 truncate my-0.5">
                  <span className="text-sm font-semibold text-white group-hover:text-zinc-200 transition truncate">
                    {creator.name}
                  </span>
                  {isCT && (
                    <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                      CT
                    </span>
                  )}
                </div>

                {/* Bottom Row */}
                <div className="text-[11px] font-mono text-zinc-500 z-10">
                  prev #{prevPosition}
                </div>

                {/* Background Compact Sparkline */}
                <MoverSparkline isUp={isUp} isHero={false} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
