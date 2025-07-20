/**
 * DateFilters Component
 * Filters for the dates table
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
  Checkbox,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiFilter, FiX } from 'react-icons/fi';
import { DateFilters as DateFiltersType } from '../types';

interface DateFiltersProps {
  filters: DateFiltersType;
  onFiltersChange: (filters: Partial<DateFiltersType>) => void;
  onReset: () => void;
}

const DateFilters: React.FC<DateFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const { isOpen, onToggle } = useDisclosure();
  
  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'status' || key === 'dateType') return value !== 'all';
    if (key === 'hasIssues') return value === true;
    if (key === 'dateRange') return value !== undefined;
    if (key === 'city' || key === 'genie') return value !== undefined && value !== '';
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
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Date Type</FormLabel>
                <Select
                  size="sm"
                  value={filters.dateType || 'all'}
                  onChange={(e) => onFiltersChange({ dateType: e.target.value as any })}
                >
                  <option value="all">All Types</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">City</FormLabel>
                <Input
                  size="sm"
                  placeholder="Filter by city"
                  value={filters.city || ''}
                  onChange={(e) => onFiltersChange({ city: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Genie</FormLabel>
                <Input
                  size="sm"
                  placeholder="Filter by genie"
                  value={filters.genie || ''}
                  onChange={(e) => onFiltersChange({ genie: e.target.value })}
                />
              </FormControl>
            </SimpleGrid>

            <HStack spacing={4}>
              <FormControl flex={1}>
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

              <FormControl>
                <FormLabel fontSize="sm">&nbsp;</FormLabel>
                <Checkbox
                  isChecked={filters.hasIssues || false}
                  onChange={(e) => onFiltersChange({ hasIssues: e.target.checked })}
                >
                  Has Issues
                </Checkbox>
              </FormControl>
            </HStack>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default DateFilters;