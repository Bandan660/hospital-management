import { Router } from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
 
} from '../controllers/patient.controller';

const router = Router();

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);

export default router;