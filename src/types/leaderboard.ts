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
