import bcryptjs from 'bcryptjs'
import { Model, DataTypes, ValidationError } from 'sequelize';
import { Table, Column, Hook, Validate } from '../lib';

declare global {
  namespace Express {
    interface Request {
      user?: InstanceType<typeof User>
    }
  }
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Table({ tableName: 'Users' })
export class User extends Model {
  readonly id: number;

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

  readonly createdAt: Date;
  readonly updatedAt: Date;

  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  get isUser(): boolean {
    return this.role === UserRole.USER;
  }

  comparePassword(password: string): boolean {
    return bcryptjs.compareSync(password, this.password);
  }

  @Validate()
  protected passwordContainsOneLetterAndOneNumber(): void {
    if (!(/\w/.test(this.password) && /\d/.test(this.password))) {
      throw new ValidationError('Field password must be one letter and one number');
    }
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

  @Hook('beforeCreate')
  protected async hashPassword(instance: User): Promise<void> {
    const salt: string = await bcryptjs.genSalt(10);
    instance.password = await bcryptjs.hash(instance.password, salt);
  }

  /**
   * Não deve permitir que usuário administradores deixem de ser administradores.
   */
  @Hook('beforeUpdate')
  protected shouldNotAllowAdminLeaveBeAdmin(instance: User): void {
    if (this.isAdmin) {
      instance.role === UserRole.ADMIN;
    }
  }
}
