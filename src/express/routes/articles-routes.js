'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`new-post`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticleById(id),
    api.getCategories(),
  ]);
  res.render(`new-post`, {article, categories});
});

articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
