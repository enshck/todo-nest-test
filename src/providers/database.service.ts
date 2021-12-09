import { Sequelize } from 'sequelize-typescript';
import variables from 'config/variables';

import Todo from 'models/Todo';
import User from 'models/User';
import Token from 'models/Token';
import { dbTables } from 'const/dbTables';

export const databaseServices = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        database: variables.dbName,
        username: variables.dbUser,
        password: variables.dbPassword,
      });
      sequelize.addModels([User, Todo, Token]);
      await sequelize.sync();
      return sequelize;
    },
  },
  {
    provide: dbTables.TODO_TABLE,
    useFactory: async () => {
      return Todo;
    },
    inject: ['SEQUELIZE'],
  },
  {
    provide: dbTables.USER_TABLE,
    useFactory: async () => {
      return User;
    },
    inject: ['SEQUELIZE'],
  },
  {
    provide: dbTables.TOKEN_TABLE,
    useFactory: async () => {
      return Token;
    },
    inject: ['SEQUELIZE'],
  },
];
