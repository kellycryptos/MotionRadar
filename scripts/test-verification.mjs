import assert from "node:assert/strict";
import { FALLBACK_LEADERBOARD } from "../src/lib/fixture-data.ts";
import { isCryptoCreator } from "../src/lib/crypto-creators.ts";
import { computeLeaderboardStats, getBiggestMovers } from "../src/lib/api.ts";
import {
  getScoutSignal,
  computeLineupNetDelta,
  autoScoutBest5,
  generateLineupShareTweet,
} from "../src/lib/scout-signals.ts";

console.log("▶ Running MotionRadar verification suite...");

// 1. Fixture integrity
assert.ok(
  FALLBACK_LEADERBOARD.rows.length >= 70,
  "Fallback leaderboard rows must have at least 70 creators"
);
assert.ok(FALLBACK_LEADERBOARD.asOf, "asOf timestamp must be present");

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
assert.ok(tweet.includes("@motion"), "Tweet must mention @motion");
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

console.log("✔ Pre-filled X share intent format verified");
console.log("🎉 All MotionRadar verification & scout engine tests passed!");
