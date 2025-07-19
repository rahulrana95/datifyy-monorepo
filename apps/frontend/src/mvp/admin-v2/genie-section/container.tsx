/**
 * Genie Section Container
 * Main container for genie date management
 */

import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Icon,
  Flex,
  Center,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';
import { useGenieSectionStore } from './store/genieSectionStore';
import DateCard from './components/DateCard';
import DateFilters from './components/DateFilters';
import DateDetailsModal from './components/DateDetailsModal';
import RescheduleModal from './components/RescheduleModal';
import SendReminderModal from './components/SendReminderModal';
import GroupedDatesList from './components/GroupedDatesList';
import { GenieDate } from './types';

const GenieSectionContainer: React.FC = () => {
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const statBg = useColorModeValue('white', 'gray.800');
  
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  
  const {
    isOpen: isRescheduleOpen,
    onOpen: onRescheduleOpen,
    onClose: onRescheduleClose,
  } = useDisclosure();
  
  const {
    isOpen: isReminderOpen,
    onOpen: onReminderOpen,
    onClose: onReminderClose,
  } = useDisclosure();

  const {
    dates,
    selectedDate,
    isLoading,
    error,
    filters,
    pagination,
    locations,
    reminderTemplates,
    setFilters,
    fetchDates,
    selectDate,
    updateDateStatus,
    rescheduleDate,
    fetchLocations,
    fetchReminderTemplates,
    sendReminder,
    updateDateNotes,
    clearError,
  } = useGenieSectionStore();

  // Initial data fetch
  useEffect(() => {
    fetchDates();
    fetchReminderTemplates();
  }, []);

  // Fetch dates when filters change
  useEffect(() => {
    fetchDates();
  }, [filters]);

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

  // Calculate stats
  const stats = {
    total: dates.length,
    upcoming: dates.filter(d => d.status === 'upcoming').length,
    completed: dates.filter(d => d.status === 'completed').length,
    cancelled: dates.filter(d => d.status === 'cancelled').length,
    successRate: dates.length > 0 
      ? Math.round((dates.filter(d => d.status === 'completed').length / dates.length) * 100)
      : 0,
  };

  // Filter dates by status for tabs
  const upcomingDates = dates.filter(d => d.status === 'upcoming');
  const ongoingDates = dates.filter(d => d.status === 'ongoing');
  const pastDates = dates.filter(d => ['completed', 'cancelled'].includes(d.status));

  const handleViewDetails = (date: GenieDate) => {
    selectDate(date);
    onDetailsOpen();
  };

  const handleReschedule = (date: GenieDate) => {
    selectDate(date);
    onRescheduleOpen();
  };

  const handleSendReminder = (date: GenieDate) => {
    selectDate(date);
    onReminderOpen();
  };

  const handleUpdateStatus = async (dateId: string, status: GenieDate['status']) => {
    await updateDateStatus(dateId, status);
    toast({
      title: 'Status Updated',
      description: `Date status changed to ${status}`,
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Genie Dashboard</Heading>
          <Text color="gray.600">
            Manage your assigned dates and send reminders
          </Text>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
          <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Total Dates</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
            <StatHelpText>
              <Icon as={FiCalendar} mr={1} />
              All time
            </StatHelpText>
          </Stat>
          
          <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Upcoming</StatLabel>
            <StatNumber color="blue.500">{stats.upcoming}</StatNumber>
            <StatHelpText>
              <Icon as={FiClock} mr={1} />
              Scheduled
            </StatHelpText>
          </Stat>
          
          <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Completed</StatLabel>
            <StatNumber color="green.500">{stats.completed}</StatNumber>
            <StatHelpText>
              <Icon as={FiCheckCircle} mr={1} />
              Successful
            </StatHelpText>
          </Stat>
          
          <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Cancelled</StatLabel>
            <StatNumber color="red.500">{stats.cancelled}</StatNumber>
            <StatHelpText>
              <Icon as={FiXCircle} mr={1} />
              Failed
            </StatHelpText>
          </Stat>
          
          <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel>Success Rate</StatLabel>
            <StatNumber>{stats.successRate}%</StatNumber>
            <StatHelpText>
              <StatArrow type={stats.successRate > 70 ? 'increase' : 'decrease'} />
              <Icon as={FiTrendingUp} mr={1} />
              Performance
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <DateFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => setFilters({
            status: 'all',
            search: '',
            mode: 'all',
            verificationStatus: 'all',
          })}
        />

        {/* Dates Tabs */}
        <Tabs>
          <TabList>
            <Tab>
              <HStack>
                <Text>Upcoming</Text>
                <Badge colorScheme="blue">{upcomingDates.length}</Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Text>Ongoing</Text>
                <Badge colorScheme="green">{ongoingDates.length}</Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Text>Past Dates</Text>
                <Badge>{pastDates.length}</Badge>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Upcoming Dates */}
            <TabPanel px={0}>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="brand.500" />
                </Center>
              ) : upcomingDates.length === 0 ? (
                <Center py={10}>
                  <Text color="gray.500">No upcoming dates</Text>
                </Center>
              ) : (
                <GroupedDatesList
                  dates={upcomingDates}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleReschedule}
                  onSendReminder={handleSendReminder}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </TabPanel>

            {/* Ongoing Dates */}
            <TabPanel px={0}>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="brand.500" />
                </Center>
              ) : ongoingDates.length === 0 ? (
                <Center py={10}>
                  <Text color="gray.500">No ongoing dates</Text>
                </Center>
              ) : (
                <GroupedDatesList
                  dates={ongoingDates}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleReschedule}
                  onSendReminder={handleSendReminder}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </TabPanel>

            {/* Past Dates */}
            <TabPanel px={0}>
              {isLoading ? (
                <Center py={10}>
                  <Spinner size="xl" color="brand.500" />
                </Center>
              ) : pastDates.length === 0 ? (
                <Center py={10}>
                  <Text color="gray.500">No past dates</Text>
                </Center>
              ) : (
                <GroupedDatesList
                  dates={pastDates}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleReschedule}
                  onSendReminder={handleSendReminder}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modals */}
      <DateDetailsModal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        date={selectedDate}
        onUpdateNotes={updateDateNotes}
        onReschedule={handleReschedule}
        onSendReminder={handleSendReminder}
      />

      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={onRescheduleClose}
        date={selectedDate}
        locations={locations}
        onSearchLocations={fetchLocations}
        onReschedule={async (request) => {
          await rescheduleDate(request);
          onRescheduleClose();
          toast({
            title: 'Date Rescheduled',
            description: 'The date has been rescheduled successfully',
            status: 'success',
            duration: 3000,
          });
        }}
      />

      <SendReminderModal
        isOpen={isReminderOpen}
        onClose={onReminderClose}
        date={selectedDate}
        templates={reminderTemplates}
        onSendReminder={async (request) => {
          await sendReminder(request);
          onReminderClose();
          toast({
            title: 'Reminder Sent',
            description: 'Reminder has been sent successfully',
            status: 'success',
            duration: 3000,
          });
        }}
      />
    </Box>
  );
};

export default GenieSectionContainer;