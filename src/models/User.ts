import { DataTypes } from 'sequelize';
import sequelize from 'config/db';

import TokensModel from './Tokens';

const User = sequelize.define('Users', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(TokensModel);
TokensModel.belongsTo(User);

export default User;
