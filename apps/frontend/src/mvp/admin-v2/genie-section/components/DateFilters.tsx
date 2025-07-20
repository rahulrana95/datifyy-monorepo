/**
 * DateFilters Component
 * Filters for genie dates
 */

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useColorModeValue,
  Icon,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiSearch, FiCalendar, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { DateFilters as DateFiltersType } from '../types';

interface DateFiltersProps {
  filters: DateFiltersType;
  onFiltersChange: (filters: Partial<DateFiltersType>) => void;
  onReset: () => void;
}

const DateFilters: React.FC<DateFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    onFiltersChange({
      dateRange: {
        start: type === 'start' ? value : filters.dateRange?.start || '',
        end: type === 'end' ? value : filters.dateRange?.end || '',
      },
    });
  };

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.mode !== 'all',
    filters.verificationStatus !== 'all',
    !!filters.dateRange?.start,
    !!filters.dateRange?.end,
    !!filters.search,
  ].filter(Boolean).length;

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={4} align="stretch">
        {/* Search and Quick Filters */}
        <HStack spacing={3}>
          <InputGroup flex={1}>
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by user name or email..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
            />
          </InputGroup>
          
          <Button
            leftIcon={<FiRefreshCw />}
            variant="outline"
            onClick={onReset}
            isDisabled={activeFiltersCount === 0}
          >
            Reset
            {activeFiltersCount > 0 && (
              <Badge ml={2} colorScheme="brand">{activeFiltersCount}</Badge>
            )}
          </Button>
        </HStack>

        {/* Filter Controls */}
        <Wrap spacing={3}>
          <WrapItem>
            <FormControl minW="150px">
              <Select
                size="sm"
                value={filters.status || 'all'}
                onChange={(e) => onFiltersChange({ status: e.target.value as any })}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </Select>
            </FormControl>
          </WrapItem>

          <WrapItem>
            <FormControl minW="150px">
              <Select
                size="sm"
                value={filters.mode || 'all'}
                onChange={(e) => onFiltersChange({ mode: e.target.value as any })}
              >
                <option value="all">All Modes</option>
                <option value="online">Online Only</option>
                <option value="offline">Offline Only</option>
              </Select>
            </FormControl>
          </WrapItem>

          <WrapItem>
            <FormControl minW="200px">
              <Select
                size="sm"
                value={filters.verificationStatus || 'all'}
                onChange={(e) => onFiltersChange({ verificationStatus: e.target.value as any })}
              >
                <option value="all">All Verification</option>
                <option value="both-verified">Both Verified</option>
                <option value="one-verified">One Verified</option>
                <option value="none-verified">None Verified</option>
              </Select>
            </FormControl>
          </WrapItem>

          <WrapItem>
            <HStack>
              <FormControl minW="140px">
                <InputGroup size="sm">
                  <InputLeftElement>
                    <Icon as={FiCalendar} color="gray.400" boxSize={3} />
                  </InputLeftElement>
                  <Input
                    type="date"
                    placeholder="Start date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              
              <FormControl minW="140px">
                <InputGroup size="sm">
                  <InputLeftElement>
                    <Icon as={FiCalendar} color="gray.400" boxSize={3} />
                  </InputLeftElement>
                  <Input
                    type="date"
                    placeholder="End date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  />
                </InputGroup>
              </FormControl>
            </HStack>
          </WrapItem>
        </Wrap>
      </VStack>
    </Box>
  );
};

export default DateFilters;