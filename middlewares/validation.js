// const { Joi, celebrate } = require('celebrate');
// const validator = require('validator');
// const {json} = require("express");
//
// const checkLink = (link) => {
//   const result = validator.isURL(link);
//   if (result) {
//     return link;
//   }
//   throw new Error('URL validation error');
// };
//
// module.exports.validateUserBody = () => {
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().email().required(),
//       name: Joi.string().min(2).max(30).required(),
//     })
//   })
// };
//
// module.exports.validateAuthentication = () => {
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().email().required(),
//       password: Joi.string().min(6).required(),
//     })
//   })
// };
//
// module.exports.validateRegistration = () => {
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().email().required(),
//       password: Joi.string().min(6).required(),
//       name: Joi.string().required(),
//     })
//   })
// };
//
// module.exports.validateCardBody = () => {
//   celebrate({
//     body: Joi.object().keys({
//       country: Joi.string().required(),
//       director: Joi.string().required(),
//       duration: Joi.number().required(),
//       year: Joi.string().required(),
//       description: Joi.string().required(),
//       image: Joi.string().custom(checkLink).required(),
//       trailer: Joi.string().custom(checkLink).required(),
//       thumbnail: Joi.string().custom(checkLink).required(),
//       nameRU: Joi.string().required(),
//       nameEN: Joi.string().required(),
//     })
//   })
// };