/**
 * DateDetailsModal Component
 * Display complete date details with user verification info
 */

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
  Icon,
  Grid,
  GridItem,
  Textarea,
  useToast,
  Table,
  Tbody,
  Tr,
  Td,
  Link,
  Flex,
  Progress,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiXCircle,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiBook,
  FiLinkedin,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiVideo,
  FiSave,
  FiEdit,
  FiExternalLink,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { GenieDate, UserDetails, VerificationStatus } from '../types';

interface DateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: GenieDate | null;
  onUpdateNotes: (dateId: string, notes: string) => void;
  onReschedule: (date: GenieDate) => void;
  onSendReminder: (date: GenieDate) => void;
}

const DateDetailsModal: React.FC<DateDetailsModalProps> = ({
  isOpen,
  onClose,
  date,
  onUpdateNotes,
  onReschedule,
  onSendReminder,
}) => {
  const [notes, setNotes] = useState(date?.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!date) return null;

  const handleSaveNotes = () => {
    onUpdateNotes(date.id, notes);
    setIsEditingNotes(false);
    toast({
      title: 'Notes updated',
      status: 'success',
      duration: 2000,
    });
  };

  const renderVerificationStatus = (status: VerificationStatus) => {
    const items = [
      { label: 'Phone', verified: status.phoneVerified, icon: FiPhone },
      { label: 'Email', verified: status.emailVerified, icon: FiMail },
      { label: 'Office Email', verified: status.officeEmailVerified, icon: FiBriefcase },
      { label: 'ID', verified: status.idVerified, icon: FiCheckCircle },
      { label: 'Work', verified: status.workVerified, icon: FiBriefcase },
      { label: 'LinkedIn', verified: status.linkedinVerified, icon: FiLinkedin },
    ];

    if (status.collegeVerified !== undefined) {
      items.push({ label: 'College', verified: status.collegeVerified, icon: FiBook });
    }

    return (
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {items.map((item) => (
          <HStack key={item.label} spacing={2}>
            <Icon
              as={item.verified ? FiCheckCircle : FiXCircle}
              color={item.verified ? 'green.500' : 'red.500'}
            />
            <Text fontSize="sm">{item.label}</Text>
          </HStack>
        ))}
      </Grid>
    );
  };

  const renderUserDetails = (user: UserDetails, title: string) => (
    <Box>
      <Text fontWeight="bold" mb={3}>{title}</Text>
      <VStack align="stretch" spacing={4}>
        {/* Basic Info */}
        <HStack spacing={4}>
          <Avatar src={user.profilePicture} size="xl" name={user.firstName} />
          <VStack align="start" spacing={2} flex={1}>
            <Text fontSize="lg" fontWeight="medium">
              {user.firstName} {user.lastName}
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              <Badge>{user.age}y</Badge>
              <Badge>{user.gender}</Badge>
              <Badge>{user.city}</Badge>
              <Badge colorScheme="purple">Score: {user.profileScore}%</Badge>
            </HStack>
          </VStack>
        </HStack>

        {/* Profile Score */}
        <Box>
          <HStack justify="space-between" mb={1}>
            <Text fontSize="sm" fontWeight="medium">Profile Score</Text>
            <Text fontSize="sm">{user.profileScore}%</Text>
          </HStack>
          <Progress value={user.profileScore} colorScheme="purple" size="sm" />
        </Box>

        {/* Contact Info */}
        <Table size="sm" variant="simple">
          <Tbody>
            <Tr>
              <Td px={0}>
                <HStack>
                  <Icon as={FiMail} />
                  <Text>Email</Text>
                </HStack>
              </Td>
              <Td px={0}>{user.email}</Td>
            </Tr>
            <Tr>
              <Td px={0}>
                <HStack>
                  <Icon as={FiPhone} />
                  <Text>Phone</Text>
                </HStack>
              </Td>
              <Td px={0}>{user.phone}</Td>
            </Tr>
            <Tr>
              <Td px={0}>
                <HStack>
                  <Icon as={FiBriefcase} />
                  <Text>Occupation</Text>
                </HStack>
              </Td>
              <Td px={0}>
                {user.occupation}
                {user.company && ` at ${user.company}`}
                {user.college && ` at ${user.college}`}
              </Td>
            </Tr>
          </Tbody>
        </Table>

        {/* Verification Status */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Verification Status</Text>
          {renderVerificationStatus(user.verificationStatus)}
        </Box>

        {/* Additional Info */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Additional Information</Text>
          <VStack align="stretch" spacing={1}>
            <Text fontSize="sm">Height: {user.height}</Text>
            <Text fontSize="sm">Religion: {user.religion}</Text>
            <Text fontSize="sm">Drinking: {user.drinking}</Text>
            <Text fontSize="sm">Smoking: {user.smoking}</Text>
            <Text fontSize="sm">Languages: {user.languages.join(', ')}</Text>
            <Text fontSize="sm">Interests: {user.interests.join(', ')}</Text>
          </VStack>
        </Box>

        {/* Bio */}
        {user.bio && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>Bio</Text>
            <Text fontSize="sm" color="gray.600">{user.bio}</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <HStack justify="space-between" pr={8}>
            <Text>Date Details</Text>
            <Badge colorScheme={
              date.status === 'upcoming' ? 'blue' :
              date.status === 'ongoing' ? 'green' :
              date.status === 'completed' ? 'purple' :
              date.status === 'cancelled' ? 'red' : 'orange'
            } fontSize="md">
              {date.status.toUpperCase()}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Date Info */}
            <Box bg={useColorModeValue('gray.50', 'gray.900')} p={4} borderRadius="lg">
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <GridItem>
                  <HStack>
                    <Icon as={FiCalendar} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.500">Date</Text>
                      <Text fontWeight="medium">
                        {format(new Date(date.scheduledDate), 'EEEE, MMM d, yyyy')}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>
                
                <GridItem>
                  <HStack>
                    <Icon as={FiClock} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.500">Time</Text>
                      <Text fontWeight="medium">
                        {date.timeSlot.startTime} - {date.timeSlot.endTime}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>
                
                <GridItem>
                  <HStack>
                    <Icon as={date.mode === 'online' ? FiVideo : FiMapPin} color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" color="gray.500">Location</Text>
                      {date.mode === 'online' ? (
                        <Link href={date.meetingLink} isExternal color="brand.500">
                          <HStack>
                            <Text>Online Meeting</Text>
                            <FiExternalLink size={12} />
                          </HStack>
                        </Link>
                      ) : (
                        <Link href={date.location?.googleMapsUrl} isExternal>
                          <HStack>
                            <Text>{date.location?.name}</Text>
                            <FiExternalLink size={12} />
                          </HStack>
                        </Link>
                      )}
                    </VStack>
                  </HStack>
                </GridItem>
              </Grid>
            </Box>

            {/* Users */}
            <Tabs>
              <TabList>
                <Tab>User 1: {date.user1.firstName}</Tab>
                <Tab>User 2: {date.user2.firstName}</Tab>
                <Tab>Notes & Feedback</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {renderUserDetails(date.user1, 'User 1 Details')}
                </TabPanel>
                
                <TabPanel>
                  {renderUserDetails(date.user2, 'User 2 Details')}
                </TabPanel>
                
                <TabPanel>
                  <VStack align="stretch" spacing={4}>
                    {/* Genie Notes */}
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium">Genie Notes</Text>
                        {!isEditingNotes && (
                          <Button
                            size="sm"
                            leftIcon={<FiEdit />}
                            variant="ghost"
                            onClick={() => setIsEditingNotes(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </HStack>
                      
                      {isEditingNotes ? (
                        <VStack align="stretch" spacing={2}>
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this date..."
                            rows={4}
                          />
                          <HStack>
                            <Button
                              size="sm"
                              colorScheme="brand"
                              leftIcon={<FiSave />}
                              onClick={handleSaveNotes}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setNotes(date.notes || '');
                                setIsEditingNotes(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        <Text color="gray.600">
                          {date.notes || 'No notes added yet.'}
                        </Text>
                      )}
                    </Box>

                    {/* Feedback */}
                    {date.feedback && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="medium" mb={2}>User Feedback</Text>
                          <VStack align="stretch" spacing={2}>
                            {date.feedback.user1 && (
                              <Box p={3} bg="blue.50" borderRadius="md">
                                <Text fontSize="sm" fontWeight="medium" mb={1}>
                                  {date.user1.firstName}:
                                </Text>
                                <Text fontSize="sm">{date.feedback.user1}</Text>
                              </Box>
                            )}
                            {date.feedback.user2 && (
                              <Box p={3} bg="purple.50" borderRadius="md">
                                <Text fontSize="sm" fontWeight="medium" mb={1}>
                                  {date.user2.firstName}:
                                </Text>
                                <Text fontSize="sm">{date.feedback.user2}</Text>
                              </Box>
                            )}
                          </VStack>
                        </Box>
                      </>
                    )}

                    {/* Reminder Status */}
                    <Divider />
                    <Box>
                      <Text fontWeight="medium" mb={2}>Reminder Status</Text>
                      <HStack spacing={4}>
                        <HStack>
                          <Icon
                            as={date.remindersSent.user1 ? FiCheckCircle : FiXCircle}
                            color={date.remindersSent.user1 ? 'green.500' : 'gray.400'}
                          />
                          <Text fontSize="sm">User 1</Text>
                        </HStack>
                        <HStack>
                          <Icon
                            as={date.remindersSent.user2 ? FiCheckCircle : FiXCircle}
                            color={date.remindersSent.user2 ? 'green.500' : 'gray.400'}
                          />
                          <Text fontSize="sm">User 2</Text>
                        </HStack>
                      </HStack>
                      {date.remindersSent.lastSentAt && (
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Last sent: {format(new Date(date.remindersSent.lastSentAt), 'MMM d, h:mm a')}
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <HStack spacing={3}>
            {date.status === 'upcoming' && (
              <>
                <Button
                  colorScheme="orange"
                  variant="outline"
                  onClick={() => {
                    onReschedule(date);
                    onClose();
                  }}
                >
                  Reschedule
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onSendReminder(date);
                    onClose();
                  }}
                >
                  Send Reminder
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateDetailsModal;