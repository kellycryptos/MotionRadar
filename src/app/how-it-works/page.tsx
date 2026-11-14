import type { Metadata } from "next";
import { HowItWorksContent } from "@/components/HowItWorksContent";

export const metadata: Metadata = {
  title: "How Motion Works — 1-Minute Strategy Guide | MotionRadar",
  description:
    "Understand Motion in under 60 seconds: Attention Velocity, Stars, Star Caps, Rarity Multipliers, and how to build a winning 5-creator lineup.",
  openGraph: {
    title: "How Motion Works — 1-Minute Strategy Guide | MotionRadar",
    description:
      "Master the meta of Motion: Stars, Star Caps, Score Boosts, and Attention Velocity. Built for Mogathon.",
    type: "website",
    siteName: "MotionRadar",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Motion Works — 1-Minute Strategy Guide",
    description:
      "Understand Motion in under 60 seconds: Attention Velocity, Stars, and Lineup Strategy for Mogathon.",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
