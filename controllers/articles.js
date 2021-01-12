const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getArticles = (req, res, next) => {
  Article.find({})
    .populate('user')
    .then((data) => {
      res.send({ data });
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') throw new BadRequestError('некорректные данные');
    })
    .catch(next);
};

const delArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        Article.findByIdAndRemove(req.params.articleId)
          .then((data) => {
            res.send({ data });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') throw new BadRequestError('некорректные данные');
          })
          .catch(next);
      } else {
        throw new ForbiddenError('У вас нет прав для удаления карточки');
      }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  delArticle,
};
