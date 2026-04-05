import { Patient } from '../models/Patient.model';

export interface CreatePatientDTO {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface UpdatePatientDTO {
  name?: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export class PatientService {
  async create(data: CreatePatientDTO): Promise<Patient> {
    // Check duplicate phone
    const existing = await Patient.findOne({ where: { phone: data.phone } });
    if (existing) {
      throw { status: 409, message: 'Patient with this phone already exists' };
    }
    return await Patient.create({ ...data });
  }

  async getAll(): Promise<Patient[]> {
    return await Patient.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async getById(id: number): Promise<Patient> {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      throw { status: 404, message: 'Patient not found' };
    }
    return patient;
  }

  async update(id: number, data: UpdatePatientDTO): Promise<Patient> {
    const patient = await this.getById(id);
    return await patient.update(data);
  }

 
}

export default new PatientService();