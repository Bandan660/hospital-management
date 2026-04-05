import { Doctor } from '../models/Docter.model';

export interface CreateDoctorDTO {
  name: string;
  specialization: string;
  phone: string;
  email?: string;
  available?: boolean;
}

export interface UpdateDoctorDTO {
  name?: string;
  specialization?: string;
  phone?: string;
  email?: string;
  available?: boolean;
}

export class DoctorService {
  async create(data: CreateDoctorDTO): Promise<Doctor> {
    const existing = await Doctor.findOne({ where: { phone: data.phone } });
    if (existing) {
      throw { status: 409, message: 'Doctor with this phone already exists' };
    }
    return await Doctor.create({ ...data });
  }

  async getAll(): Promise<Doctor[]> {
    return await Doctor.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async getAvailable(): Promise<Doctor[]> {
    return await Doctor.findAll({
      where: { available: true },
      order: [['name', 'ASC']],
    });
  }

  async getById(id: number): Promise<Doctor> {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      throw { status: 404, message: 'Doctor not found' };
    }
    return doctor;
  }

  async update(id: number, data: UpdateDoctorDTO): Promise<Doctor> {
    const doctor = await this.getById(id);
    return await doctor.update(data);
  }
}

export default new DoctorService();