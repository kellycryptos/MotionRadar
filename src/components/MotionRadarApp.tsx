"use client";

import React, { useState, useMemo, useTransition } from "react";
import { Header } from "./Header";
import { StatSummary } from "./StatSummary";
import { BiggestMovers } from "./BiggestMovers";
import {
  LeaderboardControls,
  FilterCategory,
  SortOption,
} from "./LeaderboardControls";
import { LeaderboardTable } from "./LeaderboardTable";
import { AboutSection } from "./AboutSection";
import { MogathonModal } from "./MogathonModal";
import {
  LeaderboardCreator,
  LeaderboardResponse,
  LeaderboardStats,
} from "@/types/leaderboard";
import { isCryptoCreator } from "@/lib/crypto-creators";
import {
  computeLeaderboardStats,
  getBiggestMovers,
  FetchResult,
} from "@/lib/api";
import { exportLeaderboardToCsv } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface MotionRadarAppProps {
  initialResult: FetchResult;
}

export function MotionRadarApp({ initialResult }: MotionRadarAppProps) {
  const [data, setData] = useState<LeaderboardResponse>(initialResult.data);
  const [isLive, setIsLive] = useState<boolean>(!initialResult.isFallback);
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialResult.data.baselineCapturedAt ||
      initialResult.data.capturedAt ||
      initialResult.fetchedAt
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    initialResult.error
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("all");
  const [sortOption, setSortOption] = useState<SortOption>("rank-asc");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Dynamic refresh function
  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = (await res.json()) as FetchResult;

        setData(result.data);
        setIsLive(!result.isFallback);
        setLastUpdated(
          result.data.baselineCapturedAt ||
            result.data.capturedAt ||
            result.fetchedAt
        );
        setErrorMessage(result.error);
      } catch (err) {
        console.warn("Refresh failed, keeping cached view:", err);
      }
    });
  };

  // Compute stats over full dataset
  const stats: LeaderboardStats = useMemo(() => {
    return computeLeaderboardStats(data.rows);
  }, [data.rows]);

  // Top movers for dedicated section
  const topMovers = useMemo(() => {
    return getBiggestMovers(data.rows, 6);
  }, [data.rows]);

  // Filter and sort creators
  const filteredCreators = useMemo(() => {
    let list = [...data.rows];

    // Filter by Preset
    if (activePreset === "ct-elite") {
      list = list.filter((r) => isCryptoCreator(r.name));
    } else if (activePreset === "top-10") {
      list = list.filter((r) => r.position <= 10);
    } else if (activePreset === "high-volatility") {
      list = list.filter((r) => Math.abs(r.delta) >= 2);
    }

    // Filter by Tab
    if (selectedFilter === "movers") {
      list = list.filter((r) => Math.abs(r.delta) > 0);
    } else if (selectedFilter === "gainers") {
      list = list.filter((r) => r.delta > 0);
    } else if (selectedFilter === "losers") {
      list = list.filter((r) => r.delta < 0);
    } else if (selectedFilter === "crypto") {
      list = list.filter((r) => isCryptoCreator(r.name));
    } else if (selectedFilter === "new") {
      list = list.filter((r) => r.isNew);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortOption) {
        case "rank-asc":
          return a.position - b.position;
        case "rank-desc":
          return b.position - a.position;
        case "delta-desc":
          return b.delta - a.delta;
        case "delta-asc":
          return a.delta - b.delta;
        case "abs-delta-desc":
          return Math.abs(b.delta) - Math.abs(a.delta);
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return a.position - b.position;
      }
    });

    return list;
  }, [data.rows, searchQuery, selectedFilter, sortOption, activePreset]);

  // Preset Handler
  const handleApplyPreset = (
    preset: "all" | "ct-elite" | "top-10" | "high-volatility"
  ) => {
    if (preset === "all") {
      setActivePreset(null);
      setSelectedFilter("all");
      setSearchQuery("");
      setSortOption("rank-asc");
    } else {
      setActivePreset(preset);
      setSelectedFilter("all");
      setSearchQuery("");
    }
  };

  const handleSelectCreator = (creatorName: string) => {
    setSearchQuery(creatorName);
    setActivePreset(null);
    setSelectedFilter("all");
  };

  const handleScrollToMovers = () => {
    setSelectedFilter("movers");
    setActivePreset(null);
    document.getElementById("leaderboard-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToCrypto = () => {
    setActivePreset("ct-elite");
    setSelectedFilter("all");
    document.getElementById("leaderboard-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExportCsv = () => {
    exportLeaderboardToCsv(filteredCreators);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      {/* Sticky Header */}
      <Header
        lastUpdated={lastUpdated}
        isLive={isLive}
        isRefreshing={isPending}
        onRefresh={handleRefresh}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Fallback Banner if API was unreachable */}
        {!isLive && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <span>Using cached baseline snapshot</span>
              {errorMessage && (
                <span className="text-amber-400/80 font-mono ml-1.5">
                  ({errorMessage})
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              className="text-amber-400 underline font-semibold hover:text-amber-300 ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Consolidated Subtitle (H1 removed to match design specs) */}
        <div className="-mt-1">
          <p className="text-xs sm:text-sm text-zinc-400">
            Live cultural attention & momentum tracker for the Motion game leaderboard.
          </p>
        </div>

        {/* Summary Stat Cards (4-Column Top Grid) */}
        <StatSummary stats={stats} onSelectCreator={handleSelectCreator} />

        {/* Asymmetric Bento Grid for Biggest Movers */}
        <BiggestMovers movers={topMovers} onSelectCreator={handleSelectCreator} />

        {/* Unified Filter & Control Toolbar + High-Density Table */}
        <section id="leaderboard-section" className="space-y-4 pt-1">
          <LeaderboardControls
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              if (activePreset) setActivePreset(null);
            }}
            selectedFilter={selectedFilter}
            onSelectFilter={(f) => {
              setSelectedFilter(f);
              if (activePreset) setActivePreset(null);
            }}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onExportCsv={handleExportCsv}
            totalFiltered={filteredCreators.length}
            totalRaw={data.rows.length}
            onApplyPreset={handleApplyPreset}
            activePreset={activePreset}
          />

          <LeaderboardTable
            creators={filteredCreators}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onSelectCreator={handleSelectCreator}
          />
        </section>

        {/* Detailed About & Methodology Section */}
        <AboutSection
          onFilterMovers={handleScrollToMovers}
          onFilterCrypto={handleScrollToCrypto}
        />
      </main>

      {/* Bottom Footer Bar */}
      <footer className="border-t border-white/[0.06] pt-6 pb-8 text-xs text-zinc-500 bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Side: System Status Pill */}
          <div className="bg-[#121215] border border-white/[0.06] px-3 py-1.5 rounded-full font-mono text-[11px] text-zinc-400 flex items-center gap-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span>Data Model: Live + Offline Resilient Fixture</span>
          </div>

          {/* Right Side: Horizontal Links */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span>
              Built for{" "}
              <a
                href="https://fluent-labs.notion.site/mogathon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 underline transition-colors"
              >
                Mogathon
              </a>{" "}
              by{" "}
              <a
                href="https://github.com/kellycryptos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                @kellycryptos
              </a>
            </span>
            <span>•</span>
            <a
              href="https://seats.motion.game"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Motion Seats
            </a>
            <span>•</span>
            <a
              href="https://github.com/kellycryptos/MotionRadar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Mogathon Modal */}
      <MogathonModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        stats={stats}
        topMovers={topMovers}
      />
    </div>
  );
}
