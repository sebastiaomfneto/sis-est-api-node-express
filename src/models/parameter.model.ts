import { Model, DataTypes, ValidationError } from 'sequelize';
import { Table, Column, Hook } from '../lib';

@Table({ tableName: 'Parameters' })
export class Parameter extends Model {
  readonly id: number;

  @Column({ type: DataTypes.TEXT })
  logo?: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  suggestInitialDate: boolean = false;

  @Column({ type: DataTypes.DECIMAL })
  valuePerHour: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Garatir que haja apenas 1 registro de parâmetros no banco de dados.
   */
  @Hook('beforeCreate')
  protected async keepSingleton(): Promise<void> {
    const count: number = await Parameter.count();

    if (count > 0) {
      throw new ValidationError('Should exists only one register in parameter table');
    }
  }
}
