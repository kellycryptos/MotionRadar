import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LeaderboardCreator, LeaderboardStats } from "@/types/leaderboard";
import { isCryptoCreator } from "./crypto-creators";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(isoString: string, currentTimestamp?: number): string {
  try {
    const date = new Date(isoString);
    const now = currentTimestamp ? new Date(currentTimestamp) : new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0 || diffMs < 2000) return "just now";

    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;

    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays}d ago`;
  } catch {
    return "recently";
  }
}

export function formatUtcDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return isoString;
  }
}

export function exportLeaderboardToCsv(rows: LeaderboardCreator[]): void {
  const headers = ["Rank", "Creator", "Change (Delta)", "Previous Position", "Is New", "Is Crypto/CT"];
  const csvLines = [
    headers.join(","),
    ...rows.map((r) => {
      const prevPos = r.position + r.delta;
      const isCT = isCryptoCreator(r.name) ? "Yes" : "No";
      const escapedName = `"${r.name.replace(/"/g, '""')}"`;
      return [r.position, escapedName, r.delta, prevPos, r.isNew ? "Yes" : "No", isCT].join(",");
    }),
  ];

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `motion_radar_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateMogathonTweet(
  stats: LeaderboardStats,
  topMovers: LeaderboardCreator[]
): string {
  const gainerText = stats.topGainer
    ? `🔥 Top Gainer: ${stats.topGainer.name} (+${stats.topGainer.delta} to #${stats.topGainer.position})`
    : "";
  const loserText = stats.topLoser
    ? `📉 Biggest Dip: ${stats.topLoser.name} (${stats.topLoser.delta} to #${stats.topLoser.position})`
    : "";

  const moverHighlights = topMovers
    .slice(0, 3)
    .map((m) => `• ${m.name}: ${m.delta > 0 ? `+${m.delta}` : m.delta} (now #${m.position})`)
    .join("\n");

  return `Live Motion Leaderboard Pulse ⚡ via @kellycryptos / MotionRadar

${gainerText}
${loserText}

Key Movers:
${moverHighlights}

Scouting top creator momentum for @motiongame_ #MotionSeats #Mogathon.
cc @callmogbot`;
}
