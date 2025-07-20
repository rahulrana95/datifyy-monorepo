/**
 * RevenueChart Component
 * Displays revenue analytics in chart format
 */

import React from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Select,
  useColorModeValue,
  Skeleton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { RevenueData } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  revenueData: RevenueData | null;
  isLoading?: boolean;
  onTimeframeChange?: (timeframe: 'week' | 'month') => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  revenueData, 
  isLoading = false,
  onTimeframeChange 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const [chartType, setChartType] = React.useState<'week' | 'month'>('month');

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed?.y || 0;
            return `Revenue: ₹${value.toLocaleString('en-IN')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value) => `₹${(value || 0).toLocaleString('en-IN')}`,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <Skeleton height="30px" width="200px" mb={4} />
        <Skeleton height="300px" width="100%" />
      </Box>
    );
  }

  if (!revenueData) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <VStack align="stretch" spacing={4}>
          <Skeleton height="30px" width="200px" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {[...Array(3)].map((_, i) => (
              <Box key={i}>
                <Skeleton height="20px" width="100px" mb={2} />
                <Skeleton height="30px" width="150px" />
              </Box>
            ))}
          </SimpleGrid>
          <Skeleton height="300px" width="100%" />
        </VStack>
      </Box>
    );
  }

  const chartData = chartType === 'week' ? revenueData.revenueByWeek : revenueData.revenueByMonth;
  
  // Ensure chart data is valid
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <Text color="gray.500">No chart data available</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between">
          <Heading size="md" color={textColor}>
            Revenue Analytics
          </Heading>
          <Select
            size="sm"
            value={chartType}
            onChange={(e) => {
              const value = e.target.value as 'week' | 'month';
              setChartType(value);
              onTimeframeChange?.(value);
            }}
            maxW="150px"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </Select>
        </HStack>

        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat>
            <StatLabel>Total Revenue</StatLabel>
            <StatNumber fontSize="xl" color="green.500">
              ₹{(revenueData.totalRevenue || 0).toLocaleString('en-IN')}
            </StatNumber>
          </Stat>
          
          <Stat>
            <StatLabel>Online Dates</StatLabel>
            <StatNumber fontSize="xl">
              ₹{(revenueData.revenueByDateType?.online || 0).toLocaleString('en-IN')}
            </StatNumber>
            {revenueData.totalRevenue > 0 && (
              <Badge colorScheme="blue" mt={1}>
                {(((revenueData.revenueByDateType?.online || 0) / revenueData.totalRevenue) * 100).toFixed(1)}%
              </Badge>
            )}
          </Stat>
          
          <Stat>
            <StatLabel>Offline Dates</StatLabel>
            <StatNumber fontSize="xl">
              ₹{(revenueData.revenueByDateType?.offline || 0).toLocaleString('en-IN')}
            </StatNumber>
            {revenueData.totalRevenue > 0 && (
              <Badge colorScheme="purple" mt={1}>
                {(((revenueData.revenueByDateType?.offline || 0) / revenueData.totalRevenue) * 100).toFixed(1)}%
              </Badge>
            )}
          </Stat>
        </SimpleGrid>

        {/* Chart */}
        <Box height="300px">
          <Line data={chartData} options={chartOptions} />
        </Box>

        {/* Token Packs Info */}
        <HStack
          p={4}
          bg={useColorModeValue('gray.50', 'gray.700')}
          borderRadius="lg"
          justify="space-between"
        >
          <VStack align="start" spacing={0}>
            <Text fontSize="sm" color="gray.500">
              Token Packs Sold
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {(revenueData.tokenPacksSold?.volume || 0).toLocaleString('en-IN')}
            </Text>
          </VStack>
          
          <VStack align="end" spacing={0}>
            <Text fontSize="sm" color="gray.500">
              Token Revenue
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="green.500">
              ₹{(revenueData.tokenPacksSold?.amount || 0).toLocaleString('en-IN')}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default RevenueChart;