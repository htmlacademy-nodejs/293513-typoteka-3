'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCategoryMessage = {
  NAME_MIN: `Название категории содержит меньше 5 символов`,
  NAME_MAX: `Название категории содержит более 30 символов`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.min': ErrorCategoryMessage.NAME_MIN,
    'string.max': ErrorCategoryMessage.NAME_MAX,
  }),
});

module.exports = (req, res, next) => {
  const newCategory = req.body;
  const {error} = schema.validate(newCategory);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
