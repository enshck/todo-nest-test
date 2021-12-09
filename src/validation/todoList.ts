import Joi = require('joi');
import moment = require('moment');

export const createElementSchema = Joi.object({
  value: Joi.string().min(1).trim().required(),
  scheduleAt: Joi.date().iso().min(moment().toISOString()),
});

export const updateElementSchema = Joi.object({
  id: Joi.string().required(),
  value: Joi.string().min(1).trim(),
  scheduleAt: Joi.date().iso().min(moment().toISOString()),
}).min(2);
