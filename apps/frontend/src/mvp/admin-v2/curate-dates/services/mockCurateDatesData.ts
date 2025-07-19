/**
 * Mock data for Curate Dates
 * Single source of truth for matchmaking mock data
 */

import { User, SuggestedMatch, Genie, OfflineLocation, TimeSlot } from '../types';

// Helper function to generate time slots
const generateTimeSlots = (userId: string, days: number = 7): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const timeBlocks = ['morning', 'afternoon', 'evening', 'night'] as const;
  const modes = ['online', 'offline'] as const;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    timeBlocks.forEach((timeBlock) => {
      modes.forEach((mode) => {
        if (Math.random() > 0.5) { // 50% chance of availability
          const startHour = timeBlock === 'morning' ? 8 : 
                           timeBlock === 'afternoon' ? 12 : 
                           timeBlock === 'evening' ? 16 : 20;
          
          slots.push({
            id: `${userId}-${i}-${timeBlock}-${mode}`,
            date: date.toISOString().split('T')[0],
            timeBlock,
            mode,
            startTime: `${startHour}:00`,
            endTime: `${startHour + 4}:00`,
            isAvailable: true
          });
        }
      });
    });
  }
  
  return slots;
};

export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@gmail.com',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    age: 28,
    gender: 'female',
    city: 'Mumbai',
    country: 'India',
    isActive: true,
    isVerified: true,
    lastActive: '2024-01-15T10:30:00Z',
    totalDatesAttended: 5,
    profileScore: 85,
    job: 'Software Engineer',
    salary: 1500000,
    education: 'B.Tech',
    loveTokens: 50,
    submittedAvailability: true,
    verificationStatus: {
      idVerified: true,
      workVerified: true
    }
  },
  {
    id: '2',
    firstName: 'Rahul',
    lastName: 'Kumar',
    email: 'rahul.kumar@gmail.com',
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    age: 30,
    gender: 'male',
    city: 'Delhi',
    country: 'India',
    isActive: true,
    isVerified: true,
    lastActive: '2024-01-15T09:15:00Z',
    totalDatesAttended: 8,
    profileScore: 92,
    job: 'Product Manager',
    salary: 2500000,
    education: 'MBA',
    loveTokens: 75,
    submittedAvailability: true,
    verificationStatus: {
      idVerified: true,
      workVerified: true
    }
  },
  {
    id: '3',
    firstName: 'Neha',
    lastName: 'Patel',
    email: 'neha.patel@gmail.com',
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    age: 26,
    gender: 'female',
    city: 'Bangalore',
    country: 'India',
    isActive: true,
    isVerified: false,
    lastActive: '2024-01-14T18:45:00Z',
    totalDatesAttended: 3,
    profileScore: 78,
    job: 'Designer',
    salary: 1200000,
    education: 'B.Des',
    loveTokens: 30,
    submittedAvailability: true,
    verificationStatus: {
      idVerified: true,
      workVerified: false
    }
  },
  {
    id: '4',
    firstName: 'Arjun',
    lastName: 'Singh',
    email: 'arjun.singh@gmail.com',
    profilePicture: 'https://i.pravatar.cc/150?img=4',
    age: 32,
    gender: 'male',
    city: 'Mumbai',
    country: 'India',
    isActive: true,
    isVerified: true,
    lastActive: '2024-01-15T11:00:00Z',
    totalDatesAttended: 12,
    profileScore: 88,
    job: 'Investment Banker',
    salary: 3500000,
    education: 'CA',
    loveTokens: 100,
    submittedAvailability: false,
    verificationStatus: {
      idVerified: true,
      workVerified: true
    }
  },
  {
    id: '5',
    firstName: 'Anjali',
    lastName: 'Gupta',
    email: 'anjali.gupta@gmail.com',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    age: 29,
    gender: 'female',
    city: 'Chennai',
    country: 'India',
    isActive: true,
    isVerified: true,
    lastActive: '2024-01-15T08:30:00Z',
    totalDatesAttended: 7,
    profileScore: 90,
    job: 'Doctor',
    salary: 2000000,
    education: 'MBBS',
    loveTokens: 60,
    submittedAvailability: true,
    verificationStatus: {
      idVerified: true,
      workVerified: true
    }
  }
];

// Generate more mock users
for (let i = 6; i <= 50; i++) {
  const genders = ['male', 'female'] as const;
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const jobs = ['Engineer', 'Manager', 'Consultant', 'Entrepreneur', 'Lawyer', 'Teacher', 'Marketing'];
  const education = ['B.Tech', 'MBA', 'B.Com', 'M.Tech', 'CA', 'MBBS', 'B.A'];
  
  mockUsers.push({
    id: i.toString(),
    firstName: `User${i}`,
    lastName: `Last${i}`,
    email: `user${i}@gmail.com`,
    profilePicture: `https://i.pravatar.cc/150?img=${i}`,
    age: 24 + (i % 15),
    gender: genders[i % 2],
    city: cities[i % cities.length],
    country: 'India',
    isActive: Math.random() > 0.2,
    isVerified: Math.random() > 0.3,
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalDatesAttended: Math.floor(Math.random() * 20),
    profileScore: 60 + Math.floor(Math.random() * 40),
    job: jobs[i % jobs.length],
    salary: 800000 + Math.floor(Math.random() * 3000000),
    education: education[i % education.length],
    loveTokens: Math.floor(Math.random() * 100),
    submittedAvailability: Math.random() > 0.3,
    verificationStatus: {
      idVerified: Math.random() > 0.2,
      workVerified: Math.random() > 0.4
    }
  });
}

// Generate suggested matches for a user
export const generateSuggestedMatches = (user: User): SuggestedMatch[] => {
  const oppositeGenderUsers = mockUsers.filter(u => 
    u.id !== user.id && 
    u.gender !== user.gender &&
    u.isActive
  );
  
  return oppositeGenderUsers.slice(0, 10).map(matchUser => {
    const userSlots = generateTimeSlots(user.id);
    const matchUserSlots = generateTimeSlots(matchUser.id);
    
    // Find matching slots
    const matchingOnlineSlots = userSlots.filter(us => 
      us.mode === 'online' && 
      matchUserSlots.some(ms => 
        ms.mode === 'online' &&
        ms.date === us.date &&
        ms.timeBlock === us.timeBlock
      )
    );
    
    const matchingOfflineSlots = userSlots.filter(us => 
      us.mode === 'offline' && 
      matchUserSlots.some(ms => 
        ms.mode === 'offline' &&
        ms.date === us.date &&
        ms.timeBlock === us.timeBlock
      )
    );
    
    // Simulate some users having scheduled dates
    const hasScheduledDate = Math.random() > 0.7; // 30% chance of having scheduled date
    
    return {
      user: matchUser,
      matchScore: 60 + Math.floor(Math.random() * 40),
      compatibilityReasons: [
        'Similar age group',
        'Same city',
        'Compatible education level',
        'Shared interests in travel'
      ].slice(0, Math.floor(Math.random() * 4) + 1),
      commonInterests: ['Travel', 'Movies', 'Food', 'Music'].slice(0, Math.floor(Math.random() * 3) + 1),
      availableSlots: {
        online: matchingOnlineSlots.slice(0, 5),
        offline: matchingOfflineSlots.slice(0, 5)
      },
      matchingSlotsCounts: {
        online: matchingOnlineSlots.length,
        offline: matchingOfflineSlots.length
      },
      previousDates: Math.random() > 0.8 ? [{
        dateId: 'date-1',
        date: '2024-01-01',
        feedback: 'Good conversation',
        rating: 4
      }] : undefined,
      alreadyHasDateThisWeek: Math.random() > 0.9,
      hasScheduledDate,
      scheduledDateInfo: hasScheduledDate ? {
        dateId: `scheduled-${matchUser.id}`,
        scheduledOn: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        slot: matchingOnlineSlots[0] || matchingOfflineSlots[0],
        otherUser: `User ${Math.floor(Math.random() * 50)}`
      } : undefined
    };
  });
};

export const mockGenies: Genie[] = [
  {
    id: 'genie-1',
    name: 'Riya Admin',
    email: 'riya@datifyy.com',
    isActive: true,
    specialization: 'Professional Matches',
    totalDatesCurated: 156,
    successRate: 78.5
  },
  {
    id: 'genie-2',
    name: 'Amit Admin',
    email: 'amit@datifyy.com',
    isActive: true,
    specialization: 'Creative Matches',
    totalDatesCurated: 89,
    successRate: 82.3
  },
  {
    id: 'genie-3',
    name: 'Sneha Admin',
    email: 'sneha@datifyy.com',
    isActive: true,
    specialization: 'Long-term Relationships',
    totalDatesCurated: 234,
    successRate: 85.7
  }
];

export const mockOfflineLocations: OfflineLocation[] = [
  {
    id: 'loc-1',
    name: 'Cafe Coffee Day - Bandra',
    address: 'Linking Road, Bandra West, Mumbai',
    googleMapsUrl: 'https://maps.google.com/?q=Cafe+Coffee+Day+Bandra',
    latitude: 19.0596,
    longitude: 72.8295,
    type: 'cafe',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    amenities: ['WiFi', 'AC', 'Parking'],
    rating: 4.2,
    priceRange: '₹₹'
  },
  {
    id: 'loc-2',
    name: 'Starbucks - Connaught Place',
    address: 'Block A, Connaught Place, New Delhi',
    googleMapsUrl: 'https://maps.google.com/?q=Starbucks+Connaught+Place',
    latitude: 28.6328,
    longitude: 77.2197,
    type: 'cafe',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    amenities: ['WiFi', 'AC', 'Outdoor Seating'],
    rating: 4.5,
    priceRange: '₹₹₹'
  },
  {
    id: 'loc-3',
    name: 'Cubbon Park',
    address: 'Kasturba Road, Bangalore',
    googleMapsUrl: 'https://maps.google.com/?q=Cubbon+Park+Bangalore',
    latitude: 12.9763,
    longitude: 77.5929,
    type: 'park',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    amenities: ['Walking Paths', 'Benches', 'Gardens'],
    rating: 4.6,
    priceRange: 'Free'
  }
];

// Function to simulate API delay
export const simulateApiDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};