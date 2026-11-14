import assert from "node:assert/strict";
import { FALLBACK_LEADERBOARD } from "../src/lib/fixture-data.ts";
import { isCryptoCreator, KNOWN_CRYPTO_CREATORS } from "../src/lib/crypto-creators.ts";
import { computeLeaderboardStats, getBiggestMovers } from "../src/lib/api.ts";

console.log("▶ Running MotionRadar verification suite...");

// 1. Fixture integrity
assert.ok(FALLBACK_LEADERBOARD.rows.length >= 70, "Fallback leaderboard rows must have at least 70 creators");
assert.ok(FALLBACK_LEADERBOARD.asOf, "asOf timestamp must be present");

// 2. Crypto Creators Check
const requiredCryptoNames = [
  "Ansem",
  "Clemente",
  "MINHxDYNASTY",
  "Threadguy",
  "Cobie",
  "Vitalik Buterin",
  "Toly"
];

for (const name of requiredCryptoNames) {
  assert.equal(isCryptoCreator(name), true, `Creator "${name}" should be recognized as Crypto/CT`);
}
console.log("✔ Crypto/CT creator detection passed");

// 3. Stats Computation
const stats = computeLeaderboardStats(FALLBACK_LEADERBOARD.rows);
assert.equal(stats.total, FALLBACK_LEADERBOARD.rows.length, "Total creators count must match rows");
assert.ok(stats.moversCount > 0, "Movers count must be > 0");
assert.ok(stats.gainersCount > 0, "Gainers count must be > 0");
assert.ok(stats.losersCount > 0, "Losers count must be > 0");
assert.ok(stats.topGainer !== null, "Top gainer must be computed");
assert.ok(stats.topLoser !== null, "Top loser must be computed");
assert.ok(stats.topGainer.delta > 0, "Top gainer delta must be positive");
assert.ok(stats.topLoser.delta < 0, "Top loser delta must be negative");
console.log(`✔ Stats computation passed (Total: ${stats.total}, Movers: ${stats.moversCount}, Top Gainer: ${stats.topGainer.name} +${stats.topGainer.delta})`);

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

console.log("🎉 All MotionRadar unit & integrity checks passed successfully!");
