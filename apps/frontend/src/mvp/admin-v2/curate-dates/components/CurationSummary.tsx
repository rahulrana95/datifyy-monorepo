/**
 * CurationSummary Component
 * Shows selected users, slots, genie, and location for date curation
 */

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  Select,
  FormControl,
  FormLabel,
  Badge,
  Avatar,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Icon,
  Link,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { 
  FiUser, 
  FiMapPin, 
  FiDollarSign, 
  FiCalendar,
  FiVideo,
  FiSend,
  FiExternalLink,
  FiEdit2
} from 'react-icons/fi';
import { format } from 'date-fns';
import { 
  User, 
  SuggestedMatch, 
  TimeSlot, 
  Genie, 
  OfflineLocation,
  CuratedDate 
} from '../types';

interface CurationSummaryProps {
  selectedUser: User | null;
  selectedMatch: SuggestedMatch | null;
  selectedSlots: {
    online: TimeSlot | null;
    offline: TimeSlot | null;
  };
  genies: Genie[];
  selectedGenie: Genie | null;
  onGenieSelect: (genie: Genie | null) => void;
  offlineLocations: OfflineLocation[];
  selectedLocation: OfflineLocation | null;
  onLocationSelect: (location: OfflineLocation | null) => void;
  onCreateDate: () => void;
  isCreating: boolean;
  curatedDate: CuratedDate | null;
  onEditSlots?: () => void;
}

const CurationSummary: React.FC<CurationSummaryProps> = ({
  selectedUser,
  selectedMatch,
  selectedSlots,
  genies,
  selectedGenie,
  onGenieSelect,
  offlineLocations,
  selectedLocation,
  onLocationSelect,
  onCreateDate,
  isCreating,
  curatedDate,
  onEditSlots,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const activeSlot = selectedSlots.online || selectedSlots.offline;
  const isOfflineDate = activeSlot?.mode === 'offline';

  // Check if both users have enough tokens
  const hasEnoughTokens = 
    selectedUser && 
    selectedMatch && 
    selectedUser.loveTokens >= 10 && 
    selectedMatch.user.loveTokens >= 10;

  const canCreateDate = 
    selectedUser && 
    selectedMatch && 
    activeSlot && 
    hasEnoughTokens &&
    (!isOfflineDate || selectedLocation);

  if (!selectedUser) {
    return (
      <Box bg={bgColor} p={6} borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <Text color="gray.500" textAlign="center">
          Select a user to start curating a date
        </Text>
      </Box>
    );
  }

  return (
    <>
      <VStack
        bg={bgColor}
        p={6}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        spacing={4}
        align="stretch"
      >
        <Text fontSize="lg" fontWeight="bold">Date Curation Summary</Text>
        
        {/* Selected Users */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Selected Users</Text>
          <SimpleGrid columns={2} spacing={4}>
            <Box p={3} bg="gray.50" borderRadius="md">
              <HStack>
                <Avatar src={selectedUser.profilePicture} size="sm" name={selectedUser.firstName} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium">{selectedUser.firstName} {selectedUser.lastName}</Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="green" fontSize="xs">
                      <HStack spacing={1}>
                        <FiDollarSign size={10} />
                        <Text>{selectedUser.loveTokens} tokens</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>
            </Box>

            {selectedMatch && (
              <Box p={3} bg="gray.50" borderRadius="md">
                <HStack>
                  <Avatar src={selectedMatch.user.profilePicture} size="sm" name={selectedMatch.user.firstName} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{selectedMatch.user.firstName} {selectedMatch.user.lastName}</Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="green" fontSize="xs">
                        <HStack spacing={1}>
                          <FiDollarSign size={10} />
                          <Text>{selectedMatch.user.loveTokens} tokens</Text>
                        </HStack>
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            )}
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Selected Slot */}
        {activeSlot && (
          <>
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium">Selected Date & Time</Text>
                {onEditSlots && (
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<FiEdit2 />}
                    onClick={onEditSlots}
                  >
                    Change Slot
                  </Button>
                )}
              </HStack>
              <Box p={3} bg="gray.50" borderRadius="md">
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiCalendar} color="gray.500" />
                    <Text>{format(new Date(activeSlot.date), 'EEEE, MMM d, yyyy')}</Text>
                  </HStack>
                  <Badge colorScheme={activeSlot.mode === 'online' ? 'blue' : 'purple'}>
                    <HStack spacing={1}>
                      <Icon as={activeSlot.mode === 'online' ? FiVideo : FiMapPin} boxSize={3} />
                      <Text textTransform="capitalize">{activeSlot.timeBlock}</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </Box>
            </Box>
            <Divider />
          </>
        )}

        {/* Genie Selection */}
        <FormControl>
          <FormLabel fontSize="sm">Assign Genie (Optional)</FormLabel>
          <Select
            placeholder="Select a genie"
            value={selectedGenie?.id || ''}
            onChange={(e) => {
              const genie = genies.find(g => g.id === e.target.value);
              onGenieSelect(genie || null);
            }}
            size="sm"
          >
            {genies.map(genie => (
              <option key={genie.id} value={genie.id}>
                {genie.name} - {genie.specialization} ({genie.successRate}% success)
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Location Selection for Offline Dates */}
        {isOfflineDate && (
          <>
            <Divider />
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>Meeting Location</Text>
              {selectedLocation ? (
                <Card size="sm" variant="outline">
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="bold" fontSize="sm">{selectedLocation.name}</Text>
                        <Badge colorScheme="green" fontSize="xs">
                          Selected
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.600">
                        {selectedLocation.address}
                      </Text>
                      <HStack spacing={4}>
                        <Text fontSize="xs" color="gray.500">
                          {selectedLocation.city}, {selectedLocation.state}
                        </Text>
                        {selectedLocation.postalCode && (
                          <Text fontSize="xs" color="gray.500">
                            {selectedLocation.postalCode}
                          </Text>
                        )}
                      </HStack>
                      <Link
                        href={selectedLocation.googleMapsUrl}
                        isExternal
                        color="brand.500"
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        View on Google Maps →
                      </Link>
                    </VStack>
                  </CardBody>
                </Card>
              ) : (
                <Alert status="warning" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">Please select a location in the slot selection step</Text>
                </Alert>
              )}
            </Box>
          </>
        )}

        {/* Token Warning */}
        {!hasEnoughTokens && selectedMatch && (
          <Alert status="warning">
            <AlertIcon />
            <Text fontSize="sm">
              One or both users don't have enough love tokens (minimum 10 required)
            </Text>
          </Alert>
        )}

        {/* Action Button */}
        <Button
          colorScheme="brand"
          size="lg"
          onClick={onOpen}
          isDisabled={!canCreateDate}
          isLoading={isCreating}
          leftIcon={<FiSend />}
        >
          Create Date & Send Invites
        </Button>

        {/* Success Message */}
        {curatedDate && (
          <Alert status="success">
            <AlertIcon />
            <Text fontSize="sm">
              Date created successfully! Invitations sent to both users.
            </Text>
          </Alert>
        )}
      </VStack>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Date Creation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Text>Are you sure you want to create this date?</Text>
              
              <Box p={4} bg="gray.50" borderRadius="md">
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Text fontWeight="medium">Users:</Text>
                    <Text>{selectedUser?.firstName} & {selectedMatch?.user.firstName}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Date:</Text>
                    <Text>{activeSlot && format(new Date(activeSlot.date), 'MMM d, yyyy')}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Time:</Text>
                    <Text textTransform="capitalize">{activeSlot?.timeBlock}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">Mode:</Text>
                    <Badge colorScheme={activeSlot?.mode === 'online' ? 'blue' : 'purple'}>
                      {activeSlot?.mode}
                    </Badge>
                  </HStack>
                  {selectedLocation && (
                    <HStack>
                      <Text fontWeight="medium">Location:</Text>
                      <Text>{selectedLocation.name}</Text>
                    </HStack>
                  )}
                  {selectedGenie && (
                    <HStack>
                      <Text fontWeight="medium">Genie:</Text>
                      <Text>{selectedGenie.name}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>

              <Alert status="info">
                <AlertIcon />
                <Text fontSize="sm">
                  10 love tokens will be deducted from each user's account
                </Text>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={() => {
                onCreateDate();
                onClose();
              }}
              isLoading={isCreating}
            >
              Confirm & Send Invites
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CurationSummary;