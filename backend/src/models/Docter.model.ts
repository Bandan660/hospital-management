import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    HasMany,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'doctors', timestamps: true })
  export class Doctor extends Model {
    @Column({ type: DataType.STRING(100), allowNull: false })
    name!: string;
  
    @Column({ type: DataType.STRING(100), allowNull: false })
    specialization!: string;
  
    @Column({ type: DataType.STRING(15), allowNull: false, unique: true })
    phone!: string;
  
    @Column({ type: DataType.STRING(100), allowNull: true })
    email!: string;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    available!: boolean;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }