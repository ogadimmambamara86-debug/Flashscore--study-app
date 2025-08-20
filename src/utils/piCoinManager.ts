
interface PiCoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'quiz_complete' | 'daily_login' | 'prediction_correct' | 'bonus';
  timestamp: Date;
  description: string;
}

interface PiCoinBalance {
  userId: string;
  balance: number;
  totalEarned: number;
  lastUpdated: Date;
}

class PiCoinManager {
  private static readonly STORAGE_KEY = 'pi_coin_data';
  private static readonly TRANSACTIONS_KEY = 'pi_coin_transactions';

  // Earning rates
  static readonly REWARDS = {
    QUIZ_COMPLETE: 10,
    QUIZ_PERFECT_SCORE: 25,
    DAILY_LOGIN: 5,
    PREDICTION_CORRECT: 15,
    WEEKLY_STREAK: 50,
    MONTHLY_BONUS: 100
  };

  static getBalance(userId: string = 'default'): PiCoinBalance {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const balances = data ? JSON.parse(data) : {};
    
    return balances[userId] || {
      userId,
      balance: 0,
      totalEarned: 0,
      lastUpdated: new Date()
    };
  }

  static updateBalance(userId: string = 'default', amount: number): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const balances = data ? JSON.parse(data) : {};
    
    const currentBalance = this.getBalance(userId);
    
    balances[userId] = {
      ...currentBalance,
      balance: currentBalance.balance + amount,
      totalEarned: amount > 0 ? currentBalance.totalEarned + amount : currentBalance.totalEarned,
      lastUpdated: new Date()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(balances));
  }

  static addTransaction(
    userId: string = 'default',
    amount: number,
    type: PiCoinTransaction['type'],
    description: string
  ): void {
    const transaction: PiCoinTransaction = {
      id: Date.now().toString(),
      userId,
      amount,
      type,
      timestamp: new Date(),
      description
    };

    // Save transaction
    const data = localStorage.getItem(this.TRANSACTIONS_KEY);
    const transactions = data ? JSON.parse(data) : [];
    transactions.unshift(transaction); // Add to beginning
    
    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.splice(100);
    }
    
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
    
    // Update balance
    this.updateBalance(userId, amount);
  }

  static getTransactions(userId: string = 'default'): PiCoinTransaction[] {
    const data = localStorage.getItem(this.TRANSACTIONS_KEY);
    const transactions = data ? JSON.parse(data) : [];
    
    return transactions
      .filter((t: PiCoinTransaction) => t.userId === userId)
      .slice(0, 20); // Return last 20 transactions
  }

  static awardQuizCompletion(userId: string, score: number, totalQuestions: number): number {
    const percentage = (score / totalQuestions) * 100;
    let amount = this.REWARDS.QUIZ_COMPLETE;
    let description = `Quiz completed: ${score}/${totalQuestions}`;
    
    if (percentage === 100) {
      amount = this.REWARDS.QUIZ_PERFECT_SCORE;
      description = `Perfect quiz score! ${score}/${totalQuestions}`;
    }
    
    this.addTransaction(userId, amount, 'quiz_complete', description);
    return amount;
  }

  static awardDailyLogin(userId: string): number {
    const lastLogin = localStorage.getItem(`last_login_${userId}`);
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      localStorage.setItem(`last_login_${userId}`, today);
      this.addTransaction(userId, this.REWARDS.DAILY_LOGIN, 'daily_login', 'Daily login bonus');
      return this.REWARDS.DAILY_LOGIN;
    }
    
    return 0;
  }

  static formatPiCoins(amount: number): string {
    return `π ${amount.toLocaleString()}`;
  }

  // Purchase Pi Coins with real money/Pi
  static purchasePiCoins(userId: string, amount: number, paymentMethod: 'pi_network' | 'credit_card', creatorId?: string): boolean {
    try {
      // In production, integrate with payment processor
      // For now, simulate successful purchase
      
      this.addTransaction(userId, amount, 'bonus', `Purchased ${amount} Pi coins`);
      
      // If this was from a creator's content, record commission
      if (creatorId) {
        import('./monetizationManager').then(({ default: MonetizationManager }) => {
          MonetizationManager.recordUserPurchase(creatorId, amount);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    }
  }

  // Exchange Pi coins for real Pi (for users)
  static exchangeToRealPi(userId: string, piCoins: number, piWalletAddress: string): { success: boolean; realPi?: number; error?: string } {
    const balance = this.getBalance(userId);
    const exchangeRate = 200; // 200 Pi coins = 1 real Pi (different from creator rate)
    const minExchange = 1000; // Minimum 1000 Pi coins
    
    if (piCoins < minExchange) {
      return { success: false, error: `Minimum exchange is ${minExchange} Pi coins` };
    }
    
    if (balance.balance < piCoins) {
      return { success: false, error: 'Insufficient Pi coin balance' };
    }
    
    const realPiAmount = piCoins / exchangeRate;
    
    // Deduct Pi coins
    this.addTransaction(userId, -piCoins, 'bonus', `Exchanged ${piCoins} Pi coins for ${realPiAmount} Pi`);
    
    // In production, send real Pi to user's wallet
    // For now, just record the exchange
    
    return { success: true, realPi: realPiAmount };
  }
}

export default PiCoinManager;
export type { PiCoinTransaction, PiCoinBalance };
