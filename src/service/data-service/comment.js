'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  findAll(article) {
    return article.comments;
  }

  remove(article, commentId) {
    const removedComment = article.comments.find((comment) => comment.id === commentId);

    if (!removedComment) {
      return null;
    }

    article.comments = article.comments.filter((comment) => comment.id !== commentId);
    return removedComment;
  }

  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    article.comments.push(newComment);
    return newComment;
  }
}

module.exports = CommentService;
