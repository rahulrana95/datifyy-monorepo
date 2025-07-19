import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Text,
  useToast,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from '@chakra-ui/react';
import {
  FiMail,
  FiDownload,
  FiRefreshCw,
  FiSettings,
  FiFilter,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import VerificationTable from './components/VerificationTable';
import VerificationFilters from './components/VerificationFilters';
import VerificationStats from './components/VerificationStats';
import BulkEmailModal from './components/BulkEmailModal';
import verificationService from './services/VerificationService';
import { 
  UserVerification, 
  VerificationFilter, 
  VerificationStats as VerificationStatsType,
  VerificationStatus 
} from './types';
import { Pagination } from '../../common/Pagination';

const VerificationPage: React.FC = () => {
  const [users, setUsers] = useState<UserVerification[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<VerificationFilter>({});
  const [stats, setStats] = useState<VerificationStatsType>({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingVerifications: 0,
    rejectedVerifications: 0,
    byType: {
      phone: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      email: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      officialEmail: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      aadharId: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      collegeId: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      workId: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      collegeMarksheet: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const pageSize = 20;

  // Load data on component mount and when filters/page change
  useEffect(() => {
    loadUsers();
    loadStats();
  }, [currentPage, filters]);

  // Update active filter count
  useEffect(() => {
    let count = 0;
    if (filters.userType && filters.userType !== 'all') count++;
    if (filters.verificationStatus && filters.verificationStatus !== 'all') count++;
    if (filters.specificVerification) count++;
    if (filters.city) count++;
    if (filters.country) count++;
    if (filters.dateRange) count++;
    setActiveFilterCount(count);
  }, [filters]);

  // Enable mock data by default for development
  useEffect(() => {
    localStorage.setItem('useVerificationMockData', 'true');
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { response, error } = await verificationService.getUsers(
        currentPage,
        pageSize,
        filters
      );
      
      if (response) {
        setUsers(response.users);
        setTotalPages(response.totalPages);
        setTotalUsers(response.total);
      } else {
        toast({
          title: 'Error loading users',
          description: error?.message || 'Failed to load users',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    setIsStatsLoading(true);
    try {
      const { response, error } = await verificationService.getStats();
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(users.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUpdateStatus = async (
    userId: string, 
    type: keyof UserVerification['verificationStatus'], 
    status: VerificationStatus
  ) => {
    try {
      const { response, error } = await verificationService.updateVerificationStatus({
        userId,
        verificationType: type,
        status,
        verifiedBy: 'admin', // In real app, get from auth context
        verifiedAt: new Date().toISOString(),
      });

      if (response) {
        toast({
          title: 'Status updated',
          description: `${type} verification marked as ${status}`,
          status: 'success',
          duration: 3000,
        });
        // Reload data
        loadUsers();
        loadStats();
      } else {
        toast({
          title: 'Update failed',
          description: error?.message || 'Failed to update status',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleBulkEmail = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select users to send email',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    onEmailOpen();
  };

  const handleExport = async () => {
    try {
      const { response, error } = await verificationService.exportUsers(filters);
      if (response) {
        window.open(response.downloadUrl, '_blank');
        toast({
          title: 'Export started',
          description: 'Your export will download shortly',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  const getUnverifiedTypes = useCallback(() => {
    const types = new Set<string>();
    
    selectedUsers.forEach(userId => {
      const user = users.find(u => u.id === userId);
      if (user) {
        Object.entries(user.verificationStatus).forEach(([type, status]) => {
          if (status && status !== 'verified') {
            types.add(type);
          }
        });
      }
    });
    
    return Array.from(types);
  }, [selectedUsers, users]);

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="lg">User Verification</Heading>
            <Text color="gray.600">
              Manage user verification documents and status
            </Text>
          </VStack>
          <HStack spacing={3}>
            <Button
              leftIcon={<FiRefreshCw />}
              variant="outline"
              onClick={() => {
                loadUsers();
                loadStats();
              }}
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiSettings />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<FiDownload />} onClick={handleExport}>
                  Export Data
                </MenuItem>
                <MenuItem icon={<FiFilter />}>
                  Save Current Filters
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>

        {/* Stats */}
        <VerificationStats stats={stats} isLoading={isStatsLoading} />

        <Divider />

        {/* Main Content */}
        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab>
              All Users
              <Badge ml={2} colorScheme="gray">
                {totalUsers}
              </Badge>
            </Tab>
            <Tab>
              Pending Review
              <Badge ml={2} colorScheme="yellow">
                {stats.pendingVerifications}
              </Badge>
            </Tab>
            <Tab>
              Recently Verified
              <Badge ml={2} colorScheme="green">
                {stats.verifiedUsers}
              </Badge>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {/* Filters */}
                <VerificationFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={() => {
                    setFilters({});
                    setCurrentPage(1);
                  }}
                  activeFilterCount={activeFilterCount}
                />

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <HStack
                    p={3}
                    bg="blue.50"
                    borderRadius="md"
                    justify="space-between"
                  >
                    <Text fontSize="sm">
                      {selectedUsers.length} users selected
                    </Text>
                    <HStack>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUsers([])}
                      >
                        Clear Selection
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<FiMail />}
                        colorScheme="brand"
                        onClick={handleBulkEmail}
                      >
                        Send Email
                      </Button>
                    </HStack>
                  </HStack>
                )}

                {/* Users Table */}
                <Box bg="white" borderRadius="lg" overflow="hidden" boxShadow="sm">
                  <VerificationTable
                    users={users}
                    selectedUsers={selectedUsers}
                    onUserSelect={handleUserSelect}
                    onSelectAll={handleSelectAll}
                    onUpdateStatus={handleUpdateStatus}
                    onSendEmail={(userIds) => {
                      setSelectedUsers(userIds);
                      onEmailOpen();
                    }}
                    isLoading={isLoading}
                  />
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                  <HStack justify="center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </HStack>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <Text>Pending Review content coming soon...</Text>
            </TabPanel>

            <TabPanel>
              <Text>Recently Verified content coming soon...</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Bulk Email Modal */}
        <BulkEmailModal
          isOpen={isEmailOpen}
          onClose={() => {
            onEmailClose();
            setSelectedUsers([]);
          }}
          selectedUserIds={selectedUsers}
          unverifiedTypes={getUnverifiedTypes()}
        />
      </VStack>
    </Box>
  );
};

export default VerificationPage;