import {
  Table,
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';

import User from './User';

@Table
export default class Todo extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @IsUUID(4)
  @BelongsTo(() => User, {
    foreignKey: 'id',
    onDelete: 'CASCADE',
  })
  @Column
  idOfUser: string;

  @Column
  device: string;

  @Column
  @AllowNull(true)
  token: string;
}
