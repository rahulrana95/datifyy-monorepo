/**
 * RevenueFilters Component
 * Filters for the revenue transactions
 */

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Select,
  FormControl,
  FormLabel,
  Button,
  Collapse,
  useDisclosure,
  Badge,
  Input,
  NumberInput,
  NumberInputField,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiFilter, FiX } from 'react-icons/fi';
import { RevenueFilters as RevenueFiltersType } from '../types';

interface RevenueFiltersProps {
  filters: RevenueFiltersType;
  onFiltersChange: (filters: Partial<RevenueFiltersType>) => void;
  onReset: () => void;
}

const RevenueFilters: React.FC<RevenueFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const { isOpen, onToggle } = useDisclosure();
  
  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'status' || key === 'type' || key === 'paymentMethod') return value !== 'all';
    if (key === 'dateRange') return value !== undefined;
    if (key === 'minAmount' || key === 'maxAmount') return value !== undefined;
    return false;
  }).length;

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Button
          leftIcon={<FiFilter />}
          onClick={onToggle}
          variant="outline"
          size="sm"
          rightIcon={activeFiltersCount > 0 ? <Badge colorScheme="brand">{activeFiltersCount}</Badge> : undefined}
        >
          Filters
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            leftIcon={<FiX />}
            onClick={onReset}
            variant="ghost"
            size="sm"
            colorScheme="red"
          >
            Clear Filters
          </Button>
        )}
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          bg="gray.50"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          mb={4}
        >
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Status</FormLabel>
                <Select
                  size="sm"
                  value={filters.status || 'all'}
                  onChange={(e) => onFiltersChange({ status: e.target.value as any })}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Type</FormLabel>
                <Select
                  size="sm"
                  value={filters.type || 'all'}
                  onChange={(e) => onFiltersChange({ type: e.target.value as any })}
                >
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="subscription">Subscription</option>
                  <option value="refund">Refund</option>
                  <option value="bonus">Bonus</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Payment Method</FormLabel>
                <Select
                  size="sm"
                  value={filters.paymentMethod || 'all'}
                  onChange={(e) => onFiltersChange({ paymentMethod: e.target.value as any })}
                >
                  <option value="all">All Methods</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Netbanking</option>
                  <option value="wallet">Wallet</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Date Range</FormLabel>
                <HStack>
                  <Input
                    size="sm"
                    type="date"
                    value={filters.dateRange?.from || ''}
                    onChange={(e) => onFiltersChange({ 
                      dateRange: { 
                        from: e.target.value,
                        to: filters.dateRange?.to || '',
                      } 
                    })}
                  />
                  <Input
                    size="sm"
                    type="date"
                    value={filters.dateRange?.to || ''}
                    onChange={(e) => onFiltersChange({ 
                      dateRange: { 
                        from: filters.dateRange?.from || '',
                        to: e.target.value,
                      } 
                    })}
                  />
                </HStack>
              </FormControl>
            </SimpleGrid>

            <HStack spacing={4}>
              <FormControl flex={1}>
                <FormLabel fontSize="sm">Amount Range (₹)</FormLabel>
                <HStack>
                  <NumberInput
                    size="sm"
                    value={filters.minAmount || ''}
                    onChange={(_, value) => onFiltersChange({ minAmount: value || undefined })}
                    min={0}
                  >
                    <NumberInputField placeholder="Min" />
                  </NumberInput>
                  <NumberInput
                    size="sm"
                    value={filters.maxAmount || ''}
                    onChange={(_, value) => onFiltersChange({ maxAmount: value || undefined })}
                    min={0}
                  >
                    <NumberInputField placeholder="Max" />
                  </NumberInput>
                </HStack>
              </FormControl>
            </HStack>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default RevenueFilters;