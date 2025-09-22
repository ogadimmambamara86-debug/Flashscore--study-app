import fetch from 'node-fetch';

interface EnhancedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  time: string;
  league: string;
  statistics?: MatchStatistics;
  events?: MatchEvent[];
  socialData?: SocialData;
  news?: NewsItem[];
}

interface MatchStatistics {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  offsides: { home: number; away: number };
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'card' | 'substitution' | 'var' | 'penalty';
  minute: number;
  player: string;
  team: 'home' | 'away';
  description: string;
  icon: string;
  timestamp: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface SocialData {
  comments: Comment[];
  reactions: { [emoji: string]: number };
  shares: number;
  liveViewers: number;
  trending: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  source: 'goal' | 'internal' | 'social';
}

interface LeagueTable {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  logo: string;
}

interface TransferNews {
  id: string;
  player: string;
  fromTeam: string;
  toTeam: string;
  fee: string;
  status: 'rumored' | 'agreed' | 'completed';
  reliability: number; // 1-10
  source: string;
  date: string;
}

interface Notification {
  type: string;
  message: string;
  matchId?: string;
  newsId?: string;
  timestamp: Date;
}

interface PredictionInput {
  match: any;
  historicalData: any;
  teamForm: any;
  injuries: any;
  oddsData: any;
}

export class EnhancedSportsService {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  // FlashScore-style live match data
  async fetchLiveMatchesWithStats(): Promise<EnhancedMatch[]> {
    try {
      // Multiple API sources for comprehensive data
      const [basicMatches, detailedStats, socialFeed] = await Promise.allSettled([
        this.fetchBasicMatchData(),
        this.fetchMatchStatistics(),
        this.fetchSocialFeedData()
      ]);

      const matches: EnhancedMatch[] = [];

      if (basicMatches.status === 'fulfilled' && Array.isArray(basicMatches.value)) {
        for (const match of basicMatches.value) {
          try {
            const enhancedMatch: EnhancedMatch = {
              ...match,
              statistics: this.getMatchStats(match.id, 
                detailedStats.status === 'fulfilled' ? detailedStats.value : null),
              events: await this.fetchMatchEvents(match.id),
              socialData: await this.fetchSocialMatchData(match.id),
              news: await this.fetchMatchNews(match.id)
            };
            matches.push(enhancedMatch);
          } catch (matchError) {
            console.warn(`Error enhancing match ${match.id}:`, matchError);
            // Push basic match data without enhancements
            matches.push(match);
          }
        }
      }

      return matches;
    } catch (error) {
      console.error('Error fetching enhanced matches:', error);
      return this.getFallbackMatches();
    }
  }

  // Goal.com-style news aggregation
  async fetchSportsNews(category?: string): Promise<NewsItem[]> {
    const newsItems: NewsItem[] = [];

    try {
      // Multiple news sources
      const sources = [
        { url: 'https://api.football-data.org/v4/news', type: 'internal' },
        { url: 'https://newsapi.org/v2/everything?q=football&apiKey=' + (this.config.newsApiKey || ''), type: 'external' }
      ];

      for (const source of sources) {
        try {
          const response = await fetch(source.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'X-Auth-Token': this.config.footballDataApiKey || ''
            }
          });

          if (response.ok) {
            const data = await response.json();
            const formattedNews = this.formatNewsData(data, source.type as any);
            newsItems.push(...formattedNews);
          }
        } catch (sourceError) {
          console.warn(`Failed to fetch from ${source.url}:`, sourceError);
        }
      }

      // Add trending social content
      const socialNews = await this.fetchTrendingSocialContent();
      newsItems.push(...socialNews);

      // Filter by category if provided
      let filteredNews = newsItems;
      if (category) {
        filteredNews = newsItems.filter(item => 
          item.tags.includes(category.toLowerCase()) ||
          item.title.toLowerCase().includes(category.toLowerCase())
        );
      }

      return filteredNews.slice(0, 50); // Limit to 50 most recent
    } catch (error) {
      console.error('Error fetching sports news:', error);
      return this.getFallbackNews();
    }
  }

  // Facebook-style social features
  async fetchSocialMatchData(matchId: string): Promise<SocialData> {
    try {
      // Simulate social media integration
      const comments = await this.generateMatchComments(matchId);
      const reactions = await this.getMatchReactions(matchId);
      
      return {
        comments,
        reactions,
        shares: Math.floor(Math.random() * 1000) + 100,
        liveViewers: Math.floor(Math.random() * 5000) + 500,
        trending: Math.random() > 0.7
      };
    } catch (error) {
      console.error('Error fetching social data:', error);
      return {
        comments: [],
        reactions: {},
        shares: 0,
        liveViewers: 0,
        trending: false
      };
    }
  }

  // League tables with live updates
  async fetchLeagueTable(leagueId: string): Promise<LeagueTable[]> {
    try {
      const response = await fetch(`https://api.football-data.org/v4/competitions/${leagueId}/standings`, {
        headers: {
          'X-Auth-Token': this.config.footballDataApiKey || '',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`League table API error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatLeagueTable(data);
    } catch (error) {
      console.error('Error fetching league table:', error);
      return this.getFallbackLeagueTable();
    }
  }

  // Transfer news aggregation
  async fetchTransferNews(): Promise<TransferNews[]> {
    try {
      // Simulate transfer news from API
      const response = await fetch('https://api.football-data.org/v4/transfers', {
        headers: {
          'X-Auth-Token': this.config.footballDataApiKey || '',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return this.formatTransferData(data);
      }

      return this.getFallbackTransfers();
    } catch (error) {
      console.error('Error fetching transfer news:', error);
      return this.getFallbackTransfers();
    }
  }

  // Real-time notifications
  async setupLiveNotifications(userId: string, preferences: any): Promise<Notification[]> {
    const notifications: Notification[] = [];

    try {
      // Goal alerts
      const liveMatches = await this.fetchLiveMatchesWithStats();
      for (const match of liveMatches) {
        if (match.events && match.events.length > 0) {
          const recentGoals = match.events.filter(event => 
            event.type === 'goal' && 
            this.isEventRecent(event.timestamp)
          );

          for (const goal of recentGoals) {
            notifications.push({
              type: 'goal',
              message: `⚽ ${goal.player} scored for ${goal.team === 'home' ? match.homeTeam : match.awayTeam}!`,
              matchId: match.id,
              timestamp: new Date()
            });
          }
        }
      }

      // Breaking news alerts
      const breakingNews = await this.fetchBreakingNews();
      for (const news of breakingNews.slice(0, 5)) { // Limit to 5 breaking news
        notifications.push({
          type: 'news',
          message: `📰 ${news.title}`,
          newsId: news.id,
          timestamp: new Date()
        });
      }

      return notifications;
    } catch (error) {
      console.error('Error setting up notifications:', error);
      return [];
    }
  }

  // Match prediction with AI analysis
  async generateMatchPrediction(matchId: string): Promise<any> {
    try {
      const match = await this.fetchMatchDetails(matchId);
      const historicalData = await this.fetchHeadToHeadData(match.homeTeam, match.awayTeam);
      const teamForm = await this.fetchTeamForm([match.homeTeam, match.awayTeam]);
      const injuries = await this.fetchInjuryNews([match.homeTeam, match.awayTeam]);

      // AI-powered prediction algorithm
      const prediction = this.calculateMatchPrediction({
        match,
        historicalData,
        teamForm,
        injuries,
        oddsData: await this.fetchOddsData(matchId)
      });

      return {
        prediction: prediction.outcome,
        confidence: prediction.confidence,
        reasoning: prediction.reasoning,
        suggestedBets: prediction.bets,
        riskLevel: prediction.risk
      };
    } catch (error) {
      console.error('Error generating prediction:', error);
      return this.getFallbackPrediction();
    }
  }

  // Private helper methods
  private async fetchBasicMatchData(): Promise<EnhancedMatch[]> {
    try {
      // Simulate API call for basic match data
      return [
        {
          id: '1',
          homeTeam: 'Manchester United',
          awayTeam: 'Liverpool',
          homeScore: 2,
          awayScore: 1,
          status: 'FT',
          time: '90+3',
          league: 'Premier League'
        },
        {
          id: '2',
          homeTeam: 'Barcelona',
          awayTeam: 'Real Madrid',
          homeScore: 3,
          awayScore: 2,
          status: 'LIVE',
          time: '78',
          league: 'La Liga'
        }
      ];
    } catch (error) {
      console.error('Error fetching basic match data:', error);
      return this.getFallbackMatches();
    }
  }

  private async fetchMatchStatistics(): Promise<any> {
    // Implementation for detailed match stats
    return {};
  }

  private async fetchSocialFeedData(): Promise<any> {
    // Implementation for social feed data
    return {};
  }

  private getMatchStats(matchId: string, detailedStats: any): MatchStatistics {
    // Generate realistic match statistics
    return {
      possession: { 
        home: Math.floor(Math.random() * 30) + 35, 
        away: Math.floor(Math.random() * 30) + 35 
      },
      shots: { 
        home: Math.floor(Math.random() * 10) + 8, 
        away: Math.floor(Math.random() * 10) + 6 
      },
      shotsOnTarget: { 
        home: Math.floor(Math.random() * 6) + 3, 
        away: Math.floor(Math.random() * 6) + 2 
      },
      corners: { 
        home: Math.floor(Math.random() * 8) + 2, 
        away: Math.floor(Math.random() * 8) + 2 
      },
      fouls: { 
        home: Math.floor(Math.random() * 10) + 10, 
        away: Math.floor(Math.random() * 10) + 10 
      },
      yellowCards: { 
        home: Math.floor(Math.random() * 4), 
        away: Math.floor(Math.random() * 4) 
      },
      redCards: { 
        home: Math.floor(Math.random() * 2), 
        away: Math.floor(Math.random() * 2) 
      },
      offsides: { 
        home: Math.floor(Math.random() * 5), 
        away: Math.floor(Math.random() * 5) 
      }
    };
  }

  private async fetchMatchEvents(matchId: string): Promise<MatchEvent[]> {
    // Simulate match events
    return [
      {
        id: '1',
        type: 'goal',
        minute: 23,
        player: 'Messi',
        team: 'home',
        description: 'Great finish from outside the box',
        icon: '⚽',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      },
      {
        id: '2',
        type: 'card',
        minute: 45,
        player: 'Ramos',
        team: 'away',
        description: 'Yellow card for rough tackle',
        icon: '🟨',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
      }
    ];
  }

  private async fetchMatchNews(matchId: string): Promise<NewsItem[]> {
    // Simulate match-specific news
    return [
      {
        id: '1',
        title: 'Key player returns from injury',
        summary: 'Important boost for the home team',
        content: 'Full story content...',
        author: 'Sports Reporter',
        publishDate: new Date().toISOString(),
        tags: ['injury', 'lineup'],
        source: 'internal'
      }
    ];
  }

  private formatNewsData(data: any, source: string): NewsItem[] {
    // Format news data from various sources
    if (!data || !data.articles) return [];

    return data.articles.slice(0, 10).map((article: any, index: number) => ({
      id: `news_${source}_${index}`,
      title: article.title || 'No title',
      summary: article.description || 'No summary',
      content: article.content || 'No content',
      author: article.author || 'Unknown',
      publishDate: article.publishedAt || new Date().toISOString(),
      tags: article.tags || ['football'],
      imageUrl: article.urlToImage,
      source: source as 'goal' | 'internal' | 'social'
    }));
  }

  private async fetchTrendingSocialContent(): Promise<NewsItem[]> {
    // Simulate trending social content
    return [
      {
        id: 'social_1',
        title: 'Viral goal celebration breaks internet',
        summary: 'Fans go crazy over incredible celebration',
        content: 'Social media content...',
        author: 'Social Media',
        publishDate: new Date().toISOString(),
        tags: ['viral', 'social'],
        source: 'social'
      }
    ];
  }

  private async generateMatchComments(matchId: string): Promise<Comment[]> {
    // Simulate match comments
    return [
      {
        id: 'comment_1',
        user: 'FootballFan123',
        text: 'What a fantastic match!',
        timestamp: new Date().toISOString(),
        likes: 15
      }
    ];
  }

  private async getMatchReactions(matchId: string): Promise<{ [emoji: string]: number }> {
    // Simulate match reactions
    return {
      '⚽': Math.floor(Math.random() * 1000) + 100,
      '🔥': Math.floor(Math.random() * 500) + 50,
      '👏': Math.floor(Math.random() * 300) + 30
    };
  }

  private formatLeagueTable(data: any): LeagueTable[] {
    if (!data || !data.standings || !data.standings[0] || !data.standings[0].table) {
      return this.getFallbackLeagueTable();
    }

    return data.standings[0].table.map((team: any) => ({
      position: team.position,
      team: team.team.name,
      played: team.playedGames,
      won: team.won,
      drawn: team.draw,
      lost: team.lost,
      goalsFor: team.goalsFor,
      goalsAgainst: team.goalsAgainst,
      goalDifference: team.goalDifference,
      points: team.points,
      form: team.form ? team.form.split(',') : [],
      logo: team.team.crest || ''
    }));
  }

  private formatTransferData(data: any): TransferNews[] {
    if (!data || !data.transfers) return this.getFallbackTransfers();

    return data.transfers.slice(0, 20).map((transfer: any, index: number) => ({
      id: `transfer_${index}`,
      player: transfer.player?.name || 'Unknown Player',
      fromTeam: transfer.fromTeam?.name || 'Unknown Team',
      toTeam: transfer.toTeam?.name || 'Unknown Team',
      fee: transfer.fee || 'Undisclosed',
      status: this.determineTransferStatus(transfer),
      reliability: Math.floor(Math.random() * 10) + 1,
      source: transfer.source || 'Unknown',
      date: transfer.date || new Date().toISOString()
    }));
  }

  private determineTransferStatus(transfer: any): 'rumored' | 'agreed' | 'completed' {
    const status = transfer.status?.toLowerCase() || '';
    if (status.includes('completed')) return 'completed';
    if (status.includes('agreed')) return 'agreed';
    return 'rumored';
  }

  private async fetchBreakingNews(): Promise<NewsItem[]> {
    return this.fetchSportsNews().then(news => 
      news.filter(item => item.tags.includes('breaking')).slice(0, 3)
    );
  }

  private isEventRecent(timestamp: string): boolean {
    const eventTime = new Date(timestamp).getTime();
    const currentTime = Date.now();
    return (currentTime - eventTime) < 5 * 60 * 1000; // Last 5 minutes
  }

  private async fetchMatchDetails(matchId: string): Promise<any> {
    return {
      id: matchId,
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      // ... other match details
    };
  }

  private async fetchHeadToHeadData(team1: string, team2: string): Promise<any> {
    return {
      totalMatches: 15,
      homeWins: 8,
      awayWins: 4,
      draws: 3
    };
  }

  private async fetchTeamForm(teams: string[]): Promise<any> {
    return teams.reduce((form: any, team) => {
      form[team] = ['W', 'D', 'W', 'L', 'W'].slice(0, 5);
      return form;
    }, {});
  }

  private async fetchInjuryNews(teams: string[]): Promise<any> {
    return teams.reduce((injuries: any, team) => {
      injuries[team] = [
        { player: 'Player A', injury: 'Knee', return: '2 weeks' }
      ];
      return injuries;
    }, {});
  }

  private async fetchOddsData(matchId: string): Promise<any> {
    return {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.1
    };
  }

  private calculateMatchPrediction(data: PredictionInput): any {
    // Simple prediction algorithm (replace with actual AI/ML model)
    const { match, historicalData, teamForm, injuries, oddsData } = data;
    
    let homeStrength = 50;
    let awayStrength = 50;

    // Adjust based on historical data
    if (historicalData.homeWins > historicalData.awayWins) {
      homeStrength += 10;
    } else if (historicalData.awayWins > historicalData.homeWins) {
      awayStrength += 10;
    }

    // Adjust based on recent form
    const homeForm = teamForm[match.homeTeam]?.filter((r: string) => r === 'W').length || 0;
    const awayForm = teamForm[match.awayTeam]?.filter((r: string) => r === 'W').length || 0;
    
    homeStrength += homeForm * 5;
    awayStrength += awayForm * 5;

    // Normalize to percentages
    const total = homeStrength + awayStrength;
    const homeProbability = (homeStrength / total) * 100;
    const awayProbability = (awayStrength / total) * 100;
    const drawProbability = 100 - homeProbability - awayProbability;

    let outcome = 'Draw';
    let confidence = drawProbability;
    
    if (homeProbability > awayProbability && homeProbability > drawProbability) {
      outcome = 'Home Win';
      confidence = homeProbability;
    } else if (awayProbability > homeProbability && awayProbability > drawProbability) {
      outcome = 'Away Win';
      confidence = awayProbability;
    }

    return {
      outcome,
      confidence: Math.round(confidence),
      reasoning: 'Based on historical data, recent form, and team strength',
      bets: this.generateSuggestedBets(outcome, oddsData),
      risk: confidence > 70 ? 'Low' : confidence > 50 ? 'Medium' : 'High'
    };
  }

  private generateSuggestedBets(outcome: string, oddsData: any): string[] {
    const bets = [];
    
    if (outcome === 'Home Win' && oddsData.homeWin > 2.0) {
      bets.push('Home Win');
    } else if (outcome === 'Away Win' && oddsData.awayWin > 2.0) {
  