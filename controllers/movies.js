const Movie = require('../models/movie');
const WrongData = require('../errors/WrongData');
const NotFoundError = require('../errors/NotFoundError');
const AccessingError = require('../errors/AccessingError');

module.exports.getFilms = (req, res, next) => {
  Movie.find({})
    .populate('movie')
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

module.exports.createFilm = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongData('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Нет карточки по заданному id'));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new AccessingError('Нет прав на удаление фильма'));
      } else {
        movie
          .delete()
          .then((data) => res.send(data))
          .catch(next);
      }
    })
    .catch(next);
};
