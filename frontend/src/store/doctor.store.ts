import { create } from 'zustand';
import {type Doctor } from '../types';
import * as  doctorApi from '../api/doctor.api';

interface DoctorState {
  doctors:  Doctor[];
  loading:  boolean;
  error:    string | null;

  fetchDoctors:  ()                                        => Promise<void>;
  createDoctor:  (data: Omit<Doctor, 'id' | 'createdAt'>) => Promise<void>;
  updateDoctor:  (id: number, data: Partial<Doctor>)       => Promise<void>;
  deleteDoctor:  (id: number)                              => Promise<void>;
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  loading: false,
  error:   null,

  fetchDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await doctorApi.getAllDoctors();
      set({ doctors: data.data });
    } catch {
      set({ error: 'Failed to fetch doctors' });
    } finally {
      set({ loading: false });
    }
  },

  createDoctor: async (payload) => {
    const { data } = await doctorApi.createDoctor(payload);
    set({ doctors: [data.data, ...get().doctors] });
  },

  updateDoctor: async (id, payload) => {
    const { data } = await doctorApi.updateDoctor(id, payload);
    set({
      doctors: get().doctors.map((d) => d.id === id ? data.data : d),
    });
  },

  deleteDoctor: async (id) => {
    await doctorApi.deleteDoctor(id);
    set({ doctors: get().doctors.filter((d) => d.id !== id) });
  },
}));