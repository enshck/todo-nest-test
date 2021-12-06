import { DataTypes, Model } from 'sequelize';
import sequelize from 'config/db';

import User from './User';
import { ITokenModel } from 'interfaces/auth';

const Tokens = sequelize.define<Model<ITokenModel>>('Token', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  idOfUser: {
    type: DataTypes.UUID,
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
