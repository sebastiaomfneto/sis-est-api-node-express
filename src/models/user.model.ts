import { Model, DataTypes } from 'sequelize';

import { Table, Column } from '../lib';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Table({ tableName: 'users' })
export class User extends Model {
  public readonly id: number;

  @Column({ type: DataTypes.STRING(100) })
  userName: string;

  @Column({ type: DataTypes.STRING(100) })
  password: string;

  @Column({ type: DataTypes.ENUM('user', 'admin') })
  role: UserRole;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}
