import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator } from "./crypto-creators";

export type ScoutSignalType =
  | "breakout"
  | "contrarian-dip"
  | "ct-momentum"
  | "bluechip-anchor"
  | "ct-discount"
  | "hidden-gem"
  | "new-catalyst";

export interface ScoutSignal {
  type: ScoutSignalType;
  label: string;
  badge: string;
  emoji: string;
  tagColor: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  thesis: string;
}

/**
 * Computes an automated scouting thesis badge based on rank, delta, category, and novelty:
 * - delta >= 3: 🔥 Breakout Velocity (emerald)
 * - delta <= -3 and rank <= 50: 🎯 Contrarian Dip (amber)
 * - Crypto/CT and delta >= 1: ⚡ CT Momentum (cyan)
 * - rank <= 10 and delta === 0: 🛡️ Bluechip Anchor (zinc/white)
 * - Additional complementary signals for CT discounts, new entrants, and hidden gems.
 */
export function getScoutSignal(creator: LeaderboardCreator): ScoutSignal | null {
  const isCT = isCryptoCreator(creator.name);

  // 1. Breakout Velocity: delta >= 3
  if (creator.delta >= 3) {
    return {
      type: "breakout",
      label: "Breakout Velocity",
      badge: "Breakout Velocity",
      emoji: "🔥",
      tagColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      bgColor: "bg-emerald-500/10",
      thesis: `Surging upward velocity (+${creator.delta} spots); heavy market rotation.`,
    };
  }

  // 2. Contrarian Dip: delta <= -3 and rank <= 50 (or delta <= -2 and rank <= 30)
  if (
    (creator.delta <= -3 && creator.position <= 50) ||
    (creator.delta <= -2 && creator.position <= 30)
  ) {
    return {
      type: "contrarian-dip",
      label: "Contrarian Dip",
      badge: "Contrarian Dip",
      emoji: "🎯",
      tagColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/20",
      bgColor: "bg-amber-500/10",
      thesis: `Top-tier creator experiencing temporary pullback (${creator.delta} spots); prime contrarian rebound candidate.`,
    };
  }

  // 3. CT Momentum: Crypto/CT creator with delta >= 1
  if (isCT && creator.delta >= 1) {
    return {
      type: "ct-momentum",
      label: "CT Momentum",
      badge: "CT Momentum",
      emoji: "⚡",
      tagColor: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/20",
      bgColor: "bg-cyan-500/10",
      thesis: `Crypto native riding active Web3/CT mindshare (+${creator.delta} spots).`,
    };
  }

  // 4. Bluechip Anchor: rank <= 10 and delta === 0
  if (creator.position <= 10 && creator.delta === 0) {
    return {
      type: "bluechip-anchor",
      label: "Bluechip Anchor",
      badge: "Bluechip Anchor",
      emoji: "🛡️",
      tagColor: "bg-zinc-800 text-zinc-300 border border-white/10",
      textColor: "text-zinc-300",
      borderColor: "border-white/10",
      bgColor: "bg-zinc-800",
      thesis: "Top 10 cultural anchor holding steady; dominant mindshare with zero drawdown.",
    };
  }

  // 5. Fresh New Entrant
  if (creator.isNew) {
    return {
      type: "new-catalyst",
      label: "New Catalyst",
      badge: "New Catalyst",
      emoji: "✨",
      tagColor: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
      textColor: "text-cyan-300",
      borderColor: "border-cyan-500/20",
      bgColor: "bg-cyan-500/10",
      thesis: "Fresh leaderboard entry; high novelty and attention expansion.",
    };
  }

  // 6. CT Discount: Crypto/CT with delta < 0
  if (isCT && creator.delta < 0) {
    return {
      type: "ct-discount",
      label: "CT Discount",
      badge: "CT Discount",
      emoji: "💎",
      tagColor: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
      textColor: "text-purple-300",
      borderColor: "border-purple-500/20",
      bgColor: "bg-purple-500/10",
      thesis: `High-conviction CT figure trading at a relative rank discount (${creator.delta} spots).`,
    };
  }

  // 7. Hidden Gem: rank > 25 and delta === 2
  if (creator.position > 25 && creator.delta === 2) {
    return {
      type: "hidden-gem",
      label: "Hidden Gem",
      badge: "Hidden Gem",
      emoji: "👀",
      tagColor: "bg-sky-500/10 text-sky-300 border border-sky-500/20",
      textColor: "text-sky-300",
      borderColor: "border-sky-500/20",
      bgColor: "bg-sky-500/10",
      thesis: `Climbing from mid/lower tier with quiet momentum (+${creator.delta} spots).`,
    };
  }

  return null;
}

/**
 * Calculates combined net velocity (sum of deltas) for a lineup.
 */
export function computeLineupNetDelta(lineup: LeaderboardCreator[]): number {
  return lineup.reduce((acc, creator) => acc + creator.delta, 0);
}

/**
 * Selects a balanced 5-creator scout roster:
 * - Top 2 Gainers (highest delta)
 * - Top 2 Crypto/CT Movers (isCrypto && delta > 0)
 * - 1 Contrarian Dip (delta < 0, rank <= 50)
 */
export function autoScoutBest5(creators: LeaderboardCreator[]): LeaderboardCreator[] {
  const chosen: LeaderboardCreator[] = [];
  const chosenIds = new Set<string>();

  const addCreator = (c: LeaderboardCreator | undefined) => {
    if (c && !chosenIds.has(c.id) && chosen.length < 5) {
      chosen.push(c);
      chosenIds.add(c.id);
    }
  };

  // 1. Top 2 Gainers
  const topGainers = [...creators]
    .filter((c) => c.delta > 0)
    .sort((a, b) => b.delta - a.delta);
  addCreator(topGainers[0]);
  addCreator(topGainers[1]);

  // 2. Top 2 Crypto/CT Movers
  const ctMovers = [...creators]
    .filter((c) => isCryptoCreator(c.name) && c.delta > 0 && !chosenIds.has(c.id))
    .sort((a, b) => (b.delta !== a.delta ? b.delta - a.delta : a.position - b.position));
  addCreator(ctMovers[0]);
  addCreator(ctMovers[1]);

  // 3. 1 Contrarian Dip (rank <= 50, delta < 0)
  const dips = [...creators]
    .filter((c) => c.delta < 0 && c.position <= 50 && !chosenIds.has(c.id))
    .sort((a, b) => a.delta - b.delta);
  addCreator(dips[0]);

  // 4. Fill any remaining slots if needed
  if (chosen.length < 5) {
    const remaining = [...creators]
      .filter((c) => !chosenIds.has(c.id))
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    for (const c of remaining) {
      if (chosen.length >= 5) break;
      addCreator(c);
    }
  }

  return chosen.slice(0, 5);
}

/**
 * Generates the clean pre-filled tweet string for sharing on X:
 * Tags @motion, @callmogbot, #Mogathon, and includes live URL.
 */
export function generateLineupShareTweet(lineup: LeaderboardCreator[]): string {
  const totalDelta = computeLineupNetDelta(lineup);
  const formattedTotalDelta = totalDelta > 0 ? `+${totalDelta}` : `${totalDelta}`;

  const picksText = lineup
    .map((c, i) => {
      const signal = getScoutSignal(c);
      let tagStr = "";
      if (signal?.type === "contrarian-dip") {
        tagStr = ` | 🎯 Contrarian Dip ${c.delta}`;
      } else if (c.delta > 0) {
        tagStr = ` | ↑ +${c.delta}`;
      } else if (c.delta < 0) {
        tagStr = ` | ↓ ${c.delta}`;
      } else {
        tagStr = ` | —`;
      }
      return `${i + 1}. ${c.name} (#${c.position}${tagStr})`;
    })
    .join("\n");

  return `My 5-Creator @motion Roster scouted on MotionRadar 📡 (Net Velocity: ${formattedTotalDelta} Δ)

${picksText}

Scout live cultural velocity before lineups lock 👇
https://motionradar.vercel.app/
cc @callmogbot #Mogathon`;
}
