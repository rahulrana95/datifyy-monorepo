/**
 * Genie Section Types
 * Types for genie date management
 */

export interface VerificationStatus {
  phoneVerified: boolean;
  emailVerified: boolean;
  officeEmailVerified: boolean;
  collegeVerified?: boolean;
  idVerified: boolean;
  workVerified: boolean;
  linkedinVerified?: boolean;
}

export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  occupation: string;
  company?: string;
  college?: string;
  isStudent: boolean;
  verificationStatus: VerificationStatus;
  profileScore: number;
  bio?: string;
  interests: string[];
  languages: string[];
  height?: string;
  religion?: string;
  drinking?: 'never' | 'occasionally' | 'socially' | 'regularly';
  smoking?: 'never' | 'occasionally' | 'socially' | 'regularly';
}

export interface DateLocation {
  id: string;
  name: string;
  address: string;
  googleMapsUrl: string;
  latitude: number;
  longitude: number;
  type: 'cafe' | 'restaurant' | 'park' | 'coworking' | 'other';
  city: string;
  state: string;
  country: string;
  amenities?: string[];
  rating?: number;
  priceRange?: string;
  imageUrl?: string;
}

export interface GenieDate {
  id: string;
  user1: UserDetails;
  user2: UserDetails;
  scheduledDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
    timeBlock: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  mode: 'online' | 'offline';
  location?: DateLocation;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'rescheduled';
  genieId: string;
  genieName: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  feedback?: {
    user1?: string;
    user2?: string;
    genieNotes?: string;
  };
  remindersSent: {
    user1: boolean;
    user2: boolean;
    lastSentAt?: string;
  };
  meetingLink?: string; // For online dates
}

export interface DateFilters {
  status?: 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  mode?: 'all' | 'online' | 'offline';
  verificationStatus?: 'all' | 'both-verified' | 'one-verified' | 'none-verified';
}

export interface ReminderTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'whatsapp';
  variables: string[]; // e.g., ['userName', 'dateTime', 'location', 'partnerName']
}

export interface GenieSectionState {
  dates: GenieDate[];
  selectedDate: GenieDate | null;
  isLoading: boolean;
  error: string | null;
  filters: DateFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
  locations: DateLocation[];
  reminderTemplates: ReminderTemplate[];
  selectedTemplate: ReminderTemplate | null;
}

export interface RescheduleRequest {
  dateId: string;
  newDate: string;
  newTimeSlot: {
    startTime: string;
    endTime: string;
    timeBlock: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  newMode?: 'online' | 'offline';
  newLocationId?: string;
  reason?: string;
}

export interface SendReminderRequest {
  dateId: string;
  templateId: string;
  recipients: ('user1' | 'user2' | 'both')[];
  customMessage?: string;
}

export interface DateStats {
  totalDates: number;
  upcomingDates: number;
  completedDates: number;
  cancelledDates: number;
  successRate: number;
  averageRating: number;
}