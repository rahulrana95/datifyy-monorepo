/**
 * RevenueMetricCard Component
 * Card for displaying revenue metrics
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
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface RevenueMetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: IconType;
  color: string;
  helpText?: string;
  isLoading?: boolean;
}

const RevenueMetricCard: React.FC<RevenueMetricCardProps> = ({
  label,
  value,
  change,
  icon,
  color,
  helpText,
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={-2}
        right={-2}
        opacity={0.1}
      >
        <Icon as={icon} boxSize={20} color={`${color}.500`} />
      </Box>
      
      <Stat position="relative">
        <HStack mb={2}>
          <Icon as={icon} color={`${color}.500`} boxSize={5} />
          <StatLabel color="gray.500" fontSize="sm">
            {label}
          </StatLabel>
        </HStack>
        
        <StatNumber fontSize="3xl" fontWeight="bold">
          {value}
        </StatNumber>
        
        {(change !== undefined || helpText) && (
          <StatHelpText>
            {change !== undefined && (
              <HStack spacing={1}>
                <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                <span>{Math.abs(change)}%</span>
              </HStack>
            )}
            {helpText}
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

export default RevenueMetricCard;