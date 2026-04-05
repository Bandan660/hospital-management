import { Router } from 'express';
import patientRoutes from './patient.routes';
import doctorRoutes from './docter.routes';
import appointmentRoutes from './appointment.routes'
import authRoutes from './auth.routes'
import dashboardRoutes from './dashboard.routes'
import { adminOnly, protect } from '../middleware/auth.middleware';

const router = Router();


router.use('/auth', authRoutes);

router.use('/patients',     protect, adminOnly, patientRoutes);
router.use('/doctors',      protect, adminOnly, doctorRoutes);
router.use('/appointments', protect, adminOnly, appointmentRoutes);
router.use('/dashboard',    protect, adminOnly, dashboardRoutes);


export default router;