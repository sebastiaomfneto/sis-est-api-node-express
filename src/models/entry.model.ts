import { Model, DataTypes } from 'sequelize';

import { Table, Column } from '../lib';
import { Invoice } from './invoice.model';

@Table({ tableName: 'entries' })
export class Entry extends Model {
  public readonly id: number;

  @Column({ type: DataTypes.DATE })
  public initialDate: Date;

  @Column({ type: DataTypes.DATE })
  public finalDate: Date;

  @Column({ type: DataTypes.STRING(7) })
  public carLicencePlate: string;

  @Column.HasOne(Invoice, { foreignKey: 'entryId' })
  public invoice: Invoice;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}
