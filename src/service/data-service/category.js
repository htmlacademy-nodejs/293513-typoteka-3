'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._Article = sequelize.models.Article;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
              `COUNT`,
              `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }

  async findOne(id, articles) {
    let include = [];

    if (articles) {
      include.push({
        model: this._Article,
        as: Alias.ARTICLES,
        include: [
          Alias.CATEGORIES,
          Alias.COMMENTS,
        ],
      });
    }

    return await this._Category.findByPk(id, {include});
  }
}

module.exports = CategoryService;
