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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ 
            fontSize: '3.5rem', 
            margin: '0',
            background: 'linear-gradient(135deg, #22c55e, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            Welcome to Sports Central
          </h1>
          {currentUser && (
            <p style={{ 
              color: '#22c55e', 
              fontSize: '1.2rem', 
              margin: '8px 0 0 0',
              fontWeight: '600'
            }}>
              Hello, {currentUser.username}! 👋
            </p>
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

      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666', 
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        Your ultimate destination for <strong>free AI-powered sports predictions</strong>, live sports data, and real-time updates across <em>NFL, NBA, MLB, and Soccer</em>. Join thousands of sports fans earning Pi coins through accurate predictions and interactive challenges.
      </p>

      {isOffline && <OfflineManager />}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px', 
        marginBottom: '50px' 
      }}>
        <article style={{ 
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
          }}>⚽ Live Sports Matches</h3>
          <p style={{ color: '#d1fae5', margin: '0', lineHeight: '1.5' }}>Real-time NFL, NBA, MLB, and Soccer scores with instant updates</p>
        </article>

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
        {['predictions', 'news', 'stories', 'quiz', 'challenges', 'forum', 'voting'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: activeTab === tab ? 'white' : '#d1d5db',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'predictions' ? '🔮 Predictions' : 
               tab === 'news' ? '📰 Latest News' :
               tab === 'stories' ? '📖 Stories' :
               tab === 'quiz' ? '🧠 Quiz Mode' :
               tab === 'challenges' ? '🏆 Challenges' :
               tab === 'forum' ? '💬 Forum' :
               tab === 'voting' ? '🗳️ Voting' :
               '🔧 Tools'}
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
    </div>
  );
}