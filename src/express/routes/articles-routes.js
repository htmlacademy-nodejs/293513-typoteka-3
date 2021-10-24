'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ARTICLE_PER_PAGE} = require(`../../constants`);

const csrfProtection = csrf();
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {page = 1} = req.query;
  const limit = ARTICLE_PER_PAGE;
  const offset = (Number(page) - 1) * ARTICLE_PER_PAGE;

  const [categories, category, {count, articles}] = await Promise.all([
    api.getCategories(true),
    api.getCategoryById(id),
    api.getArticles({offset, limit, comments: true, categoryId: id})
  ]);

  const totalPages = Math.ceil(count / ARTICLE_PER_PAGE);

  res.render(`articles-by-category`, {
    id,
    categories,
    category,
    articles,
    page: Number(page),
    totalPages,
    user
  });
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
  const [article, categories] = await Promise.all([
    api.getArticleById(id, true),
    api.getCategories(true),
  ]);
  res.render(`post`, {id, article, categories, user, csrfToken: req.csrfToken()});
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
    const [article, categories] = await Promise.all([
      api.getArticleById(id, true),
      api.getCategories(true),
    ]);

    const meta = {
      newComment,
      error: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`post`, {
        id,
        user,
        article,
        categories,
        meta,
        csrfToken: req.csrfToken()
      });
    });
  }
});

articlesRouter.post(`/delete/:id`, auth, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteArticle(id);

    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`/500`);
  }
});

module.exports = articlesRouter;
