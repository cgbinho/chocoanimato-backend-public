import { celebrate, Segments, Joi } from 'celebrate';
import {
  errorStringMessages,
  errorNumberMessages
} from '@shared/infra/http/validations/shared.validations';

export const templateValidation = celebrate({
  [Segments.BODY]: {
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('name', 'text')),
    description: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('description', 'text')),
    duration: Joi.number()
      .integer()
      .max(120)
      .messages(errorNumberMessages('price', 'number')),
    ratio: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('ratio', 'text')),
    path: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('path', 'text')),
    category: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('path', 'text')),
    price: Joi.number()
      .integer()
      .max(100000)
      .messages(errorNumberMessages('price', 'number')),
    status: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('path', 'text'))
  }
});
