import { Model, DataTypes } from "sequelize/types";

import { Table, Column } from '../lib';

enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ type: DataTypes.STRING(100) })
  userName: string;

  @Column({ type: DataTypes.STRING(100) })
  password: string;

  @Column({ type: DataTypes.ENUM('user', 'admin') })
  role: UserRole;
}
