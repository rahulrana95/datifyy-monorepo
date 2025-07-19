import React from 'react';
import {
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Divider,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { GenieDate } from '../types';
import DateCard from './DateCard';

interface GroupedDatesListProps {
  dates: GenieDate[];
  onViewDetails: (date: GenieDate) => void;
  onReschedule: (date: GenieDate) => void;
  onSendReminder: (date: GenieDate) => void;
  onUpdateStatus: (dateId: string, status: GenieDate['status']) => Promise<void>;
}

interface DateGroup {
  label: string;
  dates: GenieDate[];
}

const GroupedDatesList: React.FC<GroupedDatesListProps> = ({
  dates,
  onViewDetails,
  onReschedule,
  onSendReminder,
  onUpdateStatus,
}) => {
  const sectionBg = useColorModeValue('gray.50', 'gray.800');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  // Group dates by date
  const groupDatesByDate = (dates: GenieDate[]): DateGroup[] => {
    const groups: { [key: string]: GenieDate[] } = {};
    
    dates.forEach((date) => {
      const dateObj = parseISO(date.scheduledDate);
      let label: string;
      
      if (isToday(dateObj)) {
        label = 'Today';
      } else if (isTomorrow(dateObj)) {
        label = 'Tomorrow';
      } else if (isYesterday(dateObj)) {
        label = 'Yesterday';
      } else {
        // Format as "Monday, 12 July 2022"
        label = format(dateObj, 'EEEE, d MMMM yyyy');
      }
      
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(date);
    });
    
    // Convert to array and sort
    const groupedArray = Object.entries(groups).map(([label, dates]) => ({
      label,
      dates: dates.sort((a, b) => 
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      ),
    }));
    
    // Sort groups by date (Today first, then Tomorrow, then chronologically)
    groupedArray.sort((a, b) => {
      if (a.label === 'Today') return -1;
      if (b.label === 'Today') return 1;
      if (a.label === 'Tomorrow') return -1;
      if (b.label === 'Tomorrow') return 1;
      if (a.label === 'Yesterday') return -1;
      if (b.label === 'Yesterday') return 1;
      
      // For other dates, sort by actual date
      const dateA = parseISO(a.dates[0].scheduledDate);
      const dateB = parseISO(b.dates[0].scheduledDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    return groupedArray;
  };

  const groupedDates = groupDatesByDate(dates);

  return (
    <VStack spacing={6} align="stretch">
      {groupedDates.map((group, index) => (
        <Box key={group.label}>
          {/* Date Section Header */}
          <HStack mb={4}>
            <Text 
              fontSize="lg" 
              fontWeight="semibold" 
              color={labelColor}
            >
              {group.label}
            </Text>
            <Text fontSize="sm" color={labelColor}>
              ({group.dates.length} {group.dates.length === 1 ? 'date' : 'dates'})
            </Text>
          </HStack>
          
          {/* Date Cards Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={4}>
            {group.dates.map((date) => (
              <DateCard
                key={date.id}
                date={date}
                onViewDetails={onViewDetails}
                onReschedule={onReschedule}
                onSendReminder={onSendReminder}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </SimpleGrid>
          
          {/* Divider between sections */}
          {index < groupedDates.length - 1 && (
            <Divider mt={6} />
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default GroupedDatesList;