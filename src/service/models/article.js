'use strict';

const {Model, DataTypes} = require(`sequelize`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  class Article extends Model {
    static associate(models) {
      Article.hasMany(models.Comment,
          {as: Alias.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`}
      );
      Article.belongsToMany(models.Category,
          {through: models.ArticleCategory, as: Alias.CATEGORIES}
      );
      Article.belongsTo(models.User, {as: Alias.USERS, foreignKey: `userId`});
      Article.hasMany(models.ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});
    }
  }

  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
    },
    announce: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fullText: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`,
  });

  return Article;
};

module.exports = define;
