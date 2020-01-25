import { Model, DataTypes } from 'sequelize';
import { Table, Column } from '../lib';
import { Entry } from './entry.model';

@Table({ tableName: 'Invoices' })
export class Invoice extends Model {
  readonly id: number;

  @Column({ type: DataTypes.INTEGER, allowNull: false })
  entryId: number;

  @Column({ type: DataTypes.DECIMAL, allowNull: false })
  totalValue: number;

  @Column.BelongsTo(Invoice, { foreignKey: 'entryId' })
  entry: Entry;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static getTotalValue(initialDate: Date, finalDate: Date, valuePerHour: number) {
    const time = initialDate.getTime() - finalDate.getTime();

    return time * (valuePerHour / 3600000);
  }
}
