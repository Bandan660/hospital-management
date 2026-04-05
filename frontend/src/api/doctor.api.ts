import api from './axios';
import { type CreateDoctorPayload } from '../types';

export const getAllDoctors = () => api.get('/doctors');
export const getDoctorById = (id: number) => api.get(`/doctors/${id}`);
export const createDoctor = (data: CreateDoctorPayload) => api.post('/doctors', data);
export const updateDoctor = (id: number, data: Partial<CreateDoctorPayload>) => api.put(`/doctors/${id}`, data);
export const deleteDoctor = (id: number) => api.delete(`/doctors/${id}`);