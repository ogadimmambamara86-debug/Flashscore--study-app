import SecurityUtils from './securityUtils';

// Define constants for storage keys and security
const BALANCE_KEY = 'pi_coin_data';
const TRANSACTIONS_KEY = 'pi_coin_transactions';
const WITHDRAWALS_KEY = 'pi_withdrawals'; // Added for withdrawal history

// Assuming SecurityUtils has a method like this for logging security events
// and ClientStorage for basic localStorage operations.
// If these are not defined elsewhere, they would need to be implemented.
// For this example, we'll assume they exist and work as expected.
// Example stubs (replace with actual implementations):
const SecurityManager = {
    logSecurityEvent: (event: string, details?: any) => {
        console.log(`SECURITY_EVENT: ${event}`, details);
    },
    sanitizeInput: (input: string): string => {
        if (typeof input !== 'string') return '';
        // Basic sanitization: remove potentially harmful characters.
        // A more robust solution would be needed for production.
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    },
    checkRateLimit: (key: string, limit: number, windowMs: number): boolean => {
        // Placeholder for rate limiting logic
        return true;
    }
};

const ClientStorage = {
    getItem: (key: string): string | null => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            SecurityManager.logSecurityEvent('storage_get_error', { key, error });
            console.error(`Error getting item from localStorage: ${key}`, error);
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            SecurityManager.logSecurityEvent('storage_set_error', { key, error });
            console.error(`Error setting item in localStorage: ${key}`, error);
        }
    }
};

// Mock encryption/decryption for demonstration if SecurityUtils is not fully provided.
// In a real scenario, these would be robust cryptographic functions.
const mockEncrypt = (data: string, key: string): string => {
    // Extremely basic and INSECURE encryption for demonstration. DO NOT USE IN PRODUCTION.
    try {
        const CryptoJS = require('crypto-js');
        return CryptoJS.AES.encrypt(data, key).toString();
    } catch (e) {
        console.error("CryptoJS not available. Using simple XOR encryption.");
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(encrypted); // Base64 encode for storage
    }
};

const mockDecrypt = (ciphertext: string, key: string): string => {
    // Extremely basic and INSECURE decryption for demonstration. DO NOT USE IN PRODUCTION.
    try {
        const CryptoJS = require('crypto-js');
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        console.error("CryptoJS not available. Using simple XOR decryption.");
        let decrypted = '';
        const encrypted = atob(ciphertext); // Base64 decode
        for (let i = 0; i < encrypted.length; i++) {
            decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return decrypted;
    }
};

// Use actual SecurityUtils if available, otherwise fallback to mock functions
const encryptData = (data: string, key: string): string => {
    if (SecurityUtils && typeof SecurityUtils.encrypt === 'function') {
        try {
            return SecurityUtils.encrypt(data, key);
        } catch (error) {
            console.error("SecurityUtils.encrypt failed, falling back to mockEncrypt:", error);
            return mockEncrypt(data, key);
        }
    }
    return mockEncrypt(data, key);
};

const decryptData = (ciphertext: string, key: string): string => {
    if (SecurityUtils && typeof SecurityUtils.decrypt === 'function') {
        try {
            return SecurityUtils.decrypt(ciphertext, key);
        } catch (error) {
            console.error("SecurityUtils.decrypt failed, falling back to mockDecrypt:", error);
            return mockDecrypt(ciphertext, key);
        }
    }
    return mockDecrypt(ciphertext, key);
};


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
  private static readonly STORAGE_KEY = BALANCE_KEY;
  private static readonly TRANSACTION_KEY = TRANSACTIONS_KEY;
  private static readonly WITHDRAWALS_KEY = WITHDRAWALS_KEY; // Key for withdrawal history
  private static readonly ENCRYPTION_KEY = process.env.PICOIN_ENCRYPTION_KEY || 'development_key_only_change_me';

  // Earning rates
  static readonly REWARDS = {
    QUIZ_COMPLETE: 10,
    QUIZ_PERFECT_SCORE: 25,
    DAILY_LOGIN: 5,
    PREDICTION_CORRECT: 15,
    WEEKLY_STREAK: 50,
    MONTHLY_BONUS: 100
  };

  static getBalance(userId: string): { balance: number, lastUpdated: Date } {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      console.warn('Invalid userId provided to getBalance:', userId);
      return { balance: 0, lastUpdated: new Date() };
    }

    const data = ClientStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return { userId: userId || 'default', balance: 0, totalEarned: 0, lastUpdated: new Date() };
    }
    try {
      // Ensure proper decryption and parsing
      const decryptedData = decryptData(data, this.ENCRYPTION_KEY);
      const balances = JSON.parse(decryptedData);
      // Sanitize userId before lookup
      const sanitizedUserId = SecurityManager.sanitizeInput(userId);
      return balances[sanitizedUserId] || { userId: sanitizedUserId, balance: 0, totalEarned: 0, lastUpdated: new Date() };
    } catch (error) {
      console.error('Failed to decrypt balance data or parse JSON:', error);
      SecurityManager.logSecurityEvent('balance_read_error', { userId, error });
      // Return default balance on error
      return { userId: userId || 'default', balance: 0, totalEarned: 0, lastUpdated: new Date() };
    }
  }

  static updateBalance(userId: string = 'default', amount: number): void {
    if (typeof window === 'undefined') return; // Do nothing if not in browser

    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Update balance attempted with invalid user ID, skipping...');
        SecurityManager.logSecurityEvent('balance_update_invalid_user', { amount });
        return;
    }

    const data = ClientStorage.getItem(this.STORAGE_KEY);
    let balances = {};

    if (data) {
      try {
        const decryptedData = decryptData(data, this.ENCRYPTION_KEY);
        balances = JSON.parse(decryptedData);
      } catch (error) {
        console.error('Failed to decrypt balance data for update, proceeding with empty balances:', error);
        SecurityManager.logSecurityEvent('balance_update_decryption_error', { userId: sanitizedUserId });
        // If decryption fails, we might want to reset or handle it more robustly.
        // For now, proceed with potentially empty balances.
        balances = {};
      }
    }

    const currentBalance = balances[sanitizedUserId] || {
      userId: sanitizedUserId,
      balance: 0,
      totalEarned: 0,
      lastUpdated: new Date()
    };

    balances[sanitizedUserId] = {
      ...currentBalance,
      balance: currentBalance.balance + amount,
      totalEarned: amount > 0 ? currentBalance.totalEarned + amount : currentBalance.totalEarned,
      lastUpdated: new Date()
    };

    try {
      const encryptedData = encryptData(JSON.stringify(balances), this.ENCRYPTION_KEY);
      ClientStorage.setItem(this.STORAGE_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to encrypt balance data:', error);
      SecurityManager.logSecurityEvent('balance_encryption_error', { userId: sanitizedUserId });
      // Fallback to unencrypted storage for now if encryption fails
      try {
        ClientStorage.setItem(this.STORAGE_KEY, JSON.stringify(balances));
        console.warn('Balance data stored unencrypted due to encryption failure.');
      } catch (fallbackError) {
        console.error('Failed to store balance data even unencrypted:', fallbackError);
        SecurityManager.logSecurityEvent('balance_fallback_storage_error', { userId: sanitizedUserId });
      }
    }
  }

  static addTransaction(
    userId: string,
    amount: number,
    type: PiCoinTransaction['type'],
    description: string = ''
  ): boolean {
    if (!userId || userId.trim() === '' || typeof userId !== 'string') {
      SecurityManager.logSecurityEvent('invalid_transaction_user', { amount, type, userId: userId?.toString() || 'null' });
      console.error('Invalid user ID provided to addTransaction:', userId);
      return false;
    }

    // Sanitize and validate userId early
    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
      console.warn('Transaction attempted with invalid user ID, skipping...');
      SecurityManager.logSecurityEvent('invalid_transaction_user', { amount, type, originalUserId: userId });
      return false; // Return false instead of throwing, as per original intent
    }

    // Validate transaction amount
    if (typeof amount !== 'number' || !isFinite(amount)) {
      console.error('Invalid transaction amount provided:', amount);
      SecurityManager.logSecurityEvent('invalid_transaction_amount', { userId: sanitizedUserId, amount, type });
      return false; // Return false on invalid amount
    }

    // Rate limiting for transactions
    if (!SecurityUtils.checkRateLimit(`transaction_${sanitizedUserId}`, 20, 60000)) { // 20 transactions per minute
      console.warn('Transaction rate limit exceeded for user:', sanitizedUserId);
      SecurityManager.logSecurityEvent('transaction_rate_limit', { userId: sanitizedUserId, amount, type });
      return false;
    }

    // Validate transaction limits
    const maxSingleTransaction = 10000;
    if (Math.abs(amount) > maxSingleTransaction) {
      console.error(`Transaction amount exceeds limit (${maxSingleTransaction}) for user:`, sanitizedUserId);
      SecurityManager.logSecurityEvent('transaction_limit_exceeded', { userId: sanitizedUserId, amount, type });
      return false;
    }

    const transactionsData = ClientStorage.getItem(this.TRANSACTION_KEY);
    let transactions: PiCoinTransaction[] = [];

    if (transactionsData) {
      try {
        const decryptedData = decryptData(transactionsData, this.ENCRYPTION_KEY);
        transactions = JSON.parse(decryptedData);
        // Ensure transactions is an array
        if (!Array.isArray(transactions)) {
            console.error('Decrypted transaction data is not an array, resetting.');
            SecurityManager.logSecurityEvent('transaction_data_format_error', { userId: sanitizedUserId });
            transactions = [];
        }
      } catch (error) {
        SecurityManager.logSecurityEvent('transaction_decryption_error', { userId: sanitizedUserId });
        console.error('Failed to decrypt transaction data:', error);
        // Return empty array instead of throwing
        return false; // Return false on decryption error
      }
    }

    const newTransaction: PiCoinTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: sanitizedUserId,
      amount,
      type,
      description: SecurityUtils.sanitizeInput(description), // Sanitize description
      timestamp: new Date()
    };

    transactions.unshift(newTransaction); // Add to beginning

    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.splice(100);
    }

    try {
      const encryptedData = encryptData(JSON.stringify(transactions), this.ENCRYPTION_KEY);
      ClientStorage.setItem(this.TRANSACTION_KEY, encryptedData);
    } catch (error) {
      console.error('Failed to encrypt transaction data:', error);
      SecurityManager.logSecurityEvent('transaction_encryption_error', { userId: sanitizedUserId });
      // Fallback to unencrypted storage for now
      try {
        ClientStorage.setItem(this.TRANSACTION_KEY, JSON.stringify(transactions));
        console.warn('Transaction data stored unencrypted due to encryption failure.');
      } catch (fallbackError) {
        console.error('Failed to store transaction data even unencrypted:', fallbackError);
        SecurityManager.logSecurityEvent('transaction_fallback_storage_error', { userId: sanitizedUserId });
      }
    }

    // Update balance
    this.updateBalance(sanitizedUserId, amount);
    return true;
  }

  static getTransactions(userId: string = 'default'): PiCoinTransaction[] {
    if (typeof window === 'undefined') return []; // Do nothing if not in browser

    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Get transactions attempted with invalid user ID, returning empty array.');
        SecurityManager.logSecurityEvent('get_transactions_invalid_user', { originalUserId: userId });
        return [];
    }

    const data = ClientStorage.getItem(this.TRANSACTION_KEY);
    if (!data) {
      return [];
    }
    try {
      const decryptedData = decryptData(data, this.ENCRYPTION_KEY);
      const transactions = JSON.parse(decryptedData);

      // Ensure transactions is an array before filtering
      if (!Array.isArray(transactions)) {
          console.error('Retrieved transaction data is not an array.');
          SecurityManager.logSecurityEvent('get_transactions_data_format_error', { userId: sanitizedUserId });
          return [];
      }

      return transactions
        .filter((t: PiCoinTransaction) => t.userId === sanitizedUserId)
        .slice(0, 20); // Return last 20 transactions
    } catch (error) {
      console.error('Failed to retrieve or decrypt transactions:', error);
      SecurityManager.logSecurityEvent('transaction_retrieval_error', { userId: sanitizedUserId });
      return [];
    }
  }

  static awardQuizCompletion(userId: string, score: number, totalQuestions: number): number {
    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Award quiz completion attempted with invalid user ID, skipping.');
        SecurityManager.logSecurityEvent('award_quiz_invalid_user', { score, totalQuestions });
        return 0;
    }

    const percentage = (score / totalQuestions) * 100;
    let amount = this.REWARDS.QUIZ_COMPLETE;
    let description = `Quiz completed: ${score}/${totalQuestions}`;

    if (percentage === 100) {
      amount = this.REWARDS.QUIZ_PERFECT_SCORE;
      description = `Perfect quiz score! ${score}/${totalQuestions}`;
    }

    this.addTransaction(sanitizedUserId, amount, 'quiz_complete', description);
    return amount;
  }

  static awardDailyLogin(userId: string): number {
    if (typeof window === 'undefined') return 0; // Do nothing if not in browser

    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Award daily login attempted with invalid user ID, skipping.');
        SecurityManager.logSecurityEvent('award_daily_login_invalid_user', { originalUserId: userId });
        return 0;
    }

    const lastLoginKey = `last_login_${sanitizedUserId}`;
    const lastLogin = ClientStorage.getItem(lastLoginKey);
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      ClientStorage.setItem(lastLoginKey, today);
      this.addTransaction(sanitizedUserId, this.REWARDS.DAILY_LOGIN, 'daily_login', 'Daily login bonus');
      return this.REWARDS.DAILY_LOGIN;
    }

    return 0;
  }

  static formatPiCoins(amount: number): string {
    // Ensure amount is a number, default to 0 if not
    const validAmount = typeof amount === 'number' && isFinite(amount) ? amount : 0;
    return `π ${validAmount.toLocaleString()}`;
  }

  // Purchase Pi Coins with real money/Pi
  static purchasePiCoins(userId: string, amount: number, paymentMethod: 'pi_network' | 'credit_card', creatorId?: string): boolean {
    if (typeof window === 'undefined') return false; // Do nothing if not in browser

    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Purchase Pi coins attempted with invalid user ID, skipping.');
        SecurityManager.logSecurityEvent('purchase_pi_coins_invalid_user', { amount, paymentMethod, creatorId });
        return false;
    }
     if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) {
        console.error('Invalid amount for purchasing Pi coins:', amount);
        SecurityManager.logSecurityEvent('purchase_pi_coins_invalid_amount', { userId: sanitizedUserId, amount, paymentMethod });
        return false;
    }

    try {
      // In production, integrate with payment processor and validate paymentMethod securely
      // For now, simulate successful purchase

      this.addTransaction(sanitizedUserId, amount, 'bonus', `Purchased ${amount} Pi coins`);

      // If this was from a creator's content, record commission
      if (creatorId) {
        // Assuming MonetizationManager is also secured and handles its own validation
        import('./monetizationManager').then(({ default: MonetizationManager }) => {
          MonetizationManager.recordUserPurchase(sanitizedUserId, amount); // Pass userId to record purchase
        });
      }

      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      SecurityManager.logSecurityEvent('purchase_pi_coins_error', { userId: sanitizedUserId, amount, paymentMethod });
      return false;
    }
  }

  // Exchange Pi coins for real Pi (for users)
  static exchangeToRealPi(userId: string, piCoins: number, piWalletAddress: string): { success: boolean; realPi?: number; error?: string; txId?: string } {
    if (typeof window === 'undefined') return { success: false, error: 'Not available outside browser environment' };

    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Exchange to real Pi attempted with invalid user ID, skipping.');
        SecurityManager.logSecurityEvent('exchange_invalid_user', { piCoins, piWalletAddress });
        return { success: false, error: 'Invalid user ID provided.' };
    }

    const balance = this.getBalance(sanitizedUserId);
    const exchangeRate = 200; // 200 Pi coins = 1 real Pi (different from creator rate)
    const minExchange = 1000; // Minimum 1000 Pi coins

    // Input validation for exchange
    if (piCoins < minExchange) {
      console.error(`Minimum exchange is ${minExchange} Pi coins, requested: ${piCoins}`);
      SecurityManager.logSecurityEvent('exchange_min_amount_error', { userId: sanitizedUserId, piCoins });
      return { success: false, error: `Minimum exchange is ${minExchange} Pi coins` };
    }

    if (balance.balance < piCoins) {
      console.error(`Insufficient Pi coin balance for exchange. Has: ${balance.balance}, Needs: ${piCoins}`);
      SecurityManager.logSecurityEvent('exchange_insufficient_balance', { userId: sanitizedUserId, piCoins, currentBalance: balance.balance });
      return { success: false, error: 'Insufficient Pi coin balance' };
    }

    const sanitizedWalletAddress = SecurityManager.sanitizeInput(piWalletAddress);
    if (!sanitizedWalletAddress || sanitizedWalletAddress.trim().length === 0) {
      console.error('Pi wallet address is required and cannot be empty.');
      SecurityManager.logSecurityEvent('exchange_invalid_wallet_address', { userId: sanitizedUserId });
      return { success: false, error: 'Pi wallet address is required and cannot be empty' };
    }

    // Basic check for wallet address format (can be more robust)
    if (!/^P[A-Za-z0-9]{24,}$/.test(sanitizedWalletAddress)) {
        console.error('Invalid Pi wallet address format:', sanitizedWalletAddress);
        SecurityManager.logSecurityEvent('exchange_invalid_wallet_format', { userId: sanitizedUserId, walletAddress: sanitizedWalletAddress });
        return { success: false, error: 'Invalid Pi wallet address format' };
    }

    const realPiAmount = piCoins / exchangeRate;
    const txId = `pi_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Deduct Pi coins
    // Use a boolean return value to check if transaction was successful
    const transactionSuccess = this.addTransaction(sanitizedUserId, -piCoins, 'bonus', `Withdrew ${piCoins} Pi coins → ${realPiAmount.toFixed(2)} Pi to ${sanitizedWalletAddress.substring(0, 8)}...`);

    if (!transactionSuccess) {
        console.error('Failed to deduct Pi coins for withdrawal.');
        SecurityManager.logSecurityEvent('exchange_deduction_failed', { userId: sanitizedUserId, piCoins });
        return { success: false, error: 'Failed to process Pi coin deduction.' };
    }

    // Store withdrawal record
    const withdrawalRecord = {
      id: txId,
      userId: sanitizedUserId,
      piCoinsExchanged: piCoins,
      realPiAmount: realPiAmount.toFixed(4),
      walletAddress: sanitizedWalletAddress,
      timestamp: new Date(),
      status: 'pending' // In production: 'pending' → 'completed' → 'confirmed'
    };

    const withdrawalsData = ClientStorage.getItem(this.WITHDRAWALS_KEY);
    let withdrawals: any[] = [];
    if (withdrawalsData) {
      try {
        const decryptedWithdrawals = decryptData(withdrawalsData, this.ENCRYPTION_KEY);
        withdrawals = JSON.parse(decryptedWithdrawals);
        if (!Array.isArray(withdrawals)) {
             console.error('Decrypted withdrawal history data is not an array, resetting.');
             SecurityManager.logSecurityEvent('withdrawal_history_data_format_error', { userId: sanitizedUserId });
             withdrawals = [];
        }
      } catch (error) {
        console.error('Failed to decrypt withdrawal history, proceeding with empty history:', error);
        SecurityManager.logSecurityEvent('withdrawal_history_decryption_error', { userId: sanitizedUserId });
        // If decryption fails, reset withdrawals
        withdrawals = [];
      }
    }

    withdrawals.unshift(withdrawalRecord);

    // Limit history size for performance and security
    if (withdrawals.length > 100) {
      withdrawals.splice(100);
    }

    try {
      const encryptedWithdrawals = encryptData(JSON.stringify(withdrawals), this.ENCRYPTION_KEY);
      ClientStorage.setItem(this.WITHDRAWALS_KEY, encryptedWithdrawals);
    } catch (error) {
      console.error('Failed to encrypt withdrawal history:', error);
      SecurityManager.logSecurityEvent('withdrawal_history_encryption_error', { userId: sanitizedUserId });
      // Fallback to unencrypted storage
      try {
        ClientStorage.setItem(this.WITHDRAWALS_KEY, JSON.stringify(withdrawals));
        console.warn('Withdrawal history stored unencrypted due to encryption failure.');
      } catch (fallbackError) {
         console.error('Failed to store withdrawal history even unencrypted:', fallbackError);
         SecurityManager.logSecurityEvent('withdrawal_history_fallback_storage_error', { userId: sanitizedUserId });
      }
    }

    // In production, integrate with Pi Network SDK securely
    // await PiNetwork.sendPayment(sanitizedWalletAddress, realPiAmount);

    return { success: true, realPi: realPiAmount, txId };
  }

  static getWithdrawalHistory(userId: string = 'default'): any[] {
     if (typeof window === 'undefined') return []; // Do nothing if not in browser

    const sanitizedUserId = SecurityManager.sanitizeInput(userId);
    if (!sanitizedUserId || sanitizedUserId === '' || sanitizedUserId === 'undefined' || sanitizedUserId === 'null') {
        console.warn('Get withdrawal history attempted with invalid user ID, returning empty array.');
        SecurityManager.logSecurityEvent('get_withdrawal_history_invalid_user', { originalUserId: userId });
        return [];
    }

    const withdrawalsData = ClientStorage.getItem(this.WITHDRAWALS_KEY);
    if (!withdrawalsData) {
      return [];
    }
    try {
      const decryptedData = decryptData(withdrawalsData, this.ENCRYPTION_KEY);
      const withdrawals = JSON.parse(decryptedData);

      // Ensure withdrawals is an array
      if (!Array.isArray(withdrawals)) {
          console.error('Retrieved withdrawal history data is not an array.');
          SecurityManager.logSecurityEvent('get_withdrawal_history_data_format_error', { userId: sanitizedUserId });
          return [];
      }

      return withdrawals.filter((w: any) => w.userId === sanitizedUserId);
    } catch (error) {
      console.error('Failed to retrieve or decrypt withdrawal history:', error);
      SecurityManager.logSecurityEvent('withdrawal_history_retrieval_error', { userId: sanitizedUserId });
      return [];
    }
  }

  // New static method to display the betting agreement
  static displayBettingAgreement(): string {
      return `
          <div class="betting-agreement-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;">
              <div class="modal-content" style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); text-align: center; max-width: 500px;">
                  <h2 style="color: #333; margin-bottom: 15px;">Betting Agreement</h2>
                  <p style="color: #555; line-height: 1.6;">You have agreed to bet responsibly. By continuing to use this platform, you acknowledge and accept these terms. Always gamble within your means and seek help if needed.</p>
                  <div style="margin-top: 25px;">
                      <button id="closeBettingAgreement" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">I Agree</button>
                  </div>
              </div>
          </div>
      `;
  }
}

export default PiCoinManager;
export type { PiCoinTransaction, PiCoinBalance };