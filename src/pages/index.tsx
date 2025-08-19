
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '20px', 
        background: 'linear-gradient(135deg, #007bff, #0056b3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
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
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>Live Matches</h3>
          <p style={{ color: '#666', margin: '0' }}>Real-time scores and updates</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          background: 'white', 
          borderRadius: '8px', 
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
      
      <Link href="/dashboard" style={{
        display: 'inline-block',
        padding: '15px 30px',
        background: '#007bff',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease'
      }}>
        Enter Dashboard
      </Link>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px' 
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
