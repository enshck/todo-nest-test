import { DataTypes, Model } from 'sequelize';
import sequelize from 'config/db';

import User from './User';
import { ITokenModel } from 'interfaces/auth';

const Tokens = sequelize.define<Model<ITokenModel>>('Token', {
  idOfUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
});

User.hasMany(Tokens, {
  foreignKey: {
    allowNull: false,
    name: 'idOfUser',
  },
  onDelete: 'CASCADE',
});
Tokens.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    name: 'idOfUser',
  },
  onDelete: 'CASCADE',
});

Tokens.sync();

export default Tokens;
