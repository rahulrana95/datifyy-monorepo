// apps/frontend/src/mvp/admin-v2/dashboard/components/DashboardOverview.tsx

import React, { useEffect } from 'react';
import {
    Box,
    SimpleGrid,
    Heading,
    Text,
    Flex,
    Button,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    VStack,
    HStack,
    Badge,
    Divider,
} from '@chakra-ui/react';
import {
    FiUsers,
    FiDollarSign,
    FiHeart,
    FiTrendingUp,
    FiRefreshCw,
    FiDownload,
    FiCalendar,
    FiActivity,
} from 'react-icons/fi';
import MetricCard from './MetricCard';
import TrendChart from './TrendChart';
import {
    useDashboardStore,
    useDashboardOverview,
    useDashboardLoading,
    useDashboardError,
    useDashboardAlerts,
    useMetricTrends,
} from '../store/dashboardStore';
import { formatLastUpdated, formatErrorMessage } from '../utils/formatters';
import type { ChartDataPoint } from '../types';
import { ALERT_SEVERITY_COLORS, MetricVariant, ChartType, TrendDirection } from '../types';

const DashboardOverview: React.FC = () => {
    const toast = useToast();

    // Store state
    const {
        fetchDashboardOverview,
        fetchAlerts,
        fetchTrends,
        refreshAllData,
        clearError,
        selectedTimeRange,
        lastUpdated,
        isRefreshing,
    } = useDashboardStore();

    // Data selectors
    const overview = useDashboardOverview();
    const isLoading = useDashboardLoading();
    const error = useDashboardError();
    const alerts = useDashboardAlerts();
    const trends = useMetricTrends();

    // Load data on mount and time range change
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchDashboardOverview(),
                fetchAlerts(),
                fetchTrends(),
            ]);
        };

        loadData();
    }, [fetchDashboardOverview, fetchAlerts, fetchTrends]);

    // Handle refresh
    const handleRefresh = async () => {
        try {
            await refreshAllData();
            toast({
                title: 'Dashboard Refreshed',
                description: 'All data has been updated successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Refresh Failed',
                description: 'Failed to refresh dashboard data. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Handle export
    const handleExport = () => {
        toast({
            title: 'Export Started',
            description: 'Your dashboard export is being prepared.',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
        // TODO: Implement export functionality
    };

    // Process chart data from trends
    const processChartData = (trendData: any[]): ChartDataPoint[] => {
        if (!trendData || !Array.isArray(trendData)) return [];

        return trendData.map(point => ({
            date: point.date,
            value: point.value,
            label: point.label,
        }));
    };

    // Dismiss alert
    const dismissAlert = (alertId: string) => {
        // TODO: Implement alert dismissal
        console.log('Dismissing alert:', alertId);
    };

    return (
        <Box p={6} maxW="7xl" mx="auto">
            {/* Header */}
            <Flex justify="space-between" align="center" mb={8}>
                <Box>
                    <Heading size="lg" color="gray.800" mb={2}>
                        Dashboard Overview
                    </Heading>
                    <Text color="gray.600" fontSize="md">
                        Monitor your platform's key metrics and performance
                    </Text>
                    {lastUpdated && (
                        <Text color="gray.500" fontSize="sm" mt={1}>
                            {formatLastUpdated(lastUpdated)}
                        </Text>
                    )}
                </Box>

                <HStack spacing={3}>
                    <Button
                        leftIcon={<FiDownload />}
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                    <Button
                        leftIcon={<FiRefreshCw />}
                        colorScheme="brand"
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                        loadingText="Refreshing"
                    >
                        Refresh
                    </Button>
                </HStack>
            </Flex>

            {/* Error Alert */}
            {error && (
                <Alert status="error" borderRadius="lg" mb={6}>
                    <AlertIcon />
                    <Box flex="1">
                        <AlertTitle>Error loading dashboard data</AlertTitle>
                        <AlertDescription>
                            {formatErrorMessage(error)}
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf="flex-start"
                        position="relative"
                        right={-1}
                        top={-1}
                        onClick={clearError}
                    />
                </Alert>
            )}

            {/* Dashboard Alerts */}
            {alerts.length > 0 && (
                <VStack spacing={3} mb={6}>
                    {alerts.slice(0, 3).map((alert) => {
                        const severityColor = ALERT_SEVERITY_COLORS[alert.severity];

                        return (
                            <Alert
                                key={alert.id}
                                status={alert.severity === 'critical' ? 'error' : 'warning'}
                                borderRadius="lg"
                                bg={severityColor.bg}
                                borderColor={severityColor.border}
                                borderWidth="1px"
                            >
                                <AlertIcon color={severityColor.icon} />
                                <Box flex="1">
                                    <AlertTitle color={severityColor.text}>
                                        {alert.title}
                                    </AlertTitle>
                                    <AlertDescription color={severityColor.text}>
                                        {alert.message}
                                    </AlertDescription>
                                </Box>
                                <Badge colorScheme={alert.severity === 'critical' ? 'red' : 'orange'}>
                                    {alert.severity}
                                </Badge>
                                <CloseButton
                                    alignSelf="flex-start"
                                    position="relative"
                                    right={-1}
                                    top={-1}
                                    onClick={() => dismissAlert(alert.id)}
                                />
                            </Alert>
                        );
                    })}
                </VStack>
            )}

            {/* Key Metrics Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <MetricCard
                    title="Total Users"
                    value={overview?.userMetrics.totalUsers || 0}
                    trend={overview?.userMetrics.totalUsersGrowth ? {
                        direction: overview.userMetrics.totalUsersGrowth.direction,
                        percentage: overview.userMetrics.totalUsersGrowth.percentage,
                        label: 'vs last period'
                    } : undefined}
                    icon={<FiUsers />}
                    format="number"
                    variant={MetricVariant.USERS}
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Total Revenue"
                    value={overview?.revenueMetrics.totalRevenue || 0}
                    trend={overview?.revenueMetrics.totalRevenueGrowth ? {
                        direction: overview.revenueMetrics.totalRevenueGrowth.direction,
                        percentage: overview.revenueMetrics.totalRevenueGrowth.percentage,
                        label: 'vs last period'
                    } : undefined}
                    icon={<FiDollarSign />}
                    format="currency"
                    variant={MetricVariant.REVENUE}
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Dates Setup"
                    value={overview?.dateMetrics.totalDatesSetup || 0}
                    trend={overview?.dateMetrics.datesSetupGrowth ? {
                        direction: overview.dateMetrics.datesSetupGrowth.direction,
                        percentage: overview.dateMetrics.datesSetupGrowth.percentage,
                        label: 'vs last period'
                    } : undefined}
                    icon={<FiHeart />}
                    format="number"
                    variant={MetricVariant.DATES}
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Success Rate"
                    value={overview?.dateMetrics.successRate ? overview.dateMetrics.successRate * 100 : 0}
                    trend={overview?.dateMetrics.successRateGrowth ? {
                        direction: overview.dateMetrics.successRateGrowth.direction,
                        percentage: overview.dateMetrics.successRateGrowth.percentage,
                        label: 'vs last period'
                    } : undefined}
                    icon={<FiTrendingUp />}
                    format="percentage"
                    variant={MetricVariant.SUCCESS}
                    isLoading={isLoading}
                />
            </SimpleGrid>

            {/* Activity Metrics */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
                <MetricCard
                    title="Active Users Today"
                    value={overview?.activityMetrics.activeUsersToday || 0}
                    icon={<FiActivity />}
                    format="number"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Dates This Week"
                    value={overview?.dateMetrics.datesThisWeek || 0}
                    icon={<FiCalendar />}
                    format="number"
                    isLoading={isLoading}
                />

                <MetricCard
                    title="Revenue Today"
                    value={overview?.revenueMetrics.revenueToday || 0}
                    icon={<FiDollarSign />}
                    format="currency"
                    isLoading={isLoading}
                />
            </SimpleGrid>

            <Divider my={8} />

            {/* Trend Charts */}
            <Box mb={8}>
                <Heading size="md" color="gray.800" mb={6}>
                    Trends & Analytics
                </Heading>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <TrendChart
                        title="User Growth"
                        data={processChartData(trends?.userGrowth || [])}
                        type={ChartType.AREA}
                        color="#3b82f6"
                        isLoading={isLoading}
                    />

                    <TrendChart
                        title="Revenue Trend"
                        data={processChartData(trends?.revenue || [])}
                        type={ChartType.LINE}
                        color="#22c55e"
                        isLoading={isLoading}
                    />

                    <TrendChart
                        title="Date Success Rate"
                        data={processChartData(trends?.dateSuccessRate || [])}
                        type={ChartType.AREA}
                        color="#e85d75"
                        isLoading={isLoading}
                    />

                    <TrendChart
                        title="Daily Active Users"
                        data={processChartData(trends?.dailyActiveUsers || [])}
                        type={ChartType.BAR}
                        color="#8b5cf6"
                        isLoading={isLoading}
                    />
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default DashboardOverview;