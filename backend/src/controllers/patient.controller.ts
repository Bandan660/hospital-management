import { Request, Response } from 'express';
import patientService from '../services/patient.sevice';
import { sendSuccess, sendError } from '../utils/response';

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, age, gender, phone, email, address } = req.body;
    const patient = await patientService.create({ name, age, gender, phone, email, address });
    sendSuccess(res, patient, 'Patient created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getAllPatients = async (_req: Request, res: Response): Promise<void> => {
  try {
    const patients = await patientService.getAll();
    sendSuccess(res, patients, 'Patients fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await patientService.getById(Number(req.params.id));
    sendSuccess(res, patient, 'Patient fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await patientService.update(Number(req.params.id), req.body);
    sendSuccess(res, patient, 'Patient updated successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

