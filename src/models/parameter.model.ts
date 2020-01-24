import { Model, DataTypes } from 'sequelize';

import { Table, Column } from '../lib';

@Table({ tableName: 'Parameters' })
export class Parameter extends Model {
  public readonly id: number;

  @Column({ type: DataTypes.TEXT })
  logo?: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: false })
  suggestInitialDate: boolean = false;

  @Column({ type: DataTypes.DECIMAL })
  valuePerHour: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}
