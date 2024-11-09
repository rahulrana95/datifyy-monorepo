// src/store/useEventStore.ts

import { create } from "zustand";
import axios from "axios";
import { EventFormData } from "../admin/events/createEventModal";

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
}

export interface EventStore {
  events: Event[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: CreateEventRequest) => Promise<{
    error?: string;
    success?: boolean;
  }>;
}

export interface CreateEventRequest extends EventFormData {
  createdby: number;
  updatedby: number;
}

const useEventStore = create<EventStore>((set) => ({
  events: [],
  loading: false,

  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<Event[]>(
        "http://localhost:3453/api/v1/events?createdby=desc&updatedby=desc"
      ); // Adjust the endpoint based on your API
      set({ events: response.data });
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (eventData: CreateEventRequest) => {
    try {
      const response = await axios.post(
        "http://localhost:3453/api/v1/events",
        eventData
      ); // Adjust the endpoint based on your API
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
    }
  },
}));

export default useEventStore;
