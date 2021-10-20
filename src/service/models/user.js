'use strict';

const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}

const define = (sequelize) => User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: `User`,
  tableName: 'users',
});

module.exports = define;
