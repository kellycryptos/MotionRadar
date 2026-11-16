import { LeaderboardCreator, LeaderboardResponse, LeaderboardStats } from "../types/leaderboard";
import { FALLBACK_LEADERBOARD } from "./fixture-data";
import { isCryptoCreator } from "./crypto-creators";
import { getCreatorHandle } from "./creator-handles";

export interface FetchResult {
  data: LeaderboardResponse;
  isFallback: boolean;
  error?: string;
  source: "live" | "fallback";
  fetchedAt: string;
}

const MOTION_LEADERBOARD_URL = "https://leaderboard.motion.game/api/leaderboard";

export async function getLeaderboardData(): Promise<FetchResult> {
  const now = new Date().toISOString();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(MOTION_LEADERBOARD_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "MotionRadar/1.0 (+https://github.com/kellycryptos/MotionRadar)",
      },
      next: { revalidate: 25 },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Motion API responded with status ${res.status}`);
    }

    const json = (await res.json()) as LeaderboardResponse;

    if (!json || !Array.isArray(json.rows)) {
      throw new Error("Invalid response format received from Motion API");
    }

    const enrichedRows: LeaderboardCreator[] = json.rows.map((row) => {
      const handle = row.handle || getCreatorHandle(row.name);
      return {
        ...row,
        handle,
        xUrl: row.xUrl || (handle ? `https://x.com/${handle}` : undefined),
      };
    });

    return {
      data: {
        ...json,
        rows: enrichedRows,
      },
      isFallback: false,
      source: "live",
      fetchedAt: now,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch live data";
    console.warn("Using offline fallback fixture due to error:", errorMessage);

    const enrichedFallbackRows: LeaderboardCreator[] = FALLBACK_LEADERBOARD.rows.map((row) => {
      const handle = row.handle || getCreatorHandle(row.name);
      return {
        ...row,
        handle,
        xUrl: row.xUrl || (handle ? `https://x.com/${handle}` : undefined),
      };
    });

    return {
      data: {
        ...FALLBACK_LEADERBOARD,
        rows: enrichedFallbackRows,
      },
      isFallback: true,
      error: errorMessage,
      source: "fallback",
      fetchedAt: now,
    };
  }
}

export function computeLeaderboardStats(rows: LeaderboardCreator[]): LeaderboardStats {
  const total = rows.length;
  let moversCount = 0;
  let gainersCount = 0;
  let losersCount = 0;
  let neutralCount = 0;
  let cryptoCount = 0;
  let totalAbsDelta = 0;

  let topGainer: LeaderboardCreator | null = null;
  let topLoser: LeaderboardCreator | null = null;

  for (const row of rows) {
    if (isCryptoCreator(row.name)) {
      cryptoCount++;
    }

    const delta = row.delta;
    totalAbsDelta += Math.abs(delta);

    if (delta > 0) {
      gainersCount++;
      moversCount++;
      if (!topGainer || delta > topGainer.delta) {
        topGainer = row;
      }
    } else if (delta < 0) {
      losersCount++;
      moversCount++;
      if (!topLoser || delta < topLoser.delta) {
        topLoser = row;
      }
    } else {
      neutralCount++;
    }
  }

  const avgAbsoluteDelta = total > 0 ? Number((totalAbsDelta / total).toFixed(2)) : 0;

  return {
    total,
    moversCount,
    gainersCount,
    losersCount,
    neutralCount,
    cryptoCount,
    topGainer,
    topLoser,
    avgAbsoluteDelta,
  };
}

export function getBiggestMovers(rows: LeaderboardCreator[], limit = 6): LeaderboardCreator[] {
  return [...rows]
    .filter((r) => Math.abs(r.delta) > 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, limit);
}
