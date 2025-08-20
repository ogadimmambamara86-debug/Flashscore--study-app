
interface CreatorEarnings {
  userId: string;
  totalEarned: number;
  pendingWithdrawal: number;
  lastPayout: Date;
  conversionRate: number; // Pi coins to real Pi ratio
}

interface MonetizationConfig {
  creatorCommission: number; // Percentage of user purchases
  withdrawalMinimum: number;
  conversionRate: number;
  platformFee: number;
}

class MonetizationManager {
  private static readonly EARNINGS_KEY = 'creator_earnings';
  private static readonly CONFIG_KEY = 'monetization_config';

  static readonly DEFAULT_CONFIG: MonetizationConfig = {
    creatorCommission: 0.15, // 15% commission
    withdrawalMinimum: 1000, // Minimum 1000 Pi coins to withdraw
    conversionRate: 100, // 100 Pi coins = 1 real Pi
    platformFee: 0.05 // 5% platform fee
  };

  static getCreatorEarnings(userId: string): CreatorEarnings {
    const data = localStorage.getItem(this.EARNINGS_KEY);
    const earnings = data ? JSON.parse(data) : {};
    
    return earnings[userId] || {
      userId,
      totalEarned: 0,
      pendingWithdrawal: 0,
      lastPayout: new Date(0),
      conversionRate: this.DEFAULT_CONFIG.conversionRate
    };
  }

  static recordUserPurchase(creatorId: string, purchaseAmount: number): void {
    const config = this.getConfig();
    const creatorEarning = purchaseAmount * config.creatorCommission;
    
    const data = localStorage.getItem(this.EARNINGS_KEY);
    const earnings = data ? JSON.parse(data) : {};
    
    const currentEarnings = this.getCreatorEarnings(creatorId);
    
    earnings[creatorId] = {
      ...currentEarnings,
      totalEarned: currentEarnings.totalEarned + creatorEarning,
      pendingWithdrawal: currentEarnings.pendingWithdrawal + creatorEarning
    };
    
    localStorage.setItem(this.EARNINGS_KEY, JSON.stringify(earnings));
  }

  static canWithdraw(userId: string): boolean {
    const earnings = this.getCreatorEarnings(userId);
    return earnings.pendingWithdrawal >= this.DEFAULT_CONFIG.withdrawalMinimum;
  }

  static processWithdrawal(userId: string, piWalletAddress: string): { success: boolean; amount?: number; error?: string } {
    const earnings = this.getCreatorEarnings(userId);
    
    if (!this.canWithdraw(userId)) {
      return { 
        success: false, 
        error: `Minimum withdrawal is ${this.DEFAULT_CONFIG.withdrawalMinimum} Pi coins` 
      };
    }

    const realPiAmount = earnings.pendingWithdrawal / this.DEFAULT_CONFIG.conversionRate;
    
    // In production, integrate with Pi Network API
    // For now, simulate withdrawal
    const data = localStorage.getItem(this.EARNINGS_KEY);
    const allEarnings = data ? JSON.parse(data) : {};
    
    allEarnings[userId] = {
      ...earnings,
      pendingWithdrawal: 0,
      lastPayout: new Date()
    };
    
    localStorage.setItem(this.EARNINGS_KEY, JSON.stringify(allEarnings));
    
    // Add withdrawal transaction record
    this.addWithdrawalRecord(userId, realPiAmount, piWalletAddress);
    
    return { success: true, amount: realPiAmount };
  }

  private static addWithdrawalRecord(userId: string, amount: number, address: string): void {
    const record = {
      id: Date.now().toString(),
      userId,
      amount,
      address,
      timestamp: new Date(),
      status: 'completed'
    };
    
    const data = localStorage.getItem('withdrawal_records');
    const records = data ? JSON.parse(data) : [];
    records.unshift(record);
    
    localStorage.setItem('withdrawal_records', JSON.stringify(records));
  }

  private static getConfig(): MonetizationConfig {
    const data = localStorage.getItem(this.CONFIG_KEY);
    return data ? JSON.parse(data) : this.DEFAULT_CONFIG;
  }
}

export default MonetizationManager;
export type { CreatorEarnings, MonetizationConfig };
