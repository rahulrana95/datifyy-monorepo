import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Grid } from '@mui/material';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import useEventStore from '../../stores/useEventStore';
import { useVideoRoomStore } from '../../stores/videoRoomStore';
import { useParams } from 'react-router-dom';
import { useSnackbarStore } from '../../stores/useSnackbarStore';
import { on } from 'events';

interface Participant {
    id: string;
    name: string;
    roomId: string;
    userEmail: string;
}

// RoomModal Component
const RoomModal: React.FC<{
    isOpen: boolean;
    numberOfRooms: number;
    setNumberOfRooms: (value: number) => void;
    onClose: () => void;
    onCreateRooms: () => void;
    isCreateButtonDisabled: boolean;
}> = ({ isOpen, numberOfRooms, setNumberOfRooms, onClose, onCreateRooms, isCreateButtonDisabled }) => (
    <Modal open={isOpen} onClose={onClose}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 400 }}>
            <Typography variant="h6">Enter Number of Rooms</Typography>
            <TextField
                label="Number of Rooms"
                type="number"
                fullWidth
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(Number(e.target.value))}
            />
            <Button variant="contained" color="primary" onClick={onCreateRooms} sx={{ marginTop: 2 }} disabled={isCreateButtonDisabled}>
                Generate Rooms
            </Button>

        </Box>
    </Modal>
);

// ParticipantCard Component
const ParticipantCard: React.FC<{
    participant: Participant;
    onUpdateRoomId: (id: string, newRoomId: string) => void;
    onDeleteRoomId: (id: string) => void;
    handleValidateRoom: (roomId: string) => void;
}> = ({ participant, onUpdateRoomId, onDeleteRoomId, handleValidateRoom }) => (
    <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 1 }}>
        <Typography variant="body1">{participant.name}</Typography>
        <TextField
            label="Room ID"
            fullWidth
            value={participant.roomId || ''}
            onChange={(e) => onUpdateRoomId(participant.id, e.target.value)}
            sx={{ marginTop: 1 }}
        />
        <Button
            variant="outlined"
            color="secondary"
            onClick={() => onDeleteRoomId(participant.id)}
            sx={{ marginTop: 1 }}
            size='small'
        >
            Delete Room ID
        </Button>
        <Button
            variant="contained"
            color="primary"
            size='small'
            onClick={() => handleValidateRoom(participant.roomId)}  // Replace with your specific handler
        >
            Validate Room
        </Button>
    </Box>
);

// Main VideoRooms Component
const VideoRooms: React.FC = () => {
    const { totalMen, totalWomen } = { totalMen: 5, totalWomen: 5 };
    const { eventId } = useParams();
    const { fetchEvent, event } = useEventStore();
    const { createRoomsOnVideoSdk, createVideoChatSessions, roomIds,
        updateUserRooms, validateRoomId, getRoomsForEvent,
        roomAssignments, isCreatingMeeting, isFetchingRooms,
        isUpdatingRooms } = useVideoRoomStore();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numberOfRooms, setNumberOfRooms] = useState<number>(0);
    const snackbar = useSnackbarStore();

    useEffect(() => {
        if (!eventId) return;
        fetchEvent(Number(eventId));
        getRoomsForEvent(Number(eventId));
    }, []);

    useEffect(() => {
        if (!event) return;
        setParticipants([...roomAssignments]);
    },
        [roomAssignments]
    );

    useEffect(() => {
        if (!event || participants.length) return;
        // Initialize participants based on the number of men and women
        const men = Array.from({ length: event.totalmenstickets }, (_, i) => {
            const id = uuidv4();
            return {
                id,
                name: `Man ${i + 1}`,
                roomId: '',
                userEmail: `${id}@idIsAssignedAsEmail(replace with actual email once real user is buy ticket).com`
            }
        });
        const women = Array.from({ length: event.totalfemaletickets }, (_, i) => {
            const id = uuidv4();
            return {
                id,
                name: `Man ${i + 1}`,
                roomId: '',
                userEmail: `${id}@idIsAssignedAsEmail(replace with actual email once real user is buy ticket).com`
            }
        });
        setParticipants([...men, ...women]);
    }, [event]);

    useEffect(() => {
        if (!roomIds.length || !participants.length) return;

        // check if all participants have room IDs
        const hasAllRoomIds = participants.every((participant) => participant.roomId);
        if (hasAllRoomIds) return;
        // Assign room IDs to participants
        const updatedParticipants = participants.map((participant) => {
            const roomId = roomIds.find((id) => !participants.some((p) => p.roomId === id));
            return { ...participant, roomId: roomId ?? '' };
        });
        setParticipants(updatedParticipants);
    }, [participants, roomIds]);

    const handleCreateRooms = async () => {
        // await createRoomsOnVideoSdk(numberOfRooms);
        setIsModalOpen(false);

    };

    const handleSameRoomAssignments = async () => {
        const { success, error } = await updateUserRooms(Number(eventId), participants);
    };

    const updateRoomId = (id: string, newRoomId: string) => {
        setParticipants((prev) =>
            prev.map((participant) => (participant.id === id ? { ...participant, roomId: newRoomId } : participant))
        );
    };

    const deleteRoomId = (id: string) => {
        setParticipants((prev) =>
            prev.map((participant) => (participant.id === id ? { ...participant, roomId: '' } : participant))
        );
    };

    const handleValidateRoom = async (roomId: string) => {
        const { success } = await validateRoomId(roomId);
        if (success) {
            snackbar.show('success', 'Room ID is valid');
        } else {
            snackbar.show('error', 'Room ID is invalid');
        }
    }

    const onCreateVideoChatSessions = async () => {
        const { success } = await createVideoChatSessions(Number(eventId));
        if (success) {
            snackbar.show('success', 'Video chat sessions created successfully');
        } else {
            snackbar.show('error', 'Error creating video chat sessions');
        }
    }

    const hasAllParticipantsRooms = participants.every((participant) => !!participant.roomId);

    if (isFetchingRooms) return <Box><Typography>Loading...</Typography></Box>;

    return (
        <Box>
            <Typography variant="h5">Video Rooms</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)} disabled={hasAllParticipantsRooms}>
                    Create Rooms
                </Button>
                <Button variant="contained" color="secondary" onClick={onCreateVideoChatSessions}>
                    Create Video chat sessions
                </Button>
                <RoomModal
                    isOpen={isModalOpen}
                    numberOfRooms={numberOfRooms}
                    setNumberOfRooms={setNumberOfRooms}
                    onClose={() => setIsModalOpen(false)}
                    onCreateRooms={handleCreateRooms}
                    isCreateButtonDisabled={isCreatingMeeting}
                />
            </div>

            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {participants.map((participant) => (
                    <Grid item xs={12} sm={6} key={participant.id}>
                        <ParticipantCard
                            participant={participant}
                            onUpdateRoomId={updateRoomId}
                            onDeleteRoomId={deleteRoomId}
                            handleValidateRoom={handleValidateRoom}
                        />

                    </Grid>
                ))}
            </Grid>

            <Button variant="contained" color="secondary" onClick={handleSameRoomAssignments} sx={{ marginTop: 2 }} disabled={isUpdatingRooms}>
                Save Room Assignments
            </Button>
        </Box>
    );
};

export default VideoRooms;
