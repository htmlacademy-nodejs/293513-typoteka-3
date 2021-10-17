'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `Анонс публикации содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс публикации не может содержать более 250 символов`,
  FULL_TEXT_MIN: `Полный текст публикации содержит меньше 50 символов`,
  FULL_TEXT_MAX: `Полный текст публикации не может содержать более 1000 символов`,
};

const schema = Joi.object({
  categories: Joi.array().items(
    Joi.number().integer().positive()
  ).min(1).required().messages({
    'number.base': ErrorArticleMessage.CATEGORIES,
  }),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
  }),
  fullText: Joi.string().min(50).max(1000).messages({
    'string.min': ErrorArticleMessage.FULL_TEXT_MIN,
    'string.max': ErrorArticleMessage.FULL_TEXT_MAX,
  }),
  picture: Joi.string(),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
