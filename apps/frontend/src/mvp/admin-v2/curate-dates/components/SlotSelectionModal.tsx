/**
 * SlotSelectionModal Component
 * Complete date configuration modal with slot selection and summary
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
  Button,
  Badge,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  Avatar,
  Flex,
  Grid,
  GridItem,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
} from '@chakra-ui/react';
import { FiVideo, FiMapPin, FiCalendar, FiClock, FiX, FiCheck } from 'react-icons/fi';
import { TimeSlot, SuggestedMatch, User, Genie, OfflineLocation, CuratedDate } from '../types';
import { format } from 'date-fns';
import SlotSelector from './SlotSelector';
import CurationSummary from './CurationSummary';

interface SlotSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
  match: SuggestedMatch | null;
  selectedSlots: {
    online: TimeSlot | null;
    offline: TimeSlot | null;
  };
  onSlotSelect: (slot: TimeSlot, mode: 'online' | 'offline') => void;
  genies: Genie[];
  selectedGenie: Genie | null;
  onGenieSelect: (genie: Genie | null) => void;
  offlineLocations: OfflineLocation[];
  selectedLocation: OfflineLocation | null;
  onLocationSelect: (location: OfflineLocation | null) => void;
  onCreateDate: () => void;
  isCreating: boolean;
  curatedDate: CuratedDate | null;
}

const SlotSelectionModal: React.FC<SlotSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  match,
  selectedSlots,
  onSlotSelect,
  genies,
  selectedGenie,
  onGenieSelect,
  offlineLocations,
  selectedLocation,
  onLocationSelect,
  onCreateDate,
  isCreating,
  curatedDate,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [currentView, setCurrentView] = useState<'slots' | 'summary'>('slots');
  
  const steps = [
    { title: 'Select Slot', description: 'Choose time slot' },
    { title: 'Configure Date', description: 'Add details' },
  ];
  
  const { activeStep } = useSteps({
    index: currentView === 'slots' ? 0 : 1,
    count: steps.length,
  });

  if (!match || !selectedUser) return null;

  const hasSelectedSlot = selectedSlots.online || selectedSlots.offline;
  
  const handleContinue = () => {
    if (hasSelectedSlot) {
      setCurrentView('summary');
    }
  };
  
  const handleBack = () => {
    setCurrentView('slots');
  };
  
  const handleClose = () => {
    setCurrentView('slots');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="6xl"
      scrollBehavior="inside"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader pb={2}>
          <Flex direction="column" pr={8}>
            <Text fontSize="xl" mb={3}>Configure Date</Text>
            
            {/* Stepper */}
            <Stepper size='sm' index={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink='0'>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Flex>
        </ModalHeader>
        
        <ModalCloseButton top={4} right={4} />
        
        <Divider />
        
        <ModalBody p={0}>
          {currentView === 'slots' ? (
            <Box>
              {/* Match Info Header */}
              <Box p={4} bg={useColorModeValue('gray.50', 'gray.900')}>
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <GridItem>
                    <HStack spacing={3}>
                      <Avatar 
                        src={selectedUser.profilePicture} 
                        size="md" 
                        name={selectedUser.firstName} 
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </Text>
                        <HStack spacing={2}>
                          <Badge>{selectedUser.age}y</Badge>
                          <Badge>{selectedUser.city}</Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                  </GridItem>
                  
                  <GridItem>
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" boxSize={5} />
                      <Avatar 
                        src={match.user.profilePicture} 
                        size="md" 
                        name={match.user.firstName} 
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">
                          {match.user.firstName} {match.user.lastName}
                        </Text>
                        <HStack spacing={2}>
                          <Badge>{match.user.age}y</Badge>
                          <Badge colorScheme="green">
                            {match.matchScore}% Match
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                  </GridItem>
                </Grid>
                
                <HStack mt={3} justify="center">
                  <Badge colorScheme="blue" variant="solid" fontSize="sm">
                    <HStack spacing={1}>
                      <FiVideo size={12} />
                      <Text>{match.matchingSlotsCounts.online} Common Online Slots</Text>
                    </HStack>
                  </Badge>
                  <Badge colorScheme="purple" variant="solid" fontSize="sm">
                    <HStack spacing={1}>
                      <FiMapPin size={12} />
                      <Text>{match.matchingSlotsCounts.offline} Common Offline Slots</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </Box>
              
              {/* Slot Selection */}
              <SlotSelector
                match={match}
                selectedSlots={selectedSlots}
                onSlotSelect={onSlotSelect}
              />
            </Box>
          ) : (
            <Box p={6}>
              <CurationSummary
                selectedUser={selectedUser}
                selectedMatch={match}
                selectedSlots={selectedSlots}
                genies={genies}
                selectedGenie={selectedGenie}
                onGenieSelect={onGenieSelect}
                offlineLocations={offlineLocations}
                selectedLocation={selectedLocation}
                onLocationSelect={onLocationSelect}
                onCreateDate={onCreateDate}
                isCreating={isCreating}
                curatedDate={curatedDate}
              />
            </Box>
          )}
        </ModalBody>
        
        <Divider />
        
        <ModalFooter>
          {currentView === 'slots' ? (
            <>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="brand" 
                onClick={handleContinue}
                isDisabled={!hasSelectedSlot}
                rightIcon={<FiCheck />}
              >
                Continue to Configuration
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" mr={3} onClick={handleBack}>
                Back to Slots
              </Button>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Close
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SlotSelectionModal;