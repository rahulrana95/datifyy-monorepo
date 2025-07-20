/**
 * Revenue Tracking Types
 */

export interface Transaction {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'purchase' | 'refund' | 'subscription' | 'bonus';
  amount: number;
  currency: 'INR';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  description: string;
  loveTokens?: number;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  metadata?: {
    orderId?: string;
    subscriptionPlan?: string;
    promoCode?: string;
    referralCode?: string;
  };
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  averageTransactionValue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedAmount: number;
  growthRate: number;
}

export interface RevenueByPeriod {
  date: string;
  revenue: number;
  transactions: number;
  refunds: number;
}

export interface RevenueByCategory {
  category: string;
  revenue: number;
  percentage: number;
  transactions: number;
}

export interface TopUser {
  userId: string;
  userName: string;
  userEmail: string;
  totalSpent: number;
  transactionCount: number;
  lastPurchase: string;
  loveTokensPurchased: number;
}

export interface PaymentMethodStats {
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  revenue: number;
  transactions: number;
  percentage: number;
}

export interface SubscriptionMetrics {
  activeSubscriptions: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
}

export interface RevenueFilters {
  search: string;
  status?: 'all' | 'pending' | 'completed' | 'failed' | 'refunded';
  type?: 'all' | 'purchase' | 'refund' | 'subscription' | 'bonus';
  paymentMethod?: 'all' | 'card' | 'upi' | 'netbanking' | 'wallet';
  dateRange?: {
    from: string;
    to: string;
  };
  minAmount?: number;
  maxAmount?: number;
}

export interface RevenueTrackingState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  metrics: RevenueMetrics | null;
  revenueByPeriod: RevenueByPeriod[];
  revenueByCategory: RevenueByCategory[];
  topUsers: TopUser[];
  paymentMethodStats: PaymentMethodStats[];
  subscriptionMetrics: SubscriptionMetrics | null;
  isLoading: boolean;
  error: string | null;
  filters: RevenueFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
}