import { sequelize } from '../config/database';
import { Doctor } from './Docter.model';
import { Patient } from './Patient.model';
import { User }   from './User.model';
import { Appointment }   from './Appointment.model';
import defineAssociations from '../association/index';


sequelize.addModels([User,Patient,Doctor,Appointment]);
defineAssociations();

export {User , Patient, Doctor, Appointment };
