import { Sequelize } from 'sequelize-typescript';
import variables from 'config/variables';

import Todo from 'models/Todos';
import User from 'models/User';
import Tokens from 'models/Tokens';

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
      sequelize.addModels([Todo, User, Tokens]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
