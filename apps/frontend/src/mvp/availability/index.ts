// apps/frontend/src/mvp/availability/index.ts
/**
 * Availability Module Exports
 * 
 * Main exports for the availability management feature.
 * Follow the same pattern as your profile module.
 */

// Main container component
export { default as AvailabilityContainer } from './AvailabilityContainer';

// Navigation component for header integration
export { default as AvailabilityNavLink } from '../header/AvailabilityNavLink';

// Core components (to be created next)
export { default as AvailabilityTabs } from './components/AvailabilityTabs';
export { default as AvailabilityCreateForm } from './components/AvailabilityCreateForm';
export { default as AvailabilityUpcomingList } from './components/AvailabilityUpcomingList';
export { default as AvailabilityPastList } from './components/AvailabilityPastList';
export { default as AvailabilityHeader } from './components/AvailabilityHeader';
export { default as AvailabilityStats } from './components/AvailabilityStats';

// Store
export { useAvailabilityStore } from './store/availabilityStore';

// Service
export { default as availabilityService } from './service/availabilityService';

// Types
export type {
  AvailabilitySlot,
  AvailabilityBooking,
  TimeSlot,
  DayAvailability,
  AvailabilityState,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AvailabilityTab
} from './types';

export {
  DateType,
  AvailabilityStatus,
  BookingStatus,
  SelectedActivity,
  AVAILABILITY_CONSTANTS
} from './types';

// Route configuration for easy integration into App.tsx
export const AVAILABILITY_ROUTES = {
  path: '/availability',
  component: 'AvailabilityContainer',
  title: 'Manage Availability',
  description: 'Set up and manage your dating availability',
  requiresAuth: true
} as const;