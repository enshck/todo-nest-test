import { DataTypes } from 'sequelize';
import sequelize from 'config/db';

// import UserModel from './User';

const Tokens = sequelize.define('Tokens', {
  UserId: {
    type: DataTypes.INTEGER,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
});

export default Tokens;
