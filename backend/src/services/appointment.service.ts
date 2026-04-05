import { Appointment, AppointmentStatus } from '../models/Appointment.model';
import { Patient } from '../models/Patient.model';
import { Doctor } from '../models/Docter.model';

export interface CreateAppointmentDTO {
  patientId: number;
  doctorId: number;
  appointmentDate: string;  // YYYY-MM-DD
  timeSlot: string;         // e.g. "10:00 AM"
  notes?: string;
}

export interface UpdateStatusDTO {
  status: AppointmentStatus;
}

export interface AppointmentFilters {
  doctorId?: number;
  patientId?: number;
  status?: AppointmentStatus;
  date?: string;
}

const appointmentIncludes = [
  {
    model: Patient,
    as: 'patient',
    attributes: ['id', 'name', 'age', 'gender', 'phone'],
  },
  {
    model: Doctor,
    as: 'doctor',
    attributes: ['id', 'name', 'specialization', 'phone'],
  },
];

export class AppointmentService {

  async book(data: CreateAppointmentDTO): Promise<Appointment> {
    // 1. Validate patient exists
    const patient = await Patient.findByPk(data.patientId);
    if (!patient) {
      throw { status: 404, message: 'Patient not found' };
    }

    // 2. Validate doctor exists and is available
    const doctor = await Doctor.findByPk(data.doctorId);
    if (!doctor) {
      throw { status: 404, message: 'Doctor not found' };
    }
    if (!doctor.available) {
      throw { status: 400, message: `Dr. ${doctor.name} is currently not available` };
    }

    // 3. Double booking check
    const conflict = await Appointment.findOne({
      where: {
        doctorId: data.doctorId,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        status: AppointmentStatus.SCHEDULED,
      },
    });
    if (conflict) {
      throw {
        status: 409,
        message: `Dr. ${doctor.name} already has a booking at ${data.timeSlot} on ${data.appointmentDate}`,
      };
    }

    // 4. Create and return with joins
    const appointment = await Appointment.create({ ...data });
    return await this.getById(appointment.id);
  }

  async getAll(filters: AppointmentFilters): Promise<Appointment[]> {
    const where: any = {};

    if (filters.doctorId)  where.doctorId         = filters.doctorId;
    if (filters.patientId) where.patientId         = filters.patientId;
    if (filters.status)    where.status            = filters.status;
    if (filters.date)      where.appointmentDate   = filters.date;

    return await Appointment.findAll({
      where,
      include: appointmentIncludes,
      order: [
        ['appointmentDate', 'DESC'],
        ['timeSlot', 'ASC'],
      ],
    });
  }

  async getById(id: number): Promise<Appointment> {
    const appointment = await Appointment.findByPk(id, {
      include: appointmentIncludes,
    });
    if (!appointment) {
      throw { status: 404, message: 'Appointment not found' };
    }
    return appointment;
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.getById(id);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw { status: 400, message: 'Cannot update a cancelled appointment' };
    }
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw { status: 400, message: 'Cannot update a completed appointment' };
    }

    await appointment.update({ status });
    return await this.getById(id);
  }

  async cancel(id: number): Promise<Appointment> {
    return await this.updateStatus(id, AppointmentStatus.CANCELLED);
  }
}

export default new AppointmentService();