'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async findAll(needComments) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`],
        },
      },
    ];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`],
            },
          },
        ],
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`],
      ],
    });

    return articles.map((article) => article.get());
  }

  async findPopular(count) {
    const options = {
      limit: count,
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)),
            `commentsCount`,
          ],
        ],
      },
      include: [
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          attributes: [],
        },
      ],
      group: [`Article.id`],
      order: [[Sequelize.col(`commentsCount`), `DESC`]],
    };

    const articles = await this._Article.findAll(options);

    return articles.map((article) => article.get());
  }

  async findOne(id, needComments) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`],
        },
      },
    ];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`],
            },
          },
        ],
      });
    }

    return await this._Article.findByPk(id, {include});
  }

  async findPage({limit, offset, comments}) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`],
        },
      },
    ];

    if (comments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`],
            },
          },
        ],
      });
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
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
