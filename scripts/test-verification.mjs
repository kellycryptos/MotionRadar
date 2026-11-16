import assert from "node:assert/strict";
import { FALLBACK_LEADERBOARD } from "../src/lib/fixture-data.ts";
import { isCryptoCreator } from "../src/lib/crypto-creators.ts";
import { getCreatorHandle } from "../src/lib/creator-handles.ts";
import { computeLeaderboardStats, getBiggestMovers } from "../src/lib/api.ts";
import {
  getScoutSignal,
  computeLineupNetDelta,
  autoScoutBest5,
  generateLineupShareTweet,
} from "../src/lib/scout-signals.ts";
import {
  BOARD_TIERS,
  createEmptyBoard,
  countTotalPicks,
  getSuggestedTheses,
  generateSuggestedBoard,
  generateBoardShareTweet,
  encodeBoardToUrlParam,
  decodeBoardFromUrlParam,
  syncBoardWithLiveData,
} from "../src/lib/board.ts";

console.log("▶ Running MotionRadar verification suite...");

// 1. Fixture integrity
assert.ok(
  FALLBACK_LEADERBOARD.rows.length >= 70,
  "Fallback leaderboard rows must have at least 70 creators"
);
assert.ok(FALLBACK_LEADERBOARD.asOf, "asOf timestamp must be present");

// 1b. Verify all creators resolve to valid X handles
for (const creator of FALLBACK_LEADERBOARD.rows) {
  const handle = creator.handle || getCreatorHandle(creator);
  assert.ok(
    Boolean(handle),
    `Creator "${creator.name}" must resolve to a valid X handle`
  );
  assert.ok(
    !handle.includes("/"),
    `Handle for "${creator.name}" should not contain slashes: "${handle}"`
  );
}
console.log(`✔ All ${FALLBACK_LEADERBOARD.rows.length} creators resolved to verified X handles`);

// 2. Crypto Creators Check
const requiredCryptoNames = [
  "Ansem",
  "Clemente",
  "MINHxDYNASTY",
  "Threadguy",
  "Cobie",
  "Vitalik Buterin",
  "Toly",
];

for (const name of requiredCryptoNames) {
  assert.equal(
    isCryptoCreator(name),
    true,
    `Creator "${name}" should be recognized as Crypto/CT`
  );
}
console.log("✔ Crypto/CT creator detection passed");

// 3. Stats Computation
const stats = computeLeaderboardStats(FALLBACK_LEADERBOARD.rows);
assert.equal(
  stats.total,
  FALLBACK_LEADERBOARD.rows.length,
  "Total creators count must match rows"
);
assert.ok(stats.moversCount > 0, "Movers count must be > 0");
assert.ok(stats.gainersCount > 0, "Gainers count must be > 0");
assert.ok(stats.losersCount > 0, "Losers count must be > 0");
assert.ok(stats.topGainer !== null, "Top gainer must be computed");
assert.ok(stats.topLoser !== null, "Top loser must be computed");
assert.ok(stats.topGainer.delta > 0, "Top gainer delta must be positive");
assert.ok(stats.topLoser.delta < 0, "Top loser delta must be negative");
console.log(
  `✔ Stats computation passed (Total: ${stats.total}, Movers: ${stats.moversCount}, Top Gainer: ${stats.topGainer.name} +${stats.topGainer.delta})`
);

// 4. Biggest Movers Sorting
const movers = getBiggestMovers(FALLBACK_LEADERBOARD.rows, 5);
assert.equal(movers.length, 5, "Should return 5 movers");
for (let i = 0; i < movers.length - 1; i++) {
  assert.ok(
    Math.abs(movers[i].delta) >= Math.abs(movers[i + 1].delta),
    "Movers must be sorted by absolute delta descending"
  );
}
console.log("✔ Biggest movers ordering passed");

// 5. Automated Scout Signal Tags Verification
// Condition 1: delta >= 3 => Breakout Velocity
const breakoutCreator = {
  id: "c1",
  name: "Top Mover",
  position: 18,
  delta: 4,
  isNew: false,
};
const breakoutSignal = getScoutSignal(breakoutCreator);
assert.equal(
  breakoutSignal?.type,
  "breakout",
  "delta >= 3 should trigger Breakout Velocity"
);
assert.equal(breakoutSignal?.badge, "Breakout Velocity");
assert.equal(breakoutSignal?.emoji, "🔥");

// Condition 2: delta <= -3 and rank <= 50 => Contrarian Dip
const contrarianCreator = {
  id: "c2",
  name: "Dip Creator",
  position: 43,
  delta: -4,
  isNew: false,
};
const contrarianSignal = getScoutSignal(contrarianCreator);
assert.equal(
  contrarianSignal?.type,
  "contrarian-dip",
  "delta <= -3 and rank <= 50 should trigger Contrarian Dip"
);
assert.equal(contrarianSignal?.badge, "Contrarian Dip");
assert.equal(contrarianSignal?.emoji, "🎯");

// Condition 3: Crypto / CT and delta >= 1 => CT Momentum
const ctCreator = {
  id: "c3",
  name: "Vitalik Buterin",
  position: 52,
  delta: 3,
  isNew: false,
};
const ctSignal = getScoutSignal(ctCreator);
assert.ok(ctSignal !== null, "Vitalik should receive a valid signal");

const ctMover1 = {
  id: "c4",
  name: "Ansem",
  position: 24,
  delta: 1,
  isNew: false,
};
const ctMoverSignal = getScoutSignal(ctMover1);
assert.equal(
  ctMoverSignal?.type,
  "ct-momentum",
  "CT creator with delta >= 1 should trigger CT Momentum"
);
assert.equal(ctMoverSignal?.badge, "CT Momentum");
assert.equal(ctMoverSignal?.emoji, "⚡");

// Condition 4: rank <= 10 and delta === 0 => Bluechip Anchor
const anchorCreator = {
  id: "c5",
  name: "Druski",
  position: 1,
  delta: 0,
  isNew: false,
};
const anchorSignal = getScoutSignal(anchorCreator);
assert.equal(
  anchorSignal?.type,
  "bluechip-anchor",
  "rank <= 10 and delta === 0 should trigger Bluechip Anchor"
);
assert.equal(anchorSignal?.badge, "Bluechip Anchor");
assert.equal(anchorSignal?.emoji, "🛡️");

console.log("✔ Scout Signals engine passed all 4 core thesis badge checks");

// 6. Auto-Scout Best 5 (Balanced Lineup Algorithm)
const autoRoster = autoScoutBest5(FALLBACK_LEADERBOARD.rows);
assert.equal(autoRoster.length, 5, "Auto-scout must return exactly 5 creators");
const uniqueIds = new Set(autoRoster.map((c) => c.id));
assert.equal(uniqueIds.size, 5, "All 5 drafted creators must be unique");
console.log(
  `✔ Auto-Scout Best 5 balanced selection passed: ${autoRoster.map((c) => c.name).join(", ")}`
);

// 7. Lineup Net Velocity & Pre-filled Share Tweet Format
const testLineup = [
  { id: "1", name: "Valkyrae", position: 18, delta: 4, isNew: false },
  { id: "2", name: "Vitalik Buterin", position: 52, delta: 3, isNew: false },
  { id: "3", name: "Bill Ackman", position: 38, delta: 2, isNew: false },
  { id: "4", name: "Haseeb Qureshi", position: 67, delta: 2, isNew: false },
  { id: "5", name: "Garry Tan", position: 43, delta: -4, isNew: false },
];

const netVelocity = computeLineupNetDelta(testLineup);
assert.equal(netVelocity, 7, "Net velocity should be 4 + 3 + 2 + 2 - 4 = 7");

const tweet = generateLineupShareTweet(testLineup);
assert.ok(tweet.includes("@motiongame_"), "Tweet must mention @motiongame_");
assert.ok(tweet.includes("@callmogbot"), "Tweet must tag @callmogbot");
assert.ok(tweet.includes("#Mogathon"), "Tweet must include #Mogathon");
assert.ok(
  tweet.includes("https://motionradar.vercel.app/"),
  "Tweet must include the live site URL"
);
assert.ok(
  tweet.includes("Net Velocity: +7 Δ"),
  "Tweet must display net combined velocity"
);
assert.ok(
  tweet.includes("1. Valkyrae (#18 | ↑ +4)"),
  "Tweet should format creator line with arrow"
);
assert.ok(
  tweet.includes("5. Garry Tan (#43 | 🎯 Contrarian Dip -4)"),
  "Tweet should format contrarian dip with tag"
);

console.log("✔ Lineup pre-filled X share intent format verified");

// 8. Motion Board Engine & Tier Management Verification
assert.equal(BOARD_TIERS.length, 4, "Must define exactly 4 tiers");
const tierIds = BOARD_TIERS.map((t) => t.id);
assert.deepEqual(
  tierIds,
  ["must-haves", "value-picks", "sleepers", "pass"],
  "Tiers must be Must-Haves, Value Picks, Sleepers, Pass"
);

// Empty board check
const emptyBoard = createEmptyBoard();
assert.equal(countTotalPicks(emptyBoard), 0, "Empty board should have 0 picks");

// Thesis suggestion tests
const gainerCreator = {
  id: "g1",
  name: "Gainer",
  position: 12,
  delta: 5,
  isNew: false,
};
const mustHaveTheses = getSuggestedTheses(gainerCreator, "must-haves");
assert.ok(mustHaveTheses.length >= 2, "Must return at least 2 thesis suggestions");
assert.ok(
  mustHaveTheses[0].includes("Breakout velocity"),
  "Must suggest breakout velocity for high positive delta"
);

const dipCreator = {
  id: "d1",
  name: "Dipper",
  position: 30,
  delta: -4,
  isNew: false,
};
const valueTheses = getSuggestedTheses(dipCreator, "value-picks");
assert.ok(
  valueTheses[0].includes("Contrarian dip"),
  "Must suggest contrarian dip for negative delta in value tier"
);

// Suggested Board Generation
const suggestedBoard = generateSuggestedBoard(FALLBACK_LEADERBOARD.rows);
const suggestedPicksCount = countTotalPicks(suggestedBoard);
assert.ok(suggestedPicksCount >= 8, "Suggested board should draft at least 8 picks");
assert.ok(
  suggestedBoard["must-haves"].length > 0,
  "Must-Haves tier should have picks"
);
assert.ok(
  suggestedBoard["value-picks"].length > 0,
  "Value Picks tier should have picks"
);
assert.ok(
  suggestedBoard["sleepers"].length > 0,
  "Sleepers tier should have picks"
);
assert.ok(
  suggestedBoard["pass"].length > 0,
  "Pass tier should have picks"
);

// Sync with live data
const updatedRows = FALLBACK_LEADERBOARD.rows.map((r) => {
  if (r.id === suggestedBoard["must-haves"][0].creatorId) {
    return { ...r, delta: r.delta + 1, position: Math.max(1, r.position - 1) };
  }
  return r;
});
const syncedBoard = syncBoardWithLiveData(suggestedBoard, updatedRows);
assert.equal(
  syncedBoard["must-haves"][0].delta,
  suggestedBoard["must-haves"][0].delta + 1,
  "Synced board must update delta from live data"
);

// Board URL param encoding & decoding roundtrip
const encodedParam = encodeBoardToUrlParam(suggestedBoard);
assert.ok(encodedParam.length > 0, "Board should serialize to non-empty string");
const decodedBoard = decodeBoardFromUrlParam(encodedParam, FALLBACK_LEADERBOARD.rows);
assert.ok(decodedBoard !== null, "Decoded board must be non-null");
assert.equal(
  countTotalPicks(decodedBoard),
  suggestedPicksCount,
  "Decoded board must preserve pick count"
);

// Board Share Tweet Format
const boardTweet = generateBoardShareTweet(suggestedBoard);
assert.ok(boardTweet.includes("My Motion Board"), "Tweet must have title");
assert.ok(boardTweet.includes("@motiongame_"), "Tweet must mention @motiongame_");
assert.ok(boardTweet.includes("@callmogbot"), "Tweet must tag @callmogbot");
assert.ok(boardTweet.includes("#Mogathon"), "Tweet must include #Mogathon");
assert.ok(boardTweet.includes("🔥 MUST-HAVES:"), "Tweet must include Must-Haves header");
assert.ok(boardTweet.includes("💎 VALUE PICKS:"), "Tweet must include Value Picks header");
assert.ok(boardTweet.includes("⚡ SLEEPERS:"), "Tweet must include Sleepers header");
assert.ok(boardTweet.includes("⚠️ PASS:"), "Tweet must include Pass header");

console.log("✔ Motion Board tier maker & share engine verification passed");
console.log("🎉 All MotionRadar verification & scout engine tests passed!");
