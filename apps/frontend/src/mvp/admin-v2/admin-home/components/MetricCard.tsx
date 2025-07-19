/**
 * MetricCard Component
 * Displays a single metric with trend and comparison
 */

import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  Icon,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import * as FiIcons from 'react-icons/fi';
import { MetricData } from '../types';

interface MetricCardProps {
  metric: MetricData;
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, isLoading = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  
  // Get icon component dynamically
  const IconComponent = metric.icon ? (FiIcons as any)[metric.icon] : FiIcons.FiActivity;

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
        _hover={{
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        }}
        transition="all 0.2s"
      >
        <Skeleton height="20px" width="60%" mb={2} />
        <Skeleton height="32px" width="80%" mb={2} />
        <Skeleton height="16px" width="40%" />
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
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <Stat>
        <HStack justify="space-between" mb={2}>
          <StatLabel color={labelColor} fontSize="sm" fontWeight="medium">
            {metric.label}
          </StatLabel>
          <Icon 
            as={IconComponent} 
            color={metric.color || 'brand.500'} 
            boxSize={5}
          />
        </HStack>
        
        <StatNumber fontSize="2xl" fontWeight="bold" color={metric.color}>
          {metric.value.toLocaleString('en-IN')}
        </StatNumber>
        
        {metric.changePercent !== undefined && (
          <StatHelpText>
            <HStack spacing={1}>
              <StatArrow type={metric.trend === 'up' ? 'increase' : 'decrease'} />
              <Box as="span" fontWeight="medium">
                {Math.abs(metric.changePercent).toFixed(2)}%
              </Box>
              {metric.previousValue && (
                <Box as="span" color={labelColor} fontSize="xs">
                  vs {metric.previousValue.toLocaleString('en-IN')}
                </Box>
              )}
            </HStack>
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

export default MetricCard;