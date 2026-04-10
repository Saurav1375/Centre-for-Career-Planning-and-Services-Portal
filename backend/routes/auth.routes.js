import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import { trackActivity } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', trackActivity, login);
router.post('/logout', trackActivity, logout);

export default router;