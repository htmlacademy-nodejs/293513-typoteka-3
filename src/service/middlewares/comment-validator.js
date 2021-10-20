'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  TEXT_REQUIRED: `Комментарий не может быть пустым`
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT,
    'any.required': ErrorCommentMessage.TEXT_REQUIRED,
  }),
});

module.exports = (req, res, next) => {
  const comment = req.body;
  const {error} = schema.validate(comment);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
