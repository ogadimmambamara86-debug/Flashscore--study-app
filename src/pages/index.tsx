import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuizMode from '../components/QuizMode';
import OfflineManager from '../components/OfflineManager';
import PredictionsTable from '../components/PredictionsTable';
import LatestNews from '../components/LatestNews';
import InteractiveTools from '../components/InteractiveTools';
import PiCoinWallet from '../components/PiCoinWallet';
import UserRegistration from '../components/UserRegistration';
import UserManager, { User } from '../utils/userManager';
import PiCoinManager from '../utils/piCoinManager';
import ChallengeSystem from '../components/ChallengeSystem';
import Forum from '../components/Forum';
import BackupSettings from '../components/BackupSettings';
import BackupManager from '../utils/backupManager';
import CommunityVoting from '../components/CommunityVoting'; // Import CommunityVoting component
import BettingAgreement from '../components/BettingAgreement';


export default function Home() {
  const [predictions] = useState([]);
  const [activeTab, setActiveTab] = useState<'predictions' | 'news' | 'stories' | 'quiz' | 'tools' | 'challenges' | 'forum' | 'voting'>('predictions');
  const [isOffline, setIsOffline] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [piBalance, setPiBalance] = useState(0);
  const [isBackupOpen, setIsBackupOpen] = useState(false);


  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    setIsOffline(!navigator.onLine);

    // Check for existing user
    const existingUser = UserManager.getCurrentUser();
    if (existingUser) {
      setCurrentUser(existingUser);
      // Load Pi coin balance and award daily login
      const dailyBonus = PiCoinManager.awardDailyLogin(existingUser.id);
      const balance = PiCoinManager.getBalance(existingUser.id);
      setPiBalance(balance.balance);
    } else {
      // Show registration modal for new users
      setIsRegistrationOpen(true);
    }

    // Listen for registration modal trigger from news component
    const handleOpenRegistration = () => {
      setIsRegistrationOpen(true);
    };

    window.addEventListener('openRegistration', handleOpenRegistration);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('openRegistration', handleOpenRegistration);
    };
  }, []);

  const handleUserCreated = (user: User) => {
    setCurrentUser(user);
    const balance = PiCoinManager.getBalance(user.id);
    setPiBalance(balance.balance);
  };

  const handleLogout = () => {
    UserManager.logoutUser();
    setCurrentUser(null);
    setPiBalance(0);
    setIsRegistrationOpen(true);
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      maxWidth: '900px', 
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative'
    }}>
      {/* Animated background particles - client-only to avoid SSR mismatch */}
      {typeof window !== 'undefined' && (
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
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ 
            fontSize: '3.5rem', 
            margin: '0',
            background: 'linear-gradient(135deg, #ffffff, #00d4ff, #0066cc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
            letterSpacing: '-1px',
            fontFamily: 'monospace'
          }}>
            🚀 SPACEX MISSION CONTROL
          </h1>
          {currentUser && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginTop: '12px'
            }}>
              <p style={{ 
                color: '#00d4ff', 
                fontSize: '1.2rem', 
                margin: '0',
                fontWeight: '600',
                fontFamily: 'monospace'
              }}>
                COMMANDER {currentUser.username.toUpperCase()}
              </p>
              <div style={{
                padding: '4px 12px',
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 102, 204, 0.2))',
                border: '1px solid rgba(0, 212, 255, 0.4)',
                borderRadius: '15px',
                fontSize: '0.8rem',
                color: '#00d4ff',
                fontWeight: '700',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#00ff88',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                MISSION ACTIVE
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {currentUser && (
            <>
              <button
                onClick={() => setIsWalletOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>π</span>
                {piBalance.toLocaleString()} Pi Coins
              </button>

              <button
                onClick={() => setIsBackupOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
                }}
              >
                💾 Backup
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ 
        fontSize: '1.2rem', 
        color: '#a0a0a0', 
        marginBottom: '30px',
        lineHeight: '1.8',
        fontFamily: 'monospace',
        textAlign: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 0, 0, 0.8))',
        borderRadius: '15px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
          animation: 'scan 3s ease-in-out infinite'
        }} />
        <strong style={{ color: '#00d4ff' }}>MISSION BRIEFING:</strong> Navigate the sports universe with our <strong style={{ color: '#ffffff' }}>quantum-powered prediction algorithms</strong>. Monitor live data streams across <em style={{ color: '#00ff88' }}>NFL, NBA, MLB, and Soccer sectors</em>. Earn mission credits through precision targeting and tactical challenges.
        <div style={{
          marginTop: '15px',
          fontSize: '1rem',
          color: '#00d4ff',
          fontWeight: '700'
        }}>
          🛰️ TELEMETRY ACTIVE • 🚀 ENGINES NOMINAL • ⚡ NEURAL LINKS ESTABLISHED
        </div>
      </div>

      {isOffline && <OfflineManager />}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px', 
        marginBottom: '50px' 
      }}>
        {/* Falcon Heavy - Live Data Module */}
        <article style={{ 
          padding: '25px', 
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(0, 0, 0, 0.9))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px', 
          boxShadow: '0 12px 40px rgba(0, 212, 255, 0.15)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderLeft: '4px solid #00d4ff',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        }}
        >
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
            animation: 'scan 2.5s ease-in-out infinite'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 15px rgba(0, 255, 136, 0.6)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <h3 style={{ 
              color: '#ffffff',
              margin: '0',
              fontWeight: '800',
              fontSize: '1.3rem',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>🚀 FALCON HEAVY DATA STREAM</h3>
          </div>
          <p style={{ 
            color: '#a0a0a0', 
            margin: '0', 
            lineHeight: '1.6',
            fontFamily: 'monospace'
          }}>Real-time telemetry from NFL, NBA, MLB, and Soccer orbital stations with quantum-encrypted data transmission</p>
        </article>

        {/* Dragon Capsule - Prediction Module */}
        <article style={{ 
          padding: '25px', 
          background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.08), rgba(0, 0, 0, 0.9))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px', 
          boxShadow: '0 12px 40px rgba(0, 102, 204, 0.15)',
          border: '1px solid rgba(0, 102, 204, 0.3)',
          borderLeft: '4px solid #0066cc',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 102, 204, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(0, 102, 204, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 102, 204, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(0, 102, 204, 0.3)';
        }}
        >
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(0, 102, 204, 0.15) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#0066cc',
              boxShadow: '0 0 12px rgba(0, 102, 204, 0.6)'
            }} />
            <h3 style={{ 
              color: '#ffffff',
              margin: '0',
              fontWeight: '800',
              fontSize: '1.3rem',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>🛸 DRAGON AI PREDICTIONS</h3>
          </div>
          <p style={{ 
            color: '#a0a0a0', 
            margin: '0', 
            lineHeight: '1.6',
            fontFamily: 'monospace'
          }}>Neural network powered match outcome calculations with 95% accuracy rating from mission control</p>
        </article>

        {/* Starship - Analytics Module */}
        <article style={{ 
          padding: '25px', 
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.08), rgba(0, 0, 0, 0.9))',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px', 
          boxShadow: '0 12px 40px rgba(255, 165, 0, 0.15)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderLeft: '4px solid #ffa500',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 165, 0, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(255, 165, 0, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 165, 0, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 165, 0, 0.3)';
        }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ffa500',
              boxShadow: '0 0 10px rgba(255, 165, 0, 0.6)'
            }} />
            <h3 style={{ 
              color: '#ffffff',
              margin: '0',
              fontWeight: '800',
              fontSize: '1.3rem',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>🌌 STARSHIP ANALYTICS</h3>
          </div>
          <p style={{ 
            color: '#a0a0a0', 
            margin: '0', 
            lineHeight: '1.6',
            fontFamily: 'monospace'
          }}>Deep space reconnaissance and comprehensive betting intelligence from Mars orbital platform</p>
        </article>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        marginBottom: '40px', 
        flexWrap: 'wrap',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 212, 255, 0.05))',
        borderRadius: '25px',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        backdropFilter: 'blur(15px)'
      }}>
        {['predictions', 'news', 'stories', 'quiz', 'challenges', 'forum', 'voting'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #00d4ff, #0066cc)'
                  : 'rgba(0, 212, 255, 0.1)',
                color: activeTab === tab ? '#000000' : '#ffffff',
                border: `1px solid ${activeTab === tab ? 'rgba(0, 212, 255, 0.6)' : 'rgba(0, 212, 255, 0.3)'}`,
                padding: '14px 26px',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                letterSpacing: '0.5px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: activeTab === tab 
                  ? '0 8px 25px rgba(0, 212, 255, 0.3)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 102, 204, 0.1))';
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {activeTab === tab && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
                  animation: 'scan 2s ease-in-out infinite'
                }} />
              )}
              {tab === 'predictions' ? '🎯 TRAJECTORY' : 
               tab === 'news' ? '📡 COMMS' :
               tab === 'stories' ? '📋 MISSION LOG' :
               tab === 'quiz' ? '🧠 TRAINING SIM' :
               tab === 'challenges' ? '🏆 OBJECTIVES' :
               tab === 'forum' ? '💬 CREW CHAT' :
               tab === 'voting' ? '🗳️ CONSENSUS' :
               '🔧 SYSTEMS'}
            </button>
          ))}
      </div>

      {/* Always show latest news for guests */}
      {!currentUser && (
        <div style={{ 
          marginBottom: '40px'
        }}>
          <LatestNews />
          <div style={{
            textAlign: 'center',
            padding: '30px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.1))',
            borderRadius: '16px',
            border: '2px dashed rgba(34, 197, 94, 0.3)',
            marginTop: '20px'
          }}>
            <h3 style={{
              color: '#22c55e',
              marginBottom: '16px',
              fontSize: '1.4rem',
              fontWeight: '700'
            }}>
              🎉 Want More Features?
            </h3>
            <p style={{
              color: '#d1fae5',
              marginBottom: '20px',
              fontSize: '1.1rem'
            }}>
              Sign up now and get π50 Welcome Bonus! Access quizzes, predictions, interactive tools and much more!
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.4)';
              }}
            >
              🚀 Join Sports Central Free!
            </button>
          </div>
        </div>
      )}

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
        {activeTab === 'quiz' && (currentUser ? <QuizMode isOffline={isOffline} /> : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ color: '#22c55e', marginBottom: '20px', fontSize: '1.5rem' }}>🎯 Quiz Mode</h3>
            <p style={{ color: '#d1fae5', marginBottom: '30px', fontSize: '1.1rem' }}>
              Test your sports knowledge with our interactive quizzes!
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)'
              }}
            >
              Sign Up to Play Quiz
            </button>
          </div>
        ))}
        {activeTab === 'tools' && (currentUser ? <InteractiveTools /> : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ color: '#22c55e', marginBottom: '20px', fontSize: '1.5rem' }}>🛠️ Interactive Tools</h3>
            <p style={{ color: '#d1fae5', marginBottom: '30px', fontSize: '1.1rem' }}>
              Access powerful sports analytics and prediction tools!
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)'
              }}
            >
              Sign Up to Access Tools
            </button>
          </div>
        ))}
        {activeTab === 'challenges' && (currentUser ? <ChallengeSystem /> : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ color: '#22c55e', marginBottom: '20px', fontSize: '1.5rem' }}>🏆 Challenges</h3>
            <p style={{ color: '#d1fae5', marginBottom: '30px', fontSize: '1.1rem' }}>
              Compete with other users in exciting sports challenges!
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)'
              }}
            >
              Sign Up to Compete
            </button>
          </div>
        ))}
        {activeTab === 'forum' && (currentUser ? <Forum /> : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ color: '#22c55e', marginBottom: '20px', fontSize: '1.5rem' }}>💬 Forum</h3>
            <p style={{ color: '#d1fae5', marginBottom: '30px', fontSize: '1.1rem' }}>
              Join the discussion, share your insights, and connect with fellow sports fans!
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)'
              }}
            >
              Sign Up to Join Forum
            </button>
          </div>
        ))}
        {activeTab === 'voting' && (currentUser ? <CommunityVoting currentUser={currentUser} /> : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ color: '#22c55e', marginBottom: '20px', fontSize: '1.5rem' }}>🗳️ Community Voting</h3>
            <p style={{ color: '#d1fae5', marginBottom: '30px', fontSize: '1.1rem' }}>
              Participate in community polls and vote on your favorite topics using Pi Coins!
            </p>
            <button
              onClick={() => setIsRegistrationOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.4)'
              }}
            >
              Sign Up to Vote
            </button>
          </div>
        ))}
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
        padding: '30px', 
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 212, 255, 0.08))',
        borderRadius: '20px',
        borderLeft: '4px solid #00d4ff',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        backdropFilter: 'blur(15px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
          animation: 'scan 4s ease-in-out infinite'
        }} />
        <h4 style={{ 
          color: '#ffffff', 
          marginBottom: '20px',
          fontSize: '1.4rem',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textAlign: 'center'
        }}>🛰️ ACTIVE SATELLITE NETWORKS</h4>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['NFL', 'NBA', 'MLB', 'SOCCER'].map((sport, index) => (
            <span key={sport} style={{ 
              padding: '12px 20px', 
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 102, 204, 0.1))',
              color: '#00d4ff',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: '700',
              fontFamily: 'monospace',
              border: '1px solid rgba(0, 212, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0, 212, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.6)',
                animation: `pulse ${2 + index * 0.5}s ease-in-out infinite`
              }} />
              {sport}
            </span>
          ))}
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#a0a0a0',
          fontSize: '0.9rem',
          fontFamily: 'monospace'
        }}>
          STATUS: ALL SYSTEMS NOMINAL • UPLINK: SECURE • LATENCY: &lt;50ms
        </div>
      </div>

      <PiCoinWallet
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentUser={currentUser}
        balance={piBalance}
        onBalanceUpdate={setPiBalance}
      />

      <UserRegistration
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onUserCreated={handleUserCreated}
      />

      <BackupSettings
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      {/* Betting Agreement - Always visible when logged in */}
      <BettingAgreement isVisible={!!currentUser} />
    </div>
  );
}