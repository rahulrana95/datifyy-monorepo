// src/routes/userRoutes.ts

import { Router } from 'express';
import { sendVerificationCodes } from '../controllers/emailController';

const router = Router();

router.post('/emails/:email/send-verification-codes', sendVerificationCodes);

export default router;
