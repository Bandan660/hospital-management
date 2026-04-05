import { Router } from 'express';
import {
  createDoctor,
  getAllDoctors,
  getAvailableDoctors,
  getDoctorById,
  updateDoctor,
  
} from '../controllers/docter.controller';

const router = Router();

router.post('/', createDoctor);
router.get('/', getAllDoctors);
router.get('/available', getAvailableDoctors); 
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);

export default router;