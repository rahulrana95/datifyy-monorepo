// src/store/useEventStore.ts

import {create} from 'zustand';
import axios from 'axios';

interface Event {
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
  createdby: string;  // Adjust based on your user model
  updatedby: string;  // Adjust based on your user model
}

interface EventStore {
  events: Event[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: Omit<Event, 'id'>) => Promise<void>;
}

const useEventStore = create<EventStore>((set) => ({
  events: [],
  loading: false,
  
  fetchEvents: async () => {
    set({ loading: true });
    try {
      const response = await axios.get<Event[]>('/api/events'); // Adjust the endpoint based on your API
      set({ events: response.data });
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      set({ loading: false });
    }
  },

  createEvent: async (eventData) => {
    try {
      await axios.post('/api/events', eventData); // Adjust the endpoint based on your API
      // Optionally refetch events after creating a new one
      await set((state) => ({
        events: [...state.events, { ...eventData, id: Date.now() }] // Mocking the id for now
      }));
    } catch (error) {
      console.error('Failed to create event', error);
    }
  },
}));

export default useEventStore;
