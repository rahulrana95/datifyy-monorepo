/**
 * Mock Data for Genie Section
 */

import { GenieDate, DateLocation, ReminderTemplate, UserDetails, VerificationStatus } from '../types';

// Helper function to generate verification status
const generateVerificationStatus = (): VerificationStatus => ({
  phoneVerified: Math.random() > 0.3,
  emailVerified: Math.random() > 0.2,
  officeEmailVerified: Math.random() > 0.5,
  collegeVerified: Math.random() > 0.6,
  idVerified: Math.random() > 0.4,
  workVerified: Math.random() > 0.5,
  linkedinVerified: Math.random() > 0.7,
});

// Helper function to generate notes based on status
const generateNotesForStatus = (status: GenieDate['status']): string | undefined => {
  const notesByStatus = {
    upcoming: [
      'Both users have confirmed availability. High compatibility score.',
      'First date for both users. Please ensure smooth experience.',
      'Users have similar interests in travel and music.',
      'Previous date was rescheduled. Both are excited for this one.',
      'VIP users - extra attention needed.',
    ],
    ongoing: [
      'Date started on time. Both users joined promptly.',
      'Initial conversation going well. Good chemistry observed.',
      'Users are engaged in deep conversation about shared interests.',
      'Technical issues resolved. Date proceeding smoothly.',
      'Both users seem comfortable and enjoying the interaction.',
    ],
    completed: [
      'Date went exceptionally well. Both expressed interest in second date.',
      'Good conversation but no romantic spark. Remained friends.',
      'Users had great chemistry. Exchanged contact information.',
      'Date completed successfully. Awaiting user feedback.',
      'Both users rated the experience highly.',
    ],
    cancelled: [
      'User 1 had emergency. Requested reschedule.',
      'Both users agreed to cancel due to scheduling conflict.',
      'Technical issues prevented date from happening.',
      'User 2 not feeling well. Cancelled last minute.',
      'Mutual cancellation due to changed preferences.',
    ],
    rescheduled: [
      'Original date postponed due to user 1 travel plans.',
      'Both users requested different time slot.',
      'Rescheduled to accommodate work commitments.',
      'Changed from online to offline mode per user request.',
      'Moved to next week for better preparation.',
    ],
  };
  
  const notes = notesByStatus[status];
  return Math.random() > 0.3 ? notes[Math.floor(Math.random() * notes.length)] : undefined;
};

// Helper function to generate feedback based on status
const generateFeedbackForStatus = (status: GenieDate['status']): GenieDate['feedback'] | undefined => {
  if (status !== 'completed' || Math.random() > 0.7) return undefined;
  
  const feedbacks = [
    {
      user1: 'Had an amazing time! Would love to meet again.',
      user2: 'Great conversation and connection. Looking forward to next date.',
      genieNotes: 'Perfect match! Both users are planning a second date.',
    },
    {
      user1: 'Nice person but didn\'t feel the romantic connection.',
      user2: 'Enjoyed the conversation but more as friends.',
      genieNotes: 'Good interaction but no romantic chemistry. Both handled it maturely.',
    },
    {
      user1: 'Wonderful experience! Found so many common interests.',
      user2: 'Best date I\'ve had through Datifyy. Thank you!',
      genieNotes: 'Highly successful date. Users exchanged numbers.',
    },
    {
      user1: 'Good date overall. Would like to know them better.',
      user2: 'Interesting person. Open to exploring further.',
      genieNotes: 'Positive experience. Both interested in second date.',
    },
    {
      user1: 'The conversation flowed naturally. Very comfortable.',
      user2: 'Felt like talking to an old friend. Great match!',
      genieNotes: 'Excellent compatibility. Natural chemistry observed.',
    },
  ];
  
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
};

// Helper function to generate reminder status based on date status
const generateReminderStatus = (status: GenieDate['status']): GenieDate['remindersSent'] => {
  switch (status) {
    case 'upcoming':
      // Most upcoming dates should have reminders sent
      const upcomingSent = Math.random() > 0.2;
      return {
        user1: upcomingSent,
        user2: upcomingSent,
        lastSentAt: upcomingSent 
          ? new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString()
          : undefined,
      };
    
    case 'ongoing':
      // All ongoing dates should have reminders sent
      return {
        user1: true,
        user2: true,
        lastSentAt: new Date(Date.now() - Math.floor(Math.random() * 2 * 60 * 60 * 1000)).toISOString(), // Within last 2 hours
      };
    
    case 'completed':
      // Most completed dates had reminders
      const completedSent = Math.random() > 0.1;
      return {
        user1: completedSent,
        user2: completedSent,
        lastSentAt: completedSent 
          ? new Date(Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000)).toISOString()
          : undefined,
      };
    
    case 'cancelled':
      // Some cancelled dates had reminders before cancellation
      const cancelledSent = Math.random() > 0.6;
      return {
        user1: cancelledSent,
        user2: cancelledSent,
        lastSentAt: cancelledSent 
          ? new Date(Date.now() - Math.floor(Math.random() * 72 * 60 * 60 * 1000)).toISOString()
          : undefined,
      };
    
    case 'rescheduled':
      // Mix of sent and not sent for rescheduled
      const rescheduledSent = Math.random() > 0.4;
      return {
        user1: rescheduledSent,
        user2: rescheduledSent,
        lastSentAt: rescheduledSent 
          ? new Date(Date.now() - Math.floor(Math.random() * 36 * 60 * 60 * 1000)).toISOString()
          : undefined,
      };
    
    default:
      return {
        user1: false,
        user2: false,
        lastSentAt: undefined,
      };
  }
};

// Helper function to generate user details
const generateUserDetails = (id: string, gender: 'male' | 'female'): UserDetails => {
  const firstNames = {
    male: ['Rahul', 'Arjun', 'Vikram', 'Karan', 'Aditya', 'Rohan', 'Nikhil', 'Siddharth'],
    female: ['Priya', 'Neha', 'Ananya', 'Kavya', 'Shreya', 'Pooja', 'Divya', 'Riya'],
  };
  
  const lastNames = ['Sharma', 'Verma', 'Singh', 'Patel', 'Gupta', 'Kumar', 'Mehta', 'Jain'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
  const companies = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Paytm', 'Swiggy', 'Zomato'];
  const colleges = ['IIT Delhi', 'IIT Bombay', 'IIM Ahmedabad', 'BITS Pilani', 'NIT Trichy', 'VIT'];
  
  const firstName = firstNames[gender][Math.floor(Math.random() * firstNames[gender].length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const isStudent = Math.random() > 0.7;
  
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
    phone: `+91${Math.floor(9000000000 + Math.random() * 999999999)}`,
    profilePicture: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    age: 24 + Math.floor(Math.random() * 10),
    gender,
    city: cities[Math.floor(Math.random() * cities.length)],
    occupation: isStudent ? 'Student' : 'Software Engineer',
    company: isStudent ? undefined : companies[Math.floor(Math.random() * companies.length)],
    college: isStudent ? colleges[Math.floor(Math.random() * colleges.length)] : undefined,
    isStudent,
    verificationStatus: generateVerificationStatus(),
    profileScore: 60 + Math.floor(Math.random() * 40),
    bio: 'Love traveling, cooking, and meeting new people. Looking for meaningful connections.',
    interests: ['Travel', 'Music', 'Food', 'Movies', 'Reading'].slice(0, Math.floor(Math.random() * 3) + 2),
    languages: ['English', 'Hindi', 'Marathi'].slice(0, Math.floor(Math.random() * 2) + 1),
    height: `${160 + Math.floor(Math.random() * 30)} cm`,
    religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other'][Math.floor(Math.random() * 5)],
    drinking: ['never', 'occasionally', 'socially', 'regularly'][Math.floor(Math.random() * 4)] as 'never' | 'occasionally' | 'socially' | 'regularly',
    smoking: ['never', 'occasionally', 'socially', 'regularly'][Math.floor(Math.random() * 4)] as 'never' | 'occasionally' | 'socially' | 'regularly',
  };
};

// Mock locations
export const mockLocations: DateLocation[] = [
  {
    id: 'loc-1',
    name: 'Starbucks - Bandra',
    address: 'Linking Road, Bandra West, Mumbai 400050',
    googleMapsUrl: 'https://maps.google.com/?q=Starbucks+Bandra+Mumbai',
    latitude: 19.0596,
    longitude: 72.8295,
    type: 'cafe',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    amenities: ['WiFi', 'AC', 'Parking'],
    rating: 4.5,
    priceRange: '₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
  },
  {
    id: 'loc-2',
    name: 'Blue Tokai Coffee - Connaught Place',
    address: 'Block A, Inner Circle, Connaught Place, New Delhi 110001',
    googleMapsUrl: 'https://maps.google.com/?q=Blue+Tokai+Coffee+CP+Delhi',
    latitude: 28.6328,
    longitude: 77.2197,
    type: 'cafe',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    amenities: ['WiFi', 'AC', 'Pet Friendly'],
    rating: 4.7,
    priceRange: '₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400',
  },
  {
    id: 'loc-3',
    name: 'Cubbon Park',
    address: 'Kasturba Road, Bangalore 560001',
    googleMapsUrl: 'https://maps.google.com/?q=Cubbon+Park+Bangalore',
    latitude: 12.9763,
    longitude: 77.5929,
    type: 'park',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    amenities: ['Walking Paths', 'Benches', 'Gardens', 'Public Restrooms'],
    rating: 4.6,
    priceRange: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
  },
  {
    id: 'loc-4',
    name: 'Social - Hauz Khas',
    address: '9A & 12, Hauz Khas Village, New Delhi 110016',
    googleMapsUrl: 'https://maps.google.com/?q=Social+Hauz+Khas+Delhi',
    latitude: 28.5494,
    longitude: 77.2001,
    type: 'restaurant',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    amenities: ['WiFi', 'AC', 'Bar', 'Live Music'],
    rating: 4.3,
    priceRange: '₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  },
];

// Mock reminder templates
export const mockReminderTemplates: ReminderTemplate[] = [
  {
    id: 'template-1',
    name: 'Date Tomorrow Reminder',
    subject: 'Your Datifyy date is tomorrow! 💕',
    body: `Hi {{userName}},

This is a friendly reminder that you have a date scheduled tomorrow with {{partnerName}}!

📅 Date: {{dateTime}}
📍 Location: {{location}}
💬 Mode: {{mode}}

Please make sure to:
✓ Confirm your attendance
✓ Review your partner's profile
✓ Be on time
✓ Have a great time!

If you need to reschedule, please let us know ASAP.

Best wishes,
Team Datifyy`,
    type: 'email',
    variables: ['userName', 'partnerName', 'dateTime', 'location', 'mode'],
  },
  {
    id: 'template-2',
    name: 'Date Today Reminder',
    subject: 'Your date is today! Get ready 🎉',
    body: `Hi {{userName}},

Your date with {{partnerName}} is happening today!

⏰ Time: {{dateTime}}
📍 Where: {{location}}

Quick tips:
• Be yourself
• Listen actively
• Have fun!

We're rooting for you! 🌟

Team Datifyy`,
    type: 'email',
    variables: ['userName', 'partnerName', 'dateTime', 'location'],
  },
  {
    id: 'template-3',
    name: 'Date in 1 Hour SMS',
    subject: '',
    body: `Datifyy: Hi {{userName}}! Your date with {{partnerName}} starts in 1 hour at {{location}}. Don't be late! 😊`,
    type: 'sms',
    variables: ['userName', 'partnerName', 'location'],
  },
];

// Generate mock dates
export const generateMockDates = (genieId: string, genieName: string): GenieDate[] => {
  const dates: GenieDate[] = [];
  const timeBlocks = ['morning', 'afternoon', 'evening', 'night'] as const;
  
  // Ensure good distribution of statuses
  // First 15: upcoming dates
  // Next 10: ongoing dates
  // Next 15: completed dates
  // Next 5: cancelled dates
  // Last 5: rescheduled dates
  
  // Generate 50 dates
  for (let i = 1; i <= 50; i++) {
    let status: GenieDate['status'];
    
    // Determine status based on index to ensure good distribution
    if (i <= 15) {
      status = 'upcoming';
    } else if (i <= 25) {
      status = 'ongoing';
    } else if (i <= 40) {
      status = 'completed';
    } else if (i <= 45) {
      status = 'cancelled';
    } else {
      status = 'rescheduled';
    }
    
    const mode = Math.random() > 0.5 ? 'online' : 'offline';
    const user1 = generateUserDetails(`user-${i}-1`, Math.random() > 0.5 ? 'male' : 'female');
    const user2 = generateUserDetails(`user-${i}-2`, user1.gender === 'male' ? 'female' : 'male');
    
    // Calculate date based on status
    let scheduledDate = new Date();
    if (status === 'upcoming') {
      // Upcoming dates: 1-7 days in the future
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 7) + 1);
    } else if (status === 'ongoing') {
      // Ongoing dates: Today, different times
      const currentHour = new Date().getHours();
      scheduledDate.setHours(currentHour - Math.floor(Math.random() * 2)); // Started within last 2 hours
    } else if (status === 'completed' || status === 'cancelled') {
      // Past dates: 1-30 days ago
      scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 30) - 1);
    } else if (status === 'rescheduled') {
      // Rescheduled dates: Mix of past and future
      if (Math.random() > 0.5) {
        scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 5) + 1);
      } else {
        scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 10) - 1);
      }
    }
    
    const timeBlock = timeBlocks[Math.floor(Math.random() * timeBlocks.length)];
    const timeSlotMap = {
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '12:00', end: '16:00' },
      evening: { start: '16:00', end: '20:00' },
      night: { start: '20:00', end: '23:00' },
    };
    
    const date: GenieDate = {
      id: `date-${i}`,
      user1,
      user2,
      scheduledDate: scheduledDate.toISOString(),
      timeSlot: {
        startTime: timeSlotMap[timeBlock].start,
        endTime: timeSlotMap[timeBlock].end,
        timeBlock,
      },
      mode,
      location: mode === 'offline' ? mockLocations[Math.floor(Math.random() * mockLocations.length)] : undefined,
      status,
      genieId,
      genieName,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: generateNotesForStatus(status),
      feedback: generateFeedbackForStatus(status),
      remindersSent: generateReminderStatus(status),
      meetingLink: mode === 'online' ? `https://meet.datifyy.com/date-${i}` : undefined,
    };
    
    dates.push(date);
  }
  
  // Shuffle the dates to mix different statuses
  // This ensures that pagination doesn't show only one type
  const shuffledDates = dates.sort(() => Math.random() - 0.5);
  
  return shuffledDates;
};

// Function to simulate API delay
export const simulateApiDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};