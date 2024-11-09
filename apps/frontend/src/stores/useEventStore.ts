// src/store/useEventStore.ts

import { create } from "zustand";
import axios from "axios";
import { EventFormData } from "../admin/events/createEventModal";
import axiosInstance from "../utils/axios";

export interface Event {
  id: number;
  eventdate: Date;
  totalmenstickets: number;
  totalfemaletickets: number;
  menticketprice: string;
  womenticketprice: string;
  currencycode: string;
  mode: string;
  type: string;
  title: string;
  location: string;
  description: string | null;
  photos: string[] | null;
  isdeleted: boolean | null;
  maxcapacity: number;
  registrationdeadline: Date | null;
  refundpolicy: string | null;
  tags: string[] | null;
  socialmedialinks: string[] | null;
  createdby: string; // Adjust based on your user model
  updatedby: string; // Adjust based on your user model
  status: string;
  coverimageurl?: string;
  durationObj?: {
    hours: number;
    minutes: number;
  };
  duration: number;
  createdat: string;
  updatedat: string;
}

export interface EventStore {
  events: Event[];
  event: Event | null;
  loading: boolean;
  fetchEvents: () => Promise<void>;
  fetchEvent: (eventId: number) => Promise<void>;
  createEvent: (eventData: CreateEventRequest) => Promise<{
    error?: string;
    success?: boolean;
  }>;
  updateEvent: (eventId: number, eventData: Partial<Event>) => Promise<{error?: string, success?: boolean}>;
  deleteEvent: (id: number) => Promise<boolean>;
  deleteMultipleEvents: (id: number[]) => Promise<boolean>;
    isDeleteEventInProgress: boolean,
  isEventCreationInProgress: boolean,
  isFetchingEvent: boolean
}

export interface CreateEventRequest extends EventFormData {
  createdby: number;
  updatedby: number;
}

const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  event: null,
  loading: false,
  isDeleteEventInProgress: false,
  isFetchingEvent: false,
  isEventCreationInProgress: false,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get<Event[]>(
        "/events?createdby=desc&updatedby=desc"
      ); // Adjust the endpoint based on your API
      set({ events: response.data });
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchEvent: async (eventId: number) => {
    set({ isFetchingEvent: true });
    try {
      const response = await axiosInstance.get<Event>(
        `/events/${eventId}`
      ); // Adjust the endpoint based on your API
      set({ event: response.data });
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
       set({ isFetchingEvent: false });
    }
  },
  

  createEvent: async (eventData: CreateEventRequest) => {
    try {
       set((state) => ({
        ...state,
        isEventCreationInProgress: true
      }))
      const response = await axiosInstance.post("/events", eventData); // Adjust the endpoint based on your API
      // Directly update the events with the newly created event from the response
      set((state) => ({
        events: [...state.events, response.data], // Assuming response.data contains the created event with an id
      }));
      return {
        success: true,
      };
    } catch (error) {
      // Type the error as AxiosError for more specific access to the error details
      if (axios.isAxiosError(error)) {
        return {
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Unknown error occurred",
        };
      }
      // If the error is not from axios, fallback to a generic error message
      return {
        error: "An unknown error occurred",
      };
    } finally {
       set((state) => ({
        ...state,
        isEventCreationInProgress: false
      }))
    }
  },

  updateEvent: async (eventId: number, eventData: Partial<Event>) => {
  try {
    set((state) => ({
      ...state,
      isEventUpdateInProgress: true,
    }));
    
    await axiosInstance.put(`/events/${eventId}`, eventData); // Adjust the endpoint based on your API

    // Access fetchEvent using getState and call it
    get().fetchEvent(eventId);
    
    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Unknown error occurred",
      };
    }
    return {
      error: "An unknown error occurred",
    };
  } finally {
    set((state) => ({
      ...state,
      isEventUpdateInProgress: false,
    }));
  }
},


  // Delete a single event
  deleteEvent: async (eventId: number) => {
    try {
      set((state) => ({
        ...state,
        isDeleteEventInProgress: true
      }))
      // Make the API call to delete the event
      await axiosInstance.delete(`/events/${eventId}`);

      // Update the state to remove the deleted event from the list
      set((state) => ({
        ...state,
        events: state.events.filter((event) => event.id !== eventId),
      }));
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    } finally {
       set((state) => ({
        ...state,
        isDeleteEventInProgress: false
      }))
    }
  },

  // Bulk delete events
  deleteMultipleEvents: async (eventIds: number[]) => {
    try {
       set((state) => ({
        ...state,
        isDeleteEventInProgress: true
      }))
      // Make the API call to delete multiple events
      await axiosInstance.post("/events/bulk-delete", { eventIds });

      set((state) => ({
        ...state,
        events: state.events.filter((event) => !eventIds.includes(event.id)),
      }));
      return true;
    } catch (error) {
      console.error("Error deleting multiple events:", error);
      return false;
    } finally {
       set((state) => ({
        ...state,
        isDeleteEventInProgress: false
      }))
    }
  },
}));

export default useEventStore;
