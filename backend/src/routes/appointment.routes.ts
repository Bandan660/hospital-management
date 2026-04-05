import { Router } from 'express';
import {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} from '../controllers/appointment.controller';

const router = Router();

router.post('/',              bookAppointment);         // Book new appointment
router.get('/',               getAllAppointments);       // Get all (with filters)
router.get('/:id',            getAppointmentById);      // Get single
router.patch('/:id/status',   updateAppointmentStatus); // Update status
router.patch('/:id/cancel',   cancelAppointment);       // Cancel

export default router;