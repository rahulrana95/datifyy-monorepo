/**
 * TransactionTable Component
 * Table for displaying transactions
 */

import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Text,
  IconButton,
  useColorModeValue,
  Flex,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiCreditCard,
  FiSmartphone,
  FiGlobe,
  FiDollarSign,
  FiInfo,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionSelect?: (transaction: Transaction) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onTransactionSelect,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);
  const showingFrom = (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalItems);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'purchase':
        return 'blue';
      case 'subscription':
        return 'purple';
      case 'refund':
        return 'red';
      case 'bonus':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getPaymentMethodIcon = (method: Transaction['paymentMethod']) => {
    switch (method) {
      case 'card':
        return FiCreditCard;
      case 'upi':
        return FiSmartphone;
      case 'netbanking':
        return FiGlobe;
      case 'wallet':
        return FiDollarSign;
      default:
        return FiDollarSign;
    }
  };

  return (
    <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor} overflow="hidden">
      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>User</Th>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Payment Method</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr
                key={transaction.id}
                _hover={{ bg: hoverBg }}
                cursor="pointer"
                onClick={() => onTransactionSelect?.(transaction)}
              >
                <Td>
                  <Text fontWeight="medium" fontSize="sm">
                    {transaction.transactionId}
                  </Text>
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm">{transaction.userName}</Text>
                    <Text fontSize="xs" color="gray.500">{transaction.userEmail}</Text>
                  </VStack>
                </Td>
                <Td>
                  <Badge colorScheme={getTypeColor(transaction.type)}>
                    {transaction.type}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <Text
                      fontWeight="bold"
                      color={transaction.amount < 0 ? 'red.500' : 'green.500'}
                    >
                      {transaction.amount < 0 ? '-' : '+'}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                    </Text>
                    {transaction.loveTokens && (
                      <Badge colorScheme="purple" fontSize="xs">
                        {transaction.loveTokens} LT
                      </Badge>
                    )}
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <Box as={getPaymentMethodIcon(transaction.paymentMethod)} size={14} />
                    <Text fontSize="sm" textTransform="capitalize">
                      {transaction.paymentMethod}
                    </Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm">
                      {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {format(new Date(transaction.createdAt), 'hh:mm a')}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Tooltip label="View Details">
                    <IconButton
                      aria-label="View details"
                      icon={<FiInfo />}
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTransactionSelect?.(transaction);
                      }}
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box p={4} borderTop="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <HStack>
            <Text fontSize="sm" color="gray.500">
              Show:
            </Text>
            <Select
              size="sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              w="80px"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
            <Text fontSize="sm" color="gray.500">
              Showing {showingFrom} to {showingTo} of {totalItems} transactions
            </Text>
          </HStack>

          <HStack>
            <IconButton
              aria-label="Previous page"
              icon={<FiChevronLeft />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <IconButton
                  key={pageNum}
                  aria-label={`Page ${pageNum}`}
                  size="sm"
                  variant={currentPage === pageNum ? 'solid' : 'outline'}
                  colorScheme={currentPage === pageNum ? 'brand' : 'gray'}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </IconButton>
              );
            })}

            {totalPages > 5 && <Text>...</Text>}

            <IconButton
              aria-label="Next page"
              icon={<FiChevronRight />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default TransactionTable;