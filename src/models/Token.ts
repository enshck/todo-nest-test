import {
  Table,
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  BelongsTo,
  AllowNull,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';

import User from './User';

@Table
export default class Token extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @Column
  device: string;

  @AllowNull(true)
  @Column
  token: string;

  @ForeignKey(() => User)
  @Column
  idOfUser: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
  })
  User: User;
}
