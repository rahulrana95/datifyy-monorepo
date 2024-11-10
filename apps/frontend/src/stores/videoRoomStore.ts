import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import axios from "axios";

export const authToken: string = process.env.REACT_APP_VIDEO_TOKEN ?? "N/A";

// API call to create a meeting
export const createMeeting = async ({ token }: { token: string }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${authToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    const { roomId }: { roomId: string } = await res.json();
    return roomId;
};

interface RoomAssignment {
    id: string;
    name: string;
    userEmail: string;
    roomId: string;
}

interface UserMatch {
    email: string;
    roomId: string;
}


interface UserRoom {
    email: string;
    gender: string;
    roomId: string;
}

interface Response {
    success?: boolean;
    error?: string;
}

// Zustand store
interface VideoRoomState {
    roomId: string | null;
    roomIds: string[];
    userRoom: UserRoom | null;
    userMatch: UserMatch | null;
    sessions: any[];
    isCreatingMeeting: boolean;
    createRoomsOnVideoSdk: (n: number) => Promise<void>;
    roomAssignments: RoomAssignment[];
    isUpdatingRooms: boolean;
    isFetchingRooms: boolean;
    isFetchingUserRoom: boolean;
    error: string | null;
    updateUserRooms: (id: number, roomAssignments: RoomAssignment[]) => Promise<{
        success?: boolean;
        error?: string;
    }>;
    getRoomsForEvent: (eventId: number) => Promise<void>;
    validateRoomId: (roomId: string) => Promise<Response>;
    createVideoChatSessions: (eventId: number) => Promise<Response>;
    getVideoChatSessions: (eventId: number) => Promise<Response>;
    createMeeting: () => Promise<string>;
    createMultipleMeetings: (userEmails: string[]) => Promise<Response>;
    getNextMatch: (eventId: string, email: string) => Promise<Response>;
    getUserRooms: (eventId: number, email: string) => Promise<Response>;
}

export const useVideoRoomStore = create<VideoRoomState>()(
    devtools((set, get) => ({
        roomId: null,
        roomIds: [],
        sessions: [],
        userMatch: null,
        userRoom: null,
        isCreatingMeeting: false,
        isFetchingUserRoom: false,
        error: null,
        roomAssignments: [],
        isUpdatingRooms: false,
        isFetchingRooms: false,

        createRoomsOnVideoSdk: async (numberOfRooms: number) => {
            try {
                set({ isCreatingMeeting: true, error: null });

                const createRoomBatch = async (batchSize: number, startIndex: number) => {
                    // Create rooms in batches of 10
                    const rooms = [];
                    for (let i = startIndex; i < startIndex + batchSize; i++) {
                        try {
                            const roomId = await createMeeting({ token: authToken });
                            rooms.push(roomId);
                        } catch (error) {
                            console.error(`Error creating room ${i + 1}:`, error);
                        }
                    }
                    return rooms;
                };

                let createdRooms: string[] = [];
                const batchSize = 10;

                // Loop through and create rooms in batches
                for (let i = 0; i < numberOfRooms; i += batchSize) {
                    const batchRooms = await createRoomBatch(batchSize, i);
                    createdRooms = [...createdRooms, ...batchRooms];
                }


                // Update state with the created roomIds
                set({ roomIds: createdRooms });

            } catch (error) {
                console.error("Error creating meetings:", error);
                set({ error: "Failed to create meeting. Please try again." });
            } finally {
                set({ isCreatingMeeting: false });
            }
        },

        updateUserRooms: async (eventId: number, roomAssignments: RoomAssignment[]) => {
            try {
                set({ isUpdatingRooms: true, error: null });

                // Assuming you have an API endpoint that handles the room updates
                await axiosInstance.post(`/events/${eventId}/updateRooms`, { roomAssignments });

                return {
                    success: true,
                }

            } catch (error: any) {
                console.error("Error updating rooms:", error);
                set({ error: error?.response?.data?.message || "An error occurred while updating rooms" });
                return {
                    error: "An error occurred while updating rooms"
                }
            } finally {
                set({ isUpdatingRooms: false });
            }
        },

        getRoomsForEvent: async (eventId: number) => {
            try {
                set({ isUpdatingRooms: true, error: null });
                // Fetch room assignments for the event
                const response = await axiosInstance.get(`/events/${eventId}/rooms`);

                // Update state with the room assignments
                set({ roomAssignments: response.data?.rooms ?? [] });

            } catch (error: any) {
                console.error("Error fetching room assignments:", error);
                set({ error: error?.response?.data?.message || "An error occurred while fetching room assignments" });
            } finally {
                set({ isUpdatingRooms: false });
            }
        },

        validateRoomId: async (roomId: string) => {
            try {
                await axios.get(`https://api.videosdk.live/v2/rooms/validate/${roomId}`, {
                    headers: {
                        authorization: `${authToken}`,
                    }
                });
                return {
                    success: true
                }
            } catch (error: any) {
                console.error("Error validating room ID:", error);
                return {
                    error: error?.response?.data?.message || "An error occurred while validating room ID"
                }
            }
        },

        createVideoChatSessions: async (eventId: number) => {
            try {
                await axiosInstance.post(`/events/${eventId}/create-video-chat-session`);
                return {
                    success: true
                }
            } catch (error: any) {
                console.error("Error creating video chat sessions:", error);
                return {
                    error: error?.response?.data?.message || "An error occurred while creating video chat sessions"
                }
            }
        },
        getVideoChatSessions: async (eventId: number) => {
            try {
                const response = await axiosInstance.get(`/events/${eventId}/video-chat-sessions`);
                set({ sessions: response.data?.sessions ?? [] });
                return {
                    success: true,
                }
            } catch (error: any) {
                console.error("Error fetching video chat sessions:", error);
                return {
                    error: error?.response?.data?.message || "An error occurred while fetching video chat sessions"
                }
            }
        },
        createMeeting: async () => {
            const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
                method: "POST",
                headers: {
                    authorization: `${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                }),
            });
            //Destructuring the roomId from the response
            const { roomId }: { roomId: string } = await res.json();
            return roomId;
        },

        createMultipleMeetings: async (
            userEmails: string[]
        ): Promise<{
            success?: boolean;
            error?: string;
        }> => {
            const createMeeting = get().createMeeting;
            try {
                const roomPromises = userEmails.map(async (email) => {
                    const roomId = await createMeeting(); // Create a meeting for each user
                    return { email, roomId }; // Return an object with the email and roomId
                });

                // Wait for all the room creations to complete
                const roomDetails = await Promise.all(roomPromises);


                // Send the room details to the backend
                const response = await axiosInstance.post("/rooms", {
                   body: roomDetails
                } );

                return {
                    success: true
                }
            } catch (error) {
                return {
                    error: 'Failed to save rooms in the database'
                }
            }
        },

        getNextMatch: async (eventId: string, email: string) => {
            try {
                const response = await axiosInstance.get(`events/${eventId}/live/${email}/next-user-to-match`);
                
                const { nextUser } = response.data;
                
                set({
                    userMatch: {
                        email: nextUser.userEmail,
                        roomId: nextUser.roomId,
                } });
                return {
                    success: true,
                };
            } catch (error: any) {
                return {
                    error: error?.response?.data?.message || "An error occurred while fetching next match"
                };
            }
        },
        getUserRooms: async (eventId: number, email: string) => {
            try {
                set({ isFetchingUserRoom: true, error: null });
                const response = await axiosInstance.get(`/events/${eventId}/rooms/${email}`);
                set({
                    userRoom: {
                        email: response.data?.userEmail ?? '',
                        gender: response.data?.gender ?? '',
                        roomId: response.data?.roomId ?? '',
                } });
                return {
                    success: true,
                }
            } catch (error: any) {
                return {
                    error: "An error occurred while fetching user rooms"
                }
            } finally {
                set({ isFetchingUserRoom: false });
            }
        }

    }))
);
