import { create } from 'zustand';
import { type Patient } from '../types';
import * as patientApi from '../api/patient.api';

interface PatientState {
  patients:  Patient[];
  loading:   boolean;
  error:     string | null;

  fetchPatients:  ()                                        => Promise<void>;
  createPatient:  (data: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>;
  updatePatient:  (id: number, data: Partial<Patient>)      => Promise<void>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  loading:  false,
  error:    null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await patientApi.getAllPatients();
      set({ patients: data.data });
    } catch {
      set({ error: 'Failed to fetch patients' });
    } finally {
      set({ loading: false });
    }
  },

  createPatient: async (payload) => {
    const { data } = await patientApi.createPatient(payload);
    set({ patients: [data.data, ...get().patients] });
  },

  updatePatient: async (id, payload) => {
    const { data } = await patientApi.updatePatient(id, payload);
    set({
      patients: get().patients.map((p) => p.id === id ? data.data : p),
    });
  },

 
}));