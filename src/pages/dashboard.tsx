
import React, { useState, useEffect } from 'react';
import styles from '../styles/Dashboard.module.css';

interface Sport {
  id: number;
  name: string;
  players: number;
  category: string;
}

const Dashboard: React.FC = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await fetch('/api/sports');
      if (!response.ok) {
        throw new Error('Failed to fetch sports data');
      }
      const data = await response.json();
      setSports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading sports data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.dashboard}>
      <h1>Sports Dashboard</h1>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Sports</h3>
          <p>{sports.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Team Sports</h3>
          <p>{sports.filter(sport => sport.category === 'Team Sport').length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Individual Sports</h3>
          <p>{sports.filter(sport => sport.category === 'Individual Sport').length}</p>
        </div>
      </div>
      
      <div className={styles.sportsGrid}>
        {sports.map(sport => (
          <div key={sport.id} className={styles.sportCard}>
            <h3>{sport.name}</h3>
            <p><strong>Players:</strong> {sport.players}</p>
            <p><strong>Category:</strong> {sport.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
