import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotionRadar | Live Motion Leaderboard & Biggest Movers",
  description:
    "Real-time analytics and rank change tracker for the Motion game leaderboard. Spot top creator momentum, biggest movers, and Crypto/CT influencers for Mogathon.",
  keywords: [
    "Motion",
    "Mogathon",
    "Leaderboard",
    "Motion game",
    "Creator movers",
    "Crypto Twitter",
    "CT",
    "Ansem",
    "Cobie",
    "Vitalik",
    "Druski",
  ],
  authors: [{ name: "MotionRadar Team" }],
  openGraph: {
    title: "MotionRadar — Real-Time Motion Leaderboard & Movers",
    description: "Track live Motion ranks, spot top momentum gainers, and scout creator lineups for Mogathon.",
    type: "website",
    siteName: "MotionRadar",
  },
  twitter: {
    card: "summary_large_image",
    title: "MotionRadar — Real-Time Motion Leaderboard",
    description: "Track live Motion ranks and spot top momentum gainers for Mogathon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#09090B" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><circle cx='12' cy='12' r='10'/><path d='M12 2a10 10 0 0 1 10 10' stroke='%23ffffff' stroke-width='2' fill='none'/></svg>" />
      </head>
      <body className="min-h-screen bg-[#09090B] text-zinc-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
