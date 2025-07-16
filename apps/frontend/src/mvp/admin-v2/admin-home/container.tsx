/**
 * Admin Dashboard Container
 * Main dashboard page with metrics, charts, and analytics
 */

import React, { useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Select,
  Button,
  useToast,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';
import { useDashboardStore } from './store/dashboardStore';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import TopCitiesTable from './components/TopCitiesTable';
import dashboardService from './services/dashboardService';

const AdminDashboardContainer: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const {
    metrics,
    revenueData,
    isLoading,
    error,
    filters,
    setFilters,
    fetchAllData,
    clearError,
  } = useDashboardStore();

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchAllData();
  }, [filters.timeframe]);

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

  const handleRefresh = () => {
    fetchAllData();
    toast({
      title: 'Refreshing data',
      description: 'Dashboard data is being updated',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleExport = async () => {
    try {
      const { response, error } = await dashboardService.exportDashboardData('metrics');
      
      if (error) {
        toast({
          title: 'Export failed',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (response) {
        // Create download link
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Export successful',
          description: 'Dashboard data has been downloaded',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Prepare metrics in groups
  const primaryMetrics = metrics ? [
    metrics.totalSignups,
    metrics.verifiedUsers,
    metrics.activeUsersToday,
    metrics.activeUsersThisWeek,
  ] : [];

  const dateMetrics = metrics ? [
    metrics.totalCuratedDates,
    metrics.successfulDatesThisMonth,
    metrics.upcomingDates,
    metrics.cancelledDates,
  ] : [];

  const revenueMetrics = metrics ? [
    metrics.totalRevenue,
    metrics.totalTokensPurchased,
    metrics.newUsersThisWeek,
  ] : [];

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header Controls */}
        <HStack justify="space-between">
          <Select
            value={filters.timeframe}
            onChange={(e) => setFilters({ timeframe: e.target.value as any })}
            maxW="200px"
            size="sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </Select>
          
          <HStack>
            <Tooltip label="Export data" hasArrow>
              <IconButton
                aria-label="Export"
                icon={<FiDownload />}
                size="sm"
                variant="outline"
                onClick={handleExport}
                isDisabled={isLoading}
              />
            </Tooltip>
            
            <Tooltip label="Refresh data" hasArrow>
              <IconButton
                aria-label="Refresh"
                icon={<FiRefreshCw />}
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                isLoading={isLoading}
              />
            </Tooltip>
          </HStack>
        </HStack>

        {/* Primary Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {primaryMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} isLoading={isLoading} />
          ))}
        </SimpleGrid>

        {/* Date Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {dateMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} isLoading={isLoading} />
          ))}
        </SimpleGrid>

        {/* Revenue Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <RevenueChart 
            revenueData={revenueData} 
            isLoading={isLoading}
            onTimeframeChange={(timeframe) => setFilters({ timeframe })}
          />
          
          <TopCitiesTable 
            cities={revenueData?.topRevenueCities || []} 
            isLoading={isLoading}
          />
        </SimpleGrid>

        {/* Bottom Revenue Metrics */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {revenueMetrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} isLoading={isLoading} />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default AdminDashboardContainer;