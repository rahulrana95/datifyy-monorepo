import express from "express";
import { createEvent, deleteEvent, editEvent, fetchEvent, fetchEvents, getRooms, updateUserRooms } from "../controllers/eventController";
import { authenticateToken, requireAdmin } from "../middlewares/authMiddleWare";
import { validateEvent } from "../middlewares/validateEvent";

const router = express.Router();

// router.post('/events', validateEvent, authenticateToken, requireAdmin, createEvent);
router.post("/events",validateEvent, createEvent);
router.get("/events", fetchEvents); // Use fetchEvents function to handle this route
router.get("/events/:eventId", fetchEvent); // Use fetchEvents function to handle this route
router.delete("/events/:eventId", deleteEvent);
router.put("/events/:eventId", validateEvent, editEvent);

// rooms
router.post("/events/:eventId/updateRooms", updateUserRooms);
router.get("/events/:eventId/rooms", getRooms);
export default router;
