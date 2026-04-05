import api from './axios';
import { type CreatePatientPayload } from '../types';

export const getAllPatients = () => api.get('/patients');
export const getPatientById = (id: number) => api.get(`/patients/${id}`);
export const createPatient = (data: CreatePatientPayload) => api.post('/patients', data);
export const updatePatient = (id: number, data: Partial<CreatePatientPayload>) => api.put(`/patients/${id}`, data);
