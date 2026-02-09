
export enum TrustLevel {
  SAFE = 'SAFE',
  EMERGING = 'EMERGING',
  CAUTION = 'CAUTION',
  HIGH_RISK = 'HIGH_RISK'
}

export interface UserReview {
  source: string;
  snippet: string;
  url: string;
}

export interface ScoreItem {
  label: string;
  points: number;
}

export interface AnalysisResult {
  url: string;
  score: number;
  level: TrustLevel;
  insights: string[];
  pros: string[];
  cons: string[];
  scoreBreakdown: ScoreItem[];
  userReviews: UserReview[];
  technical: {
    ssl: boolean;
    domainAgeDays: number;
    whoisPrivacy: boolean;
    serverLocation: string;
  };
  contentAnalysis: string;
  scoreReasoningLayman: string;
  isClaimable: boolean;
}

export interface GroundingMetadata {
  searchQueries?: string[];
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    }
  }>;
}
