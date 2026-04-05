import { Request, Response } from 'express';
import doctorService from '../services/docter.service';
import { sendSuccess, sendError } from '../utils/response';

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, specialization, phone, email, available } = req.body;
    const doctor = await doctorService.create({ name, specialization, phone, email, available });
    sendSuccess(res, doctor, 'Doctor created successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getAllDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await doctorService.getAll();
    sendSuccess(res, doctors, 'Doctors fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getAvailableDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await doctorService.getAvailable();
    sendSuccess(res, doctors, 'Available doctors fetched');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await doctorService.getById(Number(req.params.id));
    sendSuccess(res, doctor, 'Doctor fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await doctorService.update(Number(req.params.id), req.body);
    sendSuccess(res, doctor, 'Doctor updated successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    await doctorService.delete(Number(req.params.id));
    sendSuccess(res, null, 'Doctor deleted successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};