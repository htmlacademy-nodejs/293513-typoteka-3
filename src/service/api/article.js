'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments, categoryId} = req.query;

    let result;

    if (limit || offset) {
      result = await articleService.findPage({limit, offset, comments, categoryId});
    } else {
      result = await articleService.findAll(comments, categoryId);
    }

    res.status(HttpCode.OK).json(result);
  });

  route.get(`/popular`, async (req, res) => {
    const {count} = req.query;
    const articles = await articleService.findPopular(count);
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/comments`, async (req, res) => {
    const {count, needArticle} = req.query;

    const comments = await commentService.findAll(count, needArticle);

    res.status(HttpCode.OK).json(comments);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;

    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;

    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(`Updated`);
  });

  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;

    const article = await articleService.remove(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;

    const comments = await commentService.findAllByArticleId(articleId);

    res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {commentId} = req.params;

    const deleted = await commentService.remove(commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${commentId}`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;

    const comment = await commentService.create(articleId, req.body);

    res.status(HttpCode.CREATED).json(comment);
  });
};
