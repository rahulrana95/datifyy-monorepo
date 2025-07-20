/**
 * RevenueChart Component
 * Chart for displaying revenue trends
 */

import React from 'react';
import {
  Box,
  Heading,
  HStack,
  Button,
  ButtonGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { format } from 'date-fns';
import { RevenueByPeriod } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: RevenueByPeriod[];
  period: '7d' | '30d' | '90d';
  onPeriodChange: (period: '7d' | '30d' | '90d') => void;
  isLoading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  period,
  onPeriodChange,
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gridColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const chartData = {
    labels: data.map(d => format(new Date(d.date), 'MMM dd')),
    datasets: [
      {
        label: 'Revenue',
        data: data.map(d => d.revenue),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Refunds',
        data: data.map(d => d.refunds * 1000), // Multiply to show on same scale
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        hidden: true, // Hidden by default
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Revenue') {
              return `${label}: ₹${value.toLocaleString('en-IN')}`;
            } else if (label === 'Refunds') {
              return `${label}: ${Math.floor(value / 1000)} transactions`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      h="400px"
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Revenue Trend</Heading>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button
            onClick={() => onPeriodChange('7d')}
            isActive={period === '7d'}
          >
            7 Days
          </Button>
          <Button
            onClick={() => onPeriodChange('30d')}
            isActive={period === '30d'}
          >
            30 Days
          </Button>
          <Button
            onClick={() => onPeriodChange('90d')}
            isActive={period === '90d'}
          >
            90 Days
          </Button>
        </ButtonGroup>
      </HStack>
      
      <Box h="calc(100% - 60px)">
        <Line data={chartData} options={options} />
      </Box>
    </Box>
  );
};

export default RevenueChart;