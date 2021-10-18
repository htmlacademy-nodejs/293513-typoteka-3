'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {prepareErrors} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  },
});

const articlesRouter = new Router();
const upload = multer({storage});

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
    fullText: body.fullText,
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
    res.render(`new-post`, {categories, validationMessages});
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

articlesRouter.put(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  try {
    const articleData = {
      createdDate: body.date,
      title: body.title,
      categories: body.category || [],
      announce: body.announcement,
      fullText: body.fullText,
    };

    if (file) {
      articleData.picture = file.filename;
    }

    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const [article, categories] = await Promise.all([
      api.getArticleById(id),
      api.getCategories(),
    ]);
    res.render(`edit-post`, {id, article, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticleById(id, true);
  res.render(`post`, {id, article});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, comment);
    res.redirect(`/articles/${id}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const article = await api.getArticleById(id, true);
    res.render(`post`, {id, article, validationMessages});
  }
});

module.exports = articlesRouter;
