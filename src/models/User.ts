import {
  Table,
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  HasMany,
  Default,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';

import Todo from './Todo';
import Token from './Token';

@Table
export default class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Todo)
  Todos: Todo[];

  @HasMany(() => Token)
  Tokens: Token[];
}
