export interface LeaderboardCreator {
  id: string;
  name: string;
  position: number;
  delta: number;
  isNew: boolean;
}

export interface LeaderboardResponse {
  asOf: string;
  capturedAt: string;
  baselineCapturedAt: string;
  history: string;
  rows: LeaderboardCreator[];
}

export interface LeaderboardStats {
  total: number;
  moversCount: number;
  gainersCount: number;
  losersCount: number;
  neutralCount: number;
  cryptoCount: number;
  topGainer: LeaderboardCreator | null;
  topLoser: LeaderboardCreator | null;
  avgAbsoluteDelta: number;
}

export type ScoutSignalType =
  | "breakout"
  | "oversold"
  | "ct-momentum"
  | "ct-value"
  | "blue-chip"
  | "hidden-mover"
  | "new-catalyst";

export interface ScoutSignal {
  type: ScoutSignalType;
  label: string;
  badge: string;
  emoji: string;
  tagColor: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  thesis: string;
}
