import { DataTypes, Model } from 'sequelize';
import sequelize from 'config/db';

import { IUserModel } from 'interfaces/auth';

const User = sequelize.define<Model<IUserModel>>('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: {
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
