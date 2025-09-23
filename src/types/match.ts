export interface TeamStats {
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  avgPossession: number;
  shotsPerGame: number;
}

export interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeForm: string[];
  awayForm: string[];
  headToHead: string[];
  homeStats: TeamStats;
  awayStats: TeamStats;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export interface EnhancedMatch extends MatchData {
  id: string;
  timestamp: Date;
  venue: string;
  competition: string;
  status: 'scheduled' | 'live' | 'completed';
  events?: MatchEvent[];
  news?: NewsItem[];
  socialSentiment?: SocialSentiment;
}