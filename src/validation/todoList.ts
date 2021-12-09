import Joi = require('joi');

export const createElementSchema = Joi.object({
  value: Joi.string().min(1).trim().required(),
  scheduleAt: Joi.date().iso().min('now').required(),
});

export const updateElementSchema = Joi.object({
  id: Joi.string().required(),
  value: Joi.string().min(1).trim(),
  scheduleAt: Joi.date().iso().min('now'),
}).min(2);
