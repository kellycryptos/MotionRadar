# MotionRadar 📡⚡

> Real-time analytics, leaderboard tracker, and momentum radar for the [Motion](https://seats.motion.game) creator fantasy game. Built for **Mogathon**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kellycryptos/MotionRadar)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 🎯 What is MotionRadar?

**Motion** is a fantasy game where players collect cards of creators (streamers, founders, crypto leaders, internet personalities), draft weekly lineups of 5, and score points based on cultural velocity across X, Instagram, TikTok, and YouTube.

**MotionRadar** connects directly to the live Motion leaderboard to:
- Track ranked creators and real-time rank changes ($\Delta$).
- Highlight **Biggest Movers** sorted by absolute rank volatility ($|\Delta|$).
- Filter and monitor top **Crypto / CT influencers** (Ansem, Cobie, Vitalik, Toly, Clemente, Threadguy, etc.).
- Deliver a fast, responsive, dark-mode dashboard with instantaneous search and zero setup friction.
- Provide a 1-click **Mogathon Submission Assistant** with pre-formatted market pulse updates for `@callmogbot`.

---

## 🏆 Mogathon Sponsor Track & Evidence Matrix ("The Receipt Box")

| Sponsor / Track | Integration & Artifact | Source Code Permalinks | Status |
| :--- | :--- | :--- | :--- |
| **Motion Leaderboard API** | Live endpoint ingestion (`https://leaderboard.motion.game/api/leaderboard`) with fallback fixture | [`src/lib/api.ts#L16-L53`](src/lib/api.ts) | Verified Live |
| **Movers & Volatility Engine** | Top rank jumper / dropper detection and absolute delta sorting | [`src/lib/api.ts#L104-L109`](src/lib/api.ts) | Tested |
| **CT / Crypto Curation** | Curated registry and metadata for Crypto Twitter creators & founders | [`src/lib/crypto-creators.ts#L8-L168`](src/lib/crypto-creators.ts) | Live Tagged |
| **Mogathon Bot Share Assistant** | 1-click formatted post builder for submitting to `@callmogbot` | [`src/components/MogathonModal.tsx`](src/components/MogathonModal.tsx) | Operational |
| **Zero-Config Sandbox** | Automated CI/CD immune build with deterministic offline snapshot | [`src/lib/fixture-data.ts`](src/lib/fixture-data.ts) | 0-env Passing |

---

## ✨ Features

- **Live Data Feed**: Connects to `https://leaderboard.motion.game/api/leaderboard` with 60s background revalidation.
- **Dedicated Biggest Movers**: Cards grid highlighting creators with the highest absolute rank fluctuations ($|\Delta|$).
- **Color-Coded Rank Deltas**: Emerald green for rank gains (`+Δ`), crimson red for drops (`-Δ`), subtle slate for unchanged (`0`).
- **Interactive Search**: Instant type-ahead filtering by creator name or alias.
- **Category Filter Tabs**:
  - `All`: Full ranked roster
  - `Movers`: Creators with non-zero rank changes ($|\Delta| > 0$)
  - `Gainers`: Momentum runners ($+\Delta$)
  - `Drops`: Creators falling down the board ($-\Delta$)
  - `Crypto / CT`: Curated Web3/CT heavyweights (Cobie, Ansem, Vitalik, Toly, Mert, etc.)
  - `New`: Newly entered creators on the leaderboard
- **90-Second Evaluator Presets**:
  - `CT Elite`: 1-click focus on top Crypto Twitter culture leaders
  - `|Δ| ≥ 2`: High-volatility shock filter
  - `Top 10`: The current top 10 ranked creators
- **Multi-Column Sorting**: Sort by Rank, Creator Name, Net Delta, or Absolute Volatility.
- **Export to CSV**: Instant 1-click download of the active filtered dataset.
- **Fail-Safe Offline Mode**: Gracefully activates a local cached baseline fixture if the external API is ever unreachable or rate-limited.
- **Linear-Grade Dark UI**: Minimalist, high-contrast dark theme optimized for both desktop and mobile screens.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18+ (tested on Node v20 and v22)
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/kellycryptos/MotionRadar.git
cd MotionRadar
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Verification Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 Data Shape

```ts
type LeaderboardResponse = {
  asOf: string;
  capturedAt: string;
  baselineCapturedAt: string;
  history: string;
  rows: {
    id: string;
    name: string;
    position: number;
    delta: number;
    isNew: boolean;
  }[];
};
```

---

## 🤖 Submitting to Mogathon

1. Deploy the app to Vercel or run locally.
2. Click the **"Share"** button in the header.
3. Copy the pre-formatted post text.
4. Post to X and tag **`@callmogbot`**!

---

## 📄 License

MIT © [kellycryptos](https://github.com/kellycryptos)
