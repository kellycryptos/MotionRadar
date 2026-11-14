/**
 * Official X (Twitter) handles and URL helpers for MotionRadar creators.
 * Covers all 79 creators in the dataset (both Crypto/CT and Culture).
 */

export const CREATOR_X_HANDLES: Record<string, string> = {
  // Culture Creators
  "druski": "druski",
  "marques brownlee": "MKBHD",
  "pat mcafee": "PatMcAfeeShow",
  "ishowspeed": "ishowspeedsui",
  "bryan johnson": "bryan_johnson_",
  "zohran mamdani": "ZohranKMamdani",
  "ludwig": "LudwigAhgren",
  "greg isenberg": "gregisenberg",
  "dave portnoy": "stoolpresidente",
  "kai cenat": "KaiCenat",
  "shams charania": "ShamsCharania",
  "lex fridman": "lexfridman",
  "gary vaynerchuk": "garyvee",
  "jake paul": "jakepaul",
  "jake lucky": "JakeSucky",
  "andrew huberman": "hubermanlab",
  "dj akademiks": "Akademiks",
  "valkyrae": "Valkyrae",
  "theo von": "TheoVon",
  "grimes": "Grimezsz",
  "chamath palihapitiya": "chamath",
  "logan paul": "LoganPaul",
  "mark cuban": "mcuban",
  "david senra": "FoundersPodcast",
  "mark rober": "MarkRober",
  "jim cramer": "jimcramer",
  "jason": "Jason",
  "bill ackman": "BillAckman",
  "plaqueboymax": "Plaqueboymax",
  "garry tan": "garrytan",
  "nikita bier": "nikitabier",
  "andrej karpathy": "karpathy",
  "palmer luckey": "PalmerLuckey",
  "mike solana": "micsolana",
  "david sacks": "DavidSacks",
  "tim dillon": "TimJDillon",
  "john coogan": "johncoogan",
  "xqc": "xQc",
  "paul graham": "paulg",
  "aaron levie": "levie",
  "vlad tenev": "vladtenev",
  "jordi hays": "jordihays",
  "dylan field": "zoink",
  "kai trump": "kaitrump",
  "david holz": "DavidSHolz",
  "jynxzi": "Jynxzi",
  "brian chesky": "bchesky",

  // Crypto / CT Creators
  "michael saylor": "saylor",
  "naval": "naval",
  "ansem": "blknoiz06",
  "minhxdynasty": "minhxdynasty",
  "greg": "greg16676935420",
  "clemente": "WClementeIII",
  "threadguy": "notthreadguy",
  "dogedesigner": "cb_doge",
  "rasmr": "rasmr_eth",
  "murray hill guy": "MurrayHillGuy",
  "sir doge of the coin": "dogeofficialceo",
  "beff jezos": "BasedBeffJezos",
  "coffeezilla": "coffeebreak_YT",
  "mert mumtaz": "0xMert_",
  "flood": "ThinkingUSD",
  "brian armstrong": "brian_armstrong",
  "chooserich": "ChooseRichNick",
  "vitalik buterin": "VitalikButerin",
  "martin shkreli": "MartinShkreli",
  "tarek mansour": "mansourtarek_",
  "roon": "tszzl",
  "alexfinn": "AlexFinnX",
  "toly": "aeyakovenko",
  "taiki maeda": "TaikiMaeda2",
  "balaji": "balajis",
  "jack butcher": "jackbutcher",
  "andy": "ayyyeandy",
  "haseeb qureshi": "hosseeb",
  "marc andreessen": "pmarca",
  "cobie": "cobie",
  "chris dixon": "cdixon",
  "shayne coplan": "shayne_coplan",

  // Common aliases & shortcuts
  "vitalik": "VitalikButerin",
  "chamath": "chamath",
  "saylor": "saylor",
  "mkbhd": "MKBHD",
  "speed": "ishowspeedsui",
  "karpathy": "karpathy",
  "mert": "0xMert_",

  // Methodology micro-diagram initials aliases
  "vr": "Valkyrae",
  "an": "blknoiz06",
  "co": "cobie",
  "vb": "VitalikButerin",
  "ty": "aeyakovenko",
};

/**
 * Extract clean handle from an X/Twitter profile URL (e.g. "https://x.com/notthreadguy" -> "notthreadguy").
 */
export function extractHandleFromUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const clean = url.trim().replace(/\/+$/, "");
    const parts = clean.split("/");
    const last = parts[parts.length - 1];
    return last ? last.replace(/^@/, "") : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolves an X handle from a creator object, name, or URL.
 */
export function getCreatorHandle(
  creatorOrName?:
    | {
        name?: string;
        handle?: string;
        xUrl?: string;
      }
    | string
): string | undefined {
  if (!creatorOrName) return undefined;

  if (typeof creatorOrName === "string") {
    const raw = creatorOrName.trim();
    if (raw.includes("x.com/") || raw.includes("twitter.com/")) {
      return extractHandleFromUrl(raw);
    }
    const normalized = raw.toLowerCase();
    return CREATOR_X_HANDLES[normalized] || (raw.startsWith("@") ? raw.slice(1) : undefined);
  }

  // Explicit handle
  if (creatorOrName.handle) {
    return creatorOrName.handle.replace(/^@/, "").trim();
  }

  // Extract from xUrl if available
  if (creatorOrName.xUrl) {
    const fromUrl = extractHandleFromUrl(creatorOrName.xUrl);
    if (fromUrl) return fromUrl;
  }

  // Match by name
  if (creatorOrName.name) {
    const normalized = creatorOrName.name.trim().toLowerCase();
    return CREATOR_X_HANDLES[normalized];
  }

  return undefined;
}

/**
 * Returns full X profile URL for a creator.
 */
export function getCreatorXUrl(
  creatorOrName?:
    | {
        name?: string;
        handle?: string;
        xUrl?: string;
      }
    | string
): string | undefined {
  if (!creatorOrName) return undefined;
  if (typeof creatorOrName === "object" && creatorOrName.xUrl) {
    return creatorOrName.xUrl;
  }
  const handle = getCreatorHandle(creatorOrName);
  return handle ? `https://x.com/${handle}` : undefined;
}

/**
 * Fallback 2-letter initials for a creator name.
 */
export function getInitials(name?: string, fallbackInitials?: string): string {
  if (fallbackInitials) return fallbackInitials.slice(0, 2).toUpperCase();
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
