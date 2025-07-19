/**
 * Curate Dates Types
 * Extended types for matchmaking workflow
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  city: string;
  country: string;
  isActive: boolean;
  isVerified: boolean;
  lastActive: string;
  totalDatesAttended: number;
  profileScore: number;
  job?: string;
  salary?: number;
  education?: string;
  loveTokens: number;
  submittedAvailability: boolean;
  verificationStatus: {
    idVerified: boolean;
    workVerified: boolean;
  };
}

export interface TimeSlot {
  id: string;
  date: string;
  timeBlock: 'morning' | 'afternoon' | 'evening' | 'night';
  mode: 'online' | 'offline';
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface UserAvailability {
  userId: string;
  slots: TimeSlot[];
}

export interface SuggestedMatch {
  user: User;
  matchScore: number;
  compatibilityReasons: string[];
  commonInterests: string[];
  availableSlots: {
    online: TimeSlot[];
    offline: TimeSlot[];
  };
  matchingSlotsCounts: {
    online: number;
    offline: number;
  };
  previousDates?: {
    dateId: string;
    date: string;
    feedback?: string;
    rating?: number;
  }[];
  alreadyHasDateThisWeek: boolean;
  hasScheduledDate?: boolean;
  scheduledDateInfo?: {
    dateId: string;
    scheduledOn: string;
    slot: TimeSlot;
    otherUser: string;
  };
}

export interface CuratedDate {
  id?: string;
  user1: User;
  user2: User;
  selectedSlot: TimeSlot;
  mode: 'online' | 'offline';
  location?: OfflineLocation;
  genieId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
  notes?: string;
}

export interface OfflineLocation {
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
}

export interface Genie {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  specialization?: string;
  totalDatesCurated: number;
  successRate: number;
}

export interface TableFilters {
  search: string;
  gender?: 'all' | 'male' | 'female' | 'other';
  city?: string;
  verificationStatus?: 'all' | 'verified' | 'unverified';
  hasAvailability?: 'all' | 'yes' | 'no';
  ageRange?: {
    min: number;
    max: number;
  };
  salaryRange?: {
    min: number;
    max: number;
  };
  minProfileScore?: number;
}

export interface SuggestedMatchFilters {
  minMatchScore?: number;
  hasCommonSlots?: 'all' | 'online' | 'offline' | 'both';
  noPreviousDates?: boolean;
  city?: string;
  ageRange?: {
    min: number;
    max: number;
  };
}

export interface CurateDatesState {
  users: User[];
  selectedUser: User | null;
  suggestedMatches: SuggestedMatch[];
  selectedMatch: SuggestedMatch | null;
  selectedSlots: {
    online: TimeSlot | null;
    offline: TimeSlot | null;
  };
  genies: Genie[];
  selectedGenie: Genie | null;
  offlineLocations: OfflineLocation[];
  selectedLocation: OfflineLocation | null;
  curatedDate: CuratedDate | null;
  isLoading: boolean;
  error: string | null;
  filters: TableFilters;
  suggestedMatchFilters: SuggestedMatchFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
}