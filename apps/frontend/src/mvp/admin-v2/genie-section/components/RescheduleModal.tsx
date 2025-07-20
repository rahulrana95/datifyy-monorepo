/**
 * RescheduleModal Component
 * Modal for rescheduling dates with location selection and map preview
 */

import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  Select,
  Radio,
  RadioGroup,
  useColorModeValue,
  Alert,
  AlertIcon,
  InputGroup,
  InputLeftElement,
  Icon,
  Image,
  Textarea,
  Badge,
  Divider,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiVideo,
  FiSearch,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { GenieDate, DateLocation, RescheduleRequest } from '../types';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: GenieDate | null;
  locations: DateLocation[];
  onSearchLocations: (city?: string, query?: string) => void;
  onReschedule: (request: RescheduleRequest) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  date,
  locations,
  onSearchLocations,
  onReschedule,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newTimeBlock, setNewTimeBlock] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [newMode, setNewMode] = useState<'online' | 'offline'>('online');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (date) {
      setNewDate(format(new Date(date.scheduledDate), 'yyyy-MM-dd'));
      setNewTimeBlock(date.timeSlot.timeBlock);
      setNewMode(date.mode);
      setSelectedLocationId(date.location?.id || '');
    }
  }, [date]);

  useEffect(() => {
    if (newMode === 'offline' && date?.user1.city) {
      onSearchLocations(date.user1.city, locationSearch);
    }
  }, [newMode, locationSearch, date, onSearchLocations]);

  if (!date) return null;

  const timeSlotMap = {
    morning: { start: '09:00', end: '12:00' },
    afternoon: { start: '12:00', end: '16:00' },
    evening: { start: '16:00', end: '20:00' },
    night: { start: '20:00', end: '23:00' },
  };

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const request: RescheduleRequest = {
      dateId: date.id,
      newDate: new Date(newDate).toISOString(),
      newTimeSlot: {
        startTime: timeSlotMap[newTimeBlock].start,
        endTime: timeSlotMap[newTimeBlock].end,
        timeBlock: newTimeBlock,
      },
      newMode,
      newLocationId: newMode === 'offline' ? selectedLocationId : undefined,
      reason,
    };

    await onReschedule(request);
    setIsSubmitting(false);
    onClose();
  };

  const isValid = newDate && (newMode === 'online' || selectedLocationId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reschedule Date</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Current Date Info */}
            <Alert status="info" variant="left-accent">
              <AlertIcon />
              <Box>
                <Text fontWeight="medium">Current Schedule</Text>
                <Text fontSize="sm">
                  {format(new Date(date.scheduledDate), 'EEEE, MMM d, yyyy')} at {date.timeSlot.startTime}
                </Text>
              </Box>
            </Alert>

            {/* New Date */}
            <FormControl isRequired>
              <FormLabel>New Date</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiCalendar} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </InputGroup>
            </FormControl>

            {/* Time Slot */}
            <FormControl isRequired>
              <FormLabel>Time Slot</FormLabel>
              <Select
                value={newTimeBlock}
                onChange={(e) => setNewTimeBlock(e.target.value as any)}
              >
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
                <option value="night">Night (8 PM - 11 PM)</option>
              </Select>
            </FormControl>

            {/* Mode */}
            <FormControl isRequired>
              <FormLabel>Date Mode</FormLabel>
              <RadioGroup value={newMode} onChange={(v) => setNewMode(v as any)}>
                <HStack spacing={4}>
                  <Radio value="online">
                    <HStack>
                      <Icon as={FiVideo} />
                      <Text>Online</Text>
                    </HStack>
                  </Radio>
                  <Radio value="offline">
                    <HStack>
                      <Icon as={FiMapPin} />
                      <Text>Offline</Text>
                    </HStack>
                  </Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* Location Selection for Offline */}
            {newMode === 'offline' && (
              <>
                <FormControl isRequired>
                  <FormLabel>Search Location</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search for cafes, restaurants..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Select Location</FormLabel>
                  <Select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    placeholder="Choose a location"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} - {loc.type} ({loc.priceRange})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* Location Preview */}
                {selectedLocation && (
                  <Box
                    p={4}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text fontWeight="medium">{selectedLocation.name}</Text>
                        <Badge>{selectedLocation.type}</Badge>
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600">
                        {selectedLocation.address}
                      </Text>
                      
                      <HStack spacing={4} fontSize="sm">
                        <Text>Rating: ⭐ {selectedLocation.rating}</Text>
                        <Text>Price: {selectedLocation.priceRange}</Text>
                      </HStack>

                      {selectedLocation.imageUrl && (
                        <Image
                          src={selectedLocation.imageUrl}
                          alt={selectedLocation.name}
                          borderRadius="md"
                          h="150px"
                          w="100%"
                          objectFit="cover"
                        />
                      )}

                      {/* Google Maps Preview */}
                      <Box
                        as="iframe"
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(selectedLocation.address)}`}
                        width="100%"
                        height="200px"
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderColor}
                      />
                      
                      <Button
                        size="sm"
                        as="a"
                        href={selectedLocation.googleMapsUrl}
                        target="_blank"
                        variant="outline"
                        colorScheme="blue"
                      >
                        View on Google Maps
                      </Button>
                    </VStack>
                  </Box>
                )}
              </>
            )}

            {/* Reason */}
            <FormControl>
              <FormLabel>Reason for Rescheduling</FormLabel>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional: Add a reason for rescheduling..."
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Reschedule Date
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RescheduleModal;