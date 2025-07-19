/**
 * DateStatusBadge Component
 * Badge for displaying date status
 */

import React from 'react';
import { Badge } from '@chakra-ui/react';
import { CuratedDateDetails } from '../types';

interface DateStatusBadgeProps {
  status: CuratedDateDetails['status'];
}

const DateStatusBadge: React.FC<DateStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'ongoing':
        return 'purple';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'no_show':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      default:
        return status;
    }
  };

  return (
    <Badge colorScheme={getStatusColor()} variant="subtle">
      {getStatusLabel()}
    </Badge>
  );
};

export default DateStatusBadge;