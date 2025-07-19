import React, { useState } from 'react';
import {
  Box,
  HStack,
  VStack,
  Select,
  Input,
  Button,
  Text,
  Badge,
  Collapse,
  IconButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import {
  FiFilter,
  FiX,
  FiCalendar,
  FiSearch,
} from 'react-icons/fi';
import { VerificationFilter } from '../types';

interface VerificationFiltersProps {
  filters: VerificationFilter;
  onFiltersChange: (filters: VerificationFilter) => void;
  onReset: () => void;
  activeFilterCount: number;
}

const VerificationFilters: React.FC<VerificationFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  activeFilterCount,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const [localFilters, setLocalFilters] = useState<VerificationFilter>(filters);

  const verificationTypes = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'officialEmail', label: 'Official Email' },
    { value: 'aadharId', label: 'Aadhar ID' },
    { value: 'collegeId', label: 'College ID' },
    { value: 'workId', label: 'Work ID' },
    { value: 'collegeMarksheet', label: 'College Marksheet' },
  ];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleRemoveFilter = (filterType: keyof VerificationFilter) => {
    const newFilters = { ...localFilters };
    delete newFilters[filterType];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const getActiveFilters = () => {
    const active: { type: string; value: string }[] = [];
    
    if (localFilters.userType && localFilters.userType !== 'all') {
      active.push({ type: 'userType', value: localFilters.userType });
    }
    if (localFilters.verificationStatus && localFilters.verificationStatus !== 'all') {
      active.push({ type: 'verificationStatus', value: localFilters.verificationStatus });
    }
    if (localFilters.specificVerification) {
      active.push({ 
        type: 'specificVerification', 
        value: verificationTypes.find(t => t.value === localFilters.specificVerification)?.label || localFilters.specificVerification 
      });
    }
    if (localFilters.city) {
      active.push({ type: 'city', value: localFilters.city });
    }
    if (localFilters.country) {
      active.push({ type: 'country', value: localFilters.country });
    }

    return active;
  };

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        {/* Filter Header */}
        <HStack justify="space-between">
          <HStack>
            <IconButton
              icon={<FiFilter />}
              aria-label="Toggle filters"
              variant="ghost"
              onClick={onToggle}
            />
            <Text fontWeight="medium">Filters</Text>
            {activeFilterCount > 0 && (
              <Badge colorScheme="brand" borderRadius="full">
                {activeFilterCount}
              </Badge>
            )}
          </HStack>
          {activeFilterCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<FiX />}
              onClick={() => {
                setLocalFilters({});
                onReset();
              }}
            >
              Clear all
            </Button>
          )}
        </HStack>

        {/* Active Filters */}
        {getActiveFilters().length > 0 && (
          <Wrap spacing={2}>
            {getActiveFilters().map((filter, index) => (
              <WrapItem key={index}>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                >
                  <TagLabel>{filter.value}</TagLabel>
                  <TagCloseButton
                    onClick={() => handleRemoveFilter(filter.type as keyof VerificationFilter)}
                  />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}

        {/* Filter Controls */}
        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={4} align="stretch" pt={4}>
            <HStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">User Type</FormLabel>
                <Select
                  size="sm"
                  value={localFilters.userType || 'all'}
                  onChange={(e) => setLocalFilters({ ...localFilters, userType: e.target.value as any })}
                >
                  <option value="all">All Users</option>
                  <option value="college_student">College Students</option>
                  <option value="working_professional">Working Professionals</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Verification Status</FormLabel>
                <Select
                  size="sm"
                  value={localFilters.verificationStatus || 'all'}
                  onChange={(e) => setLocalFilters({ ...localFilters, verificationStatus: e.target.value as any })}
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="not_submitted">Not Submitted</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Specific Verification</FormLabel>
                <Select
                  size="sm"
                  placeholder="Select verification"
                  value={localFilters.specificVerification || ''}
                  onChange={(e) => setLocalFilters({ 
                    ...localFilters, 
                    specificVerification: e.target.value as any || undefined 
                  })}
                >
                  <option value="">All Verifications</option>
                  {verificationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">City</FormLabel>
                <Input
                  size="sm"
                  placeholder="Enter city"
                  value={localFilters.city || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Country</FormLabel>
                <Input
                  size="sm"
                  placeholder="Enter country"
                  value={localFilters.country || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, country: e.target.value })}
                />
              </FormControl>
            </HStack>

            <HStack justify="flex-end" pt={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLocalFilters(filters)}
              >
                Reset
              </Button>
              <Button
                size="sm"
                colorScheme="brand"
                leftIcon={<FiSearch />}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </HStack>
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
};

export default VerificationFilters;