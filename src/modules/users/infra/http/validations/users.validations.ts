import { celebrate, Segments, Joi } from 'celebrate';

import {
  errorIdMessages,
  errorStringMessages
} from '@shared/infra/http/validations/shared.validations';

const errorEmailMessages = {
  'string.base': `O campo 'email' precisa ser do tipo 'texto'`,
  'string.email': `O campo 'email' precisa ser do tipo 'email'`,
  'string.empty': `O campo 'email' não pode ser um campo vazio`,
  'string.min': `O campo 'email' deve ter um mínimo de {#limit} caracteres`,
  'string.max': `O campo 'email' deve ter no máximo {#limit} caracteres`,
  'any.required': `O campo 'email' é obrigatório`
};

const errorPasswordMessages = {
  'string.base': `O campo 'password' precisa ser do tipo 'texto'`,
  'string.empty': `O campo 'password' não pode ser um campo vazio`,
  'any.required': `O campo 'password' é obrigatório`
};

const errorTokenMessages = {
  'string.base': `O campo 'token' precisa ser do tipo 'texto'`,
  'string.guid': `O campo 'token' precisa ser do tipo 'uuid'`,
  'string.empty': `O campo 'token' não pode ser um campo vazio`,
  'any.required': `O campo 'token' é obrigatório`
};

const errorTextAreaMessages = {
  'string.base': `O campo 'message' precisa ser do tipo 'texto'`,
  'string.empty': `O campo 'message' não pode ser um campo vazio`,
  'string.min': `O campo 'message' deve ter um mínimo de {#limit} caracteres`,
  'string.max': `O campo 'message' deve ter no máximo {#limit} caracteres`,
  'any.required': `O campo 'message' é obrigatório`
};

export const sessionValidation = celebrate({
  [Segments.BODY]: {
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required()
      .messages(errorEmailMessages),
    password: Joi.string().required().messages(errorPasswordMessages)
  }
});

export const createUserValidation = celebrate({
  [Segments.BODY]: {
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('name', 'text')),
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required()
      .messages(errorEmailMessages),
    password: Joi.string().required().max(25).messages(errorPasswordMessages)
  }
});

export const userLoginValidation = celebrate({
  [Segments.BODY]: {
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required()
      .messages(errorEmailMessages),
    password: Joi.string().required().messages(errorPasswordMessages)
  }
});

export const confirmUsersValidation = celebrate({
  [Segments.PARAMS]: {
    confirmation_token: Joi.string()
      .max(255)
      .required()
      .guid({ version: 'uuidv4' })
      .messages(errorTokenMessages)
  }
});

export const updateProfileValidation = celebrate({
  [Segments.BODY]: {
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('name', 'text')),
    email: Joi.string().email().required().messages(errorEmailMessages),
    old_password: Joi.string().valid('').messages(errorPasswordMessages),
    password: Joi.string().valid('').messages(errorPasswordMessages),
    password_confirmation: Joi.string()
      .valid(Joi.ref('password'))
      .messages(errorPasswordMessages)
  }
});

export const resetPasswordValidation = celebrate({
  [Segments.QUERY]: {
    token: Joi.string()
      .max(255)
      .required()
      .guid({ version: 'uuidv4' })
      .messages(errorTokenMessages)
  },
  [Segments.BODY]: {
    password: Joi.string().required().messages(errorPasswordMessages),
    password_confirmation: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages(errorPasswordMessages)
  }
});

export const forgotPasswordValidation = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required()
  }
});

export const contactMailValidation = celebrate({
  [Segments.BODY]: {
    name: Joi.string()
      .min(3)
      .max(255)
      .required()
      .messages(errorStringMessages('name', 'text')),
    email: Joi.string().email().required().messages(errorEmailMessages),
    message: Joi.string()
      .required()
      .min(3)
      .max(255)
      .messages(errorTextAreaMessages),
    token: Joi.string().required().messages(errorIdMessages('token', 'text'))
  }
});
