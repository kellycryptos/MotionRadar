import assert from "node:assert/strict";
import { FALLBACK_LEADERBOARD } from "../src/lib/fixture-data.ts";
import { isCryptoCreator } from "../src/lib/crypto-creators.ts";
import { computeLeaderboardStats, getBiggestMovers } from "../src/lib/api.ts";
import {
  getScoutSignal,
  computeLineupNetDelta,
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

// 5. Scout Signals Verification
const breakoutCreator = {
  id: "1",
  name: "Breakout Star",
  position: 10,
  delta: 4,
  isNew: false,
};
const breakoutSignal = getScoutSignal(breakoutCreator);
assert.equal(
  breakoutSignal?.type,
  "breakout",
  "Delta >= 3 should trigger Breakout Velocity"
);
assert.ok(breakoutSignal?.badge.includes("Breakout"));

const ctMover = {
  id: "2",
  name: "Vitalik Buterin",
  position: 40,
  delta: 3,
  isNew: false,
};
const ctSignal = getScoutSignal(ctMover);
assert.ok(
  ctSignal !== null,
  "Crypto creator with positive delta should get a signal"
);

const oversoldCreator = {
  id: "3",
  name: "Dip Specimen",
  position: 12,
  delta: -3,
  isNew: false,
};
const oversoldSignal = getScoutSignal(oversoldCreator);
assert.equal(
  oversoldSignal?.type,
  "oversold",
  "Delta <= -3 should trigger Oversold Dip"
);

const blueChip = {
  id: "4",
  name: "Druski",
  position: 1,
  delta: 0,
  isNew: false,
};
const blueChipSignal = getScoutSignal(blueChip);
assert.equal(
  blueChipSignal?.type,
  "blue-chip",
  "Top 5 creator with non-negative delta should be Blue Chip"
);

const newEntry = {
  id: "5",
  name: "Newcomer",
  position: 50,
  delta: 0,
  isNew: true,
};
const newSignal = getScoutSignal(newEntry);
assert.equal(
  newSignal?.type,
  "new-catalyst",
  "isNew creator should trigger New Catalyst"
);

console.log("✔ Scout Signals engine passed all condition verifications");

// 6. 5-Creator Lineup Builder & Viral Share Tweet Verification
const sampleLineup = [
  { id: "10", name: "Vitalik Buterin", position: 44, delta: 3, isNew: false },
  { id: "11", name: "Coffeezilla", position: 42, delta: 3, isNew: false },
  { id: "12", name: "Dave Portnoy", position: 8, delta: 2, isNew: false },
  { id: "13", name: "Flood", position: 47, delta: 2, isNew: false },
  { id: "14", name: "Druski", position: 1, delta: 0, isNew: false },
];

const netDelta = computeLineupNetDelta(sampleLineup);
assert.equal(netDelta, 10, "Net delta sum should equal 3 + 3 + 2 + 2 + 0 = 10");

const tweet = generateLineupShareTweet(sampleLineup);
assert.ok(tweet.includes("@callmogbot"), "Tweet must mention @callmogbot");
assert.ok(tweet.includes("#Motion"), "Tweet must include #Motion");
assert.ok(tweet.includes("#Mogathon"), "Tweet must include #Mogathon");
assert.ok(
  tweet.includes("https://motionradar.vercel.app/"),
  "Tweet must include the live site URL"
);
assert.ok(
  tweet.includes("Combined Momentum: +10 Δ Net Velocity"),
  "Tweet must display net combined momentum"
);
for (const creator of sampleLineup) {
  assert.ok(
    tweet.includes(creator.name),
    `Tweet should list drafted creator ${creator.name}`
  );
}
console.log("✔ Lineup net delta & viral share tweet generation passed");

console.log("🎉 All MotionRadar verification & scout engine tests passed!");
