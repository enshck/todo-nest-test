import { DataTypes, Model } from 'sequelize';
import sequelize from 'config/db';

import { IUserModel } from 'interfaces/auth';

const User = sequelize.define<Model<IUserModel>>('User', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.sync();

export default User;
