import { EnhancedSportsService } from '../services/enhancedSportsService';
import { statAreaService } from '../services/statAreaService';

async function main() {
  const sportsService = new EnhancedSportsService({});
  const statService = statAreaService;

  console.log('=== Fetching Live Matches ===');
  try {
    const matches = await sportsService.fetchLiveMatchesWithStats();
    console.log(matches);
  } catch (err) {
    console.error('Error fetching live matches:', err);
  }

  console.log('\n=== Fetching All StatArea Predictions ===');
  try {
    const allPredictions = await statService.fetchAllPredictions();
    // demo/demo.ts
import { statService } from '../services/mock-stat-service';

async function main() {
  try {
    console.log('=== Fetching Live Matches ===');
    // This will now use mock data instead of real API calls
    
    console.log('=== Fetching All StatArea Predictions ===');
    const predictions = await statService.fetchAllPredictions();
    console.log('All predictions loaded:', predictions);
    
    console.log('=== High Confidence Predictions ===');
    const highConfidence = await statService.getHighConfidencePredictions();
    console.log('High confidence predictions:', highConfidence);
    
  } catch (error) {
    console.error('Demo error:', error);
  }
}

main();