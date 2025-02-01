// src/routes/userRoutes.ts

import { Router } from "express";
import { signup, login } from "../controllers/userController";
import { get } from "http";
import { getEnumValues } from "../controllers/enumController";
import { sendSingleEmail } from "../controllers/emailController";
import {
  createEvent,
  deleteEvent,
  editEvent,
  fetchEvent,
  fetchEvents,
  getRooms,
  updateUserRooms,
} from "../controllers/eventController";
import { validateEvent } from "../middlewares/validateEvent";
import {
  createRoom,
  deleteRoom,
  getRoomByEmailAndEvent,
  getRoomById,
  updateRoomStatus,
} from "../controllers/roomController";
import { getUserProfile, updateUserProfile } from "../controllers/userProfile";
import {
  createVideoChatSessions,
  getNextAvailableUser,
  getVideoChatSessions,
  updateVideoChatSession,
} from "../controllers/videoChatController";
import { addToWaitlist, getWaitlistCount, getWaitlistData } from "../controllers/waitListController";

const router = Router();

// enums
router.get("/enums", getEnumValues);
// router.post("/emails/:email/send-verification-codes", sendVerificationCodes);

// router.post('/events', validateEvent, authenticateToken, requireAdmin, createEvent);
router.post("/events", validateEvent, createEvent);
router.get("/events", fetchEvents); // Use fetchEvents function to handle this route
router.get("/events/:eventId", fetchEvent); // Use fetchEvents function to handle this route
router.delete("/events/:eventId", deleteEvent);
router.put("/events/:eventId", validateEvent, editEvent);

// rooms
router.post("/events/:eventId/updateRooms", updateUserRooms);
router.get("/events/:eventId/rooms", getRooms);

router.post("/events/:eventId/rooms", createRoom);
router.get("/events/:eventId/rooms", getRooms);
router.get("/events/:eventId/rooms", getRoomById);
router.post("/events/:eventId/rooms", updateRoomStatus);
router.delete("/events/:eventId/rooms", deleteRoom);
router.get("/events/:eventId/rooms/:email", getRoomByEmailAndEvent);

router.post('/waitlist/', addToWaitlist);
router.get('/waitlist-data/', getWaitlistData);
router.get('/waitlist-count/', getWaitlistCount);

router.get("/user-profile", getUserProfile);
router.put("/user-profile", updateUserProfile);

router.post("/signup", signup);
router.post("/login", login);

// notif mails
router.post('/send-emails', sendSingleEmail)


router.get(
  "/events/:eventId/live/:email/next-user-to-match",
  getNextAvailableUser
); // Use fetchEvents function to handle this route
router.post(
  "/events/:eventId/create-video-chat-session",
  createVideoChatSessions
); // Use createEvent function to handle this route
router.get("/events/:eventId/video-chat-sessions", getVideoChatSessions); // Use createEvent function to handle this route
router.put("/events/:eventId/video-chat-session", updateVideoChatSession); // Use fetchEvents function to handle this route

export default router;
