import SecurityUtils from './securityUtils';

interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  lastLogin: Date;
  sessionToken?: string;
  loginAttempts: number;
  lockedUntil?: Date;
  emailVerified: boolean;
}

class UserManager {
  private static readonly STORAGE_KEY = 'sports_central_users';
  private static readonly CURRENT_USER_KEY = 'current_user';
  private static readonly ENCRYPTION_KEY = process.env.USER_ENCRYPTION_KEY || 'development_key_only';

  static createUser(username: string, email?: string): User {
    const users = this.getAllUsers();

    // Validate and sanitize input
    const sanitizedUsername = SecurityUtils.sanitizeInput(username);
    const sanitizedEmail = email ? SecurityUtils.sanitizeInput(email) : undefined;

    // Security checks
    const userIP = 'current_user'; // In production, get real IP
    if (SecurityUtils.detectSuspiciousActivity(userIP, 'user_creation')) {
      SecurityUtils.logSecurityEvent('blocked_suspicious_user_creation', {
        username: sanitizedUsername,
        email: sanitizedEmail
      });
      throw new Error('Too many account creation attempts. Please try again later.');
    }

    // Check if username already exists
    if (users.find(u => u.username === sanitizedUsername)) {
      throw new Error('Username already exists');
    }

    // Generate a secure session token
    const sessionToken = SecurityUtils.generateSecureToken();

    const newUser: User = {
      id: this.generateUserId(),
      username: sanitizedUsername,
      email: sanitizedEmail,
      createdAt: new Date(),
      lastLogin: new Date(),
      sessionToken: sessionToken,
      loginAttempts: 0,
      emailVerified: false, // Email not verified by default
    };

    // Store token data for validation
    SecurityUtils.storeTokenData(sessionToken, {
      created: Date.now(),
      userId: newUser.id
    });

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

    // Set as current user
    this.setCurrentUser(newUser);

    // Create wallet for new user
    this.initializeUserWallet(newUser.id);

    // Log security event
    SecurityUtils.logSecurityEvent('user_created', {
      userId: newUser.id,
      username: sanitizedUsername
    });

    // TODO: Implement email verification process here

    return newUser;
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (!userData) {
        return null;
      }
      const user: User = JSON.parse(userData);

      // Check if session token is still valid (e.g., not expired)
      if (user.sessionToken && !SecurityUtils.isTokenValid(user.sessionToken)) {
        this.logoutUser();
        return null;
      }

      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  static setCurrentUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static loginUser(username: string): User | null {
    const users = this.getAllUsers();
    const sanitizedUsername = SecurityUtils.sanitizeInput(username);
    let user = users.find(u => u.username === sanitizedUsername);

    if (!user) {
      return null; // User not found
    }

    // Check if user account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('Account locked. Please try again later.');
    }

    // Dummy password check (in a real app, use hashed passwords)
    // For now, we assume a successful login if username matches and email is verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    user.lastLogin = new Date();
    user.loginAttempts = 0; // Reset login attempts on successful login
    user.sessionToken = SecurityUtils.generateSecureToken(); // Generate new token on login

    this.updateUser(user);
    this.setCurrentUser(user);
    return user;
  }

  static logoutUser(): void {
    if (typeof window === 'undefined') return;

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // Invalidate session token on logout
      currentUser.sessionToken = undefined;
      this.updateUser(currentUser);
    }
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static updateUser(user: User): void {
    if (typeof window === 'undefined') return;

    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);

    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
  }

  static deleteUser(userId: string): void {
    if (typeof window === 'undefined') return;

    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));

    // Clear user's wallet data
    this.clearUserWallet(userId);
  }

  private static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static initializeUserWallet(userId: string): void {
    // Import PiCoinManager dynamically to avoid circular dependency
    import('./piCoinManager').then(({ default: PiCoinManager }) => {
      // Give welcome bonus
      PiCoinManager.addTransaction(
        userId,
        50,
        'bonus',
        'Welcome bonus for new user!'
      );
    });
  }

  private static clearUserWallet(userId: string): void {
    // Clear user's Pi coin data
    const coinData = localStorage.getItem('pi_coin_data');
    const transactionData = localStorage.getItem('pi_coin_transactions');

    if (coinData) {
      const balances = JSON.parse(coinData);
      delete balances[userId];
      localStorage.setItem('pi_coin_data', JSON.stringify(balances));
    }

    if (transactionData) {
      const transactions = JSON.parse(transactionData);
      const filteredTransactions = transactions.filter((t: any) => t.userId !== userId);
      localStorage.setItem('pi_coin_transactions', JSON.stringify(filteredTransactions));
    }
  }
}

export default UserManager;
export type { User };