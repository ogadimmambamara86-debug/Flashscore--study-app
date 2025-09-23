export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card' | 'substitution';
  team: 'home' | 'away';
  player: string;
  description?: string;
}

export interface NewsItem {
  title: string;
  source: string;
  publishedAt: Date;
  url: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface SocialSentiment {
  homeSentiment: number;
  awaySentiment: number;
  totalMentions: number;
  trending: boolean;
}