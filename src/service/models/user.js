'use strict';

const {Model, DataTypes} = require(`sequelize`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Article, {as: Alias.ARTICLES, foreignKey: `userId`});
      User.hasMany(models.Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
    }
  }

  User.init({
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
    tableName: `users`,
  });

  return User;
};

module.exports = define;
