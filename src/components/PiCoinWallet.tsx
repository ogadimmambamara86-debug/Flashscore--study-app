
import React, { useState, useEffect } from 'react';
import PiCoinManager, { PiCoinTransaction, PiCoinBalance } from '../utils/piCoinManager';

interface PiCoinWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

const PiCoinWallet: React.FC<PiCoinWalletProps> = ({ isOpen, onClose }) => {
  const [balance, setBalance] = useState<PiCoinBalance | null>(null);
  const [transactions, setTransactions] = useState<PiCoinTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  useEffect(() => {
    if (isOpen) {
      loadWalletData();
    }
  }, [isOpen]);

  const loadWalletData = () => {
    const walletBalance = PiCoinManager.getBalance();
    const walletTransactions = PiCoinManager.getTransactions();
    setBalance(walletBalance);
    setTransactions(walletTransactions);
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
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.8rem',
            margin: '0',
            background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            π Pi Coin Wallet
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'overview' ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === 'overview' ? 'white' : '#d1fae5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'transactions' ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === 'transactions' ? 'white' : '#d1fae5',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            History
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && balance && (
          <div>
            {/* Balance Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>π</div>
              <div style={{ color: 'white', fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>
                {balance.balance.toLocaleString()}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
                Pi Coins
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: '700' }}>
                  {balance.totalEarned.toLocaleString()}
                </div>
                <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Total Earned</div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#06b6d4', fontSize: '1.5rem', fontWeight: '700' }}>
                  {transactions.length}
                </div>
                <div style={{ color: '#d1fae5', fontSize: '0.9rem' }}>Transactions</div>
              </div>
            </div>

            {/* Withdrawal Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.2rem' }}>Withdraw to Pi Network</h3>
              <div style={{ marginBottom: '12px', color: '#d1fae5', fontSize: '0.9rem' }}>
                Exchange Rate: 200 Pi Coins = 1 Real Pi • Minimum: 1,000 Pi Coins
              </div>
              {balance.balance >= 1000 ? (
                <div>
                  <input
                    type="text"
                    placeholder="Enter your Pi wallet address"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      marginBottom: '12px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="number"
                      placeholder="Pi Coins to exchange"
                      min="1000"
                      max={balance.balance}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff'
                      }}
                    />
                    <div style={{ color: '#22c55e', fontWeight: '600' }}>
                      = {(1000 / 200).toFixed(2)} Pi
                    </div>
                  </div>
                  <button
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Withdraw to Pi Network
                  </button>
                </div>
              ) : (
                <div style={{ 
                  padding: '16px', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  textAlign: 'center'
                }}>
                  Need {(1000 - balance.balance).toLocaleString()} more Pi Coins to withdraw
                </div>
              )}
            </div>

            {/* Earning Opportunities */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '1.2rem' }}>Earn More Pi Coins</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#d1fae5' }}>Complete Quiz</span>
                  <span style={{ color: '#ffd700', fontWeight: '600' }}>π 10</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#d1fae5' }}>Perfect Quiz Score</span>
                  <span style={{ color: '#ffd700', fontWeight: '600' }}>π 25</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#d1fae5' }}>Daily Login</span>
                  <span style={{ color: '#ffd700', fontWeight: '600' }}>π 5</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#d1fae5' }}>Correct Prediction</span>
                  <span style={{ color: '#ffd700', fontWeight: '600' }}>π 15</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: '16px' }}>Recent Transactions</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {transactions.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#d1fae5',
                  padding: '40px 20px'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🎯</div>
                  <p>No transactions yet!</p>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Complete quizzes to start earning Pi coins.</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#fff', fontWeight: '600' }}>
                        {transaction.description}
                      </span>
                      <span style={{
                        color: transaction.amount > 0 ? '#22c55e' : '#ef4444',
                        fontWeight: '700'
                      }}>
                        {transaction.amount > 0 ? '+' : ''}π {transaction.amount}
                      </span>
                    </div>
                    <div style={{ color: '#d1fae5', fontSize: '0.8rem' }}>
                      {new Date(transaction.timestamp).toLocaleDateString()} at {new Date(transaction.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PiCoinWallet;
