
import React, { useState, useEffect } from 'react';
import MonetizationManager, { CreatorEarnings } from '../../../../../packages/shared/src/libs/utils/monetizationManager';

interface CreatorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ isOpen, onClose, userId }) => {
  const [earnings, setEarnings] = useState<CreatorEarnings | null>(null);
  const [piWalletAddress, setPiWalletAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadEarnings();
    }
  }, [isOpen, userId]);

  const loadEarnings = () => {
    const userEarnings = MonetizationManager.getCreatorEarnings(userId);
    setEarnings(userEarnings);
  };

  const handleWithdrawal = async () => {
    if (!piWalletAddress.trim()) {
      alert('Please enter your Pi wallet address');
      return;
    }

    setIsWithdrawing(true);
    const result = MonetizationManager.processWithdrawal(userId, piWalletAddress);
    
    if (result.success) {
      alert(`Successfully withdrew ${result.amount} Pi to your wallet!`);
      loadEarnings();
      setPiWalletAddress('');
    } else {
      alert(result.error);
    }
    
    setIsWithdrawing(false);
  };

  if (!isOpen || !earnings) return null;

  const canWithdraw = MonetizationManager.canWithdraw(userId);
  const realPiValue = earnings.pendingWithdrawal / 100; // 100:1 conversion

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '500px',
        width: '90%',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, background: 'linear-gradient(135deg, #ffd700, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Creator Earnings
          </h2>
          <button onClick={onClose} style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* Earnings Summary */}
        <div style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>π {earnings.pendingWithdrawal.toLocaleString()}</div>
          <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>≈ {realPiValue.toFixed(2)} Real Pi</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>Available for Withdrawal</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: '700' }}>
              π {earnings.totalEarned.toLocaleString()}
            </div>
            <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Total Earned</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ color: '#06b6d4', fontSize: '1.5rem', fontWeight: '700' }}>
              15%
            </div>
            <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Commission Rate</div>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Withdraw to Pi Wallet</h3>
          
          <input
            type="text"
            placeholder="Enter your Pi wallet address"
            value={piWalletAddress}
            onChange={(e) => setPiWalletAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              marginBottom: '16px'
            }}
          />
          
          <button
            onClick={handleWithdrawal}
            disabled={!canWithdraw || isWithdrawing || !piWalletAddress.trim()}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: canWithdraw ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              cursor: canWithdraw ? 'pointer' : 'not-allowed',
              fontWeight: '600'
            }}
          >
            {isWithdrawing ? 'Processing...' : 
             !canWithdraw ? `Minimum: π 1,000 (Need π ${1000 - earnings.pendingWithdrawal})` : 
             `Withdraw ${realPiValue.toFixed(2)} Pi`}
          </button>
          
          <div style={{ fontSize: '0.8rem', color: '#d1fae5', marginTop: '8px', textAlign: 'center' }}>
            Rate: 100 Pi Coins = 1 Real Pi • Min withdrawal: π 1,000
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
