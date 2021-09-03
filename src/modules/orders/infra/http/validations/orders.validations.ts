import { celebrate, Segments, Joi } from 'celebrate';

import {
  errorIdMessages,
  errorStringMessages,
  errorNumberMessages
} from '@shared/infra/http/validations/shared.validations';

export const showCouponValidation = celebrate({
  [Segments.QUERY]: {
    code: Joi.string()
      .max(255)
      .required()
      .guid({ version: 'uuidv4' })
      .messages(errorIdMessages('template_id', 'uuid'))
  }
});

export const createCouponValidation = celebrate({
  [Segments.BODY]: {
    code: Joi.string()
      .min(6)
      .max(16)
      .required()
      .messages(errorStringMessages('code', 'text')),
    expire_date: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('expire_date', 'text')),
    amount: Joi.number()
      .integer()
      .max(120)
      .messages(errorNumberMessages('amount', 'number')),
    is_percent: Joi.boolean()
      .required()
      .messages(errorStringMessages('is_percent', 'boolean')),
    is_single_use: Joi.boolean()
      .required()
      .messages(errorStringMessages('is_percent', 'boolean')),
    is_active: Joi.boolean()
      .required()
      .messages(errorStringMessages('is_percent', 'boolean'))
  }
});

export const cepValidation = celebrate({
  [Segments.QUERY]: {
    cep: Joi.string()
      .max(10)
      .required()
      .regex(/^\d+$/)
      .messages(errorIdMessages('cep', 'text')),
    type: Joi.string()
      .max(15)
      // .required()
      .messages(errorIdMessages('type', 'text'))
  }
});
