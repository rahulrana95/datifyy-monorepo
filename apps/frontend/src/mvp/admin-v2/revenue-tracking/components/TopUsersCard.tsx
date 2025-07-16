/**
 * TopUsersCard Component
 * Card for displaying top spending users
 */

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Heading,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { format } from 'date-fns';
import { TopUser } from '../types';

interface TopUsersCardProps {
  users: TopUser[];
  isLoading?: boolean;
}

const TopUsersCard: React.FC<TopUsersCardProps> = ({ users, isLoading = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      h="full"
    >
      <Heading size="md" mb={4}>Top Customers</Heading>
      
      <VStack spacing={4} align="stretch">
        {users.slice(0, 5).map((user, index) => (
          <Box key={user.userId}>
            <HStack spacing={3}>
              <Box position="relative">
                <Avatar size="sm" name={user.userName} />
                <Badge
                  position="absolute"
                  top={-1}
                  right={-1}
                  fontSize="xs"
                  colorScheme={index === 0 ? 'gold' : index === 1 ? 'gray' : index === 2 ? 'orange' : 'brand'}
                  borderRadius="full"
                  px={1.5}
                >
                  {index + 1}
                </Badge>
              </Box>
              
              <VStack align="start" spacing={0} flex={1}>
                <Text fontWeight="medium" fontSize="sm">
                  {user.userName}
                </Text>
                <HStack spacing={3} fontSize="xs" color={mutedColor}>
                  <HStack spacing={1}>
                    <FiDollarSign size={10} />
                    <Text>₹{user.totalSpent.toLocaleString('en-IN')}</Text>
                  </HStack>
                  <HStack spacing={1}>
                    <FiShoppingBag size={10} />
                    <Text>{user.transactionCount} orders</Text>
                  </HStack>
                </HStack>
              </VStack>
              
              <VStack align="end" spacing={0}>
                <Badge colorScheme="purple" fontSize="xs">
                  {user.loveTokensPurchased} LT
                </Badge>
                <Text fontSize="xs" color={mutedColor}>
                  {format(new Date(user.lastPurchase), 'MMM dd')}
                </Text>
              </VStack>
            </HStack>
            
            {index < users.length - 1 && <Divider mt={4} />}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TopUsersCard;