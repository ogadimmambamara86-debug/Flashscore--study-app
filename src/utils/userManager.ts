
interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  lastLogin: Date;
}

class UserManager {
  private static readonly STORAGE_KEY = 'sports_central_users';
  private static readonly CURRENT_USER_KEY = 'current_user';

  static createUser(username: string, email?: string): User {
    const users = this.getAllUsers();
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: this.generateUserId(),
      username,
      email,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    
    // Set as current user
    this.setCurrentUser(newUser);
    
    // Create wallet for new user
    this.initializeUserWallet(newUser.id);
    
    return newUser;
  }

  static getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static loginUser(username: string): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.username === username);
    
    if (user) {
      user.lastLogin = new Date();
      this.updateUser(user);
      this.setCurrentUser(user);
      return user;
    }
    
    return null;
  }

  static logoutUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static getAllUsers(): User[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static updateUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }
  }

  static deleteUser(userId: string): void {
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
