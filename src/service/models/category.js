'use strict';

const {Model, DataTypes} = require(`sequelize`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Article,
          {through: models.ArticleCategory, as: Alias.ARTICLES}
      );
      Category.hasMany(models.ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`,
  });

  return Category;
};

module.exports = define;
