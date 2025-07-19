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
  Icon,
  Spinner,
  Divider,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';
import { FiDollarSign, FiUsers, FiHeart, FiCalendar } from 'react-icons/fi';
import { useCurateDatesStore } from './store/curateDatesStore';
import SearchableTable from './components/SearchableTable';
import UserFilters from './components/UserFilters';
import SuggestedMatchesTable from './components/SuggestedMatchesTable';
import SlotSelectionModal from './components/SlotSelectionModal';
import TableWrapper from './components/TableWrapper';
import { User } from './types';

const CurateDatesContainer: React.FC = () => {
  const toast = useToast();
  const { isOpen: isSlotModalOpen, onOpen: onSlotModalOpen, onClose: onSlotModalClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const leftPanelBg = useColorModeValue('white', 'gray.800');
  const rightPanelBg = useColorModeValue('gray.50', 'gray.850');
  const selectedUserBg = useColorModeValue('brand.50', 'brand.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
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

  // Improved highlight for selected row
  const selectedRowBg = useColorModeValue('brand.100', 'brand.800');
  const selectedRowBorder = useColorModeValue('brand.300', 'brand.600');
  
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
            <Box 
              bg={leftPanelBg} 
              borderRadius="xl" 
              p={4}
              h="full"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="sm"
            >
              <VStack spacing={4} align="stretch" h="full">
                {/* Panel Header */}
                <HStack>
                  <Icon as={FiUsers} color="brand.500" boxSize={5} />
                  <Text fontSize="lg" fontWeight="semibold">User Selection</Text>
                </HStack>
                
                <Divider />
                
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
                    onRowClick={(user) => {
                      if (selectedUser?.id !== user.id) {
                        selectUser(user);
                      }
                    }}
                    selectedRow={selectedUser || undefined}
                    searchValue={filters.search}
                    onSearchChange={(value) => setFilters({ search: value })}
                    pageSize={pagination.pageSize}
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    onPageChange={goToPage}
                    onPageSizeChange={setPageSize}
                    isLoading={false}
                    selectedRowBg={selectedRowBg}
                    selectedRowBorder={selectedRowBorder}
                  />
                </TableWrapper>
              </VStack>
            </Box>
          </GridItem>

          {/* Right Column - Match Selection */}
          <GridItem>
            <Box 
              bg={rightPanelBg} 
              borderRadius="xl" 
              p={4}
              h="full"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="sm"
              position="relative"
            >
              <VStack spacing={4} align="stretch" h="full">
                {/* Panel Header */}
                <HStack>
                  <Icon as={FiHeart} color="brand.500" boxSize={5} />
                  <Text fontSize="lg" fontWeight="semibold">Match Selection</Text>
                </HStack>
                
                <Divider />
                
                {/* Selected User Info */}
                {selectedUser && (
                  <Box
                    bg={selectedUserBg}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="brand.200"
                    boxShadow="sm"
                  >
                    <HStack>
                      <Avatar 
                        src={selectedUser.profilePicture} 
                        size="lg" 
                        name={selectedUser.firstName}
                        border="3px solid"
                        borderColor="brand.300"
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          <Badge colorScheme="purple" fontSize="sm">{selectedUser.age}y</Badge>
                          <Badge colorScheme="blue" fontSize="sm">{selectedUser.city}</Badge>
                          <Badge colorScheme="green" fontSize="sm">
                            <HStack spacing={1}>
                              <FiDollarSign size={12} />
                              <Text>{selectedUser.loveTokens} tokens</Text>
                            </HStack>
                          </Badge>
                          {selectedUser.isVerified && (
                            <Badge colorScheme="green" fontSize="sm">✓ Verified</Badge>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                )}

                {/* Suggested Matches with Loading State */}
                {selectedUser && (
                  <Box flex={1} position="relative">
                    {isLoading && (
                      <Flex
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="whiteAlpha.800"
                        zIndex={10}
                        align="center"
                        justify="center"
                        borderRadius="lg"
                      >
                        <VStack spacing={3}>
                          <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="brand.500"
                            size="xl"
                          />
                          <Text color="gray.600">Finding compatible matches...</Text>
                        </VStack>
                      </Flex>
                    )}
                    <SuggestedMatchesTable
                      matches={suggestedMatches}
                      onMatchSelect={(match) => {
                        selectMatch(match);
                        if (!match.hasScheduledDate) {
                          onSlotModalOpen();
                        }
                      }}
                      selectedMatch={selectedMatch}
                      filters={suggestedMatchFilters}
                      onFiltersChange={setSuggestedMatchFilters}
                      isLoading={false}
                    />
                  </Box>
                )}

                {/* Empty State */}
                {!selectedUser && (
                  <Flex
                    flex={1}
                    align="center"
                    justify="center"
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="lg"
                    border="2px dashed"
                    borderColor="gray.300"
                  >
                    <VStack spacing={3}>
                      <Icon as={FiUsers} boxSize={12} color="gray.400" />
                      <Text color="gray.500" fontSize="lg">
                        Select a user from the left panel
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        Then we'll show you compatible matches
                      </Text>
                    </VStack>
                  </Flex>
                )}
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        
        {/* Slot Selection Modal */}
        <SlotSelectionModal
          isOpen={isSlotModalOpen}
          onClose={onSlotModalClose}
          selectedUser={selectedUser}
          match={selectedMatch}
          selectedSlots={selectedSlots}
          onSlotSelect={selectSlot}
          genies={genies}
          selectedGenie={selectedGenie}
          onGenieSelect={selectGenie}
          offlineLocations={offlineLocations}
          selectedLocation={selectedLocation}
          onLocationSelect={selectLocation}
          onCreateDate={() => {
            createCuratedDate();
            onSlotModalClose();
          }}
          isCreating={isLoading}
          curatedDate={curatedDate}
        />
      </VStack>
    </Box>
  );
};

export default CurateDatesContainer;