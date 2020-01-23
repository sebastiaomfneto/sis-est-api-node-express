import { Model } from 'sequelize';

import { Table, Column } from '../lib';

@Table({ tableName: 'entries' })
export class Entry extends Model {
  public readonly id: number;

  @Column({ type: 'DATE' })
  public initialDate: Date;

  @Column({ type: 'DATE' })
  public finalDate: Date;

  @Column({ type: 'STRING' })
  public carLicencePlate: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}
