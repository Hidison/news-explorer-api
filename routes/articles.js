const articleRouter = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const validateUrl = (v) => {
  if (validator.isURL(v)) {
    return v;
  }
  throw new CelebrateError('Некорректный URL');
};

const {
  getArticles, createArticle, delArticle,
} = require('../controllers/articles');

articleRouter.get('/', getArticles);

articleRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(validateUrl).required(),
    image: Joi.string().custom(validateUrl).required(),
  }),
}), createArticle);

articleRouter.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24).hex(),
  }),
}), delArticle);


module.exports = articleRouter;
