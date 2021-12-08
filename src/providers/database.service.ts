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
    useValue: Todo,
  },
  {
    provide: dbTables.USER_TABLE,
    useValue: User,
  },
  {
    provide: dbTables.TOKEN_TABLE,
    useValue: Token,
  },
];
