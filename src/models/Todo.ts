import {
  Table,
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';

import User from './User';

@Table
export default class Todo extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @Column
  value: string;

  @Column
  scheduleAt: Date;

  @Default(false)
  @Column
  isCompleted: boolean;

  @ForeignKey(() => User)
  @Column
  idOfUser: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
  })
  User: User;
}
