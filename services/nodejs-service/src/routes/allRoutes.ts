// src/routes/userRoutes.ts

import { Router } from "express";
import { signup, login, validateToken, logout, verifyEmailCode, forgotPasswordSendCode, forgotPasswordVerifyCode, forgotPasswordReset, deleteUser } from "../controllers/userController";
import { get } from "http";
import { getEnumValues } from "../controllers/enumController";
import { sendBulkEmails, sendSingleEmail } from "../controllers/emailController";
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
import { authenticateToken } from "../middlewares/authentication";
import checkEmailExists from "../middlewares/user";
import { getPartnerPreferences, updatePartnerPreferences } from "../controllers/partnerPreference";
import { getAllEnums, getAllTables, updateEnums } from "../controllers/adminController";

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

router.post('/waitlist/',addToWaitlist);
router.get('/waitlist-data/',authenticateToken, getWaitlistData);
router.get('/waitlist-count/', getWaitlistCount);

router.get("/user-profile",authenticateToken, getUserProfile);
router.put("/user-profile",authenticateToken, updateUserProfile);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/validate-token", validateToken);

// notif mails
router.post('/send-emails', sendSingleEmail);
router.post("/verify-email-code", verifyEmailCode);
router.post('/forgot-password/send-verification-code', forgotPasswordSendCode)
router.post('/forgot-password/verify-code', forgotPasswordVerifyCode)
router.post('/forgot-password/reset-password', forgotPasswordReset)

// partner pref
router.get('/user/partner-preferences', authenticateToken, getPartnerPreferences);
router.put('/user/partner-preferences', authenticateToken, updatePartnerPreferences);


// send bulk mails
router.post('/admin/send-bulk-emails', sendBulkEmails);


// delete user

router.delete("/user/delete", authenticateToken, deleteUser);

// admin

router.get("/admin/tables", getAllTables);
router.get("/admin/enums", getAllEnums);
router.put("/admin/enums", updateEnums);


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
