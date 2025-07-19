/**
 * UserFilters Component
 * Filters for the user table
 */

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Select,
  FormControl,
  FormLabel,
  Text,
  Button,
  Collapse,
  useDisclosure,
  Badge,
  Input,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { FiFilter, FiX } from 'react-icons/fi';
import { TableFilters } from '../types';

interface UserFiltersProps {
  filters: TableFilters;
  onFiltersChange: (filters: Partial<TableFilters>) => void;
  onReset: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const { isOpen, onToggle } = useDisclosure();
  
  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== '';
    if (key === 'gender' || key === 'verificationStatus' || key === 'hasAvailability') return value !== 'all';
    if (key === 'ageRange') return value?.min !== undefined || value?.max !== undefined;
    return value !== undefined && value !== null;
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
            <HStack spacing={4} align="end">
              <FormControl>
                <FormLabel fontSize="sm">Gender</FormLabel>
                <Select
                  size="sm"
                  value={filters.gender || 'all'}
                  onChange={(e) => onFiltersChange({ gender: e.target.value as any })}
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Verification Status</FormLabel>
                <Select
                  size="sm"
                  value={filters.verificationStatus || 'all'}
                  onChange={(e) => onFiltersChange({ verificationStatus: e.target.value as any })}
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Has Availability</FormLabel>
                <Select
                  size="sm"
                  value={filters.hasAvailability || 'all'}
                  onChange={(e) => onFiltersChange({ hasAvailability: e.target.value as any })}
                >
                  <option value="all">All</option>
                  <option value="yes">Has Availability</option>
                  <option value="no">No Availability</option>
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
            </HStack>

            <HStack spacing={4} align="end">
              <FormControl flex={1}>
                <FormLabel fontSize="sm">Age Range</FormLabel>
                <HStack>
                  <NumberInput
                    size="sm"
                    value={filters.ageRange?.min || 18}
                    onChange={(_, value) => onFiltersChange({ 
                      ageRange: { 
                        min: value || 18,
                        max: filters.ageRange?.max || 60
                      } 
                    })}
                    min={18}
                    max={100}
                  >
                    <NumberInputField placeholder="Min" />
                  </NumberInput>
                  <Text>-</Text>
                  <NumberInput
                    size="sm"
                    value={filters.ageRange?.max || 60}
                    onChange={(_, value) => onFiltersChange({ 
                      ageRange: { 
                        min: filters.ageRange?.min || 18,
                        max: value || 60
                      } 
                    })}
                    min={18}
                    max={100}
                  >
                    <NumberInputField placeholder="Max" />
                  </NumberInput>
                </HStack>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontSize="sm">Min Profile Score</FormLabel>
                <NumberInput
                  size="sm"
                  value={filters.minProfileScore || 0}
                  onChange={(_, value) => onFiltersChange({ minProfileScore: value })}
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontSize="sm">Salary Range (₹)</FormLabel>
                <HStack>
                  <NumberInput
                    size="sm"
                    value={filters.salaryRange?.min || 0}
                    onChange={(_, value) => onFiltersChange({ 
                      salaryRange: { 
                        min: value || 0,
                        max: filters.salaryRange?.max || 10000000
                      } 
                    })}
                    min={0}
                  >
                    <NumberInputField placeholder="Min" />
                  </NumberInput>
                  <Text>-</Text>
                  <NumberInput
                    size="sm"
                    value={filters.salaryRange?.max || 10000000}
                    onChange={(_, value) => onFiltersChange({ 
                      salaryRange: { 
                        min: filters.salaryRange?.min || 0,
                        max: value || 10000000
                      } 
                    })}
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

export default UserFilters;