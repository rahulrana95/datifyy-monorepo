// apps/frontend/src/mvp/date-curation/hooks/useDateCuration.ts
import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { CuratedDateCard, DateAction } from '../types';

// Mock data for development - will be replaced with API calls
const mockUpcomingDates: CuratedDateCard[] = [
  {
    id: '1',
    matchName: 'Sarah',
    matchAge: 28,
    matchImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    mode: 'offline',
    location: 'Blue Bottle Coffee, Downtown',
    status: 'pending',
    compatibilityScore: 87,
    adminNote: 'You both love hiking and craft coffee! Perfect match for a casual coffee date.',
    dressCode: 'Casual',
    canCancel: true,
    canConfirm: true,
    hoursUntilDate: 26,
    isVerified: true,
  },
  {
    id: '2',
    matchName: 'Emma',
    matchAge: 26,
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    mode: 'online',
    meetingLink: 'https://meet.datifyy.com/room123',
    status: 'confirmed',
    compatibilityScore: 92,
    adminNote: 'Both of you are book lovers! We suggest discussing your favorite novels.',
    canCancel: true,
    canConfirm: false,
    hoursUntilDate: 74,
    isVerified: true,
  },
  {
    id: '3',
    matchName: 'Jessica',
    matchAge: 30,
    matchImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    mode: 'offline',
    location: 'Central Park, Near Bethesda Fountain',
    status: 'confirmed',
    compatibilityScore: 79,
    dressCode: 'Comfortable walking shoes',
    canCancel: false, // Too close to cancel
    canConfirm: false,
    hoursUntilDate: 2,
    isVerified: false,
  }
];

export const useDateCuration = () => {
  const [upcomingDates, setUpcomingDates] = useState<CuratedDateCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Simulate API call to fetch dates
  useEffect(() => {
    const fetchDates = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sort dates by dateTime
        const sortedDates = mockUpcomingDates.sort(
          (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );
        
        setUpcomingDates(sortedDates);
        setError(null);
      } catch (err) {
        setError('Failed to load your dates. Please try again.');
        console.error('Error fetching dates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handleDateAction = async (action: DateAction): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      if (action.type === 'accept') {
        // Update date status to confirmed
        setUpcomingDates(prev => 
          prev.map(date => 
            date.id === action.dateId 
              ? { ...date, status: 'confirmed', canConfirm: false }
              : date
          )
        );

        toast({
          title: "Date confirmed! 💕",
          description: "You'll receive a reminder 24 hours before your date.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });

      } else if (action.type === 'cancel') {
        // Remove date from upcoming list
        setUpcomingDates(prev => 
          prev.filter(date => date.id !== action.dateId)
        );

        toast({
          title: "Date cancelled",
          description: "We've notified your match and our team. No worries, we'll find you another great connection!",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

    } catch (err) {
      console.error('Error handling date action:', err);
      
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support if the issue persists.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      
      throw err; // Re-throw so component can handle loading states
    }
  };

  const refreshDates = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUpcomingDates([...mockUpcomingDates]);
      setError(null);
    } catch (err) {
      setError('Failed to refresh dates.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upcomingDates,
    isLoading,
    error,
    handleDateAction,
    refreshDates,
  };
};