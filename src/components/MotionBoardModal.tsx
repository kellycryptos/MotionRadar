"use client";

import React, { useState, useEffect } from "react";
import { X, Share2 } from "lucide-react";
import { LeaderboardCreator } from "@/types/leaderboard";
import { CreatorAvatar } from "./CreatorAvatar";

type Tier = "must" | "value" | "sleeper" | "pass";

interface BoardPick {
  creator: LeaderboardCreator;
  tier: Tier;
  thesis: string;
}

interface MotionBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  creators: LeaderboardCreator[];
}

const TIERS: { id: Tier; label: string; color: string }[] = [
  { id: "must", label: "Must-Haves", color: "text-emerald-400" },
  { id: "value", label: "Value Picks", color: "text-blue-400" },
  { id: "sleeper", label: "Sleepers", color: "text-purple-400" },
  { id: "pass", label: "Pass", color: "text-zinc-500" },
];

export function MotionBoardModal({
  isOpen,
  onClose,
  creators,
}: MotionBoardModalProps) {
  const [picks, setPicks] = useState<BoardPick[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<Tier>("must");

  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem("motionradar_board");
      if (saved) setPicks(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      try {
        localStorage.setItem("motionradar_board", JSON.stringify(picks));
      } catch {
        // ignore
      }
    }
  }, [picks, isOpen]);

  if (!isOpen) return null;

  const filtered = creators.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const addPick = (creator: LeaderboardCreator) => {
    if (picks.some((p) => p.creator.id === creator.id)) return;
    setPicks((prev) => [
      ...prev,
      { creator, tier: selectedTier, thesis: "" },
    ]);
  };

  const removePick = (id: string) => {
    setPicks((prev) => prev.filter((p) => p.creator.id !== id));
  };

  const updateThesis = (id: string, thesis: string) => {
    setPicks((prev) =>
      prev.map((p) => (p.creator.id === id ? { ...p, thesis } : p))
    );
  };

  const changeTier = (id: string, tier: Tier) => {
    setPicks((prev) =>
      prev.map((p) => (p.creator.id === id ? { ...p, tier } : p))
    );
  };

  const shareBoard = () => {
    const top = picks.filter((p) => p.tier !== "pass").slice(0, 4);
    const lines = top.map(
      (p) =>
        `${p.creator.name} (${p.tier === "must" ? "Must" : p.tier === "value" ? "Value" : "Sleeper"}): ${p.thesis || "Rising"}`
    );
    const text = `My Motion Board\n\n${lines.join("\n")}\n\nBuilt on MotionRadar\nhttps://motionradar.vercel.app\n\n@callmogbot`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#121215] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">My Motion Board</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/[0.06] space-y-3">
          <div className="flex gap-2">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  selectedTier === t.id
                    ? "bg-white text-black"
                    : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators to add..."
            className="w-full bg-[#09090B] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {TIERS.map((tier) => {
            const tierPicks = picks.filter((p) => p.tier === tier.id);
            return (
              <div key={tier.id}>
                <h3 className={`text-xs font-mono uppercase tracking-wider mb-2 ${
                  tier.color
                }`}>
                  {tier.label} ({tierPicks.length})
                </h3>
                <div className="space-y-2">
                  {tierPicks.map((pick) => (
                    <div
                      key={pick.creator.id}
                      className="flex items-start gap-3 bg-[#09090B] border border-white/[0.06] rounded-xl p-3"
                    >
                      <CreatorAvatar creator={pick.creator} className="w-8 h-8" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm text-white truncate">
                            {pick.creator.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={pick.tier}
                              onChange={(e) =>
                                changeTier(pick.creator.id, e.target.value as Tier)
                              }
                              className="bg-transparent text-xs text-zinc-400 border-none focus:outline-none"
                            >
                              {TIERS.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => removePick(pick.creator.id)}
                              className="text-zinc-500 hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <input
                          value={pick.thesis}
                          onChange={(e) =>
                            updateThesis(pick.creator.id, e.target.value)
                          }
                          placeholder="One-line thesis..."
                          className="w-full mt-1 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                  {tierPicks.length === 0 && (
                    <p className="text-xs text-zinc-600 italic">Empty</p>
                  )}
                </div>
              </div>
            );
          })}

          {search && (
            <div className="pt-2">
              <p className="text-xs text-zinc-500 mb-2">Add from search</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {filtered.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => addPick(c)}
                    className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] text-sm"
                  >
                    <CreatorAvatar creator={c} className="w-6 h-6" />
                    <span className="truncate">{c.name}</span>
                    <span className="ml-auto text-xs text-zinc-500">
                      #{c.position}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/[0.06] flex justify-end gap-2">
          <button
            onClick={shareBoard}
            disabled={picks.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-sm font-medium transition"
          >
            <Share2 className="w-4 h-4" />
            Share Board
          </button>
        </div>
      </div>
    </div>
  );
}
