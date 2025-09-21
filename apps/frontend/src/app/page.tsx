"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import Header from "@components/Header";
import MissionBriefing from "@components/MissionBriefing";
import ModulesGrid from "@components/ModulesGrid";
import LatestNews from "@components/LatestNews";
import PredictionsTable from './components/PredictionsTable';
import ProtectedContent from './components/ProtectedContent';
import VisitorManager from '../../../packages/shared/src/libs/utils/visitorManager';
import QuizMode from "@components/QuizMode";
import { useOfflineStatus } from "@hooks/useOfflineStatus";
import { useMobile } from "@hooks/useMobile";
import UnifiedSoccerHub from '@components/UnifiedSoccerHub';

// Enhanced Loading Components for better UX
const SkeletonLoader = ({ height = "h-32" }: { height?: string }) => (
  <div className={`animate-pulse bg-gray-800/50 ${height} rounded-lg`}></div>
);

const ComponentLoader = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load heavy components with better error boundaries
const InteractiveTools = lazy(() => import("@components/InteractiveTools").catch(() => ({ default: () => <div>Tools unavailable</div> })));
const CommunityVoting = lazy(() => import("@components/CommunityVoting").catch(() => ({ default: () => <div>Voting unavailable</div> })));
const Forum = lazy(() => import("@components/Forum").catch(() => ({ default: () => <div>Forum unavailable</div> })));
const PiCoinWallet = lazy(() => import("@components/PiCoinWallet").catch(() => ({ default: () => <div>Wallet unavailable</div> })));
const PiCoinStore = lazy(() => import("@components/PiCoinStore").catch(() => ({ default: () => <div>Store unavailable</div> })));
const AuthorsLeaderboard = lazy(() => import("@components/AuthorsLeaderboard").catch(() => ({ default: () => <div>Leaderboard unavailable</div> })));
const SecurityDashboard = lazy(() => import("@components/SecurityDashboard").catch(() => ({ default: () => <div>Security unavailable</div> })));
const ChallengeSystem = lazy(() => import("@components/ChallengeSystem").catch(() => ({ default: () => <div>Challenges unavailable</div> })));
const CreatorDashboard = lazy(() => import("@components/CreatorDashboard").catch(() => ({ default: () => <div>Creator tools unavailable</div> })));
const UserRegistration = lazy(() => import("@components/UserRegistration").catch(() => ({ default: () => <div>Registration unavailable</div> })));
const LoginModal = lazy(() => import("@components/LoginModal").catch(() => ({ default: () => <div>Login unavailable</div> })));
const ResponsibleBettingTutorial = lazy(() => import("@components/ResponsibleBettingTutorial").catch(() => ({ default: () => <div>Tutorial unavailable</div> })));
const BettingAgreement = lazy(() => import("@components/BettingAgreement").catch(() => ({ default: () => <div>Agreement unavailable</div> })));
const SmartNotifications = lazy(() => import("@components/SmartNotifications").catch(() => ({ default: () => <div>Notifications unavailable</div> })));
const WelcomeNotificationSetup = lazy(() => import("./components/WelcomeNotificationSetup").catch(() => ({ default: () => <div>Welcome setup unavailable</div> })));
const ContentPersonalization = lazy(() => import("@components/ContentPersonalization").catch(() => ({ default: () => <div>Personalization unavailable</div> })));
const AchievementSystem = lazy(() => import("@components/AchievementSystem").catch(() => ({ default: () => <div>Achievements unavailable</div> })));
const LiveMatchChat = lazy(() => import("@components/LiveMatchChat").catch(() => ({ default: () => <div>Live chat unavailable</div> })));
const FloatingActionButtons = lazy(() => import("@components/FloatingActionButtons").catch(() => ({ default: () => <div>Actions unavailable</div> }))); // Assuming you have this hook

import UserManager from '../../../../packages/shared/src/libs/utils/userManager';
// Assuming User type is defined elsewhere, e.g., in '@types/user' or similar
// If not, you might need to define it or use 'any' for type safety.
// For demonstration, let's assume a basic User type:
// type User = { id: string; name: string; role?: string; email?: string; };

import SearchDirectory from './components/SearchDirectory';

const predictions = []; // Mock predictions

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showCreatorDashboard, setShowCreatorDashboard] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [bettingAgreementAccepted, setBettingAgreementAccepted] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [mobileActiveTab, setMobileActiveTab] = useState('home');
  const isOffline = useOfflineStatus();
  const isMobile = useMobile();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showBettingTutorial, setShowBettingTutorial] = useState(false);
  const [showBettingAgreement, setShowBettingAgreement] = useState(false);
  const [showWelcomeNotifications, setShowWelcomeNotifications] = useState(true);

  // Load user and initialize visitor tracking on component mount
  useEffect(() => {
    UserManager.loadCurrentUser();
    const user = UserManager.getCurrentUser();
    setCurrentUser(user);
    // Track visitor on page load
    VisitorManager.trackVisitor(user?.id);
    // Reset daily limits if needed
    VisitorManager.resetDailyLimits();
  }, []);

  const handleLogout = () => {
    UserManager.logout();
    setCurrentUser(null);
    setShowLoginModal(false);
    console.log("User logged out successfully");
  };

  const handleAchievementUnlocked = (achievement: any) => {
    console.log('Achievement unlocked:', achievement.title);
    // Could show a toast notification here
  };

  // Mock live match for demo
  const mockLiveMatch = {
    id: 'match_1',
    homeTeam: 'Kansas City Chiefs',
    awayTeam: 'Buffalo Bills',
    homeScore: 14,
    awayScore: 10,
    status: 'Live',
    time: '2nd Quarter - 3:45'
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleWelcomeNotificationComplete = (enabled: boolean) => {
    setShowWelcomeNotifications(false);
    if (enabled) {
      // User enabled notifications - SmartNotifications component will handle the settings
      console.log('📱 Notifications enabled during welcome setup');
    }
  };

  // Navigation items with user-specific visibility
  const getNavItems = () => {
    const baseItems = [
      { id: "dashboard", label: "🏠 Dashboard", icon: "🏠" },
      { id: "predictions", label: "🔮 Predictions", icon: "🔮" },
      { id: "scores", label: "📊 Live Scores", icon: "📊" },
      { id: "news", label: "📰 News", icon: "📰" },
      { id: "quiz", label: "🎯 Quiz", icon: "🎯" },
      { id: "tools", label: "🛠️ Tools", icon: "🛠️" },
      { id: "search", label: "🔍 Search", icon: "🔍" }, // Added Search tab
    ];

    if (currentUser) {
      baseItems.push(
        { id: "voting", label: "🗳️ Community", icon: "🗳️" },
        { id: "forum", label: "💬 Forum", icon: "💬" },
        { id: "wallet", label: "🪙 Pi Wallet", icon: "🪙" },
        { id: "store", label: "🛒 Store", icon: "🛒" },
        { id: "leaderboard", label: "🏆 Leaderboard", icon: "🏆" },
        { id: "challenges", label: "⚔️ Challenges", icon: "⚔️" },
        { id: "security", label: "🔒 Security", icon: "🔒" }
      );

      // Add creator dashboard for content creators
      if (currentUser.role === 'creator' || currentUser.role === 'admin') {
        baseItems.push({ id: "creator", label: "✍️ Creator", icon: "✍️" });
      }
    }

    return baseItems;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <ModulesGrid />
            <LatestNews />
          </div>
        );
      case "predictions":
        return (
              <ProtectedContent
                contentType="predictions"
                contentId="main_predictions"
                title="🔮 Premium Sports Predictions"
                preview="AI-powered predictions with 94.2% accuracy rate. View match analysis, confidence scores, and betting recommendations from our advanced algorithms."
                onRegister={() => setShowRegistration(true)}
                onUpgrade={() => setShowPiCoinStore(true)}
              >
                <PredictionsTable predictions={predictions} />
              </ProtectedContent>
        );
      case "scores":
        return (
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Live Sports Scores</h2>
            <p className="text-gray-300">Live scores integration coming soon...</p>
          </div>
        );
      case "news":
        return <LatestNews />;
      case "quiz":
        return <QuizMode currentUser={currentUser} />;
      case "tools":
        return <InteractiveTools predictions={predictions} />;
      case "search": // Added case for Search tab
        return <SearchDirectory />;
      case "voting":
        return currentUser ? <CommunityVoting currentUser={currentUser} /> : <div className="text-center text-white">Please log in to access community voting.</div>;
      case "forum":
        return currentUser ? <Forum currentUser={currentUser} /> : <div className="text-center text-white">Please log in to access the forum.</div>;
      case "wallet":
        return currentUser ? <PiCoinWallet /> : <div className="text-center text-white">Please log in to access your wallet.</div>;

          {activeTab === 'wallet' && (
            <PiCoinWallet />
          )}

          {activeTab === 'search' && (
            <SearchDirectory />
          )}
      case "store":
        return currentUser ? <PiCoinStore /> : <div className="text-center text-white">Please log in to access the store.</div>;
      case "leaderboard":
        return <AuthorsLeaderboard />;
      case "challenges":
        return currentUser ? <ChallengeSystem currentUser={currentUser} /> : <div className="text-center text-white">Please log in to access challenges.</div>;
      case "security":
        return currentUser ? <SecurityDashboard /> : <div className="text-center text-white">Please log in to access security settings.</div>;
      case "creator":
        return (currentUser?.role === 'creator' || currentUser?.role === 'admin') ?
          <CreatorDashboard currentUser={currentUser} /> :
          <div className="text-center text-white">Creator access required.</div>;
      default:
        return (
          <div className="space-y-6">
            <ModulesGrid />
            <LatestNews />
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      color: "#e2e8f0",
      position: "relative",
    }}>
      {/* Background effects */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Header
          currentUser={currentUser}
          onLoginClick={() => setShowLoginModal(true)}
          onLogout={handleLogout}
          onWalletClick={() => setShowWallet(true)}
          onStoreClick={() => setShowStore(true)}
        />

        {/* Smart Notifications - Fixed Position */}
        <div style={{
          position: 'fixed',
          top: isMobile ? '80px' : '100px',
          right: '20px',
          zIndex: 1000
        }}>
          <Suspense fallback={null}>
            <SmartNotifications />
          </Suspense>
        </div>

        <main style={{
          padding: isMobile ? "10px" : "20px",
          maxWidth: "1400px",
          margin: "0 auto",
          paddingBottom: isMobile ? "80px" : "20px" // Space for mobile nav
        }}>
          <MissionBriefing />

          {!isMobile && <ModulesGrid />}

          {/* Content Personalization */}
          <Suspense fallback={<ComponentLoader><SkeletonLoader height="h-32" /></ComponentLoader>}>
            <ContentPersonalization
              currentUser={currentUser}
              onPreferencesUpdate={(prefs) => console.log('Preferences updated:', prefs)}
            />
          </Suspense>

          <LatestNews />

          {/* Unified Soccer Hub - Mobile Optimized */}
        <UnifiedSoccerHub />

          {/* AI Analysis Section */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              🎯 High-Value Scraping Targets
            </h2>
            <div className="text-gray-300">
              <p className="mb-4">
                Unlock advanced insights with our premium data and AI-powered predictions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>AI-powered predictions from your analysis engine</li>
                <li>Live match data and odds from multiple APIs</li>
                <li>StatArea predictions and confidence scores</li>
                <li>Enhanced sports statistics and real-time updates</li>
              </ul>
            </div>
          </div>

          {/* Mobile-First Layout */}
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Mobile Tab Content */}
              {mobileActiveTab === 'home' && (
                <>
                  <ProtectedContent
                    contentType="predictions"
                    contentId="main_predictions"
                    title="🔮 Premium Sports Predictions"
                    preview="AI-powered predictions with 94.2% accuracy rate. View match analysis, confidence scores, and betting recommendations from our advanced algorithms."
                    onRegister={() => setShowRegistration(true)}
                    onUpgrade={() => setShowPiCoinStore(true)}
                  >
                    <PredictionsTable predictions={predictions} />
                  </ProtectedContent>
                  <QuizMode currentUser={currentUser} />
                </>
              )}

              {mobileActiveTab === 'achievements' && (
                <Suspense fallback={<SkeletonLoader height="h-40" />}>
                  <AchievementSystem
                    currentUser={currentUser}
                    onAchievementUnlocked={handleAchievementUnlocked}
                  />
                </Suspense>
              )}

              {mobileActiveTab === 'chat' && (
                <LiveMatchChat
                  match={mockLiveMatch}
                  currentUser={currentUser}
                />
              )}

              {mobileActiveTab === 'community' && (
                <Suspense fallback={<div className="animate-pulse bg-gray-800 h-48 rounded-lg"></div>}>
                  <CommunityVoting currentUser={currentUser} />
                  <Forum currentUser={currentUser} />
                </Suspense>
              )}

              {mobileActiveTab === 'tools' && (
                <Suspense fallback={<div className="animate-pulse bg-gray-800 h-48 rounded-lg"></div>}>
                  <InteractiveTools predictions={predictions} />
                  {showChallenges && (
                    <ChallengeSystem currentUser={currentUser} />
                  )}
                </Suspense>
              )}
            </div>
          ) : (
            /* Desktop Layout */
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", marginBottom: "30px" }}>
                <div>
                  <ProtectedContent
                    contentType="predictions"
                    contentId="main_predictions"
                    title="🔮 Premium Sports Predictions"
                    preview="AI-powered predictions with 94.2% accuracy rate. View match analysis, confidence scores, and betting recommendations from our advanced algorithms."
                    onRegister={() => setShowRegistration(true)}
                    onUpgrade={() => setShowPiCoinStore(true)}
                  >
                    <PredictionsTable predictions={predictions} />
                  </ProtectedContent>
                  <InteractiveTools predictions={predictions} />

                  {showLiveChat && (
                    <div style={{ marginTop: "20px" }}>
                      <LiveMatchChat
                        match={mockLiveMatch}
                        currentUser={currentUser}
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <QuizMode currentUser={currentUser} />
                  <CommunityVoting currentUser={currentUser} />

                  {showAchievements && (
                    <AchievementSystem
                      currentUser={currentUser}
                      onAchievementUnlocked={handleAchievementUnlocked}
                    />
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <Forum currentUser={currentUser} />
              </div>
            </>
          )}

          {/* Show components based on state */}
          {showSecurityDashboard && (
            <div style={{ marginBottom: "30px" }}>
              <SecurityDashboard />
            </div>
          )}

          {showChallenges && !isMobile && (
            <div style={{ marginBottom: "30px" }}>
              <ChallengeSystem currentUser={currentUser} />
            </div>
          )}

          {showCreatorDashboard && currentUser && (
            <div style={{ marginBottom: "30px" }}>
              <CreatorDashboard currentUser={currentUser} />
            </div>
          )}

          {!isMobile && <AuthorsLeaderboard />}
        </main>

        {/* Floating Action Buttons */}
        <FloatingActionButtons
          currentUser={currentUser}
          isMobile={isMobile}
          onAchievementsClick={() => setShowAchievements(!showAchievements)}
          onLiveChatClick={() => setShowLiveChat(!showLiveChat)}
          onChallengesClick={() => setShowChallenges(!showChallenges)}
        />
      </div>

      {/* Modals */}
      {showRegistration && (
        <UserRegistration
          onClose={() => setShowRegistration(false)}
          onUserRegistered={(user) => {
            setCurrentUser(user);
            setShowRegistration(false);
          }}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {showBettingTutorial && (
        <ResponsibleBettingTutorial
          onClose={() => setShowBettingTutorial(false)}
        />
      )}

      {showBettingAgreement && (
        <BettingAgreement
          onClose={() => setShowBettingAgreement(false)}
        />
      )}

      {/* Welcome message for new users */}
      {!currentUser && showWelcomeNotifications && (
        <WelcomeNotificationSetup
          onComplete={handleWelcomeNotificationComplete}
        />
      )}

      {/* Welcome message for new users */}
      {!currentUser && (
        <div className="fixed bottom-4 left-4 max-w-sm bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm rounded-lg p-4 border border-blue-400/50">
          <h3 className="text-white font-semibold mb-2">🚀 Welcome to Sports Central!</h3>
          <p className="text-blue-100 text-sm mb-3">
            Get AI-powered predictions, join quizzes, and earn Pi coins. Sign up for your π50 welcome bonus!
          </p>
          <button
            onClick={() => setShowRegistration(true)}
            className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded border border-white/30 text-sm font-medium"
          >
            Get Started Free
          </button>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(15px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0',
          zIndex: 1000
        }}>
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'achievements', icon: '🏆', label: 'Badges' },
            { id: 'chat', icon: '💬', label: 'Live' },
            { id: 'community', icon: '👥', label: 'Social' },
            { id: 'tools', icon: '🔧', label: 'Tools' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: mobileActiveTab === tab.id ? '#22c55e' : '#9ca3af',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}