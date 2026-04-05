import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'hospital_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export const connectDB = async (): Promise<void> => {
  try {
    // import models to register them before sync
    await import('../models/index');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
};