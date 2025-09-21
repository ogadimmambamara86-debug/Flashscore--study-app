import SecurityUtils from './securityUtils';

// Define constants for storage keys and security
const BALANCE_KEY = 'pi_coin_data';
const TRANSACTIONS_KEY = 'pi_coin_transactions';
const WITHDRAWALS_KEY = 'pi_withdrawals';

// Enhanced SecurityManager with better error handling
const SecurityManager = {
    logSecurityEvent: (event: string, details?: any) => {
        console.log(`SECURITY_EVENT: ${event}`, details);
    },
    sanitizeInput: (input: string): string => {
        if (typeof input !== 'string') return '';
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    },
    checkRateLimit: (key: string, limit: number, windowMs: number): boolean => {
        // Placeholder for rate limiting logic
        return true;
    }
};

// Enhanced ClientStorage with better error handling
const ClientStorage = {
    getItem: (key: string): string | null => {
        try {
            if (!PiCoinManager.isBrowser()) return null;
            return localStorage.getItem(key);
        } catch (error) {
            SecurityManager.logSecurityEvent('storage_get_error', { key, error });
            console.error(`Error getting item from localStorage: ${key}`, error);
            return null;
        }
    },
    setItem: (key: string, value: string): void => {
        try {
            if (!PiCoinManager.isBrowser()) return;
            localStorage.setItem(key, value);
        } catch (error) {
            SecurityManager.logSecurityEvent('storage_set_error', { key, error });
            console.error(`Error setting item in localStorage: ${key}`, error);
        }
    }
};

// Improved encryption functions
const CryptoHelpers = {
    encrypt: (data: string, key: string): string => {
        try {
            const CryptoJS = require('crypto-js');
            return CryptoJS.AES.encrypt(data, key).toString();
        } catch (e) {
            console.warn("CryptoJS not available. Using fallback encryption.");
            return btoa(data); // Simple base64 encoding as fallback
        }
    },

    decrypt: (ciphertext: string, key: string): string => {
        try {
            const CryptoJS = require('crypto-js');
            const bytes = CryptoJS.AES.decrypt(ciphertext, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.warn("CryptoJS not available. Using fallback decryption.");
            return atob(ciphertext); // Simple base64 decoding as fallback
        }
    }
};

// Security utils wrapper with fallbacks
const SecureUtils = {
    encrypt: (data: string, key: string): string => {
        if (SecurityUtils && typeof SecurityUtils.encrypt === 'function') {
            try {
                return SecurityUtils.encrypt(data, key);
            } catch (error) {
                console.error("SecurityUtils.encrypt failed, falling back:", error);
            }
        }
        return CryptoHelpers.encrypt(data, key);
    },

    decrypt: (ciphertext: string, key: string): string => {
        if (SecurityUtils && typeof SecurityUtils.decrypt === 'function') {
            try {
                return SecurityUtils.decrypt(ciphertext, key);
            } catch (error) {
                console.error("SecurityUtils.decrypt failed, falling back:", error);
            }
        }
        return CryptoHelpers.decrypt(ciphertext, key);
    },

    checkRateLimit: (key: string, limit: number, windowMs: number): boolean => {
        if (SecurityUtils && typeof SecurityUtils.checkRateLimit === 'function') {
            try {
                return SecurityUtils.checkRateLimit(key, limit, windowMs);
            } catch (error) {
                console.error("SecurityUtils.checkRateLimit failed, falling back:", error);
            }
        }
        return SecurityManager.checkRateLimit(key, limit, windowMs);
    }
};

interface PiCoinTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'quiz_complete' | 'daily_login' | 'prediction_correct' | 'bonus' | 'voting' | 'purchase' | 'exchange';
    timestamp: Date;
    description: string;
}

interface PiCoinBalance {
    userId: string;
    balance: number;
    totalEarned: number;
    lastUpdated: Date;
}

interface ExchangeResult {
    success: boolean;
    realPi?: number;
    error?: string;
    txId?: string;
}

class PiCoinManager {
    private static readonly STORAGE_KEY = BALANCE_KEY;
    private static readonly TRANSACTION_KEY = TRANSACTIONS_KEY;
    private static readonly WITHDRAWALS_KEY = WITHDRAWALS_KEY;
    private static readonly ENCRYPTION_KEY = process.env.PICOIN_ENCRYPTION_KEY || 'development_key_only_change_me';

    // Configuration constants
    private static readonly CONFIG = {
        MAX_TRANSACTIONS_STORED: 100,
        MAX_TRANSACTIONS_RETURNED: 20,
        MAX_SINGLE_TRANSACTION: 10000,
        TRANSACTION_RATE_LIMIT: 20,
        RATE_LIMIT_WINDOW_MS: 60000,
        MIN_EXCHANGE_AMOUNT: 1000,
    };

    // Exchange rates
    private static readonly EXCHANGE_RATES = {
        USER_TO_REAL_PI: 200, // 200 Pi coins = 1 real Pi
        CREATOR_TO_REAL_PI: 100, // Better rate for creators
    };

    // Earning rates
    static readonly REWARDS = {
        QUIZ_COMPLETE: 10,
        QUIZ_PERFECT_SCORE: 25,
        DAILY_LOGIN: 5,
        PREDICTION_CORRECT: 15,
        WEEKLY_STREAK: 50,
        MONTHLY_BONUS: 100
    };

    /**
     * Check if code is running in browser environment
     */
    static isBrowser(): boolean {
        return typeof window !== 'undefined';
    }

    /**
     * Generate a unique transaction ID
     */
    private static generateTransactionId(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `tx_${timestamp}_${random}`;
    }

    /**
     * Validate and sanitize user ID
     */
    private static validateUserId(userId: string): string | null {
        if (!userId || typeof userId !== 'string') {
            return null;
        }

        const sanitized = SecurityManager.sanitizeInput(userId.trim());
        if (!sanitized || sanitized === 'undefined' || sanitized === 'null') {
            return null;
        }

        return sanitized;
    }

    /**
     * Safely parse JSON with error handling
     */
    private static safeJsonParse<T>(data: string, defaultValue: T): T {
        try {
            const parsed = JSON.parse(data);
            return parsed;
        } catch (error) {
            console.error('JSON parse error:', error);
            return defaultValue;
        }
    }

    /**
     * Get encrypted data from storage
     */
    private static getEncryptedData<T>(key: string, defaultValue: T): T {
        const data = ClientStorage.getItem(key);
        if (!data) {
            return defaultValue;
        }

        try {
            const decryptedData = SecureUtils.decrypt(data, this.ENCRYPTION_KEY);
            return this.safeJsonParse(decryptedData, defaultValue);
        } catch (error) {
            console.error('Failed to decrypt data:', error);
            SecurityManager.logSecurityEvent('decryption_error', { key, error });
            return defaultValue;
        }
    }

    /**
     * Set encrypted data to storage
     */
    private static setEncryptedData(key: string, data: any): boolean {
        try {
            const jsonString = JSON.stringify(data);
            const encryptedData = SecureUtils.encrypt(jsonString, this.ENCRYPTION_KEY);
            ClientStorage.setItem(key, encryptedData);
            return true;
        } catch (error) {
            console.error('Failed to encrypt data:', error);
            SecurityManager.logSecurityEvent('encryption_error', { key, error });

            // Fallback to unencrypted storage
            try {
                ClientStorage.setItem(key, JSON.stringify(data));
                console.warn('Data stored unencrypted due to encryption failure.');
                return true;
            } catch (fallbackError) {
                console.error('Failed to store data even unencrypted:', fallbackError);
                SecurityManager.logSecurityEvent('storage_fallback_error', { key, fallbackError });
                return false;
            }
        }
    }

    /**
     * Get user's Pi coin balance
     */
    static getBalance(userId: string): PiCoinBalance {
        if (!this.isBrowser()) {
            return { userId: 'default', balance: 0, totalEarned: 0, lastUpdated: new Date() };
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            console.warn('Invalid userId provided to getBalance:', userId);
            return { userId: 'default', balance: 0, totalEarned: 0, lastUpdated: new Date() };
        }

        const balances = this.getEncryptedData<Record<string, PiCoinBalance>>(this.STORAGE_KEY, {});
        return balances[validUserId] || { 
            userId: validUserId, 
            balance: 0, 
            totalEarned: 0, 
            lastUpdated: new Date() 
        };
    }

    /**
     * Update user's Pi coin balance
     */
    static updateBalance(userId: string, amount: number): boolean {
        if (!this.isBrowser()) {
            return false;
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            console.warn('Update balance attempted with invalid user ID, skipping...');
            SecurityManager.logSecurityEvent('balance_update_invalid_user', { amount });
            return false;
        }

        if (typeof amount !== 'number' || !isFinite(amount)) {
            console.error('Invalid amount provided to updateBalance:', amount);
            SecurityManager.logSecurityEvent('balance_update_invalid_amount', { userId: validUserId, amount });
            return false;
        }

        const balances = this.getEncryptedData<Record<string, PiCoinBalance>>(this.STORAGE_KEY, {});
        const currentBalance = balances[validUserId] || {
            userId: validUserId,
            balance: 0,
            totalEarned: 0,
            lastUpdated: new Date()
        };

        balances[validUserId] = {
            ...currentBalance,
            balance: currentBalance.balance + amount,
            totalEarned: amount > 0 ? currentBalance.totalEarned + amount : currentBalance.totalEarned,
            lastUpdated: new Date()
        };

        return this.setEncryptedData(this.STORAGE_KEY, balances);
    }

    /**
     * Add a new transaction
     */
    static addTransaction(
        userId: string,
        amount: number,
        type: PiCoinTransaction['type'],
        description: string = ''
    ): boolean {
        if (!this.isBrowser()) {
            return false;
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            SecurityManager.logSecurityEvent('invalid_transaction_user', { amount, type, userId });
            console.error('Invalid user ID provided to addTransaction:', userId);
            return false;
        }

        // Validate transaction amount
        if (typeof amount !== 'number' || !isFinite(amount)) {
            console.error('Invalid transaction amount provided:', amount);
            SecurityManager.logSecurityEvent('invalid_transaction_amount', { userId: validUserId, amount, type });
            return false;
        }

        // Rate limiting for transactions
        if (!SecureUtils.checkRateLimit(`transaction_${validUserId}`, this.CONFIG.TRANSACTION_RATE_LIMIT, this.CONFIG.RATE_LIMIT_WINDOW_MS)) {
            console.warn('Transaction rate limit exceeded for user:', validUserId);
            SecurityManager.logSecurityEvent('transaction_rate_limit', { userId: validUserId, amount, type });
            return false;
        }

        // Validate transaction limits
        if (Math.abs(amount) > this.CONFIG.MAX_SINGLE_TRANSACTION) {
            console.error(`Transaction amount exceeds limit (${this.CONFIG.MAX_SINGLE_TRANSACTION}) for user:`, validUserId);
            SecurityManager.logSecurityEvent('transaction_limit_exceeded', { userId: validUserId, amount, type });
            return false;
        }

        const transactions = this.getEncryptedData<PiCoinTransaction[]>(this.TRANSACTION_KEY, []);

        const newTransaction: PiCoinTransaction = {
            id: this.generateTransactionId(),
            userId: validUserId,
            amount,
            type,
            description: SecurityManager.sanitizeInput(description),
            timestamp: new Date()
        };

        transactions.unshift(newTransaction);

        // Keep only last N transactions
        if (transactions.length > this.CONFIG.MAX_TRANSACTIONS_STORED) {
            transactions.splice(this.CONFIG.MAX_TRANSACTIONS_STORED);
        }

        const success = this.setEncryptedData(this.TRANSACTION_KEY, transactions);
        if (success) {
            this.updateBalance(validUserId, amount);
        }

        return success;
    }

    /**
     * Get user's transaction history
     */
    static getTransactions(userId: string): PiCoinTransaction[] {
        if (!this.isBrowser()) {
            return [];
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            console.warn('Get transactions attempted with invalid user ID, returning empty array.');
            SecurityManager.logSecurityEvent('get_transactions_invalid_user', { userId });
            return [];
        }

        const transactions = this.getEncryptedData<PiCoinTransaction[]>(this.TRANSACTION_KEY, []);

        return transactions
            .filter((t: PiCoinTransaction) => t.userId === validUserId)
            .slice(0, this.CONFIG.MAX_TRANSACTIONS_RETURNED);
    }

    /**
     * Award Pi coins for quiz completion
     */
    static awardQuizCompletion(userId: string, score: number, totalQuestions: number): number {
        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
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

        const success = this.addTransaction(validUserId, amount, 'quiz_complete', description);
        return success ? amount : 0;
    }

    /**
     * Award daily login bonus
     */
    static awardDailyLogin(userId: string): number {
        if (!this.isBrowser()) {
            return 0;
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            console.warn('Award daily login attempted with invalid user ID, skipping.');
            SecurityManager.logSecurityEvent('award_daily_login_invalid_user', { userId });
            return 0;
        }

        const lastLoginKey = `last_login_${validUserId}`;
        const lastLogin = ClientStorage.getItem(lastLoginKey);
        const today = new Date().toDateString();

        if (lastLogin !== today) {
            ClientStorage.setItem(lastLoginKey, today);
            const success = this.addTransaction(validUserId, this.REWARDS.DAILY_LOGIN, 'daily_login', 'Daily login bonus');
            return success ? this.REWARDS.DAILY_LOGIN : 0;
        }

        return 0;
    }

    /**
     * Format Pi coins for display
     */
    static formatPiCoins(amount: number): string {
        const validAmount = typeof amount === 'number' && isFinite(amount) ? amount : 0;
        return `π ${validAmount.toLocaleString()}`;
    }

    /**
     * Purchase Pi Coins with real money/Pi
     */
    static purchasePiCoins(
        userId: string, 
        amount: number, 
        paymentMethod: 'pi_network' | 'credit_card', 
        creatorId?: string
    ): boolean {
        if (!this.isBrowser()) {
            return false;
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            console.warn('Purchase Pi coins attempted with invalid user ID, skipping.');
            SecurityManager.logSecurityEvent('purchase_pi_coins_invalid_user', { amount, paymentMethod, creatorId });
            return false;
        }

        if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) {
            console.error('Invalid amount for purchasing Pi coins:', amount);
            SecurityManager.logSecurityEvent('purchase_pi_coins_invalid_amount', { userId: validUserId, amount, paymentMethod });
            return false;
        }

        try {
            const success = this.addTransaction(validUserId, amount, 'purchase', `Purchased ${amount} Pi coins via ${paymentMethod}`);

            if (success && creatorId) {
                // Record commission for creator
                import('./monetizationManager').then(({ default: MonetizationManager }) => {
                    MonetizationManager.recordUserPurchase(validUserId, amount);
                }).catch(error => {
                    console.error('Failed to record creator commission:', error);
                });
            }

            return success;
        } catch (error) {
            console.error('Purchase failed:', error);
            SecurityManager.logSecurityEvent('purchase_pi_coins_error', { userId: validUserId, amount, paymentMethod });
            return false;
        }
    }

    /**
     * Exchange Pi coins for real Pi
     */
    static exchangeToRealPi(userId: string, piCoins: number, piWalletAddress: string): ExchangeResult {
        if (!this.isBrowser()) {
            return { success: false, error: 'Not available outside browser environment' };
        }

        const validUserId = this.validateUserId(userId);
        if (!validUserId) {
            console.warn('Exchange to real Pi attempted with invalid user ID, skipping.');
            SecurityManager.logSecurityEvent('exchange_invalid_user', { piCoins, piWalletAddress });
            return { success: false, error: 'Invalid user ID provided.' };
        }

        const balance = this.getBalance(validUserId);

        if (piCoins < this.CONFIG.MIN_EXCHANGE_AMOUNT) {
            console.error(`Minimum exchange is ${this.CONFIG.MIN_EXCHANGE_AMOUNT} Pi coins, requested: ${piCoins}`);
            SecurityManager.logSecurityEvent('exchange_min_amount_error', { userId: validUserId, piCoins });
            return { success: false, error: `Minimum exchange is ${this.CONFIG.MIN_EXCHANGE_AMOUNT} Pi coins` };
        }

        if (balance.balance < piCoins) {
            return { success: false, error: 'Insufficient Pi coin balance' };
        }

        const realPi = piCoins / this.EXCHANGE_RATES.USER_TO_REAL_PI;
        const txId = this.generateTransactionId();

        // Deduct Pi coins
        const success = this.addTransaction(validUserId, -piCoins, 'exchange', `Exchanged ${piCoins} Pi coins for ${realPi} real Pi`);

        if (success) {
            // In production, integrate with Pi Network API to transfer real Pi
            SecurityManager.logSecurityEvent('successful_exchange', { userId: validUserId, piCoins, realPi, txId });
            return { success: true, realPi, txId };
        }

        return { success: false, error: 'Exchange transaction failed' };
    }

    /**
     * Clean up old data (call periodically)
     */
    static cleanup(): void {
        if (!this.isBrowser()) {
            return;
        }

        try {
            // Clean up old login records
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('last_login_')) {
                    keysToRemove.push(key);
                }
            }

            // Remove old login records (keep only recent ones)
            keysToRemove.forEach(key => {
                const loginDate = ClientStorage.getItem(key);
                if (loginDate) {
                    const daysDiff = (new Date().getTime() - new Date(loginDate).getTime()) / (1000 * 3600 * 24);
                    if (daysDiff > 30) { // Remove login records older than 30 days
                        localStorage.removeItem(key);
                    }
                }
            });

            SecurityManager.logSecurityEvent('cleanup_completed', { keysRemoved: keysToRemove.length });
        } catch (error) {
            console.error('Cleanup failed:', error);
            SecurityManager.logSecurityEvent('cleanup_error', { error });
        }
    }
}

// Export singleton instance
export const piCoinManager = new PiCoinManager();

// Default export
export default PiCoinManager;