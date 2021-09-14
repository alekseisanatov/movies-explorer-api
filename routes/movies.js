const router = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const checkLink = (link) => {
  const result = validator.isURL(link);
  if (result) {
    return link;
  }
  throw new Error('URL validation error');
};

const {
  getFilms,
  createFilm,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getFilms);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(checkLink).required(),
    trailer: Joi.string().custom(checkLink).required(),
    thumbnail: Joi.string().custom(checkLink).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createFilm);
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
