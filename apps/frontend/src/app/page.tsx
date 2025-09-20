
"use client";
import React, { useState, useEffect } from "react";
import Header from "@components/Header";
import MissionBriefing from "@components/MissionBriefing";
import ModulesGrid from "@components/ModulesGrid";
import LatestNews from "@components/LatestNews";
import PredictionsTable from "@components/PredictionsTable";
import QuizMode from "@components/QuizMode";
import InteractiveTools from "@components/InteractiveTools";
import CommunityVoting from "@components/CommunityVoting";
import Forum from "@components/Forum";
import PiCoinWallet from "@components/PiCoinWallet";
import PiCoinStore from "@components/PiCoinStore";
import AuthorsLeaderboard from "@components/AuthorsLeaderboard";
import SecurityDashboard from "@components/SecurityDashboard";
import ChallengeSystem from "@components/ChallengeSystem";
import CreatorDashboard from "@components/CreatorDashboard";
import UserRegistration from "@components/UserRegistration";
import LoginModal from "@components/LoginModal";
import ResponsibleBettingTutorial from "@components/ResponsibleBettingTutorial";
import BettingAgreement from "@components/BettingAgreement";
import { useOfflineStatus } from "@hooks/useOfflineStatus";
import ThemeToggle from "@components/ThemeToggle";

export default function Home() {
  const isOffline = useOfflineStatus();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showBettingTutorial, setShowBettingTutorial] = useState(false);
  const [showBettingAgreement, setShowBettingAgreement] = useState(false);

  // Check for existing user session
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Listen for registration modal trigger
    const handleOpenRegistration = () => setShowRegistration(true);
    window.addEventListener('openRegistration', handleOpenRegistration);
    
    return () => {
      window.removeEventListener('openRegistration', handleOpenRegistration);
    };
  }, []);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab("dashboard");
  };

  const handleRegistration = (userData: any) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setShowRegistration(false);
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
        return <PredictionsTable />;
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
        return <QuizMode />;
      case "tools":
        return <InteractiveTools />;
      case "voting":
        return currentUser ? <CommunityVoting /> : <div className="text-center text-white">Please log in to access community voting.</div>;
      case "forum":
        return currentUser ? <Forum /> : <div className="text-center text-white">Please log in to access the forum.</div>;
      case "wallet":
        return currentUser ? <PiCoinWallet /> : <div className="text-center text-white">Please log in to access your wallet.</div>;
      case "store":
        return currentUser ? <PiCoinStore /> : <div className="text-center text-white">Please log in to access the store.</div>;
      case "leaderboard":
        return <AuthorsLeaderboard />;
      case "challenges":
        return currentUser ? <ChallengeSystem /> : <div className="text-center text-white">Please log in to access challenges.</div>;
      case "security":
        return currentUser ? <SecurityDashboard /> : <div className="text-center text-white">Please log in to access security settings.</div>;
      case "creator":
        return (currentUser?.role === 'creator' || currentUser?.role === 'admin') ? 
          <CreatorDashboard /> : 
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
    <div className="relative max-w-7xl mx-auto p-4 md:p-10 font-mono min-h-screen">
      <Header />
      <MissionBriefing />
      
      {/* Offline indicator */}
      {isOffline && (
        <div className="text-red-400 font-semibold my-4 text-center">
          ⚠️ Offline Mode - Some features may be limited
        </div>
      )}

      {/* User status and auth buttons */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-green-400">👋 Welcome, {currentUser.username}!</span>
              <span className="text-yellow-400">🪙 {currentUser.piCoins || 0} Pi</span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded border border-red-600/50 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded border border-blue-600/50"
              >
                Login
              </button>
              <button 
                onClick={() => setShowRegistration(true)}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded border border-green-600/50"
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>

        {/* Responsible betting buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBettingTutorial(true)}
            className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded border border-orange-600/50 text-sm"
          >
            🎓 Betting Guide
          </button>
          <button 
            onClick={() => setShowBettingAgreement(true)}
            className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded border border-purple-600/50 text-sm"
          >
            📋 Agreement
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {getNavItems().map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                activeTab === item.id
                  ? "bg-cyan-600/30 text-cyan-300 border-cyan-400"
                  : "bg-gray-800/50 text-gray-400 border-gray-600 hover:bg-gray-700/50"
              } border`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="min-h-[60vh]">
        {renderContent()}
      </div>

      {/* Floating theme toggle */}
      <ThemeToggle />

      {/* Modals */}
      {showRegistration && (
        <UserRegistration 
          onClose={() => setShowRegistration(false)}
          onRegister={handleRegistration}
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
    </div>
  );
}
