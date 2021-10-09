'use strict';

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async findAll(articleId) {
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
    return this._Comment.create({
      ...articleId,
      comment,
    });
  }
}

module.exports = CommentService;
