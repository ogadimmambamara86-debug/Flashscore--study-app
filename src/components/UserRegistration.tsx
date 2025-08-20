import React, { useState } from 'react';
import UserManager, { User } from '../utils/userManager';
import PiCoinManager from '../utils/piCoinManager';
import ResponsibleBettingTutorial from './ResponsibleBettingTutorial';

interface UserRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialAccepted, setTutorialAccepted] = useState(false);
  const [formData, setFormData] = useState<{username: string; email: string; age: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!username.trim() || !email.trim() || !age.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (parseInt(age) < 13) {
      setError('You must be at least 13 years old to use this platform');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    // Store form data and show tutorial
    setFormData({ username: username.trim(), email: email.trim(), age });
    setShowTutorial(true);
    setIsLoading(false);
  };

  const handleTutorialAccept = () => {
    if (!formData) return;

    setIsLoading(true);
    try {
      // Create user
      const newUser = UserManager.createUser(formData.username, formData.email, parseInt(formData.age));

      // Award welcome bonus
      PiCoinManager.awardWelcomeBonus(newUser.id);

      onUserCreated(newUser);
      onClose();

      // Clear form
      setUsername('');
      setEmail('');
      setAge('');
      setFormData(null);
      setTutorialAccepted(false);
      setShowTutorial(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setShowTutorial(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTutorialDecline = () => {
    setShowTutorial(false);
    setFormData(null);
    setError('You must accept the Responsible Betting Guidelines to create an account');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2 style={{
          color: '#fff',
          textAlign: 'center',
          marginBottom: '24px',
          fontSize: '1.8rem'
        }}>
          {isLogin ? '🔑 Login' : '🎉 Join Sports Central'}
        </h2>

        {error && (
          <div style={{
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
          )}
          {!isLogin && (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading 
                ? 'linear-gradient(135deg, #6b7280, #9ca3af)' 
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Creating Account...
              </>
            ) : (
              '📖 Continue to Guidelines'
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#22c55e',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              color: '#ccc',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '12px'
            }}
          >
            Cancel
          </button>
        </form>
      </div>

      {showTutorial && formData && (
        <ResponsibleBettingTutorial
          isOpen={true}
          onAccept={handleTutorialAccept}
          onDecline={handleTutorialDecline}
        />
      )}
    </div>
  );
};

export default UserRegistration;