import { Patient } from "../models";
import { Appointment } from "../models/Appointment.model";
import { Doctor } from "../models/Docter.model";


const defineAssociations = (): void => {

  // Patient → Appointments (one patient can have many appointments)
  Patient.hasMany(Appointment, {
    foreignKey: 'patientId',
    as: 'appointments',
    onDelete: 'CASCADE',
  });

  // Appointment → Patient (each appointment belongs to one patient)
  Appointment.belongsTo(Patient, {
    foreignKey: 'patientId',
    as: 'patient',
  });

  // Doctor → Appointments (one doctor can have many appointments)
  Doctor.hasMany(Appointment, {
    foreignKey: 'doctorId',
    as: 'appointments',
    onDelete: 'RESTRICT',   // prevent deleting doctor with active appointments
  });

  // Appointment → Doctor (each appointment belongs to one doctor)
  Appointment.belongsTo(Doctor, {
    foreignKey: 'doctorId',
    as: 'doctor',
  });

  console.log('✅ Associations defined');
};

export default defineAssociations;