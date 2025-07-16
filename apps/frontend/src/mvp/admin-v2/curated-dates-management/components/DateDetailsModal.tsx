/**
 * DateDetailsModal Component
 * Modal for viewing and managing date details
 */

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  Button,
  Divider,
  SimpleGrid,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
  Progress,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { 
  FiMapPin, 
  FiVideo, 
  FiCalendar, 
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiExternalLink,
  FiStar,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { CuratedDateDetails } from '../types';
import DateStatusBadge from './DateStatusBadge';

interface DateDetailsModalProps {
  date: CuratedDateDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (dateId: string, status: CuratedDateDetails['status'], reason?: string) => Promise<void>;
  onAddNote: (dateId: string, note: string) => Promise<void>;
}

const DateDetailsModal: React.FC<DateDetailsModalProps> = ({
  date,
  isOpen,
  onClose,
  onUpdateStatus,
  onAddNote,
}) => {
  const [newStatus, setNewStatus] = useState<CuratedDateDetails['status'] | ''>('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  if (!date) return null;

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(
        date.id, 
        newStatus, 
        newStatus === 'cancelled' ? cancellationReason : undefined
      );
      toast({
        title: 'Status updated successfully',
        status: 'success',
        duration: 3000,
      });
      setNewStatus('');
      setCancellationReason('');
    } catch (error) {
      toast({
        title: 'Failed to update status',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;

    setIsUpdating(true);
    try {
      await onAddNote(date.id, note);
      toast({
        title: 'Note added successfully',
        status: 'success',
        duration: 3000,
      });
      setNote('');
    } catch (error) {
      toast({
        title: 'Failed to add note',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Date Details - {date.dateId}</Text>
            <DateStatusBadge status={date.status} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Users</Tab>
              <Tab>Feedback</Tab>
              <Tab>Management</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500">Date Type</Text>
                      <Badge colorScheme={date.dateType === 'online' ? 'blue' : 'green'} mt={1}>
                        <HStack spacing={1}>
                          {date.dateType === 'online' ? <FiVideo size={10} /> : <FiMapPin size={10} />}
                          <Text>{date.dateType}</Text>
                        </HStack>
                      </Badge>
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" color="gray.500">Match Score</Text>
                      <CircularProgress value={date.matchScore} color="brand.500" size="60px" mt={1}>
                        <CircularProgressLabel>{date.matchScore}%</CircularProgressLabel>
                      </CircularProgress>
                    </Box>

                    <Box>
                      <HStack spacing={1} color="gray.500" mb={1}>
                        <FiCalendar size={14} />
                        <Text fontSize="sm">Scheduled Date</Text>
                      </HStack>
                      <Text fontWeight="medium">
                        {format(new Date(date.scheduledAt), 'MMMM dd, yyyy')}
                      </Text>
                    </Box>

                    <Box>
                      <HStack spacing={1} color="gray.500" mb={1}>
                        <FiClock size={14} />
                        <Text fontSize="sm">Time</Text>
                      </HStack>
                      <Text fontWeight="medium">
                        {format(new Date(date.scheduledAt), 'hh:mm a')}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {date.location && (
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Location</Text>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{date.location.name}</Text>
                            <Text fontSize="sm" color="gray.600">{date.location.address}</Text>
                            <Text fontSize="sm" color="gray.600">{date.location.city}</Text>
                          </VStack>
                          {date.location.mapUrl && (
                            <Link href={date.location.mapUrl} isExternal>
                              <Button size="sm" leftIcon={<FiExternalLink />}>
                                View Map
                              </Button>
                            </Link>
                          )}
                        </HStack>
                      </Box>
                    </Box>
                  )}

                  {date.genie && (
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>Assigned Genie</Text>
                      <Box p={3} bg="gray.50" borderRadius="md">
                        <HStack>
                          <Avatar size="sm" name={date.genie.name} />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium">{date.genie.name}</Text>
                            <Text fontSize="sm" color="gray.600">{date.genie.email}</Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </Box>
                  )}

                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2}>Timeline</Text>
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Created</Text>
                        <Text fontSize="sm" color="gray.600">
                          {format(new Date(date.createdAt), 'MMM dd, yyyy hh:mm a')}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Last Updated</Text>
                        <Text fontSize="sm" color="gray.600">
                          {format(new Date(date.lastUpdatedAt), 'MMM dd, yyyy hh:mm a')}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Users Tab */}
              <TabPanel>
                <SimpleGrid columns={2} spacing={6}>
                  {/* User 1 */}
                  <Box p={4} bg="gray.50" borderRadius="lg">
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Avatar src={date.user1.profilePicture} size="lg" name={date.user1.firstName} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">
                            {date.user1.firstName} {date.user1.lastName}
                          </Text>
                          <Badge>{date.user1.age} years</Badge>
                        </VStack>
                      </HStack>
                      
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <FiMail size={14} />
                          <Text fontSize="sm">{date.user1.email}</Text>
                        </HStack>
                        <HStack>
                          <FiMapPin size={14} />
                          <Text fontSize="sm">{date.user1.city}</Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Box>

                  {/* User 2 */}
                  <Box p={4} bg="gray.50" borderRadius="lg">
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Avatar src={date.user2.profilePicture} size="lg" name={date.user2.firstName} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">
                            {date.user2.firstName} {date.user2.lastName}
                          </Text>
                          <Badge>{date.user2.age} years</Badge>
                        </VStack>
                      </HStack>
                      
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <FiMail size={14} />
                          <Text fontSize="sm">{date.user2.email}</Text>
                        </HStack>
                        <HStack>
                          <FiMapPin size={14} />
                          <Text fontSize="sm">{date.user2.city}</Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Box>
                </SimpleGrid>
              </TabPanel>

              {/* Feedback Tab */}
              <TabPanel>
                {date.feedback ? (
                  <SimpleGrid columns={2} spacing={6}>
                    {/* User 1 Feedback */}
                    <Box p={4} bg="gray.50" borderRadius="lg">
                      <VStack spacing={3} align="stretch">
                        <HStack>
                          <Avatar src={date.user1.profilePicture} size="sm" />
                          <Text fontWeight="bold">{date.user1.firstName}'s Feedback</Text>
                        </HStack>
                        
                        <HStack>
                          <Text fontSize="sm" color="gray.500">Rating:</Text>
                          <HStack spacing={1}>
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={16}
                                fill={i < date.feedback!.user1.rating ? 'gold' : 'transparent'}
                                color={i < date.feedback!.user1.rating ? 'gold' : 'gray'}
                              />
                            ))}
                          </HStack>
                        </HStack>

                        <HStack>
                          <Text fontSize="sm" color="gray.500">Interested:</Text>
                          <Badge colorScheme={date.feedback!.user1.interested ? 'green' : 'red'}>
                            {date.feedback!.user1.interested ? 'Yes' : 'No'}
                          </Badge>
                        </HStack>

                        {date.feedback.user1.comments && (
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={1}>Comments:</Text>
                            <Text fontSize="sm">{date.feedback.user1.comments}</Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>

                    {/* User 2 Feedback */}
                    <Box p={4} bg="gray.50" borderRadius="lg">
                      <VStack spacing={3} align="stretch">
                        <HStack>
                          <Avatar src={date.user2.profilePicture} size="sm" />
                          <Text fontWeight="bold">{date.user2.firstName}'s Feedback</Text>
                        </HStack>
                        
                        <HStack>
                          <Text fontSize="sm" color="gray.500">Rating:</Text>
                          <HStack spacing={1}>
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={16}
                                fill={i < date.feedback!.user2.rating ? 'gold' : 'transparent'}
                                color={i < date.feedback!.user2.rating ? 'gold' : 'gray'}
                              />
                            ))}
                          </HStack>
                        </HStack>

                        <HStack>
                          <Text fontSize="sm" color="gray.500">Interested:</Text>
                          <Badge colorScheme={date.feedback!.user2.interested ? 'green' : 'red'}>
                            {date.feedback!.user2.interested ? 'Yes' : 'No'}
                          </Badge>
                        </HStack>

                        {date.feedback.user2.comments && (
                          <Box>
                            <Text fontSize="sm" color="gray.500" mb={1}>Comments:</Text>
                            <Text fontSize="sm">{date.feedback.user2.comments}</Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No feedback received yet</Text>
                  </Box>
                )}
              </TabPanel>

              {/* Management Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Update Status */}
                  <Box>
                    <Text fontWeight="bold" mb={3}>Update Status</Text>
                    <FormControl>
                      <FormLabel fontSize="sm">New Status</FormLabel>
                      <Select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as any)}
                        placeholder="Select new status"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </Select>
                    </FormControl>

                    {newStatus === 'cancelled' && (
                      <FormControl mt={3}>
                        <FormLabel fontSize="sm">Cancellation Reason</FormLabel>
                        <Textarea
                          value={cancellationReason}
                          onChange={(e) => setCancellationReason(e.target.value)}
                          placeholder="Enter reason for cancellation"
                          size="sm"
                        />
                      </FormControl>
                    )}

                    <Button
                      mt={3}
                      colorScheme="brand"
                      size="sm"
                      onClick={handleStatusUpdate}
                      isLoading={isUpdating}
                      isDisabled={!newStatus}
                    >
                      Update Status
                    </Button>
                  </Box>

                  <Divider />

                  {/* Notes */}
                  <Box>
                    <Text fontWeight="bold" mb={3}>Notes</Text>
                    {date.notes && (
                      <Box p={3} bg="gray.50" borderRadius="md" mb={3}>
                        <Text fontSize="sm">{date.notes}</Text>
                      </Box>
                    )}
                    
                    <FormControl>
                      <FormLabel fontSize="sm">Add/Update Note</FormLabel>
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter note"
                        size="sm"
                      />
                    </FormControl>
                    
                    <Button
                      mt={3}
                      colorScheme="brand"
                      size="sm"
                      onClick={handleAddNote}
                      isLoading={isUpdating}
                      isDisabled={!note.trim()}
                    >
                      Save Note
                    </Button>
                  </Box>

                  {date.cancellationReason && (
                    <>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" mb={2}>Cancellation Reason</Text>
                        <Box p={3} bg="red.50" borderRadius="md">
                          <Text fontSize="sm">{date.cancellationReason}</Text>
                        </Box>
                      </Box>
                    </>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateDetailsModal;