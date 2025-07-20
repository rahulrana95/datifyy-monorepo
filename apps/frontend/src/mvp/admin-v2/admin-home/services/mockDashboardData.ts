/**
 * Mock data for Admin Dashboard
 * Single source of truth for all dashboard mock data
 */

import { DashboardMetrics, RevenueData, LocationActivity } from '../types';

export const mockDashboardMetrics: DashboardMetrics = {
  totalSignups: {
    value: 12543,
    previousValue: 11234,
    changePercent: 11.65,
    trend: 'up',
    label: 'Total Signups',
    icon: 'FiUsers',
    color: 'blue.500'
  },
  verifiedUsers: {
    value: 8234,
    previousValue: 7432,
    changePercent: 10.79,
    trend: 'up',
    label: 'Verified Users',
    icon: 'FiCheckCircle',
    color: 'green.500'
  },
  activeUsersToday: {
    value: 1234,
    previousValue: 1456,
    changePercent: -15.25,
    trend: 'down',
    label: 'Active Today',
    icon: 'FiActivity',
    color: 'purple.500'
  },
  activeUsersThisWeek: {
    value: 4567,
    previousValue: 4234,
    changePercent: 7.87,
    trend: 'up',
    label: 'Active This Week',
    icon: 'FiTrendingUp',
    color: 'teal.500'
  },
  totalCuratedDates: {
    value: 3456,
    previousValue: 3123,
    changePercent: 10.66,
    trend: 'up',
    label: 'Total Curated Dates',
    icon: 'FiHeart',
    color: 'pink.500'
  },
  successfulDatesThisMonth: {
    value: 234,
    previousValue: 189,
    changePercent: 23.81,
    trend: 'up',
    label: 'Successful Dates (Month)',
    icon: 'FiSmile',
    color: 'orange.500'
  },
  totalTokensPurchased: {
    value: 45678,
    previousValue: 42345,
    changePercent: 7.87,
    trend: 'up',
    label: 'Tokens Purchased',
    icon: 'FiDollarSign',
    color: 'yellow.500'
  },
  totalRevenue: {
    value: 234567,
    previousValue: 212345,
    changePercent: 10.46,
    trend: 'up',
    label: 'Total Revenue (₹)',
    icon: 'FiTrendingUp',
    color: 'green.600'
  },
  newUsersThisWeek: {
    value: 543,
    previousValue: 467,
    changePercent: 16.27,
    trend: 'up',
    label: 'New Users This Week',
    icon: 'FiUserPlus',
    color: 'cyan.500'
  },
  cancelledDates: {
    value: 45,
    previousValue: 67,
    changePercent: -32.84,
    trend: 'down',
    label: 'Cancelled Dates',
    icon: 'FiXCircle',
    color: 'red.500'
  },
  upcomingDates: {
    value: 123,
    previousValue: 98,
    changePercent: 25.51,
    trend: 'up',
    label: 'Upcoming Dates',
    icon: 'FiCalendar',
    color: 'indigo.500'
  }
};

export const mockRevenueData: RevenueData = {
  totalRevenue: 234567,
  revenueByWeek: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [45000, 52000, 61000, 76567],
      backgroundColor: '#E85D75',
      borderColor: '#E85D75'
    }]
  },
  revenueByMonth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [145000, 152000, 161000, 176567, 189000, 234567],
      backgroundColor: '#E85D75',
      borderColor: '#E85D75'
    }]
  },
  revenueByDateType: {
    online: 134567,
    offline: 100000
  },
  topRevenueCities: [
    { city: 'Mumbai', state: 'Maharashtra', country: 'India', revenue: 45678, userCount: 2345 },
    { city: 'Delhi', state: 'Delhi', country: 'India', revenue: 38900, userCount: 1890 },
    { city: 'Bangalore', state: 'Karnataka', country: 'India', revenue: 35678, userCount: 1678 },
    { city: 'Chennai', state: 'Tamil Nadu', country: 'India', revenue: 28900, userCount: 1345 },
    { city: 'Hyderabad', state: 'Telangana', country: 'India', revenue: 25678, userCount: 1234 },
    { city: 'Pune', state: 'Maharashtra', country: 'India', revenue: 22345, userCount: 1123 },
    { city: 'Kolkata', state: 'West Bengal', country: 'India', revenue: 18900, userCount: 987 },
    { city: 'Ahmedabad', state: 'Gujarat', country: 'India', revenue: 15678, userCount: 876 },
    { city: 'Jaipur', state: 'Rajasthan', country: 'India', revenue: 12345, userCount: 654 },
    { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', revenue: 10890, userCount: 543 }
  ],
  tokenPacksSold: {
    volume: 3456,
    amount: 234567
  }
};

export const mockLocationActivity: LocationActivity[] = [
  { city: 'Mumbai', activeUsers: 456, dates: 123, revenue: 45678 },
  { city: 'Delhi', activeUsers: 389, dates: 98, revenue: 38900 },
  { city: 'Bangalore', activeUsers: 367, dates: 89, revenue: 35678 },
  { city: 'Chennai', activeUsers: 289, dates: 67, revenue: 28900 },
  { city: 'Hyderabad', activeUsers: 256, dates: 56, revenue: 25678 }
];

// Function to simulate API delay
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};