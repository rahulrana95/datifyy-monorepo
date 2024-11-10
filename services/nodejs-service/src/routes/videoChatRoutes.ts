import express from "express";
import { createEvent, deleteEvent, editEvent, fetchEvent, fetchEvents, getRooms, updateUserRooms } from "../controllers/eventController";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleWare";
import { validateEvent } from "../middlewares/validateEvent";
import { createVideoChatSessions, getNextAvailableUser, getVideoChatSessions, updateVideoChatSession } from "../controllers/videoChatController";

const router = express.Router();

router.get("/events/:eventId/live/:email/next-user-to-match", getNextAvailableUser); // Use fetchEvents function to handle this route
router.post("/events/:eventId/create-video-chat-session", createVideoChatSessions); // Use createEvent function to handle this route
router.get("/events/:eventId/video-chat-sessions", getVideoChatSessions); // Use createEvent function to handle this route
router.put("/events/:eventId/video-chat-session", updateVideoChatSession); // Use fetchEvents function to handle this route
export default router;
