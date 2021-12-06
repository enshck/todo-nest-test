import Joi = require('joi');

export const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});
