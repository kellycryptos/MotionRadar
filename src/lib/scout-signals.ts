import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator } from "./crypto-creators";

export type ScoutSignalType =
  | "breakout"
  | "oversold"
  | "ct-momentum"
  | "ct-value"
  | "blue-chip"
  | "hidden-mover"
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
 * Computes an analytical scouting signal based on rank, delta, CT status, and novelty.
 * Helps Motion players scout creator momentum and find contrarian or breakout theses.
 */
export function getScoutSignal(creator: LeaderboardCreator): ScoutSignal | null {
  const isCT = isCryptoCreator(creator.name);

  // 1. Fresh New Entry
  if (creator.isNew) {
    return {
      type: "new-catalyst",
      label: "New Catalyst",
      badge: "New Catalyst",
      emoji: "✨",
      tagColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
      textColor: "text-cyan-300",
      borderColor: "border-cyan-500/25",
      bgColor: "bg-cyan-500/10",
      thesis: "Fresh leaderboard entry; high novelty and attention expansion.",
    };
  }

  // 2. High Breakout Velocity (delta >= 3)
  if (creator.delta >= 3) {
    return {
      type: "breakout",
      label: "Breakout Velocity",
      badge: "Breakout",
      emoji: "🚀",
      tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      textColor: "text-emerald-300",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/15",
      thesis: `Surging upward velocity (+${creator.delta} spots); strong market rotation.`,
    };
  }

  // 3. Crypto / CT Momentum (isCT && delta > 0)
  if (isCT && creator.delta > 0) {
    return {
      type: "ct-momentum",
      label: "CT Momentum",
      badge: "CT Momentum",
      emoji: "⚡",
      tagColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      textColor: "text-purple-300",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/15",
      thesis: `Crypto-native leader gaining traction on CT (+${creator.delta} spots).`,
    };
  }

  // 4. Severe Oversold Dip (delta <= -3 or top 25 with delta <= -2)
  if (creator.delta <= -3 || (creator.position <= 25 && creator.delta <= -2)) {
    return {
      type: "oversold",
      label: "Oversold Dip",
      badge: "Oversold Dip",
      emoji: "📉",
      tagColor: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      textColor: "text-rose-300",
      borderColor: "border-rose-500/30",
      bgColor: "bg-rose-500/15",
      thesis: `Contrarian value; historical top rank experiencing pullback (${creator.delta} spots).`,
    };
  }

  // 5. Crypto / CT Discount (isCT && delta < 0)
  if (isCT && creator.delta < 0) {
    return {
      type: "ct-value",
      label: "CT Discount",
      badge: "CT Discount",
      emoji: "💎",
      tagColor: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      textColor: "text-indigo-300",
      borderColor: "border-indigo-500/30",
      bgColor: "bg-indigo-500/15",
      thesis: `High-conviction CT creator at a relative rank discount (${creator.delta} spots).`,
    };
  }

  // 6. Blue Chip Anchor (Top 5 holding steady or up)
  if (creator.position <= 5 && creator.delta >= 0) {
    return {
      type: "blue-chip",
      label: "Blue Chip",
      badge: "Blue Chip",
      emoji: "🛡️",
      tagColor: "bg-amber-500/10 text-amber-300 border-amber-500/25",
      textColor: "text-amber-300",
      borderColor: "border-amber-500/25",
      bgColor: "bg-amber-500/10",
      thesis: "Top 5 cultural anchor; commanding dominant mindshare stability.",
    };
  }

  // 7. Hidden Mover (Climbing from mid/lower tier with delta >= 2)
  if (creator.position >= 25 && creator.delta >= 2) {
    return {
      type: "hidden-mover",
      label: "Hidden Gem",
      badge: "Hidden Gem",
      emoji: "👀",
      tagColor: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      textColor: "text-sky-300",
      borderColor: "border-sky-500/30",
      bgColor: "bg-sky-500/15",
      thesis: `Mid-tier climber quietly gaining momentum (+${creator.delta} spots).`,
    };
  }

  return null;
}

/**
 * Calculates combined net momentum (sum of deltas) for a 5-creator lineup.
 */
export function computeLineupNetDelta(lineup: LeaderboardCreator[]): number {
  return lineup.reduce((acc, creator) => acc + creator.delta, 0);
}

/**
 * Generates the pre-filled tweet text for sharing a 5-creator lineup to X / Mogathon.
 */
export function generateLineupShareTweet(lineup: LeaderboardCreator[]): string {
  const netDelta = computeLineupNetDelta(lineup);
  const netSign = netDelta > 0 ? `+${netDelta}` : `${netDelta}`;

  const creatorLines = lineup
    .map((c, i) => {
      const deltaStr = c.delta > 0 ? `+${c.delta}` : c.delta === 0 ? "±0" : `${c.delta}`;
      const signal = getScoutSignal(c);
      const emoji = signal ? ` ${signal.emoji}` : "";
      return `${i + 1}. ${c.name} (#${c.position}, ${deltaStr})${emoji}`;
    })
    .join("\n");

  return `My 5-Creator Scout Lineup for @callmogbot #Motion:

${creatorLines}

Combined Momentum: ${netSign} Δ Net Velocity
Scouted live on https://motionradar.vercel.app/ #Mogathon`;
}
