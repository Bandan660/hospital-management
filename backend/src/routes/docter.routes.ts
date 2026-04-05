import { Router } from 'express';
import {
  createDoctor,
  getAllDoctors,
  getAvailableDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/docter.controller';

const router = Router();

router.post('/', createDoctor);
router.get('/', getAllDoctors);
router.get('/available', getAvailableDoctors);  // ← must be before /:id
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;