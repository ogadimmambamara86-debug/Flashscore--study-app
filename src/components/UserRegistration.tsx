
import React, { useState } from 'react';
import UserManager, { User } from '../utils/userManager';

interface UserRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    try {
      let user: User | null = null;

      if (isLogin) {
        user = UserManager.loginUser(username);
        if (!user) {
          setError('User not found');
          return;
        }
      } else {
        user = UserManager.createUser(username, email);
      }

      onUserCreated(user);
      setUsername('');
      setEmail('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
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

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            {isLogin ? 'Login' : 'Create Account & Get π50 Welcome Bonus!'}
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
    </div>
  );
};

export default UserRegistration;
