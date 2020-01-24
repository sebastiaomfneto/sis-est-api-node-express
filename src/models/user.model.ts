import bcryptjs from 'bcryptjs'
import { Model, DataTypes } from 'sequelize';
import { Table, Column, Hook } from '../lib';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface UserLogin {
  userName: string;
  password: string;
}

@Table({ tableName: 'Users' })
export class User extends Model {
  public readonly id: number;

  @Column({
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  })
  userName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  })
  password: string;

  @Column({ type: DataTypes.ENUM('user', 'admin') })
  role: UserRole;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  comparePassword(password: string): boolean {
    return bcryptjs.compareSync(password, this.password);
  }

  @Hook('beforeCreate')
  static async hashPassword(instance: User) {
    const salt: string = await bcryptjs.genSalt(10);
    instance.password = await bcryptjs.hash(instance.password, salt);
  }

  static async autenticate(userName: string, password: string): Promise<User> {
    const user: User | null = await User.findOne({
      where: { userName }
    });

    if (!(user && user.comparePassword(password))) {
      throw new Error('Username or Password invalid');
    }

    return user;
  }
}
