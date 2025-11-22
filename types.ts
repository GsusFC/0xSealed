export interface DiaryEntry {
  id: string;
  timestamp: number;
  content: string;
  sentiment: string;
  aiReflection: string;
  hash: string;
  isSealed: boolean;
}

export enum AppView {
  WRITE = 'WRITE',
  VAULT = 'VAULT',
  DETAILS = 'DETAILS',
  STATS = 'STATS',
  DEPLOY = 'DEPLOY',
  SYSTEM = 'SYSTEM'
}

export interface SentimentResponse {
  sentiment: string;
  reflection: string;
}

export interface UserStats {
  totalEntries: number;
  totalWords: number;
  currentStreak: number;
  voidPoints: number;
  level: string;
  nextLevelPoints: number;
  progress: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  username: string;
  walletAddress: string | null;
}

export interface ClankerDeployParams {
  name: string;
  symbol: string;
  initialSupply: string;
}