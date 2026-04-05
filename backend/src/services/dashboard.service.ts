import { Op } from 'sequelize';
import { Patient }     from '../models/Patient.model';
import { Doctor }      from '../models/Docter.model';
import { Appointment, AppointmentStatus } from '../models/Appointment.model';

export class DashboardService {

  async getStats() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Run all queries in parallel
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      scheduledCount,
      completedCount,
      cancelledCount,
      recentAppointments,
    ] = await Promise.all([

      // Total counts
      Patient.count(),
      Doctor.count(),
      Appointment.count(),

      // Today's appointments
      Appointment.count({
        where: { appointmentDate: today },
      }),

      // By status
      Appointment.count({ where: { status: AppointmentStatus.SCHEDULED } }),
      Appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
      Appointment.count({ where: { status: AppointmentStatus.CANCELLED } }),

      // Recent 5 appointments with joins
      Appointment.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Patient,
            as: 'patient',
            attributes: ['id', 'name', 'phone'],
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'name', 'specialization'],
          },
        ],
      }),
    ]);

    return {
      overview: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
      },
      appointmentStats: {
        scheduled:  scheduledCount,
        completed:  completedCount,
        cancelled:  cancelledCount,
      },
      recentAppointments,
    };
  }
}

export default new DashboardService();