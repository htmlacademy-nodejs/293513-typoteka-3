'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/add`, asyncMiddleware(async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
}));

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: body.category || [],
    announce: body.announcement,
    fullText: body[`full-text`],
  };

  if (file) {
    articleData.picture = file.filename;
  }

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();

    const meta = {
      article: articleData,
      error: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`new-post`, {categories, meta});
    });
  }
});

articlesRouter.get(`/edit/:id`, asyncMiddleware(async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticleById(id),
    api.getCategories(),
  ]);
  res.render(`edit-post`, {id, article, categories});
}));

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: body.category || [],
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: '',
  };

  if (file) {
    articleData.picture = file.filename;
  }

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();

    const meta = {
      article: articleData,
      error: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`edit-post`, {id, categories, meta});
    });
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticleById(id, true);
  res.render(`post`, {id, article});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;

  const newComment = {
    text: message,
  };

  try {
    await api.createComment(id, newComment);
    res.redirect(`/articles/${id}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const article = await api.getArticleById(id, true);

    const meta = {
      newComment,
      error: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`post`, {id, article, meta});
    });
  }
});

module.exports = articlesRouter;
