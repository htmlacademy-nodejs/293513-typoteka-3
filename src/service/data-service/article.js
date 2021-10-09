'use strict';

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(needComment) {
    const include = [Alias.CATEGORIES];

    if (needComment) {
      include.push(Alias.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`],
      ],
    });

    return articles.map((article) => article.get());
  }

  async findOne(id, needComment) {
    const include = [Alias.CATEGORIES];

    if (needComment) {
      include.push(Alias.COMMENTS);
    }

    return await this._Article.findByPk(id, {include});
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES],
      order: [
        [`createdAt`, `DESC`],
      ],
      distinct: true,
    });

    return {count, articles: rows};
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id},
    });

    return !!affectedRows;
  }

  async remove(id) {
    const deletedRows = await this._Article.destroy({
      where: {id},
    });

    return !!deletedRows;
  }
}

module.exports = ArticleService;
