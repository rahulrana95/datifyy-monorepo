/**
 * PaymentMethodChart Component
 * Donut chart for payment method distribution
 */

import React from 'react';
import {
  Box,
  Heading,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { PaymentMethodStats } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethodChartProps {
  data: PaymentMethodStats[];
  isLoading?: boolean;
}

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ data, isLoading = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const chartData = {
    labels: data.map(d => d.method.toUpperCase()),
    datasets: [
      {
        data: data.map(d => d.revenue),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Card - Indigo
          'rgba(16, 185, 129, 0.8)',   // UPI - Green
          'rgba(245, 158, 11, 0.8)',   // Netbanking - Amber
          'rgba(236, 72, 153, 0.8)',   // Wallet - Pink
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = data[context.dataIndex]?.percentage || 0;
            return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          },
        },
      },
    },
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'card':
        return 'blue';
      case 'upi':
        return 'green';
      case 'netbanking':
        return 'yellow';
      case 'wallet':
        return 'pink';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      h="full"
    >
      <Heading size="md" mb={4}>Payment Methods</Heading>
      
      <VStack spacing={4}>
        <Box h="200px" w="200px" mx="auto">
          <Doughnut data={chartData} options={options} />
        </Box>
        
        <VStack spacing={2} align="stretch" w="full">
          {data.map((method) => (
            <HStack key={method.method} justify="space-between">
              <HStack>
                <Badge colorScheme={getMethodColor(method.method)} variant="subtle">
                  {method.method.toUpperCase()}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {method.transactions} txns
                </Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" fontSize="sm">
                  ₹{method.revenue.toLocaleString('en-IN')}
                </Text>
                <Badge>{method.percentage}%</Badge>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default PaymentMethodChart;