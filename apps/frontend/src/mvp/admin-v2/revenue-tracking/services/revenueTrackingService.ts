/**
 * Revenue Tracking Service
 * Mock API service for revenue tracking
 */

import { BaseService, ServiceResponse } from '../../../../services/baseService';
import { 
  Transaction, 
  RevenueMetrics, 
  RevenueByPeriod, 
  RevenueByCategory,
  TopUser,
  PaymentMethodStats,
  SubscriptionMetrics,
  RevenueFilters 
} from '../types';
import { format, subDays, startOfDay } from 'date-fns';

// Mock data generator
const generateMockTransactions = (count: number = 100): Transaction[] => {
  const types: Transaction['type'][] = ['purchase', 'refund', 'subscription', 'bonus'];
  const statuses: Transaction['status'][] = ['pending', 'completed', 'failed', 'refunded'];
  const paymentMethods: Transaction['paymentMethod'][] = ['card', 'upi', 'netbanking', 'wallet'];
  
  const users = [
    { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com' },
    { id: 'u2', name: 'Priya Patel', email: 'priya@example.com' },
    { id: 'u3', name: 'Amit Kumar', email: 'amit@example.com' },
    { id: 'u4', name: 'Sneha Gupta', email: 'sneha@example.com' },
    { id: 'u5', name: 'Vikram Singh', email: 'vikram@example.com' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = type === 'refund' ? 'refunded' : statuses[Math.floor(Math.random() * statuses.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));
    
    const baseAmount = Math.floor(Math.random() * 5000) + 500;
    const amount = type === 'refund' ? -baseAmount : baseAmount;
    const loveTokens = type === 'purchase' ? Math.floor(amount / 100) * 10 : undefined;
    
    return {
      id: `t${i + 1}`,
      transactionId: `TXN${String(i + 1).padStart(8, '0')}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      type,
      amount,
      currency: 'INR' as const,
      status,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      description: type === 'purchase' 
        ? `Purchase of ${loveTokens} Love Tokens`
        : type === 'subscription'
        ? 'Monthly Premium Subscription'
        : type === 'bonus'
        ? 'Referral Bonus'
        : 'Refund for failed date',
      loveTokens,
      createdAt: createdDate.toISOString(),
      completedAt: status === 'completed' ? new Date(createdDate.getTime() + 5 * 60 * 1000).toISOString() : undefined,
      refundedAt: status === 'refunded' ? new Date(createdDate.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
      metadata: {
        orderId: `ORD${String(i + 1).padStart(6, '0')}`,
        subscriptionPlan: type === 'subscription' ? 'premium' : undefined,
        promoCode: Math.random() > 0.7 ? 'LOVE20' : undefined,
        referralCode: type === 'bonus' ? 'REF123' : undefined,
      },
    };
  });
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ADMIN_API_PREFIX = 'admin/revenue';

class RevenueTrackingService extends BaseService {
  private mockTransactions: Transaction[] = generateMockTransactions(150);

  async getTransactions(filters: RevenueFilters, page: number, pageSize: number): Promise<ServiceResponse<{
    transactions: Transaction[];
    totalCount: number;
  }>> {
    return this.getData<{ transactions: Transaction[]; totalCount: number }>(
      async () => {
        await delay(800);
      // Apply filters
      let filteredTransactions = [...this.mockTransactions];

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.userName.toLowerCase().includes(searchLower) ||
          transaction.userEmail.toLowerCase().includes(searchLower) ||
          transaction.transactionId.toLowerCase().includes(searchLower)
        );
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
      }

      // Type filter
      if (filters.type && filters.type !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
      }

      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.paymentMethod === filters.paymentMethod);
      }

      // Date range filter
      if (filters.dateRange) {
        const from = new Date(filters.dateRange.from);
        const to = new Date(filters.dateRange.to);
        filteredTransactions = filteredTransactions.filter(t => {
          const created = new Date(t.createdAt);
          return created >= from && created <= to;
        });
      }

      // Amount range filter
      if (filters.minAmount !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => Math.abs(t.amount) >= filters.minAmount!);
      }
      if (filters.maxAmount !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => Math.abs(t.amount) <= filters.maxAmount!);
      }

      // Sort by date (most recent first)
      filteredTransactions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Paginate
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

        return {
          response: {
            transactions: paginatedTransactions,
            totalCount: filteredTransactions.length,
          },
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/transactions`,
      { filters, page, pageSize }
    );
  }

  async getRevenueMetrics(): Promise<ServiceResponse<RevenueMetrics>> {
    return this.getData<RevenueMetrics>(
      async () => {
        await delay(500);
      const now = new Date();
      const startOfToday = startOfDay(now);
      const startOfWeek = startOfDay(subDays(now, 7));
      const startOfMonth = startOfDay(subDays(now, 30));

      const completedTransactions = this.mockTransactions.filter(t => t.status === 'completed');
      
      const metrics: RevenueMetrics = {
        totalRevenue: completedTransactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
        monthlyRevenue: completedTransactions
          .filter(t => new Date(t.createdAt) >= startOfMonth)
          .reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
        weeklyRevenue: completedTransactions
          .filter(t => new Date(t.createdAt) >= startOfWeek)
          .reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
        dailyRevenue: completedTransactions
          .filter(t => new Date(t.createdAt) >= startOfToday)
          .reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
        averageTransactionValue: 0,
        totalTransactions: this.mockTransactions.length,
        successfulTransactions: completedTransactions.length,
        failedTransactions: this.mockTransactions.filter(t => t.status === 'failed').length,
        refundedAmount: this.mockTransactions
          .filter(t => t.status === 'refunded')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
        growthRate: 15.5, // Mock growth rate
      };

      // Calculate average transaction value
      const purchaseTransactions = completedTransactions.filter(t => t.type === 'purchase');
      metrics.averageTransactionValue = purchaseTransactions.length > 0
        ? Math.round(purchaseTransactions.reduce((sum, t) => sum + t.amount, 0) / purchaseTransactions.length)
        : 0;

        return {
          response: metrics,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/overview`
    );
  }

  async getRevenueByPeriod(days: number = 30): Promise<ServiceResponse<RevenueByPeriod[]>> {
    return this.getData<RevenueByPeriod[]>(
      async () => {
        await delay(500);
      const revenueByPeriod: RevenueByPeriod[] = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(now, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        const dayTransactions = this.mockTransactions.filter(t => {
          const tDate = format(new Date(t.createdAt), 'yyyy-MM-dd');
          return tDate === dateStr && t.status === 'completed';
        });

        revenueByPeriod.push({
          date: dateStr,
          revenue: dayTransactions.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0),
          transactions: dayTransactions.filter(t => t.amount > 0).length,
          refunds: dayTransactions.filter(t => t.type === 'refund').length,
        });
      }

        return {
          response: revenueByPeriod,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/analytics/trends`,
      { days }
    );
  }

  async getRevenueByCategory(): Promise<ServiceResponse<RevenueByCategory[]>> {
    return this.getData<RevenueByCategory[]>(
      async () => {
        await delay(500);
      const completedTransactions = this.mockTransactions.filter(t => t.status === 'completed' && t.amount > 0);
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

      const categories = ['purchase', 'subscription', 'bonus'];
      const revenueByCategory: RevenueByCategory[] = categories.map(category => {
        const categoryTransactions = completedTransactions.filter(t => t.type === category);
        const categoryRevenue = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        return {
          category: category.charAt(0).toUpperCase() + category.slice(1),
          revenue: categoryRevenue,
          percentage: totalRevenue > 0 ? Math.round((categoryRevenue / totalRevenue) * 100) : 0,
          transactions: categoryTransactions.length,
        };
      });

        return {
          response: revenueByCategory,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/analytics/by-category`
    );
  }

  async getTopUsers(limit: number = 10): Promise<ServiceResponse<TopUser[]>> {
    return this.getData<TopUser[]>(
      async () => {
        await delay(500);
      const userSpending = new Map<string, {
        userId: string;
        userName: string;
        userEmail: string;
        totalSpent: number;
        transactionCount: number;
        lastPurchase: string;
        loveTokensPurchased: number;
      }>();

      // Aggregate user spending
      this.mockTransactions
        .filter(t => t.status === 'completed' && t.amount > 0)
        .forEach(t => {
          const existing = userSpending.get(t.userId) || {
            userId: t.userId,
            userName: t.userName,
            userEmail: t.userEmail,
            totalSpent: 0,
            transactionCount: 0,
            lastPurchase: t.createdAt,
            loveTokensPurchased: 0,
          };

          existing.totalSpent += t.amount;
          existing.transactionCount += 1;
          existing.loveTokensPurchased += t.loveTokens || 0;
          
          if (new Date(t.createdAt) > new Date(existing.lastPurchase)) {
            existing.lastPurchase = t.createdAt;
          }

          userSpending.set(t.userId, existing);
        });

      // Sort by total spent
      const topUsers = Array.from(userSpending.values())
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, limit);

        return {
          response: topUsers,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/analytics/top-users`,
      { limit }
    );
  }

  async getPaymentMethodStats(): Promise<ServiceResponse<PaymentMethodStats[]>> {
    return this.getData<PaymentMethodStats[]>(
      async () => {
        await delay(500);
      const completedTransactions = this.mockTransactions.filter(t => t.status === 'completed' && t.amount > 0);
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

      const methods: Transaction['paymentMethod'][] = ['card', 'upi', 'netbanking', 'wallet'];
      const paymentMethodStats: PaymentMethodStats[] = methods.map(method => {
        const methodTransactions = completedTransactions.filter(t => t.paymentMethod === method);
        const methodRevenue = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        return {
          method,
          revenue: methodRevenue,
          transactions: methodTransactions.length,
          percentage: totalRevenue > 0 ? Math.round((methodRevenue / totalRevenue) * 100) : 0,
        };
      });

        return {
          response: paymentMethodStats,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/analytics/payment-methods`
    );
  }

  async getSubscriptionMetrics(): Promise<ServiceResponse<SubscriptionMetrics>> {
    return this.getData<SubscriptionMetrics>(
      async () => {
        await delay(500);
      const now = new Date();
      const startOfMonth = startOfDay(subDays(now, 30));
      
      const subscriptionTransactions = this.mockTransactions.filter(t => t.type === 'subscription');
      const activeSubscriptions = subscriptionTransactions.filter(t => t.status === 'completed').length;
      const newSubscriptions = subscriptionTransactions
        .filter(t => t.status === 'completed' && new Date(t.createdAt) >= startOfMonth).length;
      const cancelledSubscriptions = Math.floor(activeSubscriptions * 0.1); // Mock 10% churn
      
      const metrics: SubscriptionMetrics = {
        activeSubscriptions,
        newSubscriptions,
        cancelledSubscriptions,
        monthlyRecurringRevenue: activeSubscriptions * 999, // Assuming ₹999 per month
        churnRate: activeSubscriptions > 0 ? Math.round((cancelledSubscriptions / activeSubscriptions) * 100) : 0,
      };

        return {
          response: metrics,
          error: null,
        };
      },
      `${ADMIN_API_PREFIX}/analytics/subscriptions`
    );
  }
}

export default new RevenueTrackingService();