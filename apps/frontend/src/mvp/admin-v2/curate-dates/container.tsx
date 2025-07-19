/**
 * Curate Dates Container
 * Main container for date curation workflow
 */

import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  useColorModeValue,
  Avatar,
  Badge,
} from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';
import { useCurateDatesStore } from './store/curateDatesStore';
import SearchableTable from './components/SearchableTable';
import UserFilters from './components/UserFilters';
import SuggestedMatchesTable from './components/SuggestedMatchesTable';
import SlotSelector from './components/SlotSelector';
import CurationSummary from './components/CurationSummary';
import TableWrapper from './components/TableWrapper';
import { User } from './types';

const CurateDatesContainer: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const {
    users,
    selectedUser,
    suggestedMatches,
    selectedMatch,
    selectedSlots,
    genies,
    selectedGenie,
    offlineLocations,
    selectedLocation,
    curatedDate,
    isLoading,
    error,
    filters,
    suggestedMatchFilters,
    pagination,
    setFilters,
    setSuggestedMatchFilters,
    fetchUsers,
    selectUser,
    selectMatch,
    selectSlot,
    fetchGenies,
    selectGenie,
    fetchOfflineLocations,
    selectLocation,
    createCuratedDate,
    resetSelection,
    clearError,
    goToPage,
    setPageSize,
  } = useCurateDatesStore();

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchGenies();
    fetchOfflineLocations();
  }, []);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters, fetchUsers]);

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

  // Handle successful date creation
  useEffect(() => {
    if (curatedDate) {
      toast({
        title: 'Date Created Successfully!',
        description: 'Invitations have been sent to both users.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Reset after success
      setTimeout(() => {
        resetSelection();
        fetchUsers(); // Refresh users list
      }, 2000);
    }
  }, [curatedDate, toast, resetSelection, fetchUsers]);

  // Update locations when city changes
  useEffect(() => {
    if (selectedUser?.city) {
      fetchOfflineLocations(selectedUser.city);
    }
  }, [selectedUser?.city, fetchOfflineLocations]);

  // Table columns configuration
  const userColumns = [
    {
      key: 'user',
      label: 'User',
      sortable: true,
      render: (_: any, user: User) => (
        <HStack>
          <Avatar src={user.profilePicture} size="sm" name={user.firstName} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="medium">
              {user.firstName} {user.lastName}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user.email}
            </Text>
          </VStack>
        </HStack>
      ),
    },
    {
      key: 'age',
      label: 'Age',
      sortable: true,
      render: (value: number) => `${value}y`,
      width: '80px',
    },
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      render: (value: string) => (
        <Badge colorScheme={value === 'male' ? 'blue' : 'pink'}>
          {value}
        </Badge>
      ),
      width: '100px',
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
      width: '120px',
    },
    {
      key: 'profileScore',
      label: 'Score',
      sortable: true,
      render: (value: number) => (
        <Badge colorScheme={value > 80 ? 'green' : value > 60 ? 'yellow' : 'red'}>
          {value}%
        </Badge>
      ),
      width: '80px',
    },
    {
      key: 'isVerified',
      label: 'Verified',
      sortable: true,
      render: (value: boolean) => (
        <Badge colorScheme={value ? 'green' : 'gray'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      width: '90px',
    },
    {
      key: 'loveTokens',
      label: 'Tokens',
      sortable: true,
      render: (value: number) => (
        <HStack spacing={1}>
          <FiDollarSign size={12} />
          <Text>{value}</Text>
        </HStack>
      ),
      width: '80px',
    },
    {
      key: 'submittedAvailability',
      label: 'Available',
      sortable: true,
      render: (value: boolean) => (
        <Badge colorScheme={value ? 'green' : 'orange'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      width: '100px',
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Curate Dates</Heading>
          <Text color="gray.600">
            Select users and match them for curated dates
          </Text>
        </Box>

        {/* Main Grid */}
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          templateRows={{ base: 'auto', lg: '1fr' }}
          gap={6}
          h="calc(100vh - 200px)"
        >
          {/* Left Column - User Selection */}
          <GridItem>
            <VStack spacing={4} align="stretch" h="full">
              {/* Filters */}
              <UserFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={() => setFilters({
                  search: '',
                  gender: 'all',
                  verificationStatus: 'all',
                  hasAvailability: 'all'
                })}
              />

              {/* Users Table */}
              <TableWrapper 
                pageSize={pagination.pageSize}
                hasHeader={true}
                hasFooter={true}
                flex={1}
              >
                <SearchableTable
                  data={users}
                  columns={userColumns}
                  title="Select User"
                  subtitle="Choose a user to find compatible matches"
                  onRowClick={selectUser}
                  selectedRow={selectedUser || undefined}
                  searchValue={filters.search}
                  onSearchChange={(value) => setFilters({ search: value })}
                  pageSize={pagination.pageSize}
                  currentPage={pagination.currentPage}
                  totalItems={pagination.totalItems}
                  onPageChange={goToPage}
                  onPageSizeChange={setPageSize}
                  isLoading={isLoading}
                />
              </TableWrapper>
            </VStack>
          </GridItem>

          {/* Right Column - Match Selection */}
          <GridItem>
            <VStack spacing={4} align="stretch" h="full">
              {/* Selected User Info */}
              {selectedUser && (
                <Box
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack>
                    <Avatar src={selectedUser.profilePicture} size="md" name={selectedUser.firstName} />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="bold">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </Text>
                      <HStack spacing={2}>
                        <Badge>{selectedUser.age}y</Badge>
                        <Badge>{selectedUser.city}</Badge>
                        <Badge colorScheme="green">
                          <HStack spacing={1}>
                            <FiDollarSign size={10} />
                            <Text>{selectedUser.loveTokens} tokens</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              )}

              {/* Suggested Matches */}
              {selectedUser && (
                <Box flex={1} overflow="auto">
                  <SuggestedMatchesTable
                    matches={suggestedMatches}
                    onMatchSelect={selectMatch}
                    selectedMatch={selectedMatch}
                    filters={suggestedMatchFilters}
                    onFiltersChange={setSuggestedMatchFilters}
                    isLoading={isLoading}
                  />
                </Box>
              )}

              {/* Loading State */}
              {!selectedUser && (
                <Box
                  bg="white"
                  p={8}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  textAlign="center"
                >
                  <Text color="gray.500">
                    Select a user from the left to see suggested matches
                  </Text>
                </Box>
              )}
            </VStack>
          </GridItem>
        </Grid>

        {/* Bottom Section - Slot Selection and Summary */}
        {selectedMatch && (
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            <GridItem>
              <SlotSelector
                match={selectedMatch}
                selectedSlots={selectedSlots}
                onSlotSelect={selectSlot}
              />
            </GridItem>
            
            <GridItem>
              <CurationSummary
                selectedUser={selectedUser}
                selectedMatch={selectedMatch}
                selectedSlots={selectedSlots}
                genies={genies}
                selectedGenie={selectedGenie}
                onGenieSelect={selectGenie}
                offlineLocations={offlineLocations}
                selectedLocation={selectedLocation}
                onLocationSelect={selectLocation}
                onCreateDate={createCuratedDate}
                isCreating={isLoading}
                curatedDate={curatedDate}
              />
            </GridItem>
          </Grid>
        )}
      </VStack>
    </Box>
  );
};

export default CurateDatesContainer;