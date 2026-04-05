import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);       // public
router.post('/login',    login);          // public
router.get('/profile',   protect, getProfile); // protected

export default router;