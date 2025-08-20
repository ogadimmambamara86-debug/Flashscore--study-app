import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuizMode from '../components/QuizMode';
import OfflineManager from '../components/OfflineManager';
import PredictionsTable from '../components/PredictionsTable';
import LatestNews from '../components/LatestNews';
import InteractiveTools from '../components/InteractiveTools';

export default function Home() {
  const [predictions] = useState([]);
  const [activeTab, setActiveTab] = useState('predictions');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      maxWidth: '900px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative'
    }}>
      {/* Animated background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: -1
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'radial-gradient(circle, #22c55e, transparent)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      <h1 style={{ 
        fontSize: '3.5rem', 
        marginBottom: '24px', 
        background: 'linear-gradient(135deg, #22c55e, #06b6d4, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: '800',
        textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
      }}>
        Welcome to Sports Central
      </h1>

      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666', 
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        Your ultimate destination for live sports data, predictions, and real-time updates across NFL, NBA, MLB, and Soccer.
      </p>

      {isOffline && <OfflineManager />}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '50px' 
      }}>
        <div style={{ 
          padding: '24px', 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px', 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderLeft: '4px solid #22c55e',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }}
        >
          <h3 style={{ 
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            fontWeight: '700'
          }}>Live Matches</h3>
          <p style={{ color: '#d1fae5', margin: '0', lineHeight: '1.5' }}>Real-time scores and updates</p>
        </div>

        <div style={{ 
          padding: '24px', 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Predictions</h3>
          <p style={{ color: '#666', margin: '0' }}>AI-powered match predictions</p>
        </div>

        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Odds & Analytics</h3>
          <p style={{ color: '#666', margin: '0' }}>Comprehensive betting insights</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button
          key="predictions"
          onClick={() => setActiveTab('predictions')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'predictions' ? '#22c55e' : 'transparent',
            color: activeTab === 'predictions' ? 'white' : '#d1fae5',
            border: activeTab === 'predictions' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          📊 Predictions
        </button>
        <button
          key="news"
          onClick={() => setActiveTab('news')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'news' ? '#22c55e' : 'transparent',
            color: activeTab === 'news' ? 'white' : '#d1fae5',
            border: activeTab === 'news' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          📰 News
        </button>
        <button
          key="stories"
          onClick={() => setActiveTab('stories')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'stories' ? '#22c55e' : 'transparent',
            color: activeTab === 'stories' ? 'white' : '#d1fae5',
            border: activeTab === 'stories' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          📖 Stories
        </button>
        <button
          key="quiz"
          onClick={() => setActiveTab('quiz')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'quiz' ? '#22c55e' : 'transparent',
            color: activeTab === 'quiz' ? 'white' : '#d1fae5',
            border: activeTab === 'quiz' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          🎯 Quiz
        </button>
        <button
          key="tools"
          onClick={() => setActiveTab('tools')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'tools' ? '#22c55e' : 'transparent',
            color: activeTab === 'tools' ? 'white' : '#d1fae5',
            border: activeTab === 'tools' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          🛠️ Tools
        </button>
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {activeTab === 'predictions' && <PredictionsTable predictions={predictions} />}
        {activeTab === 'news' && <LatestNews />}
        {activeTab === 'stories' && <LatestNews />}
        {activeTab === 'quiz' && <QuizMode isOffline={isOffline} />}
        {activeTab === 'tools' && <InteractiveTools />}
      </div>

      <Link href="/dashboard" style={{
        display: 'inline-block',
        padding: '15px 30px',
        background: '#007bff',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        marginTop: '50px'
      }}>
        Enter Dashboard
      </Link>

      <div style={{ 
        marginTop: '50px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      }}>
        <h4 style={{ color: '#333', marginBottom: '15px' }}>Available APIs</h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '5px 12px', 
            background: '#007bff', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '0.9rem' 
          }}>NFL</span>
          <span style={{ 
            padding: '5px 12px', 
            background: '#007bff', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '0.9rem' 
          }}>NBA</span>
          <span style={{ 
            padding: '5px 12px', 
            background: '#007bff', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '0.9rem' 
          }}>MLB</span>
          <span style={{ 
            padding: '5px 12px', 
            background: '#007bff', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '0.9rem' 
          }}>Soccer</span>
        </div>
      </div>
    </div>
  );
}