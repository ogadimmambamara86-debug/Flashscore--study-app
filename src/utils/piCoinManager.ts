import SecurityUtils from './securityUtils';

interface PiCoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'quiz_complete' | 'daily_login' | 'prediction_correct' | 'bonus' | 'voting';
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
  private static readonly TRANSACTION_KEY = 'pi_coin_transactions';
  private static readonly ENCRYPTION_KEY = 'pi_coin_secure_key_2024';

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
    if (!data) {
      return { userId, balance: 0, totalEarned: 0, lastUpdated: new Date() };
    }
    try {
      const decryptedData = SecurityUtils.decrypt(data, this.ENCRYPTION_KEY);
      const balances = JSON.parse(decryptedData);
      return balances[userId] || { userId, balance: 0, totalEarned: 0, lastUpdated: new Date() };
    } catch (error) {
      SecurityUtils.logSecurityEvent('balance_decryption_error', { userId });
      console.error('Failed to decrypt balance data:', error);
      return { userId, balance: 0, totalEarned: 0, lastUpdated: new Date() };
    }
  }

  static updateBalance(userId: string = 'default', amount: number): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let balances = {};
    if (data) {
      try {
        const decryptedData = SecurityUtils.decrypt(data, this.ENCRYPTION_KEY);
        balances = JSON.parse(decryptedData);
      } catch (error) {
        SecurityUtils.logSecurityEvent('balance_update_decryption_error', { userId });
        console.error('Failed to decrypt balance data for update:', error);
        // Proceed with potentially empty balances if decryption fails
      }
    }

    const currentBalance = balances[userId] || {
      userId,
      balance: 0,
      totalEarned: 0,
      lastUpdated: new Date()
    };

    balances[userId] = {
      ...currentBalance,
      balance: currentBalance.balance + amount,
      totalEarned: amount > 0 ? currentBalance.totalEarned + amount : currentBalance.totalEarned,
      lastUpdated: new Date()
    };

    try {
      const encryptedData = SecurityUtils.encrypt(JSON.stringify(balances), this.ENCRYPTION_KEY);
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
    } catch (error) {
      SecurityUtils.logSecurityEvent('balance_encryption_error', { userId });
      console.error('Failed to encrypt balance data:', error);
    }
  }

  static addTransaction(
    userId: string,
    amount: number,
    type: PiCoinTransaction['type'],
    description: string
  ): void {
    // Security validations
    if (!userId || typeof userId !== 'string') {
      SecurityUtils.logSecurityEvent('invalid_transaction_user', { userId, amount, type });
      throw new Error('Invalid user ID');
    }

    if (typeof amount !== 'number' || !isFinite(amount)) {
      SecurityUtils.logSecurityEvent('invalid_transaction_amount', { userId, amount, type });
      throw new Error('Invalid transaction amount');
    }

    // Rate limiting for transactions
    if (!SecurityUtils.checkRateLimit(`transaction_${userId}`, 20, 60000)) { // 20 transactions per minute
      SecurityUtils.logSecurityEvent('transaction_rate_limit', { userId, amount, type });
      throw new Error('Transaction rate limit exceeded');
    }

    // Validate transaction limits
    const maxSingleTransaction = 10000;
    if (Math.abs(amount) > maxSingleTransaction) {
      SecurityUtils.logSecurityEvent('transaction_limit_exceeded', { userId, amount, type });
      throw new Error(`Transaction amount cannot exceed ${maxSingleTransaction} Pi coins`);
    }

    const transactionsData = localStorage.getItem(this.TRANSACTION_KEY);
    let transactions: PiCoinTransaction[] = [];

    if (transactionsData) {
      try {
        const decryptedData = SecurityUtils.decrypt(transactionsData, this.ENCRYPTION_KEY);
        transactions = JSON.parse(decryptedData);
      } catch (error) {
        SecurityUtils.logSecurityEvent('transaction_decryption_error', { userId });
        console.error('Failed to decrypt transaction data:', error);
        // If decryption fails, reset transactions to prevent using potentially compromised data
        transactions = [];
      }
    }

    const newTransaction: PiCoinTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: SecurityUtils.sanitizeInput(userId),
      amount,
      type,
      description: SecurityUtils.sanitizeInput(description),
      timestamp: new Date()
    };

    transactions.unshift(newTransaction); // Add to beginning

    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.splice(100);
    }

    try {
      const encryptedData = SecurityUtils.encrypt(JSON.stringify(transactions), this.ENCRYPTION_KEY);
      localStorage.setItem(this.TRANSACTION_KEY, encryptedData);
    } catch (error) {
      SecurityUtils.logSecurityEvent('transaction_encryption_error', { userId });
      console.error('Failed to encrypt transaction data:', error);
    }


    // Update balance
    this.updateBalance(userId, amount);
  }

  static getTransactions(userId: string = 'default'): PiCoinTransaction[] {
    const data = localStorage.getItem(this.TRANSACTION_KEY);
    if (!data) {
      return [];
    }
    try {
      const decryptedData = SecurityUtils.decrypt(data, this.ENCRYPTION_KEY);
      const transactions = JSON.parse(decryptedData);
      return transactions
        .filter((t: PiCoinTransaction) => t.userId === SecurityUtils.sanitizeInput(userId))
        .slice(0, 20); // Return last 20 transactions
    } catch (error) {
      SecurityUtils.logSecurityEvent('transaction_retrieval_error', { userId });
      console.error('Failed to retrieve or decrypt transactions:', error);
      return [];
    }
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
    const lastLoginKey = `last_login_${SecurityUtils.sanitizeInput(userId)}`;
    const lastLogin = localStorage.getItem(lastLoginKey);
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      localStorage.setItem(lastLoginKey, today);
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
      // In production, integrate with payment processor and validate paymentMethod securely
      // For now, simulate successful purchase

      this.addTransaction(userId, amount, 'bonus', `Purchased ${amount} Pi coins`);

      // If this was from a creator's content, record commission
      if (creatorId) {
        // Assuming MonetizationManager is also secured and handles its own validation
        import('./monetizationManager').then(({ default: MonetizationManager }) => {
          MonetizationManager.recordUserPurchase(creatorId, amount);
        });
      }

      return true;
    } catch (error) {
      SecurityUtils.logSecurityEvent('purchase_pi_coins_error', { userId, amount, paymentMethod });
      console.error('Purchase failed:', error);
      return false;
    }
  }

  // Exchange Pi coins for real Pi (for users)
  static exchangeToRealPi(userId: string, piCoins: number, piWalletAddress: string): { success: boolean; realPi?: number; error?: string; txId?: string } {
    const balance = this.getBalance(userId);
    const exchangeRate = 200; // 200 Pi coins = 1 real Pi (different from creator rate)
    const minExchange = 1000; // Minimum 1000 Pi coins

    // Input validation for exchange
    if (piCoins < minExchange) {
      SecurityUtils.logSecurityEvent('exchange_min_amount_error', { userId, piCoins });
      return { success: false, error: `Minimum exchange is ${minExchange} Pi coins` };
    }

    if (balance.balance < piCoins) {
      SecurityUtils.logSecurityEvent('exchange_insufficient_balance', { userId, piCoins, currentBalance: balance.balance });
      return { success: false, error: 'Insufficient Pi coin balance' };
    }

    const sanitizedWalletAddress = SecurityUtils.sanitizeInput(piWalletAddress);
    if (!sanitizedWalletAddress || sanitizedWalletAddress.trim().length === 0) {
      SecurityUtils.logSecurityEvent('exchange_invalid_wallet_address', { userId });
      return { success: false, error: 'Pi wallet address is required and cannot be empty' };
    }

    // Basic check for wallet address format (can be more robust)
    if (!/^P[A-Za-z0-9]{24,}$/.test(sanitizedWalletAddress)) {
        SecurityUtils.logSecurityEvent('exchange_invalid_wallet_format', { userId, walletAddress: sanitizedWalletAddress });
        return { success: false, error: 'Invalid Pi wallet address format' };
    }


    const realPiAmount = piCoins / exchangeRate;
    const txId = `pi_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Deduct Pi coins
    this.addTransaction(userId, -piCoins, 'bonus', `Withdrew ${piCoins} Pi coins → ${realPiAmount.toFixed(2)} Pi to ${sanitizedWalletAddress.substring(0, 8)}...`);

    // Store withdrawal record
    const withdrawalRecord = {
      id: txId,
      userId,
      piCoinsExchanged: piCoins,
      realPiAmount: realPiAmount.toFixed(4),
      walletAddress: sanitizedWalletAddress,
      timestamp: new Date(),
      status: 'pending' // In production: 'pending' → 'completed' → 'confirmed'
    };

    const withdrawalsData = localStorage.getItem('pi_withdrawals');
    let withdrawals: any[] = [];
    if (withdrawalsData) {
      try {
        const decryptedWithdrawals = SecurityUtils.decrypt(withdrawalsData, this.ENCRYPTION_KEY);
        withdrawals = JSON.parse(decryptedWithdrawals);
      } catch (error) {
        SecurityUtils.logSecurityEvent('withdrawal_history_decryption_error', { userId });
        console.error('Failed to decrypt withdrawal history:', error);
        // If decryption fails, reset withdrawals to prevent using potentially compromised data
        withdrawals = [];
      }
    }

    withdrawals.unshift(withdrawalRecord);

    // Limit history size for performance and security
    if (withdrawals.length > 100) {
      withdrawals.splice(100);
    }

    try {
      const encryptedWithdrawals = SecurityUtils.encrypt(JSON.stringify(withdrawals), this.ENCRYPTION_KEY);
      localStorage.setItem('pi_withdrawals', encryptedWithdrawals);
    } catch (error) {
      SecurityUtils.logSecurityEvent('withdrawal_history_encryption_error', { userId });
      console.error('Failed to encrypt withdrawal history:', error);
    }


    // In production, integrate with Pi Network SDK securely
    // await PiNetwork.sendPayment(sanitizedWalletAddress, realPiAmount);

    return { success: true, realPi: realPiAmount, txId };
  }

  static getWithdrawalHistory(userId: string = 'default'): any[] {
    const withdrawalsData = localStorage.getItem('pi_withdrawals');
    if (!withdrawalsData) {
      return [];
    }
    try {
      const decryptedData = SecurityUtils.decrypt(withdrawalsData, this.ENCRYPTION_KEY);
      const withdrawals = JSON.parse(decryptedData);
      return withdrawals.filter((w: any) => w.userId === SecurityUtils.sanitizeInput(userId));
    } catch (error) {
      SecurityUtils.logSecurityEvent('withdrawal_history_retrieval_error', { userId });
      console.error('Failed to retrieve or decrypt withdrawal history:', error);
      return [];
    }
  }
}

export default PiCoinManager;
export type { PiCoinTransaction, PiCoinBalance };