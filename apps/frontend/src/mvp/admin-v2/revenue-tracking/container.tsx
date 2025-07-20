/**
 * Revenue Tracking Container
 * Main container for revenue tracking and analytics
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  SimpleGrid,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiDollarSign, 
  FiTrendingUp, 
  FiShoppingCart,
  FiRefreshCw,
  FiCreditCard,
  FiUsers,
} from 'react-icons/fi';
import { useRevenueTrackingStore } from './store/revenueTrackingStore';
import RevenueMetricCard from './components/RevenueMetricCard';
import RevenueChart from './components/RevenueChart';
import TransactionTable from './components/TransactionTable';
import TopUsersCard from './components/TopUsersCard';
import PaymentMethodChart from './components/PaymentMethodChart';
import RevenueFilters from './components/RevenueFilters';

const RevenueTrackingContainer: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  
  const {
    transactions,
    selectedTransaction,
    metrics,
    revenueByPeriod,
    revenueByCategory,
    topUsers,
    paymentMethodStats,
    subscriptionMetrics,
    isLoading,
    error,
    filters,
    pagination,
    setFilters,
    fetchAllData,
    fetchRevenueByPeriod,
    selectTransaction,
    clearError,
    goToPage,
    setPageSize,
    resetFilters,
  } = useRevenueTrackingStore();

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch revenue by period when chart period changes
  useEffect(() => {
    const days = chartPeriod === '7d' ? 7 : chartPeriod === '30d' ? 30 : 90;
    fetchRevenueByPeriod(days);
  }, [chartPeriod, fetchRevenueByPeriod]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Revenue & Purchase Tracking</Heading>
          <Text color="gray.600">
            Monitor revenue, transactions, and financial metrics
          </Text>
        </Box>

        {/* Metrics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <RevenueMetricCard
            label="Total Revenue"
            value={formatCurrency(metrics?.totalRevenue || 0)}
            icon={FiDollarSign}
            color="green"
            isLoading={isLoading}
          />
          <RevenueMetricCard
            label="Monthly Revenue"
            value={formatCurrency(metrics?.monthlyRevenue || 0)}
            change={metrics?.growthRate}
            icon={FiTrendingUp}
            color="blue"
            isLoading={isLoading}
          />
          <RevenueMetricCard
            label="Total Transactions"
            value={metrics?.totalTransactions || 0}
            icon={FiShoppingCart}
            color="purple"
            helpText={`${metrics?.successfulTransactions || 0} successful`}
            isLoading={isLoading}
          />
          <RevenueMetricCard
            label="Avg Transaction Value"
            value={formatCurrency(metrics?.averageTransactionValue || 0)}
            icon={FiCreditCard}
            color="orange"
            isLoading={isLoading}
          />
        </SimpleGrid>

        {/* Charts Row */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={4}>
          <GridItem>
            <RevenueChart
              data={revenueByPeriod}
              period={chartPeriod}
              onPeriodChange={setChartPeriod}
              isLoading={isLoading}
            />
          </GridItem>
          <GridItem>
            <PaymentMethodChart
              data={paymentMethodStats}
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>

        {/* Top Users and Subscription Metrics */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4}>
          <GridItem>
            <TopUsersCard
              users={topUsers}
              isLoading={isLoading}
            />
          </GridItem>
          <GridItem>
            {subscriptionMetrics && (
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                h="full"
              >
                <Heading size="md" mb={4}>Subscription Metrics</Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Active Subscriptions</Text>
                    <Text fontSize="2xl" fontWeight="bold">{subscriptionMetrics.activeSubscriptions}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">MRR</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {formatCurrency(subscriptionMetrics.monthlyRecurringRevenue)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">New This Month</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                      +{subscriptionMetrics.newSubscriptions}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Churn Rate</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="red.500">
                      {subscriptionMetrics.churnRate}%
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            )}
          </GridItem>
        </Grid>

        {/* Transactions Section */}
        <Box>
          <Heading size="md" mb={4}>Recent Transactions</Heading>
          
          {/* Search and Filters */}
          <VStack spacing={4} align="stretch" mb={4}>
            <HStack spacing={4}>
              <InputGroup flex={1} maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by user or transaction ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                />
              </InputGroup>
            </HStack>

            <RevenueFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
            />
          </VStack>

          {/* Transactions Table */}
          <TransactionTable
            transactions={transactions}
            onTransactionSelect={selectTransaction}
            currentPage={pagination.currentPage}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default RevenueTrackingContainer;