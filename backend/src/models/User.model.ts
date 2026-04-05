import {
    Table, Column, Model, DataType,
    CreatedAt, UpdatedAt, BeforeCreate, BeforeUpdate,
  } from 'sequelize-typescript';
  import bcrypt from 'bcrypt';
  
  export enum UserRole {
    ADMIN = 'admin',
    
  }
  
  @Table({ tableName: 'users', timestamps: true })
  export class User extends Model {
    @Column({ type: DataType.STRING(100), allowNull: false })
    name!: string;
  
    @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
    email!: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    password!: string;
  
    @Column({
      type: DataType.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.ADMIN,
    })
    role!: UserRole;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    isActive!: boolean;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  
    // Hash password before create
    @BeforeCreate
    static async hashOnCreate(instance: User) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  
    @BeforeUpdate
    static async hashOnUpdate(instance: User) {
      if (instance.changed('password')) {
        instance.password = await bcrypt.hash(instance.password, 10);
      }
    }
  
    // Instance method to compare password
    async comparePassword(plain: string): Promise<boolean> {
      return bcrypt.compare(plain, this.password);
    }
  
    // Strip password from JSON response
    toJSON() {
      const values = super.toJSON() as any;
      delete values.password;
      return values;
    }
  }