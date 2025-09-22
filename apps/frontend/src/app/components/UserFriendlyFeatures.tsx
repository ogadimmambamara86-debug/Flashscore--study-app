
"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface UserFriendlyFeaturesProps {
  currentUser: any;
  isMobile: boolean;
}

const UserFriendlyFeatures: React.FC<UserFriendlyFeaturesProps> = ({
  currentUser,
  isMobile
}) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [quickAccessOpen, setQuickAccessOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    oneHandMode: false
  });

  useEffect(() => {
    const saved = ClientStorage.getItem('user_friendly_preferences', userPreferences);
    setUserPreferences(saved);
    applyAccessibilitySettings(saved);
  }, []);

  const applyAccessibilitySettings = (prefs: typeof userPreferences) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--user-font-size', 
      prefs.fontSize === 'large' ? '1.2em' : 
      prefs.fontSize === 'small' ? '0.9em' : '1em'
    );
    
    // High contrast
    if (prefs.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (prefs.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // One-hand mode for mobile
    if (prefs.oneHandMode && isMobile) {
      root.classList.add('one-hand-mode');
    } else {
      root.classList.remove('one-hand-mode');
    }
  };

  const updatePreference = (key: keyof typeof userPreferences, value: any) => {
    const updated = { ...userPreferences, [key]: value };
    setUserPreferences(updated);
    ClientStorage.setItem('user_friendly_preferences', updated);
    applyAccessibilitySettings(updated);
  };

  // Feature 1: Smart Quick Actions
  const QuickActionsPanel = () => (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '80px' : '20px',
      right: '20px',
      zIndex: 999,
      display: quickAccessOpen ? 'block' : 'none'
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: '200px'
      }}>
        <h4 style={{ color: '#22c55e', margin: '0 0 12px 0', fontSize: '1rem' }}>
          ⚡ Quick Actions
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}
          >
            🔝 Back to Top
          </button>
          
          <button
            onClick={() => {
              const quizSection = document.querySelector('[data-section="quiz"]');
              quizSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3b82f6',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}
          >
            🧠 Quick Quiz
          </button>
          
          <button
            onClick={() => setActiveFeature('help')}
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}
          >
            ❓ Need Help?
          </button>
        </div>
      </div>
    </div>
  );

  // Feature 2: Interactive Tutorial System
  const InteractiveTutorial = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    
    const tutorialSteps = [
      {
        title: "Welcome to Sports Central! 🎉",
        content: "Let's take a quick tour to help you get started with predictions and earning Pi coins.",
        target: null
      },
      {
        title: "Make Your First Prediction 🔮",
        content: "Click on any match to make a prediction. Our AI will help guide you!",
        target: ".predictions-table"
      },
      {
        title: "Take a Quiz 🧠",
        content: "Test your sports knowledge and earn Pi coins by completing quizzes.",
        target: "[data-section='quiz']"
      },
      {
        title: "Check Your Wallet 💰",
        content: "View your Pi coin balance and transaction history here.",
        target: ".pi-coin-display"
      }
    ];

    if (!showTutorial) {
      return (
        <button
          onClick={() => setShowTutorial(true)}
          style={{
            position: 'fixed',
            top: isMobile ? '80px' : '100px',
            right: '20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '1.5rem',
            zIndex: 998,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}
          title="Take Tutorial"
        >
          🎓
        </button>
      );
    }

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>
            {tutorialSteps[currentStep].title.split(' ')[0]}
          </div>
          
          <h3 style={{ margin: '0 0 16px 0', color: '#22c55e' }}>
            {tutorialSteps[currentStep].title}
          </h3>
          
          <p style={{ margin: '0 0 24px 0', lineHeight: '1.5', color: '#d1fae5' }}>
            {tutorialSteps[currentStep].content}
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => setShowTutorial(false)}
              style={{
                background: 'transparent',
                color: '#9ca3af',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
            
            <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              {currentStep + 1} of {tutorialSteps.length}
            </div>
            
            <button
              onClick={() => {
                if (currentStep < tutorialSteps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setShowTutorial(false);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Feature 3: Smart Help System
  const SmartHelpSystem = () => {
    const [helpQuery, setHelpQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    
    const helpTopics = {
      'make prediction': 'To make a prediction, click on any match in the predictions table and select your choice.',
      'earn pi coins': 'Earn Pi coins by completing quizzes, making accurate predictions, and daily logins.',
      'quiz help': 'Take quizzes to test your knowledge and earn rewards. Perfect scores give bonus coins!',
      'wallet': 'View your Pi coin balance by clicking the wallet icon in the top navigation.',
      'notifications': 'Enable notifications to get alerts about match results and new opportunities.',
      'account': 'Manage your account settings and preferences through the user menu.'
    };

    useEffect(() => {
      if (helpQuery.length > 2) {
        const matches = Object.keys(helpTopics).filter(topic =>
          topic.includes(helpQuery.toLowerCase())
        );
        setSuggestions(matches.slice(0, 3));
      } else {
        setSuggestions([]);
      }
    }, [helpQuery]);

    if (activeFeature !== 'help') return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px',
          width: '90%',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#f59e0b' }}>🤖 Smart Help</h2>
            <button
              onClick={() => setActiveFeature(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="What do you need help with?"
            value={helpQuery}
            onChange={(e) => setHelpQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '16px',
              marginBottom: '16px'
            }}
          />

          {suggestions.length > 0 && (
            <div>
              <h4 style={{ color: '#22c55e', marginBottom: '12px' }}>💡 Suggestions:</h4>
              {suggestions.map(topic => (
                <div
                  key={topic}
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setHelpQuery(topic)}
                >
                  <strong style={{ color: '#22c55e' }}>{topic}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#d1fae5' }}>
                    {helpTopics[topic as keyof typeof helpTopics]}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <h4 style={{ color: '#3b82f6', marginBottom: '12px' }}>📚 Popular Topics:</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {Object.entries(helpTopics).slice(0, 3).map(([topic, answer]) => (
                <button
                  key={topic}
                  onClick={() => setHelpQuery(topic)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#3b82f6',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Feature 4: Accessibility Controls
  const AccessibilityPanel = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#8b5cf6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ♿ Accessibility Settings
      </h3>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Font Size */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '600' }}>
            🔤 Font Size
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => updatePreference('fontSize', size)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: userPreferences.fontSize === size 
                    ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: '#fff', fontWeight: '600' }}>
            🌈 High Contrast Mode
          </label>
          <button
            onClick={() => updatePreference('highContrast', !userPreferences.highContrast)}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              border: 'none',
              background: userPreferences.highContrast 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: userPreferences.highContrast ? '27px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </button>
        </div>

        {/* Reduced Motion */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ color: '#fff', fontWeight: '600' }}>
            🎭 Reduce Animation
          </label>
          <button
            onClick={() => updatePreference('reducedMotion', !userPreferences.reducedMotion)}
            style={{
              width: '50px',
              height: '26px',
              borderRadius: '13px',
              border: 'none',
              background: userPreferences.reducedMotion 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: userPreferences.reducedMotion ? '27px' : '3px',
              transition: 'left 0.2s ease'
            }} />
          </button>
        </div>

        {/* One-Hand Mode (Mobile only) */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#fff', fontWeight: '600' }}>
              👍 One-Hand Mode
            </label>
            <button
              onClick={() => updatePreference('oneHandMode', !userPreferences.oneHandMode)}
              style={{
                width: '50px',
                height: '26px',
                borderRadius: '13px',
                border: 'none',
                background: userPreferences.oneHandMode 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                  : 'rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: userPreferences.oneHandMode ? '27px' : '3px',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Feature 5: Progress Tracker
  const ProgressTracker = () => {
    const [userProgress] = useState({
      predictionsLevel: 3,
      predictionsXP: 750,
      predictionsNextLevel: 1000,
      quizLevel: 2,
      quizXP: 400,
      quizNextLevel: 500,
      weeklyGoal: 80,
      weeklyProgress: 65
    });

    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '20px 0'
      }}>
        <h3 style={{ color: '#06b6d4', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📊 Your Progress
        </h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Predictions Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>🔮 Predictions</span>
              <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>Level {userProgress.predictionsLevel}</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                height: '100%',
                width: `${(userProgress.predictionsXP / userProgress.predictionsNextLevel) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
              {userProgress.predictionsXP} / {userProgress.predictionsNextLevel} XP
            </div>
          </div>

          {/* Quiz Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>🧠 Quiz Master</span>
              <span style={{ color: '#3b82f6', fontSize: '0.9rem' }}>Level {userProgress.quizLevel}</span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                height: '100%',
                width: `${(userProgress.quizXP / userProgress.quizNextLevel) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
              {userProgress.quizXP} / {userProgress.quizNextLevel} XP
            </div>
          </div>

          {/* Weekly Goal */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#fff', fontWeight: '600' }}>🎯 Weekly Goal</span>
              <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                {userProgress.weeklyProgress}%
              </span>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                height: '100%',
                width: `${userProgress.weeklyProgress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
              Keep going! {100 - userProgress.weeklyProgress}% to go
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Feature 6: Smart Shortcuts
  const SmartShortcuts = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '20px 0'
    }}>
      <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⌨️ Keyboard Shortcuts
      </h3>
      
      <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Quick Quiz</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            Q
          </kbd>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Search</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            /
          </kbd>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Help</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            ?
          </kbd>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1fae5' }}>
          <span>Toggle Theme</span>
          <kbd style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: '#fff'
          }}>
            T
          </kbd>
        </div>
      </div>
    </div>
  );

  // Feature 7: Contextual Tips
  const ContextualTips = () => {
    const [currentTip, setCurrentTip] = useState(0);
    const tips = [
      {
        icon: '💡',
        title: 'Pro Tip',
        content: 'Make predictions early in the day for better odds and more time to research!'
      },
      {
        icon: '🎯',
        title: 'Smart Strategy',
        content: 'Focus on sports you know well. Accuracy matters more than quantity for Pi coins.'
      },
      {
        icon: '🏆',
        title: 'Achievement Hunter',
        content: 'Complete daily quizzes to maintain your streak and unlock bonus rewards.'
      },
      {
        icon: '📊',
        title: 'Data Insight',
        content: 'Check team form and head-to-head stats before making your predictions.'
      }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 10000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(6, 182, 212, 0.1))',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        margin: '20px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {tips[currentTip].icon}
          </div>
          
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', color: '#22c55e', fontSize: '1rem' }}>
              {tips[currentTip].title}
            </h4>
            <p style={{ margin: '0', color: '#d1fae5', fontSize: '0.9rem', lineHeight: '1.4' }}>
              {tips[currentTip].content}
            </p>
          </div>
        </div>
        
        {/* Progress dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '12px'
        }}>
          {tips.map((_, index) => (
            <div
              key={index}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: index === currentTip ? '#22c55e' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return; // Ignore system shortcuts
      
      switch (e.key.toLowerCase()) {
        case 'q':
          const quizSection = document.querySelector('[data-section="quiz"]');
          quizSection?.scrollIntoView({ behavior: 'smooth' });
          break;
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="search"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case '?':
          setActiveFeature('help');
          break;
        case 't':
          // Toggle theme functionality would go here
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div>
      {/* Quick Access Button */}
      <button
        onClick={() => setQuickAccessOpen(!quickAccessOpen)}
        style={{
          position: 'fixed',
          bottom: isMobile ? '80px' : '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          fontSize: '1.5rem',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
          transform: quickAccessOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}
        title="Quick Actions"
      >
        ⚡
      </button>

      {/* All Features */}
      <QuickActionsPanel />
      <InteractiveTutorial />
      <SmartHelpSystem />
      <AccessibilityPanel />
      <ProgressTracker />
      <SmartShortcuts />
      <ContextualTips />

      {/* Accessibility CSS */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.5) brightness(1.2);
        }
        
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .one-hand-mode {
          --content-max-width: 100vw;
        }
        
        .one-hand-mode .main-content {
          padding-bottom: 120px;
        }
        
        body {
          font-size: var(--user-font-size, 1em);
        }
      `}</style>
    </div>
  );
};

export default UserFriendlyFeatures;
