"use client";

import React from "react";
import { ArrowUp, ArrowDown, Zap } from "lucide-react";
import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator, getCryptoCreatorInfo } from "@/lib/crypto-creators";

interface BiggestMoversProps {
  movers: LeaderboardCreator[];
  onSelectCreator: (name: string) => void;
}

export function BiggestMovers({ movers, onSelectCreator }: BiggestMoversProps) {
  if (movers.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-tight text-white uppercase tracking-wider font-mono">
            Biggest Movers
          </h2>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          Sorted by |Δ|
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {movers.map((creator) => {
          const isUp = creator.delta > 0;
          const isDown = creator.delta < 0;
          const isCT = isCryptoCreator(creator.name);
          const ctInfo = getCryptoCreatorInfo(creator.name);
          const prevPosition = creator.position + creator.delta;

          return (
            <div
              key={creator.id}
              onClick={() => onSelectCreator(creator.name)}
              className="group relative bg-surface border border-surface-border hover:border-neutral-600 rounded-lg p-3 transition flex flex-col justify-between cursor-pointer overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${
                  isUp ? "bg-emerald-500" : isDown ? "bg-red-500" : "bg-neutral-600"
                }`}
              />

              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-mono text-xs text-neutral-400">
                    #{creator.position}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                      isUp
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : isDown
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {isUp && <ArrowUp className="w-2.5 h-2.5" />}
                    {isDown && <ArrowDown className="w-2.5 h-2.5" />}
                    {isUp ? `+${creator.delta}` : creator.delta}
                  </span>
                </div>

                <div className="font-medium text-sm text-white truncate group-hover:text-emerald-300 transition">
                  {creator.name}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>prev #{prevPosition}</span>
                {isCT && (
                  <span
                    title={ctInfo?.tag || "Crypto / Web3"}
                    className="px-1 py-0.2 rounded text-[9px] bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider"
                  >
                    CT
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
