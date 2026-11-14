export interface CryptoCreatorInfo {
  name: string;
  handle?: string;
  tag: string;
  description?: string;
}

export const KNOWN_CRYPTO_CREATORS: Record<string, CryptoCreatorInfo> = {
  ansem: {
    name: "Ansem",
    handle: "blknoiz06",
    tag: "Solana / Crypto Legend",
    description: "Influential crypto trader and culture shaper"
  },
  clemente: {
    name: "Clemente",
    handle: "WClementeIII",
    tag: "Reflexivity / On-Chain Analyst",
    description: "Co-founder Reflexivity Research"
  },
  minhxdynasty: {
    name: "MINHxDYNASTY",
    handle: "minhxdynasty",
    tag: "Crypto Native / Creator",
    description: "Web3 investor and crypto culture influencer"
  },
  threadguy: {
    name: "Threadguy",
    handle: "notthreadguy",
    tag: "Culture / Media",
    description: "Host of The Threadguy Show"
  },
  cobie: {
    name: "Cobie",
    handle: "cobie",
    tag: "UpOnly / Crypto OG",
    description: "Founder of Echo and long-time CT voice"
  },
  "vitalik buterin": {
    name: "Vitalik Buterin",
    handle: "VitalikButerin",
    tag: "Ethereum Founder",
    description: "Ethereum co-founder and researcher"
  },
  vitalik: {
    name: "Vitalik Buterin",
    handle: "VitalikButerin",
    tag: "Ethereum Founder",
    description: "Ethereum co-founder"
  },
  toly: {
    name: "Toly",
    handle: "aeyakovenko",
    tag: "Solana Founder",
    description: "Anatoly Yakovenko, co-founder of Solana"
  },
  "mert mumtaz": {
    name: "Mert Mumtaz",
    handle: "0xMert_",
    tag: "Helius CEO",
    description: "Solana developer tooling and ecosystem advocate"
  },
  "michael saylor": {
    name: "Michael Saylor",
    handle: "saylor",
    tag: "Bitcoin Maximalist",
    description: "Executive Chairman of MicroStrategy"
  },
  naval: {
    name: "Naval",
    handle: "naval",
    tag: "AngelList / Philosopher",
    description: "Tech philosopher and crypto investor"
  },
  balaji: {
    name: "Balaji",
    handle: "balajis",
    tag: "Network State / Crypto OG",
    description: "Author of The Network State, former Coinbase CTO"
  },
  "jack butcher": {
    name: "Jack Butcher",
    handle: "jackbutcher",
    tag: "Checks / Visualize Value",
    description: "Creator of Checks Elements and Visualize Value"
  },
  flood: {
    name: "Flood",
    handle: "ThinkingUSD",
    tag: "Legendary Crypto Trader",
    description: "Renowned high-volume crypto trader"
  },
  "brian armstrong": {
    name: "Brian Armstrong",
    handle: "brian_armstrong",
    tag: "Coinbase CEO",
    description: "Co-founder & CEO of Coinbase"
  },
  "sir doge of the coin": {
    name: "Sir Doge of the Coin",
    handle: "dogeofficialceo",
    tag: "Dogecoin / Memes",
    description: "Prominent meme & Doge commentator"
  },
  dogedesigner: {
    name: "DogeDesigner",
    handle: "cb_doge",
    tag: "X / Doge Graphic Designer",
    description: "Prominent X tech & crypto designer"
  },
  greg: {
    name: "greg",
    handle: "greg16676935420",
    tag: "CT Satire Legend",
    description: "The viral face of Crypto Twitter culture"
  },
  "haseeb qureshi": {
    name: "Haseeb Qureshi",
    handle: "hosseeb",
    tag: "Dragonfly Capital",
    description: "Managing Partner at Dragonfly"
  },
  "taiki maeda": {
    name: "Taiki Maeda",
    handle: "TaikiMaeda2",
    tag: "DeFi Farmer / Content",
    description: "Popular DeFi educator and yield strategist"
  },
  "chris dixon": {
    name: "Chris Dixon",
    handle: "cdixon",
    tag: "a16z Crypto",
    description: "Founder & Managing Partner of a16z Crypto"
  },
  "shayne coplan": {
    name: "Shayne Coplan",
    handle: "shayne_coplan",
    tag: "Polymarket CEO",
    description: "Founder & CEO of Polymarket prediction market"
  },
  "marc andreessen": {
    name: "Marc Andreessen",
    handle: "pmarca",
    tag: "a16z Co-founder",
    description: "Venture capitalist and techno-optimist"
  },
  "martin shkreli": {
    name: "Martin Shkreli",
    handle: "MartinShkreli",
    tag: "FinTwit / Crypto Spaces",
    description: "Controversial finance and crypto voice"
  },
  roon: {
    name: "Roon",
    handle: "tszzl",
    tag: "AI / e/acc Culture",
    description: "Tech writer and AI personality"
  },
  coffeezilla: {
    name: "Coffeezilla",
    handle: "coffeebreak_YT",
    tag: "Crypto Investigator",
    description: "Leading investigative YouTuber exposing scams"
  },
  alexfinn: {
    name: "AlexFinn",
    handle: "AlexFinnX",
    tag: "Crypto & Tech Creator",
    description: "Web3 content creator and commentator"
  }
};

export function isCryptoCreator(name: string): boolean {
  const normalized = name.trim().toLowerCase();
  return Boolean(KNOWN_CRYPTO_CREATORS[normalized]);
}

export function getCryptoCreatorInfo(name: string): CryptoCreatorInfo | undefined {
  const normalized = name.trim().toLowerCase();
  return KNOWN_CRYPTO_CREATORS[normalized];
}
