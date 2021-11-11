'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
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
    }

    return await this._Category.findAll({raw: true});
  }

  async findOne(id) {
    return await this._Category.findByPk(id);
  }

  async create(data) {
    return await this._Category.create(data);
  }

  async update(id, category) {
    return await this._Category.update(category, {
      where: {id},
    });
  }

  async remove(id) {
    const deletedRows = await this._Category.destroy({
      where: {id},
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;
