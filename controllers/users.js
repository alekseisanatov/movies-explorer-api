const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const WrongData = require('../errors/WrongData');
const WrongEmailError = require('../errors/WrongEmailError');
const AuthError = require('../errors/AuthError');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет такого пользователя'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет пользователя по заданному id'));
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongData('Невалидный id'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new WrongEmailError('Пользователь с данной почтой уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new WrongEmailError('Пользователь с данной почтой уже существует'));
      } else {
        bcrypt.hash(req.body.password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then((userData) => res.status(201).send({ userData: userData.toJSON() }))
          .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) {
              next(new WrongEmailError('Пользователь с данной почтой уже существует'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          httpOnly: true,
          sameSite: 'None',
          expires: new Date(Date.now() + (60 * 24 * 3600000)),
        })
        .status(200)
        .send({ message: 'jwt создан' });
    })
    .catch(() => next(new AuthError('Неверный логин либо пароль')));
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt').send({ message: 'jwt удален' });
  next();
};
