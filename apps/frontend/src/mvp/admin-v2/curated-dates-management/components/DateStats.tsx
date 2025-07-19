/**
 * DateStats Component
 * Statistics cards for curated dates
 */

import React from 'react';
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  HStack,
  Icon,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiStar,
} from 'react-icons/fi';
import { DateStats as DateStatsType } from '../types';

interface DateStatsProps {
  stats: DateStatsType | null;
  isLoading?: boolean;
}

const DateStats: React.FC<DateStatsProps> = ({ stats, isLoading = false }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Dates',
      value: stats.total,
      icon: FiCalendar,
      color: 'blue',
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: FiClock,
      color: 'purple',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: FiCheckCircle,
      color: 'green',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: FiXCircle,
      color: 'red',
    },
    {
      label: 'No Show',
      value: stats.noShow,
      icon: FiAlertCircle,
      color: 'orange',
    },
  ];

  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
        {statCards.map((stat, index) => (
          <Box
            key={index}
            bg={cardBg}
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <Stat>
              <HStack justify="space-between" mb={2}>
                <Icon as={stat.icon} color={`${stat.color}.500`} boxSize={5} />
              </HStack>
              <StatLabel color="gray.500" fontSize="sm">
                {stat.label}
              </StatLabel>
              <StatNumber fontSize="2xl">{stat.value}</StatNumber>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* Success Rate Card */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <HStack>
                <Icon as={FiTrendingUp} color="green.500" boxSize={5} />
                <Text fontWeight="bold">Success Rate</Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {stats.successRate}%
              </Text>
            </HStack>
            <Progress
              value={stats.successRate}
              colorScheme="green"
              size="sm"
              borderRadius="full"
            />
            <Text fontSize="sm" color="gray.500">
              Based on completed dates with positive feedback
            </Text>
          </VStack>
        </Box>

        {/* Average Rating Card */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between">
              <HStack>
                <Icon as={FiStar} color="yellow.500" boxSize={5} />
                <Text fontWeight="bold">Average Rating</Text>
              </HStack>
              <HStack>
                <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                  {stats.averageRating}
                </Text>
                <Text color="gray.500">/5</Text>
              </HStack>
            </HStack>
            <HStack spacing={1}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  as={FiStar}
                  color={i < Math.floor(stats.averageRating) ? 'yellow.500' : 'gray.300'}
                  fill={i < Math.floor(stats.averageRating) ? 'yellow.500' : 'transparent'}
                />
              ))}
            </HStack>
            <Text fontSize="sm" color="gray.500">
              From user feedback on completed dates
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default DateStats;