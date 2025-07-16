/**
 * Curated Dates Management Container
 * Main container for managing curated dates
 */

import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useCuratedDatesManagementStore } from './store/curatedDatesManagementStore';
import DateStats from './components/DateStats';
import DateFilters from './components/DateFilters';
import DatesTable from './components/DatesTable';
import DateDetailsModal from './components/DateDetailsModal';

const CuratedDatesManagementContainer: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const {
    dates,
    selectedDate,
    stats,
    isLoading,
    error,
    filters,
    pagination,
    setFilters,
    fetchDates,
    fetchStats,
    selectDate,
    updateDateStatus,
    addNote,
    clearError,
    goToPage,
    setPageSize,
    resetFilters,
  } = useCuratedDatesManagementStore();

  // Initial data fetch
  useEffect(() => {
    fetchDates();
    fetchStats();
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      clearError();
    }
  }, [error, toast, clearError]);

  // Open modal when date is selected
  useEffect(() => {
    if (selectedDate) {
      onOpen();
    }
  }, [selectedDate, onOpen]);

  const handleModalClose = () => {
    selectDate(null);
    onClose();
  };

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Curated Dates Management</Heading>
          <Text color="gray.600">
            View and manage all curated dates on the platform
          </Text>
        </Box>

        {/* Stats */}
        <DateStats stats={stats} isLoading={isLoading} />

        {/* Search and Filters */}
        <VStack spacing={4} align="stretch">
          <HStack spacing={4}>
            <InputGroup flex={1} maxW="400px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by name or date ID..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
              />
            </InputGroup>
          </HStack>

          <DateFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
        </VStack>

        {/* Dates Table */}
        <DatesTable
          dates={dates}
          onDateSelect={selectDate}
          selectedDate={selectedDate}
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
        />
      </VStack>

      {/* Date Details Modal */}
      <DateDetailsModal
        date={selectedDate}
        isOpen={isOpen}
        onClose={handleModalClose}
        onUpdateStatus={updateDateStatus}
        onAddNote={addNote}
      />
    </Box>
  );
};

export default CuratedDatesManagementContainer;