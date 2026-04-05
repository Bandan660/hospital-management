import { Request, Response } from 'express';
import appointmentService, { AppointmentFilters } from '../services/appointment.service';
import { AppointmentStatus } from '../models/Appointment.model';
import { sendSuccess, sendError } from '../utils/response';

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, doctorId, appointmentDate, timeSlot, notes } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
      sendError(res, 'patientId, doctorId, appointmentDate, timeSlot are required', 400);
      return;
    }

    const appointment = await appointmentService.book({
      patientId: Number(patientId),
      doctorId: Number(doctorId),
      appointmentDate,
      timeSlot,
      notes,
    });

    sendSuccess(res, appointment, 'Appointment booked successfully', 201);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: AppointmentFilters = {
      doctorId:  req.query.doctorId  ? Number(req.query.doctorId)        : undefined,
      patientId: req.query.patientId ? Number(req.query.patientId)       : undefined,
      status:    req.query.status    ? req.query.status as AppointmentStatus : undefined,
      date:      req.query.date      ? String(req.query.date)            : undefined,
    };

    const appointments = await appointmentService.getAll(filters);
    sendSuccess(res, appointments, 'Appointments fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await appointmentService.getById(Number(req.params.id));
    sendSuccess(res, appointment, 'Appointment fetched successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status) {
      sendError(res, 'status is required', 400);
      return;
    }

    const validStatuses = Object.values(AppointmentStatus);
    if (!validStatuses.includes(status)) {
      sendError(res, `status must be one of: ${validStatuses.join(', ')}`, 400);
      return;
    }

    const appointment = await appointmentService.updateStatus(
      Number(req.params.id),
      status as AppointmentStatus
    );
    sendSuccess(res, appointment, 'Appointment status updated successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await appointmentService.cancel(Number(req.params.id));
    sendSuccess(res, appointment, 'Appointment cancelled successfully');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};