'use strict';

const {Model, DataTypes} = require(`sequelize`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Article, {foreignKey: `articleId`});
      Comment.belongsTo(models.User, {as: Alias.USERS, foreignKey: `userId`});
    }
  }

  Comment.init({
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`,
  });

  return Comment;
};

module.exports = define;
