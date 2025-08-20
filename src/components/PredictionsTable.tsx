
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Prediction {
  title: string;
  content?: string;
  percentage?: string;
  time?: string;
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
                                    {prediction.content || 'No additional content'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
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
