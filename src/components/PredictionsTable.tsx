

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
        <div className="predictions-table">
            <h3>Predictions Table</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Title</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Sport</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Confidence</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Source</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Content</th>
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
                            <td colSpan={5} style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                No predictions available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PredictionsTable;
