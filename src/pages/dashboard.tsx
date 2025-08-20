"use client";
import { useEffect, useState } from "react";
import LatestNews from "../components/LatestNews";
import PredictionsTable from "../components/PredictionsTable";

interface Match {
  id: number;
  home: string;
  away: string;
  prediction: string;
}

interface Prediction {
  title: string;
  content?: string;
}

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load predictions data
  useEffect(() => {
    async function loadPredictions() {
      try {
        const response = await fetch('/api/predictions');
        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error('Failed to load predictions:', error);
      }
    }

    loadPredictions();
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/sports").then((res) => res.json()),
      // Already fetched predictions in a separate effect
    ])
    .then(([matchesData]) => {
      setMatches(matchesData);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 className="text-2xl font-bold mb-4">
          ⚽ Sports Predictions Dashboard
        </h1>

        {/* Device indicator */}
        <div style={{
          padding: '6px 12px',
          backgroundColor: isMobile ? '#28a745' : '#007bff',
          color: 'white',
          borderRadius: '15px',
          fontSize: '0.8rem',
          fontWeight: 'bold'
        }}>
          {isMobile ? '📱 Mobile' : '💻 Desktop'} Optimized
        </div>
      </div>

      <LatestNews />

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Our Predictions</h2>
          <div className="grid gap-4">
            {matches.map((match) => (
              <div key={match.id} className="p-4 border rounded-lg shadow bg-white">
                <p className="font-semibold">
                  {match.home} vs {match.away}
                </p>
                <p className="text-blue-600">{match.prediction}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">External Predictions</h2>
          <div className="grid gap-4">
            {predictions.length > 0 ? (
              predictions.map((prediction, index) => (
                <div key={index} className="p-4 border rounded-lg shadow bg-white">
                  <p className="text-gray-800">{prediction.title}</p>
                </div>
              ))
            ) : (
              <div className="p-4 border rounded-lg shadow bg-white">
                <p className="text-gray-500">No external predictions available</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Tomorrow's Predictions</h2>
          <PredictionsTable />
        </div>

      </div>
    </div>
  );
}