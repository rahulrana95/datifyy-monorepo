// src/routes/userRoutes.ts

import { Router } from 'express';
import { getUserProfile } from '../controllers/userProfile';

const router = Router();

router.get('/user-profile', getUserProfile);

export default router;
