import express from 'express';
import { createEvent, fetchEvents } from '../controllers/eventController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleWare';
import { validateEvent } from '../middlewares/validateEvent';

const router = express.Router();

router.post('/events', validateEvent, authenticateToken, requireAdmin, createEvent);
router.get('/events',  fetchEvents); // Use fetchEvents function to handle this route


export default router;
