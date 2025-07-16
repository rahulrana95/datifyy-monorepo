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
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">Available Time Slots</Text>
          <HStack>
            <Badge colorScheme="blue" variant="solid">
              <HStack spacing={1}>
                <FiVideo size={12} />
                <Text>{match.matchingSlotsCounts.online} Online</Text>
              </HStack>
            </Badge>
            <Badge colorScheme="purple" variant="solid">
              <HStack spacing={1}>
                <FiMapPin size={12} />
                <Text>{match.matchingSlotsCounts.offline} Offline</Text>
              </HStack>
            </Badge>
          </HStack>
        </HStack>
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
                        size="sm"
                        variant={selectedSlots.online?.id === slot.id ? 'solid' : 'outline'}
                        colorScheme={selectedSlots.online?.id === slot.id ? 'brand' : 'gray'}
                        onClick={() => onSlotSelect(slot, 'online')}
                        leftIcon={<Text>{getTimeBlockIcon(slot.timeBlock)}</Text>}
                      >
                        <VStack spacing={0}>
                          <Text fontSize="xs" textTransform="capitalize">
                            {slot.timeBlock}
                          </Text>
                          <Text fontSize="xs" opacity={0.7}>
                            {getTimeBlockLabel(slot.timeBlock)}
                          </Text>
                        </VStack>
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
                        size="sm"
                        variant={selectedSlots.offline?.id === slot.id ? 'solid' : 'outline'}
                        colorScheme={selectedSlots.offline?.id === slot.id ? 'brand' : 'gray'}
                        onClick={() => onSlotSelect(slot, 'offline')}
                        leftIcon={<Text>{getTimeBlockIcon(slot.timeBlock)}</Text>}
                      >
                        <VStack spacing={0}>
                          <Text fontSize="xs" textTransform="capitalize">
                            {slot.timeBlock}
                          </Text>
                          <Text fontSize="xs" opacity={0.7}>
                            {getTimeBlockLabel(slot.timeBlock)}
                          </Text>
                        </VStack>
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
        <Box p={4} bg="gray.50" borderTop="1px solid" borderColor={borderColor}>
          <Text fontSize="sm" fontWeight="bold" mb={2}>Selected Slots:</Text>
          <VStack align="stretch" spacing={2}>
            {selectedSlots.online && (
              <HStack>
                <Badge colorScheme="blue">Online</Badge>
                <Text fontSize="sm">
                  {format(new Date(selectedSlots.online.date), 'MMM d')} • {selectedSlots.online.timeBlock} ({getTimeBlockLabel(selectedSlots.online.timeBlock)})
                </Text>
              </HStack>
            )}
            {selectedSlots.offline && (
              <HStack>
                <Badge colorScheme="purple">Offline</Badge>
                <Text fontSize="sm">
                  {format(new Date(selectedSlots.offline.date), 'MMM d')} • {selectedSlots.offline.timeBlock} ({getTimeBlockLabel(selectedSlots.offline.timeBlock)})
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