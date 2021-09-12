const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const {celebrate, Joi} = require("celebrate");
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
  })
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  })
}), login);
router.delete('/logout', logout);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => next(new NotFoundError('Ресурс не найден')));

module.exports = router;
