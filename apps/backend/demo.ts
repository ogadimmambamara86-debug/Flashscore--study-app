// demo.ts
import { EnhancedSportsService } from './services/enhancedSportsService';
import { statAreaService } from './services/statAreaService';

async function main() {
  const sportsService = new EnhancedSportsService({ /* config options */ });

  console.log('Fetching live matches with stats...');
  const liveMatches = await sportsService.fetchLiveMatchesWithStats();
  console.log(`Found ${liveMatches.length} live matches:`);
  console.log(liveMatches.slice(0, 3)); // show first 3 matches

  console.log('\nFetching StatArea predictions...');
  const predictions = await statAreaService.fetchAllPredictions();
  console.log(`Found ${predictions.length} predictions:`);
  console.log(predictions.slice(0, 5)); // show first 5 predictions

  console.log('\nHigh-confidence predictions (>=80%):');
  const highConf = await statAreaService.getHighConfidencePredictions(80);
  console.log(highConf.slice(0, 5));
}

main().catch(err => console.error(err));