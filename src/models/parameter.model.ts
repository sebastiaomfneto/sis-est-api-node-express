import { Model, DataTypes } from 'sequelize';

import { Table, Column } from '../lib';

@Table({ tableName: 'parameters' })
export class Parameter extends Model {
  public readonly id: number;

  @Column({ type: DataTypes.TEXT })
  logo?: string;

  @Column({ type: DataTypes.BOOLEAN })
  suggestInitialDate: boolean = false;

  @Column({ type: DataTypes.DECIMAL })
  valuePerHour: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}
