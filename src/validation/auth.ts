import Joi = require('joi');

export const registrationSchema = Joi.object({
  userName: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});
