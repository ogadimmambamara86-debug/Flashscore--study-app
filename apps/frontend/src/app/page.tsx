"use client";
import React, { useState, useEffect, Suspense, lazy } from "react";
import Header from "@components/Header";
import MissionBriefing from "@components/MissionBriefing";
import ModulesGrid from "@components/ModulesGrid";
import LatestNews from "@components/LatestNews";
import PredictionsTable from '@/components/PredictionsTable';
import ProtectedContent from '@/components/ProtectedContent';
import QuizMode from "@components/QuizMode";
import { useOfflineStatus } from "@hooks/useOfflineStatus";
import { useMobile } from "@hooks/useMobile";
import UnifiedSoccerHub from '@components/UnifiedSoccerHub';
import SearchDirectory from '@/components/SearchDirectory';
import UserFriendlyFeatures from "./components/UserFriendlyFeatures";
import FootballFormations from "./components/FootballFormations";

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
const FloatingActionButtons = lazy(() => import("@components/FloatingActionButtons").catch(() => ({ default: () => <div>Actions unavailable</div> })));

// Single utility managers (removed duplicates)
const VisitorManager = {
  trackVisitor: (userId?: string) => {
    console.log('Tracking visitor:', userId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastVisit', new Date().toISOString());
      if (userId) localStorage.setItem('lastUserId', userId);
    }
  },
  resetDailyLimits: () => {
    console.log('Resetting daily limits');
    if (typeof window !== 'undefined') {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('lastDailyReset');
      if (lastReset !== today) {
        localStorage.removeItem('dailyActions');
        localStorage.setItem('lastDailyReset', today);
      }
    }
  }
};

const UserManager = {
  loadCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPreferences');
    }
  }
};

// MagajiCo AI Management System - Inspired by Tech Titans
const MagajiCo = {
  // Elon Musk: Bold Vision & Disruption
  disruptiveStrategy: (market: string, action: string) => {
    console.log(`Elon Musk Mode: Disrupting ${market} with ${action}. Aiming for exponential growth.`);
    return { efficiency: 0.9, strategy: 5, rating: 9 };
  },
  // Jeff Bezos: Customer Obsession & Long-Term Focus
  customerCentricity: (customerNeed: string, solution: string) => {
    console.log(`Jeff Bezos Mode: Obsessed with ${customerNeed}. Solution: ${solution}. Focus on Day 1.`);
    return { efficiency: 0.85, strategy: 4, rating: 8 };
  },
  // Jack Ma: Agility & Perseverance
  agileAdaptability: (challenge: string, response: string) => {
    console.log(`Jack Ma Mode: Facing ${challenge} with ${response}. Unwavering perseverance.`);
    return { efficiency: 0.8, strategy: 4, rating: 7 };
  },
  // Bill Gates: Data-Driven Decisions & Efficiency
  dataDrivenEfficiency: (dataset: string, insight: string) => {
    console.log(`Bill Gates Mode: Leveraging ${dataset}. Insight: ${insight}. Optimizing for efficiency.`);
    return { efficiency: 0.95, strategy: 3, rating: 9 };
  },
  // Mark Zuckerberg: Connecting People & Iterative Improvement
  socialConnectivity: (community: string, feature: string) => {
    console.log(`Mark Zuckerberg Mode: Connecting ${community} through ${feature}. Iterating rapidly.`);
    return { efficiency: 0.75, strategy: 3, rating: 7 };
  },
  // MagajiCo's unique blend: Power Efficiency + Strategy Rating
  ratePerformance: (power: number, efficiency: number, strategy: number): { rating: number, commentary: string } => {
    const combinedScore = (power * 0.5) + (efficiency * 0.3) + (strategy * 0.2);
    let commentary = "";

    if (combinedScore >= 8) {
      commentary = "Exceptional performance! A true leader's touch.";
    } else if (combinedScore >= 6) {
      commentary = "Strong performance, well-executed strategy.";
    } else {
      commentary = "Needs improvement, focus on refining strategy and efficiency.";
    }
    return { rating: Math.round(combinedScore * 10) / 10, commentary };
  }
};

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
  const [showPiCoinStore, setShowPiCoinStore] = useState(false);

  // Load user and initialize visitor tracking on component mount
  useEffect(() => {
    const user = UserManager.loadCurrentUser();
    setCurrentUser(user);
    // Track visitor on page load
    VisitorManager.trackVisitor(user?.id);
    // Reset daily limits if needed
    VisitorManager.resetDailyLimits();

    // Simulate MagajiCo AI analysis and rating
    const muskRating = MagajiCo.disruptiveStrategy("Sports Betting Market", "AI Prediction Integration");
    const bezosRating = MagajiCo.customerCentricity("User Prediction Accuracy", "Advanced Filtering & Clear Vision");
    const maRating = MagajiCo.agileAdaptability("Human Error in Betting", "Implementing Robust Filters");
    const gatesRating = MagajiCo.dataDrivenEfficiency("Historical Match Data", "Predicting Upsets");
    const zuckRating = MagajiCo.socialConnectivity("User Community", "Sharing Prediction Strategies");

    const combinedPowerEfficiency = (muskRating.efficiency + gatesRating.efficiency) / 2;
    const combinedStrategy = (muskRating.strategy + bezosRating.strategy + maRating.strategy + gatesRating.strategy + zuckRating.strategy) / 5;

    const magajiCoRating = MagajiCo.ratePerformance(10, combinedPowerEfficiency, combinedStrategy); // Assuming max power for simulation
    console.log("MagajiCo AI System Rating:", magajiCoRating);

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
      { id: "search", label: "🔍 Search", icon: "🔍" },
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
        return (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <InteractiveTools predictions={predictions} />
          </Suspense>
        );
      case "search":
        return <SearchDirectory />;
      case "voting":
        return currentUser ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <CommunityVoting currentUser={currentUser} />
          </Suspense>
        ) : <div className="text-center text-white">Please log in to access community voting.</div>;
      case "forum":
        return currentUser ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <Forum currentUser={currentUser} />
          </Suspense>
        ) : <div className="text-center text-white">Please log in to access the forum.</div>;
      case "wallet":
        return currentUser ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <PiCoinWallet />
          </Suspense>
        ) : <div className="text-center text-white">Please log in to access your wallet.</div>;
      case "store":
        return currentUser ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <PiCoinStore />
          </Suspense>
        ) : <div className="text-center text-white">Please log in to access the store.</div>;
      case "leaderboard":
        return (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <AuthorsLeaderboard />
          </Suspense>
        );
      case "challenges":
        return currentUser ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <ChallengeSystem currentUser={currentUser} />
          </Suspense>
        ) : <div className="text-center text-white">Please log in to access challenges.</div>;
      case "security":
        return currentUser ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <SecurityDashboard />
          </Suspense>
        ) : <div className="text-center text-white">Please log in to access security settings.</div>;
      case "creator":
        return (currentUser?.role === 'creator' || currentUser?.role === 'admin') ? (
          <Suspense fallback={<ComponentLoader><SkeletonLoader /></ComponentLoader>}>
            <CreatorDashboard currentUser={currentUser} />
          </Suspense>
        ) : <div className="text-center text-white">Creator access required.</div>;
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
          paddingBottom: isMobile ? "80px" : "20px"
        }}>
          <MissionBriefing />

          {!isMobile && <ModulesGrid />}

          {/* User-Friendly Features */}
          <Suspense fallback={<ComponentLoader><SkeletonLoader height="h-32" /></ComponentLoader>}>
            <UserFriendlyFeatures
              currentUser={currentUser}
              isMobile={isMobile}
            />
          </Suspense>

          {/* Content Personalization */}
          <Suspense fallback={<ComponentLoader><SkeletonLoader height="h-32" /></ComponentLoader>}>
            <ContentPersonalization
              currentUser={currentUser}
              onPreferencesUpdate={(prefs) => console.log('Preferences updated:', prefs)}
            />
          </Suspense>

          <LatestNews />
          <UnifiedSoccerHub />

          {/* Football Formations Component */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              ⚽ Football Formations
            </h2>
            <FootballFormations />
          </div>

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
              {mobileActiveTab === 'home' && (
                <>
                  <ProtectedContent
                    contentType="predictions"
                    contentId="main_predictions"
                    title="🔮 Premium Sports Predictions"
                    preview="AI-powered predictions with 94.2% accuracy rate."
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
                <Suspense fallback={<SkeletonLoader height="h-40" />}>
                  <LiveMatchChat
                    match={mockLiveMatch}
                    currentUser={currentUser}
                  />
                </Suspense>
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
            <>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", marginBottom: "30px" }}>
                <div>
                  <ProtectedContent
                    contentType="predictions"
                    contentId="main_predictions"
                    title="🔮 Premium Sports Predictions"
                    preview="AI-powered predictions with 94.2% accuracy rate."
                    onRegister={() => setShowRegistration(true)}
                    onUpgrade={() => setShowPiCoinStore(true)}
                  >
                    <PredictionsTable predictions={predictions} />
                  </ProtectedContent>

                  <Suspense fallback={<SkeletonLoader />}>
                    <InteractiveTools predictions={predictions} />
                  </Suspense>

                  {showLiveChat && (
                    <div style={{ marginTop: "20px" }}>
                      <Suspense fallback={<SkeletonLoader />}>
                        <LiveMatchChat
                          match={mockLiveMatch}
                          currentUser={currentUser}
                        />
                      </Suspense>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <QuizMode currentUser={currentUser} />
                  <Suspense fallback={<SkeletonLoader />}>
                    <CommunityVoting currentUser={currentUser} />
                  </Suspense>

                  {showAchievements && (
                    <Suspense fallback={<SkeletonLoader />}>
                      <AchievementSystem
                        currentUser={currentUser}
                        onAchievementUnlocked={handleAchievementUnlocked}
                      />
                    </Suspense>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <Suspense fallback={<SkeletonLoader />}>
                  <Forum currentUser={currentUser} />
                </Suspense>
              </div>
            </>
          )}

          {/* Conditional components */}
          {showSecurityDashboard && (
            <div style={{ marginBottom: "30px" }}>
              <Suspense fallback={<SkeletonLoader />}>
                <SecurityDashboard />
              </Suspense>
            </div>
          )}

          {showChallenges && !isMobile && (
            <div style={{ marginBottom: "30px" }}>
              <Suspense fallback={<SkeletonLoader />}>
                <ChallengeSystem currentUser={currentUser} />
              </Suspense>
            </div>
          )}

          {showCreatorDashboard && currentUser && (
            <div style={{ marginBottom: "30px" }}>
              <Suspense fallback={<SkeletonLoader />}>
                <CreatorDashboard currentUser={currentUser} />
              </Suspense>
            </div>
          )}

          {!isMobile && (
            <Suspense fallback={<SkeletonLoader />}>
              <AuthorsLeaderboard />
            </Suspense>
          )}
        </main>

        {/* Floating Action Buttons */}
        <Suspense fallback={null}>
          <FloatingActionButtons
            currentUser={currentUser}
            isMobile={isMobile}
            onAchievementsClick={() => setShowAchievements(!showAchievements)}
            onLiveChatClick={() => setShowLiveChat(!showLiveChat)}
            onChallengesClick={() => setShowChallenges(!showChallenges)}
          />
        </Suspense>
      </div>

      {/* Modals */}
      {showRegistration && (
        <Suspense fallback={null}>
          <UserRegistration
            onClose={() => setShowRegistration(false)}
            onUserRegistered={(userData) => {
              setCurrentUser(userData);
              setShowRegistration(false);
            }}
          />
        </Suspense>
      )}

      {showLoginModal && (
        <Suspense fallback={null}>
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
          />
        </Suspense>
      )}

      {/* Other modals remain the same... */}
    </div>
  );
}