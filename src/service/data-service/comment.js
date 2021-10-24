'use strict';

const Alias = require(`../models/alias`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async findAll(count) {
    const options = {
      order: [
        [`createdAt`, `DESC`]
      ],
      include: [
        {
          model: this._User,
          as: Alias.USERS,
          attributes: {
            exclude: [`passwordHash`],
          },
        },
      ],
    };

    if (count) {
      options.limit = count;
    }

    return await this._Comment.findAll(options);
  }

  async findAllByArticleId(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
  }

  async remove(id) {
    const removedComment = await this._Comment.destroy({
      where: {id},
    });

    return !!removedComment;
  }

  async create(articleId, comment) {
    return await this._Comment.create({
      articleId,
      ...comment,
    });
  }
}

module.exports = CommentService;
