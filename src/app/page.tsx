import { getLeaderboardData } from "@/lib/api";
import { MotionRadarApp } from "@/components/MotionRadarApp";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const initialResult = await getLeaderboardData();

  return <MotionRadarApp initialResult={initialResult} />;
}
