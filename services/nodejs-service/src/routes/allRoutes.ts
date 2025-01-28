// src/routes/userRoutes.ts

import { Router } from 'express';
import { signup, login } from '../controllers/userController';
import { get } from 'http';
import { getEnumValues } from '../controllers/enumController';

const router = Router();

// enums
router.get('/enums', getEnumValues);

export default router;
