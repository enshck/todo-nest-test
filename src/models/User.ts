import {
  Table,
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript';

import Todo from './Todos';
import Token from './Tokens';

@Table
export default class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Todo)
  @Column
  todos: Todo[];

  @HasMany(() => Token)
  @Column
  tokens: Token[];
}
