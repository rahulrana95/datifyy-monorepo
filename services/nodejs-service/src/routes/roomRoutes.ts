// src/routes/userRoutes.ts

import { Router } from 'express';
import { createRoom, deleteRoom, getRoomByEmailAndEvent, getRoomById, getRooms, updateRoomStatus } from '../controllers/roomController';

const router = Router();

router.post('/events/:eventId/rooms', createRoom);
router.get('/events/:eventId/rooms', getRooms);
router.get('/events/:eventId/rooms', getRoomById);
router.post('/events/:eventId/rooms', updateRoomStatus);
router.delete('/events/:eventId/rooms', deleteRoom);
router.get('/events/:eventId/rooms/:email', getRoomByEmailAndEvent);

export default router;
