import { DataTypes, Model } from 'sequelize';
import sequelize from 'config/db';

import User from './User';
import { ITodoModel } from 'interfaces/todoList';

const Todos = sequelize.define<Model<ITodoModel>>('Todo', {
  idOfUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Todos, {
  foreignKey: {
    allowNull: false,
    name: 'idOfUser',
  },
  onDelete: 'CASCADE',
});

Todos.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    name: 'idOfUser',
  },
  onDelete: 'CASCADE',
});

Todos.sync();

export default Todos;
