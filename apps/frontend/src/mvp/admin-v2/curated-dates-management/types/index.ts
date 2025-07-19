/**
 * Curated Dates Management Types
 */

export interface CuratedDateDetails {
  id: string;
  dateId: string;
  user1: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    age: number;
    city: string;
  };
  user2: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    age: number;
    city: string;
  };
  dateType: 'online' | 'offline';
  scheduledAt: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no_show';
  location?: {
    name: string;
    address: string;
    city: string;
    mapUrl?: string;
  };
  genie?: {
    id: string;
    name: string;
    email: string;
  };
  feedback?: {
    user1: UserFeedback;
    user2: UserFeedback;
  };
  matchScore: number;
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  cancellationReason?: string;
  notes?: string;
}

export interface UserFeedback {
  rating: number;
  interested: boolean;
  comments?: string;
  submittedAt: string;
}

export interface DateStats {
  total: number;
  scheduled: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  noShow: number;
  successRate: number;
  averageRating: number;
}

export interface DateFilters {
  search: string;
  status?: 'all' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no_show';
  dateType?: 'all' | 'online' | 'offline';
  dateRange?: {
    from: string;
    to: string;
  };
  city?: string;
  genie?: string;
  hasIssues?: boolean;
}

export interface CuratedDatesManagementState {
  dates: CuratedDateDetails[];
  selectedDate: CuratedDateDetails | null;
  stats: DateStats | null;
  isLoading: boolean;
  error: string | null;
  filters: DateFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
}