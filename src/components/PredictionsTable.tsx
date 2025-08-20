

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Prediction {
  title: string;
  content?: string;
  sport?: string;
  confidence?: string;
  source?: string;
}

function PredictionsTable() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPredictions() {
            try {
                // Use your existing predictions API instead of static file
                const response = await axios.get('/api/predictions');
                setPredictions(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch predictions:', error);
                setLoading(false);
            }
        }

        fetchPredictions();
    }, []);

    if (loading) {
        return <div>Loading predictions...</div>;
    }

    return (
        <div className="predictions-container" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0', color: '#2c3e50', fontSize: '1.5rem' }}>Live Predictions</h3>
                <div style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#27ae60', 
                    color: 'white', 
                    borderRadius: '20px', 
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}>
                    {predictions.length} Active
                </div>
            </div>
            
            {/* Mobile-friendly card layout */}
            <div style={{ display: 'none' }} className="mobile-cards">
                {predictions.map((prediction, index) => (
                    <div key={index} style={{
                        backgroundColor: 'white',
                        padding: '16px',
                        marginBottom: '12px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: `3px solid ${prediction.confidence !== 'N/A' ? '#27ae60' : '#bdc3c7'}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <h4 style={{ margin: '0', color: '#2c3e50', fontSize: '1.1rem' }}>{prediction.title}</h4>
                            <div style={{
                                padding: '4px 12px',
                                backgroundColor: prediction.confidence !== 'N/A' ? '#27ae60' : '#95a5a6',
                                color: 'white',
                                borderRadius: '15px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                {prediction.confidence || 'N/A'}
                            </div>
                        </div>
                        <p style={{ margin: '8px 0', color: '#7f8c8d' }}>{prediction.content || 'No additional content'}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ padding: '4px 8px', backgroundColor: '#3498db', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {prediction.sport || 'N/A'}
                            </span>
                            <span style={{ padding: '4px 8px', backgroundColor: prediction.source === 'internal' ? '#e74c3c' : '#f39c12', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {prediction.source || 'external'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table layout */}
            <div className="desktop-table" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#34495e' }}>
                            <th style={{ padding: '16px 12px', color: 'white', textAlign: 'left', fontWeight: '600' }}>Match Prediction</th>
                            <th style={{ padding: '16px 12px', color: 'white', textAlign: 'center', fontWeight: '600' }}>Sport</th>
                            <th style={{ padding: '16px 12px', color: 'white', textAlign: 'center', fontWeight: '600' }}>Confidence</th>
                            <th style={{ padding: '16px 12px', color: 'white', textAlign: 'center', fontWeight: '600' }}>Source</th>
                            <th style={{ padding: '16px 12px', color: 'white', textAlign: 'left', fontWeight: '600' }}>Analysis</th>
                        </tr>
                    </thead>
                <tbody>
                    {predictions.length > 0 ? (
                        predictions.map((prediction, index) => (
                            <tr key={index}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    {prediction.title}
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        backgroundColor: '#e3f2fd', 
                                        borderRadius: '4px',
                                        fontSize: '0.9em'
                                    }}>
                                        {prediction.sport || 'N/A'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                    <span style={{ 
                                        fontWeight: 'bold',
                                        color: prediction.confidence !== 'N/A' ? '#4caf50' : '#666'
                                    }}>
                                        {prediction.confidence || 'N/A'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <span style={{ 
                                        padding: '2px 6px', 
                                        backgroundColor: prediction.source === 'internal' ? '#c8e6c9' : '#ffecb3', 
                                        borderRadius: '3px',
                                        fontSize: '0.8em'
                                    }}>
                                        {prediction.source || 'external'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    {prediction.content || 'No additional content'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ 
                                padding: '40px', 
                                textAlign: 'center', 
                                color: '#7f8c8d',
                                fontSize: '1.1rem'
                            }}>
                                <div>📊 No predictions available</div>
                                <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Check back soon for new predictions!</div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
            
            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-table { display: none !important; }
                    .mobile-cards { display: block !important; }
                }
                @media (min-width: 769px) {
                    .mobile-cards { display: none !important; }
                    .desktop-table { display: block !important; }
                }
            `}</style>
        </div>
    );
}

export default PredictionsTable;
