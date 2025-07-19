import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from 'react-icons/fi';
import { VerificationStats as VerificationStatsType } from '../types';

interface VerificationStatsProps {
  stats: VerificationStatsType;
  isLoading?: boolean;
}

const VerificationStats: React.FC<VerificationStatsProps> = ({ stats, isLoading }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'blue',
      helpText: 'All registered users',
    },
    {
      label: 'Fully Verified',
      value: stats.verifiedUsers,
      icon: FiCheckCircle,
      color: 'green',
      helpText: `${calculatePercentage(stats.verifiedUsers, stats.totalUsers)}% of total`,
    },
    {
      label: 'Pending Verification',
      value: stats.pendingVerifications,
      icon: FiClock,
      color: 'yellow',
      helpText: 'Awaiting review',
    },
    {
      label: 'Rejected',
      value: stats.rejectedVerifications,
      icon: FiXCircle,
      color: 'red',
      helpText: 'Need resubmission',
    },
  ];

  const verificationTypes = [
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'officialEmail', label: 'Official Email' },
    { key: 'aadharId', label: 'Aadhar ID' },
    { key: 'collegeId', label: 'College ID' },
    { key: 'workId', label: 'Work ID' },
    { key: 'collegeMarksheet', label: 'Marksheet' },
  ];

  return (
    <VStack spacing={6} align="stretch">
      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        {statCards.map((stat) => (
          <Box
            key={stat.label}
            bg={bgColor}
            p={6}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
          >
            <Stat>
              <HStack justify="space-between" mb={2}>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <Icon as={stat.icon} color={`${stat.color}.500`} boxSize={5} />
              </HStack>
              <StatNumber fontSize="2xl" fontWeight="bold">
                {isLoading ? '-' : stat.value.toLocaleString()}
              </StatNumber>
              <StatHelpText fontSize="sm">{stat.helpText}</StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>

      {/* Verification Types Breakdown */}
      <Box bg={bgColor} p={6} borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Verification Status by Type
        </Text>
        <VStack spacing={4} align="stretch">
          {verificationTypes.map((type) => {
            const typeStats = stats.byType[type.key as keyof typeof stats.byType];
            if (!typeStats) return null;

            const total = typeStats.verified + typeStats.pending + typeStats.rejected + typeStats.notSubmitted;
            const verifiedPercentage = calculatePercentage(typeStats.verified, total);

            return (
              <Box key={type.key}>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="medium">{type.label}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {verifiedPercentage}% verified
                  </Text>
                </HStack>
                <Progress
                  value={verifiedPercentage}
                  size="sm"
                  colorScheme="green"
                  borderRadius="full"
                  bg="gray.100"
                />
                <HStack justify="space-between" mt={2} fontSize="xs" color="gray.600">
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="green.500" borderRadius="full" />
                      <Text>Verified: {typeStats.verified}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="yellow.500" borderRadius="full" />
                      <Text>Pending: {typeStats.pending}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="red.500" borderRadius="full" />
                      <Text>Rejected: {typeStats.rejected}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="gray.400" borderRadius="full" />
                      <Text>Not Submitted: {typeStats.notSubmitted}</Text>
                    </HStack>
                  </HStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </VStack>
  );
};

export default VerificationStats;