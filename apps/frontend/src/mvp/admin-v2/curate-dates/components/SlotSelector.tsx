/**
 * SlotSelector Component
 * Select time slots for online/offline dates
 */

import React, { useState } from 'react';
import {
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
} from '@chakra-ui/react';
import { FiVideo, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import { TimeSlot, SuggestedMatch } from '../types';
import { format } from 'date-fns';

interface SlotSelectorProps {
  match: SuggestedMatch | null;
  selectedSlots: {
    online: TimeSlot | null;
    offline: TimeSlot | null;
  };
  onSlotSelect: (slot: TimeSlot, mode: 'online' | 'offline') => void;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({
  match,
  selectedSlots,
  onSlotSelect,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBg = useColorModeValue('brand.50', 'brand.900');

  if (!match) {
    return (
      <Box bg={bgColor} p={6} borderRadius="lg" border="1px solid" borderColor={borderColor}>
        <Text color="gray.500" textAlign="center">
          Select a match to view available slots
        </Text>
      </Box>
    );
  }

  const getTimeBlockLabel = (timeBlock: string) => {
    switch (timeBlock) {
      case 'morning': return '8 AM - 12 PM';
      case 'afternoon': return '12 PM - 4 PM';
      case 'evening': return '4 PM - 8 PM';
      case 'night': return '8 PM - 11 PM';
      default: return timeBlock;
    }
  };

  const getTimeBlockIcon = (timeBlock: string) => {
    switch (timeBlock) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '🕐';
    }
  };

  const groupSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: { [date: string]: TimeSlot[] } = {};
    slots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const onlineSlotsByDate = groupSlotsByDate(match.availableSlots.online);
  const offlineSlotsByDate = groupSlotsByDate(match.availableSlots.offline);

  return (
    <Box bg={bgColor} borderRadius="lg" border="1px solid" borderColor={borderColor}>
      <Box p={4} borderBottom="1px solid" borderColor={borderColor}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">Common Available Time Slots</Text>
              <Text fontSize="sm" color="gray.600">
                Select a mutually available time for {match.user.firstName}
              </Text>
            </VStack>
            <HStack>
              <Badge colorScheme="blue" variant="solid" fontSize="sm">
                <HStack spacing={1}>
                  <FiVideo size={12} />
                  <Text>{match.matchingSlotsCounts.online} Online</Text>
                </HStack>
              </Badge>
              <Badge colorScheme="purple" variant="solid" fontSize="sm">
                <HStack spacing={1}>
                  <FiMapPin size={12} />
                  <Text>{match.matchingSlotsCounts.offline} Offline</Text>
                </HStack>
              </Badge>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList px={4}>
          <Tab>
            <HStack>
              <Icon as={FiVideo} />
              <Text>Online Dates</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <Icon as={FiMapPin} />
              <Text>Offline Dates</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Online Slots */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              {Object.entries(onlineSlotsByDate).map(([date, slots]) => (
                <Box key={date}>
                  <HStack mb={2}>
                    <Icon as={FiCalendar} color="gray.500" />
                    <Text fontWeight="medium">
                      {format(new Date(date), 'EEEE, MMM d')}
                    </Text>
                  </HStack>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                    {slots.map(slot => (
                      <Button
                        key={slot.id}
                        size="md"
                        variant={selectedSlots.online?.id === slot.id ? 'solid' : 'outline'}
                        colorScheme={selectedSlots.online?.id === slot.id ? 'brand' : 'gray'}
                        onClick={() => onSlotSelect(slot, 'online')}
                        leftIcon={<Text fontSize="lg">{getTimeBlockIcon(slot.timeBlock)}</Text>}
                        h="auto"
                        py={3}
                        px={4}
                        flexDir="column"
                        gap={1}
                      >
                        <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                          {slot.timeBlock}
                        </Text>
                        <Text fontSize="xs" opacity={0.7}>
                          {getTimeBlockLabel(slot.timeBlock)}
                        </Text>
                      </Button>
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
              
              {match.availableSlots.online.length === 0 && (
                <Alert status="info">
                  <AlertIcon />
                  No online slots available for this match
                </Alert>
              )}
            </VStack>
          </TabPanel>

          {/* Offline Slots */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              {Object.entries(offlineSlotsByDate).map(([date, slots]) => (
                <Box key={date}>
                  <HStack mb={2}>
                    <Icon as={FiCalendar} color="gray.500" />
                    <Text fontWeight="medium">
                      {format(new Date(date), 'EEEE, MMM d')}
                    </Text>
                  </HStack>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
                    {slots.map(slot => (
                      <Button
                        key={slot.id}
                        size="md"
                        variant={selectedSlots.offline?.id === slot.id ? 'solid' : 'outline'}
                        colorScheme={selectedSlots.offline?.id === slot.id ? 'brand' : 'gray'}
                        onClick={() => onSlotSelect(slot, 'offline')}
                        leftIcon={<Text fontSize="lg">{getTimeBlockIcon(slot.timeBlock)}</Text>}
                        h="auto"
                        py={3}
                        px={4}
                        flexDir="column"
                        gap={1}
                      >
                        <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                          {slot.timeBlock}
                        </Text>
                        <Text fontSize="xs" opacity={0.7}>
                          {getTimeBlockLabel(slot.timeBlock)}
                        </Text>
                      </Button>
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
              
              {match.availableSlots.offline.length === 0 && (
                <Alert status="info">
                  <AlertIcon />
                  No offline slots available for this match
                </Alert>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Selected Slots Summary */}
      {(selectedSlots.online || selectedSlots.offline) && (
        <Box p={4} bg={useColorModeValue('brand.50', 'brand.900')} borderTop="2px solid" borderColor="brand.200">
          <HStack mb={3}>
            <Icon as={FiClock} color="brand.500" />
            <Text fontSize="sm" fontWeight="bold">Selected Time Slots</Text>
          </HStack>
          <VStack align="stretch" spacing={2}>
            {selectedSlots.online && (
              <HStack p={2} bg="white" borderRadius="md" boxShadow="sm">
                <Badge colorScheme="blue" fontSize="sm">Online</Badge>
                <Text fontSize="sm" fontWeight="medium">
                  {format(new Date(selectedSlots.online.date), 'EEEE, MMM d')} • {getTimeBlockIcon(selectedSlots.online.timeBlock)} {selectedSlots.online.timeBlock}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  ({getTimeBlockLabel(selectedSlots.online.timeBlock)})
                </Text>
              </HStack>
            )}
            {selectedSlots.offline && (
              <HStack p={2} bg="white" borderRadius="md" boxShadow="sm">
                <Badge colorScheme="purple" fontSize="sm">Offline</Badge>
                <Text fontSize="sm" fontWeight="medium">
                  {format(new Date(selectedSlots.offline.date), 'EEEE, MMM d')} • {getTimeBlockIcon(selectedSlots.offline.timeBlock)} {selectedSlots.offline.timeBlock}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  ({getTimeBlockLabel(selectedSlots.offline.timeBlock)})
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SlotSelector;