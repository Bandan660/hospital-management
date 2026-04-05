// ── Auth ─────────────────────────────────────
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  // ── Patient ──────────────────────────────────
  export interface Patient {
    id: number;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
    address?: string;
    createdAt: string;
  }
  
  export interface CreatePatientPayload {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email?: string;
    address?: string;
  }
  
  // ── Doctor ───────────────────────────────────
  export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    phone: string;
    email?: string;
    available: boolean;
    createdAt: string;
  }
  
  export interface CreateDoctorPayload {
    name: string;
    specialization: string;
    phone: string;
    email?: string;
    available?: boolean;
  }
  
  // ── Appointment ──────────────────────────────
  export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  
  export interface Appointment {
    id: number;
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    timeSlot: string;
    status: AppointmentStatus;
    notes?: string;
    patient: Pick<Patient, 'id' | 'name' | 'phone' | 'gender' | 'age'>;
    doctor:  Pick<Doctor,  'id' | 'name' | 'specialization'>;
    createdAt: string;
  }
  
  export interface CreateAppointmentPayload {
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    timeSlot: string;
    notes?: string;
  }
  
  // ── Dashboard ────────────────────────────────
  export interface DashboardStats {
    overview: {
      totalPatients: number;
      totalDoctors: number;
      totalAppointments: number;
      todayAppointments: number;
    };
    appointmentStats: {
      scheduled: number;
      completed: number;
      cancelled: number;
    };
    recentAppointments: Appointment[];
  }
  
  // ── API Response ─────────────────────────────
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }