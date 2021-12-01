import { Sequelize } from 'sequelize';

import variables from './variables';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: variables.dbName,
  username: variables.dbUser,
  password: variables.dbPassword,
});

export default sequelize;
