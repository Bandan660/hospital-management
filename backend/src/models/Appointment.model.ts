import {
    Table, Column, Model, DataType,
    ForeignKey, CreatedAt, UpdatedAt,
  } from 'sequelize-typescript';
  import { Patient } from './Patient.model';
  import { Doctor } from './Docter.model';
  
  export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
  }
  
  @Table({ tableName: 'appointments', timestamps: true })
  export class Appointment extends Model {
    @ForeignKey(() => Patient)
    @Column({ type: DataType.INTEGER, allowNull: false })
    patientId!: number;
  
    @ForeignKey(() => Doctor)
    @Column({ type: DataType.INTEGER, allowNull: false })
    doctorId!: number;
  
    @Column({ type: DataType.DATEONLY, allowNull: false })
    appointmentDate!: string;
  
    @Column({ type: DataType.STRING(20), allowNull: false })
    timeSlot!: string;
  
    @Column({
      type: DataType.ENUM(...Object.values(AppointmentStatus)),
      defaultValue: AppointmentStatus.SCHEDULED,
    })
    status!: AppointmentStatus;
  
    @Column({ type: DataType.TEXT, allowNull: true })
    notes!: string;
  
    patient?: Patient;
    doctor?: Doctor;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }