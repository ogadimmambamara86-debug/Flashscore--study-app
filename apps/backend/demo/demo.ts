// demo/demo.ts
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
    // Instead of the problematic fetchAllPredictions, let's fetch individual endpoints
    const todayPredictions = await statService.fetchPredictionsFromEndpoint('/predictions/today');
    console.log('Today predictions:', todayPredictions);
    
    const tomorrowPredictions = await statService.fetchPredictionsFromEndpoint('/predictions/tomorrow');
    console.log('Tomorrow predictions:', tomorrowPredictions);
    
    const soccerPredictions = await statService.fetchPredictionsFromEndpoint('/soccer-predictions');
    console.log('Soccer predictions:', soccerPredictions);
    
    const footballPredictions = await statService.fetchPredictionsFromEndpoint('/football-predictions');
    console.log('Football predictions:', footballPredictions);
    
    const x1x2Predictions = await statService.fetchPredictionsFromEndpoint('/predictions/1x2');
    console.log('1X2 predictions:', x1x2Predictions);
    
    const overUnderPredictions = await statService.fetchPredictionsFromEndpoint('/predictions/over-under');
    console.log('Over/Under predictions:', overUnderPredictions);
    
    const bttsPredictions = await statService.fetchPredictionsFromEndpoint('/predictions/both-teams-to-score');
    console.log('BTTS predictions:', bttsPredictions);
    
  } catch (err) {
    console.error('Error fetching predictions:', err);
  }

  // Removed the problematic getHighConfidencePredictions section (lines 26-40)
  // This was causing: TypeError: statService.getHighConfidencePredictions is not a function
}

main().catch(console.error);