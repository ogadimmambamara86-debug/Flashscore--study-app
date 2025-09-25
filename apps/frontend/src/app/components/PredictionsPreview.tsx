
'use client';

import React from 'react';

const PredictionsPreview: React.FC = () => {
  // Mock data for preview
  const predictions = [
    { id: 1, match: 'Team A vs Team B', prediction: 'Team A Win', confidence: 85 },
    { id: 2, match: 'Team C vs Team D', prediction: 'Draw', confidence: 72 },
    { id: 3, match: 'Team E vs Team F', prediction: 'Team F Win', confidence: 90 }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Latest Predictions</h3>
      <div className="space-y-3">
        {predictions.map((pred) => (
          <div key={pred.id} className="flex justify-between items-center p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">{pred.match}</p>
              <p className="text-xs text-gray-600">{pred.prediction}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-green-600">
                {pred.confidence}% confidence
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionsPreview;
