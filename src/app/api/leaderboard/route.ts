import { NextResponse } from "next/server";
import { getLeaderboardData, computeLeaderboardStats } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getLeaderboardData();
    const stats = computeLeaderboardStats(result.data.rows);

    return NextResponse.json(
      {
        ...result,
        stats,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to retrieve leaderboard", details: errorMessage },
      { status: 500 }
    );
  }
}
