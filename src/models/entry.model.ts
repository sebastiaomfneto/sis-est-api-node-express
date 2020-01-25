import { Model, DataTypes, ValidationError } from 'sequelize';
import { Table, Column, Validate } from '../lib';
import { Invoice } from './invoice.model';

@Table({ tableName: 'Entries' })
export class Entry extends Model {
  readonly id: number;

  @Column({ type: DataTypes.DATE, allowNull: false })
  initialDate: Date;

  @Column({ type: DataTypes.DATE, allowNull: true })
  finalDate: Date;

  @Column({ type: DataTypes.STRING(8), allowNull: false })
  carLicensePlate: string;

  @Column.HasOne(Invoice, { foreignKey: 'entryId' })
  invoice: Invoice;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Deve permitir initialDate apenas para a data (dia, mês, ano) atual.
   */
  @Validate()
  protected initialDateOnlyCurrentDate(): void {
    const time: number = this.initialDate.getTime();

    if (new Date().setHours(0, 0, 0, 0) > time
      || new Date().setHours(23, 59, 59) > time) {
      throw new ValidationError('Field initialDate only current Date is valid');
    }
  }

  /**
   * Não deve permitir finalDate inferior a initialDate.
   */
  @Validate()
  protected finalDateGreaterThanInitialDate(date: Date): void {
    if (date && date.getTime() < this.initialDate.getTime()) {
      throw new ValidationError('Field finalDate must be geater than initialDate');
    }
  }

  @Validate()
  protected carLicensePlateMustBePattern(): void {
    if (!/[A-Z]{3}-[A-Z0-9]{4}/g.test(this.carLicensePlate)) {
      throw new ValidationError('Field carLicensePlate is not match with pattern [A-Z]{3}-[A-Z0-9]{4}');
    }
  }
}
