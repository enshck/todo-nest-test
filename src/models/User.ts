import { DataTypes } from 'sequelize';
import sequelize from 'config/db';

const User = sequelize.define('User', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accessToken: {
    type: DataTypes.STRING,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
