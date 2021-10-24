'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);

const csrfProtection = csrf();
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const [categories, category] = await Promise.all([
    api.getCategories(),
    api.getCategoryById(id, true),
  ]);

  res.render(`articles-by-category`, {categories, category, user});
}));

articlesRouter.get(`/add`, [auth, csrfProtection], asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`new-post`, {categories, user, csrfToken: req.csrfToken()});
}));

articlesRouter.post(`/add`, [upload.single(`upload`), csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: body.category || [],
    announce: body.announcement,
    fullText: body[`full-text`],
    userId: user.id,
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
      res.render(`new-post`, {categories, meta, csrfToken: req.csrfToken()});
    });
  }
});

articlesRouter.get(`/edit/:id`, [auth, csrfProtection], asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  const [article, categories] = await Promise.all([
    api.getArticleById(id),
    api.getCategories(),
  ]);

  res.render(`edit-post`, {id, article, categories, user, csrfToken: req.csrfToken()});
}));

articlesRouter.post(`/edit/:id`, [upload.single(`upload`), csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    createdDate: body.date,
    title: body.title,
    categories: body.category || [],
    announce: body.announcement,
    fullText: body[`full-text`],
    picture: '',
    userId: user.id,
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
      res.render(`edit-post`, {id, categories, meta, csrfToken: req.csrfToken()});
    });
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const article = await api.getArticleById(id, true);
  res.render(`post`, {id, article, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;

  const newComment = {
    text: message,
    userId: user.id,
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
      res.render(`post`, {id, article, meta, csrfToken: req.csrfToken()});
    });
  }
});

module.exports = articlesRouter;
