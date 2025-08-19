
import axios from 'axios';
import { JSDOM } from 'jsdom';

interface Prediction {
  title: string;
  content?: string;
}

export async function fetchPredictions(): Promise<Prediction[]> {
  try {
    const response = await axios.get('https://www.mybets.today/recommended-soccer-predictions/tomorrow/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Extract predictions
    const predictionElements = document.querySelectorAll('h2.prediction-title');
    const predictions: Prediction[] = [];
    
    predictionElements.forEach(element => {
      const title = element.textContent?.trim();
      if (title) {
        predictions.push({ title });
      }
    });

    return predictions;
  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    return [];
  }
}
