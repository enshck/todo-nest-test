import Joi = require('joi');

export const createElementSchema = Joi.object({
  value: Joi.string().min(1).trim().required(),
  scheduleAt: Joi.string().min(1).trim().required(),
});

export const updateElementSchema = Joi.object({
  id: Joi.string().required(),
  value: Joi.string().min(1).trim(),
  scheduleAt: Joi.string().min(1).trim(),
});
