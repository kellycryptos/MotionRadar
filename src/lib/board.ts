import { LeaderboardCreator } from "@/types/leaderboard";
import { isCryptoCreator } from "./crypto-creators";

export type BoardTierId = "must-haves" | "value-picks" | "sleepers" | "pass";

export interface BoardTierConfig {
  id: BoardTierId;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  emoji: string;
  accentColor: string;
  borderColor: string;
  bgTint: string;
  hoverBorder: string;
  max: number;
}

export interface BoardPick {
  creatorId: string;
  name: string;
  position: number;
  delta: number;
  handle?: string;
  thesis: string;
}

export type MotionBoardState = Record<BoardTierId, BoardPick[]>;

export const BOARD_STORAGE_KEY = "motionradar_motion_board_v1";
export const MAX_PICKS_PER_TIER = 4;

export const BOARD_TIERS: BoardTierConfig[] = [
  {
    id: "must-haves",
    title: "Must-Haves",
    shortTitle: "Must-Haves",
    badge: "Core Allocation",
    description: "Dominant anchors & surging breakout targets you must roster",
    emoji: "🔥",
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgTint: "bg-emerald-500/[0.08]",
    hoverBorder: "hover:border-emerald-500/50",
    max: MAX_PICKS_PER_TIER,
  },
  {
    id: "value-picks",
    title: "Value Picks",
    shortTitle: "Value",
    badge: "Contrarian / Rebound",
    description: "High-conviction names trading at oversold pullback discounts",
    emoji: "💎",
    accentColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgTint: "bg-cyan-500/[0.08]",
    hoverBorder: "hover:border-cyan-500/50",
    max: MAX_PICKS_PER_TIER,
  },
  {
    id: "sleepers",
    title: "Sleepers",
    shortTitle: "Sleepers",
    badge: "Quiet Velocity",
    description: "Mid-tier climbers & CT natives building stealth attention",
    emoji: "⚡",
    accentColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgTint: "bg-purple-500/[0.08]",
    hoverBorder: "hover:border-purple-500/50",
    max: MAX_PICKS_PER_TIER,
  },
  {
    id: "pass",
    title: "Pass",
    shortTitle: "Pass",
    badge: "Fade / Overheated",
    description: "Overextended or fading momentum names with drawdown risk",
    emoji: "⚠️",
    accentColor: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgTint: "bg-rose-500/[0.08]",
    hoverBorder: "hover:border-rose-500/50",
    max: MAX_PICKS_PER_TIER,
  },
];

export function createEmptyBoard(): MotionBoardState {
  return {
    "must-haves": [],
    "value-picks": [],
    "sleepers": [],
    "pass": [],
  };
}

/**
 * Robust sanitizer ensuring board state always contains all 4 tiers as valid arrays.
 * Handles old formats, partial objects, null/undefined, and migrations seamlessly.
 */
export function sanitizeBoard(raw: unknown): MotionBoardState {
  const safeBoard: MotionBoardState = createEmptyBoard();

  if (!raw || typeof raw !== "object") {
    return safeBoard;
  }

  // Handle old array format: [ { creator: {...}, tier: 'must', thesis: '...' } ]
  if (Array.isArray(raw)) {
    const tierMap: Record<string, BoardTierId> = {
      must: "must-haves",
      "must-haves": "must-haves",
      value: "value-picks",
      "value-picks": "value-picks",
      sleeper: "sleepers",
      sleepers: "sleepers",
      pass: "pass",
    };
    for (const item of raw) {
      if (item && item.creator && item.creator.id) {
        const targetTier = tierMap[item.tier] || "must-haves";
        safeBoard[targetTier].push({
          creatorId: String(item.creator.id),
          name: String(item.creator.name || ""),
          position: Number(item.creator.position || 0),
          delta: Number(item.creator.delta || 0),
          handle: item.creator.handle ? String(item.creator.handle) : undefined,
          thesis: String(item.thesis || ""),
        });
      }
    }
    return safeBoard;
  }

  // Handle object format: ensure all 4 tiers exist and are arrays
  const record = raw as Record<string, unknown>;
  const tierIds: BoardTierId[] = ["must-haves", "value-picks", "sleepers", "pass"];

  for (const tierId of tierIds) {
    const rawList = record[tierId];
    if (Array.isArray(rawList)) {
      safeBoard[tierId] = rawList
        .filter((item) => item && typeof item === "object" && Boolean((item as Record<string, unknown>).creatorId))
        .map((p) => {
          const pick = p as Record<string, unknown>;
          return {
            creatorId: String(pick.creatorId || ""),
            name: String(pick.name || ""),
            position: Number(pick.position || 0),
            delta: Number(pick.delta || 0),
            handle: pick.handle ? String(pick.handle) : undefined,
            thesis: String(pick.thesis || ""),
          };
        });
    } else {
      safeBoard[tierId] = [];
    }
  }

  return safeBoard;
}

export function countTotalPicks(board?: MotionBoardState | null): number {
  if (!board) return 0;
  return (
    (board["must-haves"]?.length || 0) +
    (board["value-picks"]?.length || 0) +
    (board["sleepers"]?.length || 0) +
    (board["pass"]?.length || 0)
  );
}

/**
 * Returns 2-3 contextual thesis templates based on creator performance and target tier.
 */
export function getSuggestedTheses(
  creator: LeaderboardCreator,
  tier: BoardTierId
): string[] {
  const isCT = isCryptoCreator(creator.name);
  const deltaStr = creator.delta > 0 ? `+${creator.delta}` : `${creator.delta}`;

  switch (tier) {
    case "must-haves":
      if (creator.delta >= 3) {
        return [
          `Breakout velocity (${deltaStr} Δ) with explosive market rotation`,
          `Unstoppable upward momentum holding #${creator.position}`,
          `Tier 1 cultural mindshare expansion`,
        ];
      }
      if (creator.position <= 10) {
        return [
          `Bluechip anchor holding #${creator.position} with zero drawdown`,
          `Unshakable core allocation across cultural meta`,
          `High-floor defensive leader`,
        ];
      }
      return [
        `High-conviction core hold (${deltaStr} Δ)`,
        `Essential weekly roster foundation`,
        `Leading mindshare driver at #${creator.position}`,
      ];

    case "value-picks":
      if (creator.delta < 0) {
        return [
          `Contrarian dip (${deltaStr} spots); prime rebound setup`,
          `Oversold relative to long-term cultural reach`,
          `High-quality name trading at a temporary discount`,
        ];
      }
      if (isCT) {
        return [
          `Underpriced CT mindshare; ready to run on rotation`,
          `CT value play trading below true impact`,
          `Asymmetric upside on next crypto narrative wave`,
        ];
      }
      return [
        `Favorable risk/reward entry at #${creator.position}`,
        `Mispriced attention ready for mean reversion`,
        `Solid value pick with defensive floor`,
      ];

    case "sleepers":
      if (isCT) {
        return [
          `CT momentum sleeper with stealth accumulation`,
          `Web3 attention engine climbing under the radar`,
          `Quiet catalyst brewing at #${creator.position}`,
        ];
      }
      if (creator.isNew) {
        return [
          `Fresh entrant with high novelty expansion`,
          `New catalyst entering leaderboard radar`,
          `Breakout potential before mainstream discovery`,
        ];
      }
      return [
        `Quiet mid-tier climb (${deltaStr} spots) under the radar`,
        `Stealth attention velocity outside the top 20`,
        `High-beta sleeper ready to pop into top tier`,
      ];

    case "pass":
      if (creator.delta < 0) {
        return [
          `Fading attention velocity (${deltaStr} spots); negative drift`,
          `Too much downside momentum; wait for bottom`,
          `Declining cultural mindshare this cycle`,
        ];
      }
      if (creator.position <= 10) {
        return [
          `Overextended short-term top; risk of mean reversion`,
          `Overbought relative to velocity; passing this week`,
          `Crowded trade with low asymmetric upside`,
        ];
      }
      return [
        `Unfavorable risk/reward profile`,
        `Fading momentum; passing on this spot`,
        `Better allocation opportunities elsewhere`,
      ];
  }
}

/**
 * Synchronizes an existing board's creator ranks & deltas with the newest live data.
 */
export function syncBoardWithLiveData(
  board: MotionBoardState,
  liveCreators: LeaderboardCreator[]
): MotionBoardState {
  const safeBoard = sanitizeBoard(board);
  const map = new Map<string, LeaderboardCreator>();
  for (const c of liveCreators || []) {
    map.set(c.id, c);
    if (c.name) map.set(c.name.toLowerCase().trim(), c);
  }

  const next = createEmptyBoard();

  const tierIds: BoardTierId[] = ["must-haves", "value-picks", "sleepers", "pass"];
  tierIds.forEach((tierId) => {
    next[tierId] = (safeBoard[tierId] || []).map((pick) => {
      const match = map.get(pick.creatorId) || (pick.name ? map.get(pick.name.toLowerCase().trim()) : undefined);
      if (match) {
        return {
          ...pick,
          name: match.name,
          position: match.position,
          delta: match.delta,
          handle: match.handle || pick.handle,
        };
      }
      return pick;
    });
  });

  return next;
}

/**
 * Generates an intelligent, live-data driven example board.
 */
export function generateSuggestedBoard(
  creators: LeaderboardCreator[]
): MotionBoardState {
  const usedIds = new Set<string>();

  const findUnique = (
    predicate: (c: LeaderboardCreator) => boolean,
    limit: number
  ): LeaderboardCreator[] => {
    const results: LeaderboardCreator[] = [];
    for (const c of creators || []) {
      if (!usedIds.has(c.id) && predicate(c)) {
        results.push(c);
        usedIds.add(c.id);
        if (results.length >= limit) break;
      }
    }
    return results;
  };

  // 1. Must-Haves: Top gainers (delta >= 3) or top 5 anchor
  const topGainers = [...(creators || [])]
    .filter((c) => c.delta > 0)
    .sort((a, b) => b.delta - a.delta);

  const mustHaveCandidates = findUnique(
    (c) => topGainers.some((tg) => tg.id === c.id) || c.position <= 5,
    3
  );

  // 2. Value Picks: Contrarian dips (delta < 0, rank <= 50) and CT discount
  const dipCandidates = [...(creators || [])]
    .filter((c) => c.delta < 0 && c.position <= 50)
    .sort((a, b) => a.delta - b.delta);

  const valueCandidates = findUnique(
    (c) =>
      dipCandidates.some((d) => d.id === c.id) ||
      (isCryptoCreator(c.name) && c.delta <= 0),
    3
  );

  // 3. Sleepers: Stealth velocity outside top 20 or CT movers
  const sleeperCandidates = findUnique(
    (c) => (c.position > 20 && c.delta > 0) || (isCryptoCreator(c.name) && c.delta > 0),
    3
  );

  // 4. Pass: Fading velocity (delta <= -2)
  const passCandidates = findUnique((c) => c.delta <= -2, 2);

  const toPick = (c: LeaderboardCreator, tier: BoardTierId): BoardPick => {
    const suggestions = getSuggestedTheses(c, tier);
    return {
      creatorId: c.id,
      name: c.name,
      position: c.position,
      delta: c.delta,
      handle: c.handle,
      thesis: suggestions[0] || `${tier} pick`,
    };
  };

  return {
    "must-haves": mustHaveCandidates.map((c) => toPick(c, "must-haves")),
    "value-picks": valueCandidates.map((c) => toPick(c, "value-picks")),
    "sleepers": sleeperCandidates.map((c) => toPick(c, "sleepers")),
    "pass": passCandidates.map((c) => toPick(c, "pass")),
  };
}

/**
 * Generates the clean pre-filled X share text for the Motion Board.
 */
export function generateBoardShareTweet(
  board: MotionBoardState,
  options?: { shareUrl?: string }
): string {
  const safe = sanitizeBoard(board);
  const sections: string[] = [];

  const tierEmojiMap: Record<BoardTierId, { emoji: string; title: string }> = {
    "must-haves": { emoji: "🔥", title: "MUST-HAVES" },
    "value-picks": { emoji: "💎", title: "VALUE PICKS" },
    "sleepers": { emoji: "⚡", title: "SLEEPERS" },
    "pass": { emoji: "⚠️", title: "PASS" },
  };

  (Object.keys(tierEmojiMap) as BoardTierId[]).forEach((tierId) => {
    const picks = safe[tierId] || [];
    if (picks.length > 0) {
      const { emoji, title } = tierEmojiMap[tierId];
      const items = picks
        .map((p) => {
          const deltaStr = p.delta > 0 ? `+${p.delta}` : `${p.delta}`;
          const deltaTag = p.delta === 0 ? "—" : `${deltaStr} Δ`;
          const thesisPart = p.thesis ? ` — ${p.thesis}` : "";
          return `• ${p.name} (#${p.position} | ${deltaTag})${thesisPart}`;
        })
        .join("\n");
      sections.push(`${emoji} ${title}:\n${items}`);
    }
  });

  const body = sections.join("\n\n");
  const url = options?.shareUrl || "https://motionradar.vercel.app/";

  return `My Motion Board 📡 | @motiongame_

${body || "Building my tiered Motion board on MotionRadar!"}

Build and share your tiered board 👇
${url}
cc @callmogbot #MotionSeats #Mogathon`;
}

// UTF-8 safe base64 helper that never throws Latin1 DOMException
function safeBase64Encode(str: string): string {
  try {
    if (typeof window !== "undefined") {
      const utf8Bytes = new TextEncoder().encode(str);
      let binary = "";
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      return window.btoa(binary);
    }
    return Buffer.from(str, "utf-8").toString("base64");
  } catch {
    return "";
  }
}

function safeBase64Decode(b64: string): string {
  try {
    if (typeof window !== "undefined") {
      const binary = window.atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    }
    return Buffer.from(b64, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

/**
 * Compact serialization for query parameter sharing:
 * Encodes board state into URL-safe base64 string without Latin1 crashes.
 */
export function encodeBoardToUrlParam(board: MotionBoardState): string {
  try {
    const safe = sanitizeBoard(board);
    const compact: Record<string, [string, string][]> = {
      mh: (safe["must-haves"] || []).map((p) => [p.creatorId, p.thesis || ""]),
      vp: (safe["value-picks"] || []).map((p) => [p.creatorId, p.thesis || ""]),
      sl: (safe["sleepers"] || []).map((p) => [p.creatorId, p.thesis || ""]),
      pa: (safe["pass"] || []).map((p) => [p.creatorId, p.thesis || ""]),
    };

    const jsonStr = JSON.stringify(compact);
    const b64 = safeBase64Encode(jsonStr);
    return encodeURIComponent(b64);
  } catch {
    return "";
  }
}

/**
 * Decodes board state from URL-safe base64 string, populating live creator stats.
 */
export function decodeBoardFromUrlParam(
  param: string,
  liveCreators: LeaderboardCreator[]
): MotionBoardState | null {
  try {
    if (!param) return null;
    const decodedParam = decodeURIComponent(param);
    const jsonStr = safeBase64Decode(decodedParam);
    if (!jsonStr) return null;

    const compact = JSON.parse(jsonStr);
    if (!compact || typeof compact !== "object") return null;

    const creatorMap = new Map<string, LeaderboardCreator>();
    for (const c of liveCreators || []) {
      creatorMap.set(c.id, c);
      if (c.name) creatorMap.set(c.name.toLowerCase().trim(), c);
    }

    const board = createEmptyBoard();

    const tierKeyMap: Record<string, BoardTierId> = {
      mh: "must-haves",
      vp: "value-picks",
      sl: "sleepers",
      pa: "pass",
    };

    for (const [key, tierId] of Object.entries(tierKeyMap)) {
      const items = compact[key];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (Array.isArray(item) && item[0]) {
            const creatorId = String(item[0]);
            const thesis = String(item[1] || "");
            const creator = creatorMap.get(creatorId);
            if (creator) {
              board[tierId].push({
                creatorId: creator.id,
                name: creator.name,
                position: creator.position,
                delta: creator.delta,
                handle: creator.handle,
                thesis,
              });
            }
          }
        }
      }
    }

    return countTotalPicks(board) > 0 ? sanitizeBoard(board) : null;
  } catch {
    return null;
  }
}
