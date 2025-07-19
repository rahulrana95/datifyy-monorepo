/**
 * DateCard Component
 * Display individual date information in a card format
 */

import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarGroup,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiVideo,
  FiMoreVertical,
  FiEdit,
  FiMail,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiShield,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { GenieDate } from '../types';

interface DateCardProps {
  date: GenieDate;
  onViewDetails: (date: GenieDate) => void;
  onReschedule: (date: GenieDate) => void;
  onSendReminder: (date: GenieDate) => void;
  onUpdateStatus: (dateId: string, status: GenieDate['status']) => void;
}

const DateCard: React.FC<DateCardProps> = ({
  date,
  onViewDetails,
  onReschedule,
  onSendReminder,
  onUpdateStatus,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const getStatusColor = (status: GenieDate['status']) => {
    switch (status) {
      case 'upcoming':
        return 'blue';
      case 'ongoing':
        return 'green';
      case 'completed':
        return 'purple';
      case 'cancelled':
        return 'red';
      case 'rescheduled':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getVerificationIcon = (user: GenieDate['user1'] | GenieDate['user2']) => {
    const verified = user.verificationStatus.idVerified;
    return verified ? (
      <Tooltip label="ID Verified">
        <Box>
          <FiCheckCircle color="green" size={14} />
        </Box>
      </Tooltip>
    ) : (
      <Tooltip label="ID Not Verified">
        <Box>
          <FiAlertCircle color="orange" size={14} />
        </Box>
      </Tooltip>
    );
  };

  const getVerificationBadge = () => {
    const user1Verified = date.user1.verificationStatus.idVerified;
    const user2Verified = date.user2.verificationStatus.idVerified;

    if (user1Verified && user2Verified) {
      return (
        <Badge colorScheme="green" fontSize="xs">
          <HStack spacing={1}>
            <FiShield size={10} />
            <Text>Both Verified</Text>
          </HStack>
        </Badge>
      );
    } else if (user1Verified || user2Verified) {
      return (
        <Badge colorScheme="orange" fontSize="xs">
          <HStack spacing={1}>
            <FiShield size={10} />
            <Text>Partially Verified</Text>
          </HStack>
        </Badge>
      );
    } else {
      return (
        <Badge colorScheme="red" fontSize="xs">
          <HStack spacing={1}>
            <FiShield size={10} />
            <Text>Not Verified</Text>
          </HStack>
        </Badge>
      );
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      _hover={{ bg: hoverBg, transform: 'translateY(-2px)', boxShadow: 'md' }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => onViewDetails(date)}
    >
      {/* Header */}
      <Flex justify="space-between" align="start" mb={3}>
        <HStack spacing={3}>
          <Badge colorScheme={getStatusColor(date.status)} fontSize="sm">
            {date.status.toUpperCase()}
          </Badge>
          {getVerificationBadge()}
        </HStack>
        
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList>
            <MenuItem icon={<FiEye />} onClick={(e) => {
              e.stopPropagation();
              onViewDetails(date);
            }}>
              View Details
            </MenuItem>
            <MenuItem icon={<FiEdit />} onClick={(e) => {
              e.stopPropagation();
              onReschedule(date);
            }}>
              Reschedule
            </MenuItem>
            <MenuItem icon={<FiMail />} onClick={(e) => {
              e.stopPropagation();
              onSendReminder(date);
            }}>
              Send Reminder
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Users */}
      <Flex justify="space-between" align="center" mb={3}>
        <VStack align="start" spacing={2} flex={1}>
          <HStack>
            <Avatar src={date.user1.profilePicture} size="sm" name={date.user1.firstName} />
            <VStack align="start" spacing={0}>
              <HStack>
                <Text fontWeight="medium" fontSize="sm">
                  {date.user1.firstName} {date.user1.lastName}
                </Text>
                {getVerificationIcon(date.user1)}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {date.user1.age}y • {date.user1.city}
              </Text>
            </VStack>
          </HStack>
        </VStack>

        <Icon as={FiCheckCircle} color="green.500" mx={2} />

        <VStack align="end" spacing={2} flex={1}>
          <HStack>
            <VStack align="end" spacing={0}>
              <HStack>
                {getVerificationIcon(date.user2)}
                <Text fontWeight="medium" fontSize="sm">
                  {date.user2.firstName} {date.user2.lastName}
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {date.user2.age}y • {date.user2.city}
              </Text>
            </VStack>
            <Avatar src={date.user2.profilePicture} size="sm" name={date.user2.firstName} />
          </HStack>
        </VStack>
      </Flex>

      {/* Date & Time */}
      <VStack align="stretch" spacing={2} mb={3}>
        <HStack fontSize="sm">
          <Icon as={FiCalendar} color="gray.500" />
          <Text>{format(new Date(date.scheduledDate), 'EEEE, MMM d, yyyy')}</Text>
        </HStack>
        <HStack fontSize="sm">
          <Icon as={FiClock} color="gray.500" />
          <Text>
            {date.timeSlot.startTime} - {date.timeSlot.endTime} ({date.timeSlot.timeBlock})
          </Text>
        </HStack>
        <HStack fontSize="sm">
          <Icon as={date.mode === 'online' ? FiVideo : FiMapPin} color="gray.500" />
          <Text>
            {date.mode === 'online' ? 'Online Meeting' : date.location?.name}
          </Text>
        </HStack>
      </VStack>

      {/* Reminders */}
      <HStack justify="space-between" align="center" mb={3}>
        <HStack spacing={2}>
          <Text fontSize="xs" color="gray.500">Reminders:</Text>
          <HStack spacing={1}>
            <Tooltip label={date.remindersSent.user1 ? 'Reminder sent to user 1' : 'No reminder sent to user 1'}>
              <Badge 
                colorScheme={date.remindersSent.user1 ? 'green' : 'gray'} 
                fontSize="xs"
                variant={date.remindersSent.user1 ? 'solid' : 'outline'}
              >
                U1
              </Badge>
            </Tooltip>
            <Tooltip label={date.remindersSent.user2 ? 'Reminder sent to user 2' : 'No reminder sent to user 2'}>
              <Badge 
                colorScheme={date.remindersSent.user2 ? 'green' : 'gray'} 
                fontSize="xs"
                variant={date.remindersSent.user2 ? 'solid' : 'outline'}
              >
                U2
              </Badge>
            </Tooltip>
          </HStack>
        </HStack>
      </HStack>

      {/* Quick Actions */}
      {date.status === 'upcoming' && (
        <HStack spacing={2}>
          <Button
            size="xs"
            colorScheme="green"
            leftIcon={<FiCheckCircle />}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(date.id, 'ongoing');
            }}
          >
            Start
          </Button>
          <Button
            size="xs"
            colorScheme="red"
            variant="outline"
            leftIcon={<FiXCircle />}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(date.id, 'cancelled');
            }}
          >
            Cancel
          </Button>
          {(!date.remindersSent.user1 || !date.remindersSent.user2) && (
            <Button
              size="xs"
              variant="outline"
              leftIcon={<FiMail />}
              onClick={(e) => {
                e.stopPropagation();
                onSendReminder(date);
              }}
            >
              Remind
            </Button>
          )}
        </HStack>
      )}

      {date.status === 'ongoing' && (
        <Button
          size="xs"
          colorScheme="purple"
          leftIcon={<FiCheckCircle />}
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(date.id, 'completed');
          }}
        >
          Mark Complete
        </Button>
      )}

      {/* Notes Preview */}
      {date.notes && (
        <Box mt={3} p={2} bg="gray.50" borderRadius="md">
          <Text fontSize="xs" color="gray.600" noOfLines={2}>
            📝 {date.notes}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default DateCard;