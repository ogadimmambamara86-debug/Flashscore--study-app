export interface EnhancedMatch extends MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;

  matchDate?: Date;
  date?: Date;
  competition?: string;
  league?: string;

  status?: 'scheduled' | 'live' | 'completed';
  additionalStats?: Record<string, any>;
}

/**
 * Get the effective match date safely
 */
export function getMatchDate(match: EnhancedMatch): Date | undefined {
  // Use matchDate if available; fallback to date
  return match.matchDate ?? match.date;
}

// Example usage:
const match: EnhancedMatch = {
  id: '1',
  homeTeam: 'Team A',
  awayTeam: 'Team B',
  date: new Date('2025-09-23'),
  status: 'scheduled'
};

const effectiveDate = getMatchDate(match);
console.log('Match date:', effectiveDate);