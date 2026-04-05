import { create } from 'zustand';
import { type Appointment, type CreateAppointmentPayload } from '../types';
import * as apptApi from '../api/appointment';

interface AppointmentState {
  appointments: Appointment[];
  loading:      boolean;
  error:        string | null;

  fetchAppointments:  (params?: Record<string, string>) => Promise<void>;
  createAppointment:  (data: CreateAppointmentPayload)  => Promise<void>;
  updateStatus:       (id: number, status: string)      => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  loading:      false,
  error:        null,

  fetchAppointments: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await apptApi.getAllAppointments(params);
      set({ appointments: data.data });
    } catch {
      set({ error: 'Failed to fetch appointments' });
    } finally {
      set({ loading: false });
    }
  },

  createAppointment: async (payload) => {
    const { data } = await apptApi.createAppointment(payload);
    set({ appointments: [data.data, ...get().appointments] });
  },

  updateStatus: async (id, status) => {
    const { data } = await apptApi.updateStatus(id, status);
    set({
      appointments: get().appointments.map((a) =>
        a.id === id ? { ...a, status: data.data.status } : a
      ),
    });
  },


}));