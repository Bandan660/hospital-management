import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'patients', timestamps: true })
  export class Patient extends Model {
    @Column({ type: DataType.STRING(100), allowNull: false })
    name!: string;
  
    @Column({ type: DataType.INTEGER, allowNull: false })
    age!: number;
  
    @Column({
      type: DataType.ENUM('male', 'female', 'other'),
      allowNull: false,
    })
    gender!: string;
  
    @Column({ type: DataType.STRING(15), allowNull: false })
    phone!: string;
  
    @Column({ type: DataType.STRING(100), allowNull: true })
    email!: string;
  
    @Column({ type: DataType.TEXT, allowNull: true })
    address!: string;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }