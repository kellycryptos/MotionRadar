"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Share2,
  Search,
  Check,
  Copy,
  Link2,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";
import { LeaderboardCreator } from "@/types/leaderboard";
import {
  BoardTierId,
  BOARD_TIERS,
  BoardPick,
  MotionBoardState,
  countTotalPicks,
  getSuggestedTheses,
  generateSuggestedBoard,
  generateBoardShareTweet,
  encodeBoardToUrlParam,
} from "@/lib/board";
import { CreatorAvatar } from "./CreatorAvatar";

function XTwitterIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface MotionBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: MotionBoardState;
  onUpdateBoard: (newBoard: MotionBoardState) => void;
  allCreators: LeaderboardCreator[];
}

export function MotionBoardModal({
  isOpen,
  onClose,
  board,
  onUpdateBoard,
  allCreators,
}: MotionBoardModalProps) {
  const [activeTierId, setActiveTierId] = useState<BoardTierId>("must-haves");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPickId, setEditingPickId] = useState<string | null>(null);
  const [isShareViewOpen, setIsShareViewOpen] = useState(false);
  const [customTweetText, setCustomTweetText] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalPicks = useMemo(() => countTotalPicks(board), [board]);

  // Set of all creator IDs currently in ANY tier of the board
  const draftedCreatorIds = useMemo(() => {
    const ids = new Set<string>();
    (Object.keys(board) as BoardTierId[]).forEach((tierId) => {
      board[tierId].forEach((p) => ids.add(p.creatorId));
    });
    return ids;
  }, [board]);

  // Filtered creators for the add-picker
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allCreators
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          (c.handle && c.handle.toLowerCase().includes(q))
        );
      })
      .slice(0, 10);
  }, [allCreators, searchQuery]);

  if (!isOpen) return null;

  // Handlers for managing picks
  const handleAddCreatorToTier = (creator: LeaderboardCreator, tierId: BoardTierId) => {
    const tierConfig = BOARD_TIERS.find((t) => t.id === tierId);
    if (!tierConfig) return;

    if (board[tierId].length >= tierConfig.max) return;
    if (draftedCreatorIds.has(creator.id)) return;

    const suggested = getSuggestedTheses(creator, tierId);
    const newPick: BoardPick = {
      creatorId: creator.id,
      name: creator.name,
      position: creator.position,
      delta: creator.delta,
      handle: creator.handle,
      thesis: suggested[0] || "",
    };

    onUpdateBoard({
      ...board,
      [tierId]: [...board[tierId], newPick],
    });

    setSearchQuery("");
  };

  const handleRemovePick = (tierId: BoardTierId, creatorId: string) => {
    onUpdateBoard({
      ...board,
      [tierId]: board[tierId].filter((p) => p.creatorId !== creatorId),
    });
    if (editingPickId === creatorId) setEditingPickId(null);
  };

  const handleMovePick = (tierId: BoardTierId, index: number, direction: "up" | "down") => {
    const list = [...board[tierId]];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onUpdateBoard({
      ...board,
      [tierId]: list,
    });
  };

  const handleUpdateThesis = (tierId: BoardTierId, creatorId: string, newThesis: string) => {
    onUpdateBoard({
      ...board,
      [tierId]: board[tierId].map((p) =>
        p.creatorId === creatorId ? { ...p, thesis: newThesis } : p
      ),
    });
  };

  const handleMoveTier = (sourceTierId: BoardTierId, targetTierId: BoardTierId, pick: BoardPick) => {
    if (sourceTierId === targetTierId) return;
    const targetConfig = BOARD_TIERS.find((t) => t.id === targetTierId);
    if (!targetConfig || board[targetTierId].length >= targetConfig.max) return;

    const updatedThesis = getSuggestedTheses(
      {
        id: pick.creatorId,
        name: pick.name,
        position: pick.position,
        delta: pick.delta,
        isNew: false,
      },
      targetTierId
    )[0] || pick.thesis;

    onUpdateBoard({
      ...board,
      [sourceTierId]: board[sourceTierId].filter((p) => p.creatorId !== pick.creatorId),
      [targetTierId]: [...board[targetTierId], { ...pick, thesis: updatedThesis }],
    });
  };

  const handleSuggestBoard = () => {
    const suggested = generateSuggestedBoard(allCreators);
    onUpdateBoard(suggested);
  };

  const handleClearBoard = () => {
    onUpdateBoard({
      "must-haves": [],
      "value-picks": [],
      "sleepers": [],
      "pass": [],
    });
    setEditingPickId(null);
  };

  // Generate share URL and text
  const shareBoardUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://motionradar.vercel.app/";
    const param = encodeBoardToUrlParam(board);
    if (!param) return "https://motionradar.vercel.app/";
    return `${window.location.origin}/?board=${param}`;
  }, [board]);

  const handleOpenSharePreview = () => {
    const tweet = generateBoardShareTweet(board, { shareUrl: shareBoardUrl });
    setCustomTweetText(tweet);
    setIsShareViewOpen(true);
  };

  const handleCopyTweet = () => {
    navigator.clipboard.writeText(customTweetText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyBoardLink = () => {
    navigator.clipboard.writeText(shareBoardUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePostToTwitter = () => {
    const encoded = encodeURIComponent(customTweetText);
    window.open(
      `https://twitter.com/intent/tweet?text=${encoded}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#121215] border border-white/[0.1] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] flex items-center justify-between gap-3 bg-[#121215]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  My Motion Board
                </h2>
                <span className="font-mono text-[11px] bg-white/[0.06] text-zinc-300 px-2 py-0.5 rounded-full border border-white/[0.08]">
                  {totalPicks}/16 Drafted
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Tier your high-conviction creators and craft personal theses
              </p>
            </div>
          </div>

          {/* Action buttons: Suggest, Clear, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleSuggestBoard}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.08] text-xs font-medium transition cursor-pointer"
              title="Auto-fill board using live momentum & contrarian signals"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Suggest Board</span>
              <span className="sm:hidden">Auto</span>
            </button>

            {totalPicks > 0 && (
              <button
                onClick={handleClearBoard}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] text-xs transition cursor-pointer"
                title="Reset board"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-xl transition hover:bg-white/[0.08] cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Switch between Board Editor and Share Preview */}
        {isShareViewOpen ? (
          /* Share Preview View */
          <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Board Share Preview</h3>
                <p className="text-xs text-zinc-400">
                  Inspect or refine your draft before posting to X.
                </p>
              </div>
              <button
                onClick={() => setIsShareViewOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                ← Back to Editor
              </button>
            </div>

            {/* Editable Tweet Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Post Draft (Editable)
              </label>
              <textarea
                value={customTweetText}
                onChange={(e) => setCustomTweetText(e.target.value)}
                rows={11}
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl p-3 text-xs sm:text-sm font-mono text-zinc-200 focus:outline-none focus:border-emerald-500/50 resize-y leading-relaxed"
                placeholder="Write your tweet..."
              />
            </div>

            {/* Link preview pill */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-1.5 truncate text-zinc-400">
                <Link2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{shareBoardUrl}</span>
              </div>
              <button
                onClick={handleCopyBoardLink}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium shrink-0 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20"
              >
                {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                onClick={handleCopyTweet}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium transition cursor-pointer"
              >
                {copiedText ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedText ? "Copied Draft" : "Copy Text"}</span>
              </button>

              <button
                onClick={handlePostToTwitter}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <XTwitterIcon className="w-3.5 h-3.5" />
                <span>Post on X</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Board Editor View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Tier Tabs (Scrollable on small screens) */}
            <div className="sm:hidden flex items-center gap-1 px-3 py-2 border-b border-white/[0.08] bg-[#0E0E11] overflow-x-auto no-scrollbar">
              {BOARD_TIERS.map((tier) => {
                const isActive = activeTierId === tier.id;
                const count = board[tier.id].length;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTierId(tier.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? `${tier.bgTint} ${tier.accentColor} border ${tier.borderColor}`
                        : "text-zinc-400 hover:text-zinc-200 bg-white/[0.02]"
                    }`}
                  >
                    <span>{tier.emoji}</span>
                    <span>{tier.shortTitle}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      ({count}/{tier.max})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Creator Search Bar */}
            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/[0.06] bg-[#0E0E11]/60 flex flex-col gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search live leaderboard to draft creator into a tier..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#18181C] border border-white/[0.08] rounded-xl text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              {/* Live search results dropdown if user types */}
              {searchQuery.trim().length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-xl bg-[#18181C] border border-white/[0.1] divide-y divide-white/[0.04] shadow-xl p-1 z-20">
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-center text-xs text-zinc-500 font-mono">
                      No creators match &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    searchResults.map((creator) => {
                      const isAlreadyDrafted = draftedCreatorIds.has(creator.id);
                      return (
                        <div
                          key={creator.id}
                          className="p-2 flex items-center justify-between gap-2 hover:bg-white/[0.04] rounded-lg transition"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <CreatorAvatar creator={creator} className="w-6 h-6 text-[9px]" />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] text-zinc-400">
                                  #{creator.position}
                                </span>
                                <span className="text-xs font-semibold text-zinc-200 truncate">
                                  {creator.name}
                                </span>
                                {creator.handle && (
                                  <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                                    @{creator.handle}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                creator.delta > 0
                                  ? "text-emerald-400 bg-emerald-500/10"
                                  : creator.delta < 0
                                  ? "text-rose-400 bg-rose-500/10"
                                  : "text-zinc-500 bg-white/[0.05]"
                              }`}
                            >
                              {creator.delta > 0 ? `+${creator.delta}` : creator.delta} Δ
                            </span>
                          </div>

                          {/* Quick Add Tier Buttons */}
                          {isAlreadyDrafted ? (
                            <span className="text-[10px] font-mono text-zinc-500 px-2 py-1">
                              Already Drafted
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              {BOARD_TIERS.map((tier) => {
                                const isFull = board[tier.id].length >= tier.max;
                                return (
                                  <button
                                    key={tier.id}
                                    onClick={() => handleAddCreatorToTier(creator, tier.id)}
                                    disabled={isFull}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition cursor-pointer flex items-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none ${tier.bgTint} ${tier.accentColor} border ${tier.borderColor}`}
                                    title={`Add to ${tier.title} (${board[tier.id].length}/${tier.max})`}
                                  >
                                    <span>{tier.emoji}</span>
                                    <span className="hidden md:inline">{tier.shortTitle}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* 4-Tier Grid Container (Desktop: 4 columns, Mobile: Active Tab view) */}
            <div className="flex-1 p-3 sm:p-5 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 h-full">
                {BOARD_TIERS.map((tier) => {
                  const picks = board[tier.id];
                  const isCurrentOnMobile = activeTierId === tier.id;

                  return (
                    <div
                      key={tier.id}
                      className={`flex flex-col rounded-xl bg-[#0E0E11] border ${tier.borderColor} p-3 sm:p-3.5 transition-all min-h-[300px] ${
                        isCurrentOnMobile ? "flex" : "hidden sm:flex"
                      }`}
                    >
                      {/* Tier Column Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-base">{tier.emoji}</span>
                          <div className="min-w-0">
                            <h4 className={`text-xs sm:text-sm font-bold truncate ${tier.accentColor}`}>
                              {tier.title}
                            </h4>
                            <span className="text-[10px] text-zinc-500 block truncate">
                              {tier.badge}
                            </span>
                          </div>
                        </div>

                        <span className="font-mono text-[10px] text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06] shrink-0">
                          {picks.length}/{tier.max}
                        </span>
                      </div>

                      {/* Picks List */}
                      <div className="flex-1 py-2.5 space-y-2 overflow-y-auto">
                        {picks.length === 0 ? (
                          <div className="h-32 flex flex-col items-center justify-center text-center p-3 border border-dashed border-white/[0.08] rounded-xl text-zinc-500 text-xs">
                            <span className="text-zinc-600 mb-1 font-mono text-[11px]">
                              Empty Tier
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Search above to draft up to {tier.max} picks
                            </span>
                          </div>
                        ) : (
                          picks.map((pick, index) => {
                            const isEditing = editingPickId === pick.creatorId;
                            const suggestions = getSuggestedTheses(
                              {
                                id: pick.creatorId,
                                name: pick.name,
                                position: pick.position,
                                delta: pick.delta,
                                isNew: false,
                              },
                              tier.id
                            );

                            return (
                              <div
                                key={pick.creatorId}
                                className="group relative rounded-xl bg-[#141418] border border-white/[0.08] hover:border-white/[0.16] p-2.5 transition space-y-1.5"
                              >
                                {/* Creator header */}
                                <div className="flex items-center justify-between gap-1.5">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <CreatorAvatar
                                      creator={{ name: pick.name, handle: pick.handle }}
                                      className="w-5 h-5 text-[9px]"
                                    />
                                    <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                                      #{pick.position}
                                    </span>
                                    <span
                                      className="text-xs font-semibold text-zinc-200 truncate"
                                      title={pick.name}
                                    >
                                      {pick.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <span
                                      className={`font-mono text-[10px] font-bold px-1 rounded ${
                                        pick.delta > 0
                                          ? "text-emerald-400"
                                          : pick.delta < 0
                                          ? "text-rose-400"
                                          : "text-zinc-500"
                                      }`}
                                    >
                                      {pick.delta > 0 ? `+${pick.delta}` : pick.delta}
                                    </span>

                                    {/* Reorder and Delete Actions */}
                                    <button
                                      onClick={() => handleMovePick(tier.id, index, "up")}
                                      disabled={index === 0}
                                      className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 p-0.5"
                                      title="Move Up"
                                    >
                                      <ChevronUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleMovePick(tier.id, index, "down")}
                                      disabled={index === picks.length - 1}
                                      className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 p-0.5"
                                      title="Move Down"
                                    >
                                      <ChevronDown className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleRemovePick(tier.id, pick.creatorId)}
                                      className="text-zinc-500 hover:text-rose-400 p-0.5 ml-0.5"
                                      title="Remove from tier"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* One-Line Thesis Input */}
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={pick.thesis}
                                    onFocus={() => setEditingPickId(pick.creatorId)}
                                    onChange={(e) =>
                                      handleUpdateThesis(tier.id, pick.creatorId, e.target.value)
                                    }
                                    placeholder="Add one-line thesis..."
                                    className="w-full bg-[#09090B] border border-white/[0.08] focus:border-emerald-500/40 rounded-lg px-2 py-1 text-[11px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
                                  />

                                  {/* Quick suggestion chips (active when focused or empty) */}
                                  {(isEditing || !pick.thesis) && (
                                    <div className="pt-0.5 space-y-1">
                                      <span className="text-[9px] font-mono text-zinc-500 block">
                                        Suggested Thesis:
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {suggestions.slice(0, 2).map((sug, i) => (
                                          <button
                                            key={i}
                                            onClick={() => {
                                              handleUpdateThesis(tier.id, pick.creatorId, sug);
                                              setEditingPickId(null);
                                            }}
                                            className="text-[9px] font-mono text-left px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] transition"
                                            title="Click to apply"
                                          >
                                            {sug}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Quick Switch Tier dropdown/menu */}
                                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                                  <span>Move to:</span>
                                  <div className="flex items-center gap-1">
                                    {BOARD_TIERS.filter((t) => t.id !== tier.id).map((other) => (
                                      <button
                                        key={other.id}
                                        onClick={() => handleMoveTier(tier.id, other.id, pick)}
                                        disabled={board[other.id].length >= other.max}
                                        className="text-[10px] hover:text-zinc-200 transition disabled:opacity-20 cursor-pointer"
                                        title={`Move to ${other.title}`}
                                      >
                                        {other.emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/[0.08] bg-[#0E0E11] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="hidden sm:inline">Persisted to localStorage</span>
                <span>•</span>
                <span>{totalPicks}/16 Drafted</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                >
                  Done
                </button>

                <button
                  onClick={handleOpenSharePreview}
                  disabled={totalPicks === 0}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-zinc-950 font-semibold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Preview & Share Board ↗</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MotionBoardModal;
