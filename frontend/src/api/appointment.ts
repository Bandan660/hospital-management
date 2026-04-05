import api from './axios';
import { type CreateAppointmentPayload } from '../types';

export const getAllAppointments  = (params?: Record<string, string>) => api.get('/appointments', { params });
export const getAppointmentById = (id: number)                       => api.get(`/appointments/${id}`);
export const createAppointment  = (data: CreateAppointmentPayload)   => api.post('/appointments', data);
export const updateStatus       = (id: number, status: string)       => api.patch(`/appointments/${id}/status`, { status });
