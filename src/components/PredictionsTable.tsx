import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Prediction {
  id: string;
  match: string;
  prediction: string;
  confidence: number;
  status: 'pending' | 'won' | 'lost';
}

interface PredictionsTableProps {
  predictions: Prediction[];
}

const PredictionsTable: React.FC<PredictionsTableProps> = ({ predictions }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        margin: '0 0 30px 0',
        background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🔮 Sports Predictions
      </h2>

      {predictions.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
          <h3>No predictions available</h3>
          <p>Check back later for expert sports predictions!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {predictions.map(prediction => (
            <div
              key={prediction.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#22c55e', margin: '0 0 8px 0' }}>
                    {prediction.match}
                  </h3>
                  <p style={{ color: '#d1fae5', margin: '0 0 8px 0' }}>
                    {prediction.prediction}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#06b6d4' }}>
                      Confidence: {prediction.confidence}%
                    </span>
                    <span
                      style={{
                        background: prediction.status === 'won' ? '#22c55e' : 
                                  prediction.status === 'lost' ? '#ef4444' : '#f59e0b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}
                    >
                      {prediction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionsTable;