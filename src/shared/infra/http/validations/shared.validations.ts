import { celebrate, Segments, Joi } from 'celebrate';

export const errorIdMessages = (field: string, type: string) => {
  return {
    'string.base': `O campo ${field} precisa ser do tipo tipo 'text'`,
    'string.guid': `O campo ${field} precisa ser do tipo '${type}'`,
    'string.empty': `O campo ${field} não pode ser um campo vazio`,
    'any.required': `O campo ${field} é obrigatório`
  };
};

export const errorStringMessages = (field: string, type: string) => {
  return {
    'string.base': `O campo ${field} precisa ser do tipo '${type}'`,
    'string.empty': `O campo ${field} não pode ser um campo vazio`,
    'string.min': `O campo ${field} deve ter um mínimo de {#limit} caracteres`,
    'string.max': `O campo ${field} deve ter no máximo {#limit} caracteres`,
    'any.required': `O campo ${field} é obrigatório`
  };
};

export const errorNumberMessages = (field: string, type: string) => {
  return {
    'number.base': `O campo ${field} precisa ser do tipo '${type}'`,
    'number.empty': `O campo ${field} não pode ser um campo vazio`,
    'number.max': `O campo ${field} deve ter no máximo {#limit} caracteres`,
    'any.required': `O campo ${field} é obrigatório`
  };
};

export const ParamsStringValidation = (param: string) =>
  celebrate({
    [Segments.PARAMS]: {
      [param]: Joi.string()
        .max(255)
        .required()
        .messages(errorIdMessages(param, 'text'))
    }
  });

export const ParamsIdv4Validation = (id: string) =>
  celebrate({
    [Segments.PARAMS]: {
      [id]: Joi.string()
        .max(255)
        .required()
        .guid({ version: 'uuidv4' })
        .messages(errorIdMessages(id, 'uuid'))
    }
  });

export const ParamsIdv4AndStringValidation = (id: string, type: string) =>
  celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.string()
        .max(255)
        .required()
        .guid({ version: 'uuidv4' })
        .messages(errorIdMessages(id, 'uuid')),
      type: Joi.string()
        .max(255)
        .required()
        .messages(errorIdMessages(id, 'string'))
    })
  });

export const QueryStringValidation = (param: string) =>
  celebrate({
    [Segments.QUERY]: {
      [param]: Joi.string()
        .max(255)
        .required()
        .messages(errorIdMessages(param, 'text'))
    }
  });

export const QueryIdv4Validation = (param: string) =>
  celebrate({
    [Segments.QUERY]: {
      [param]: Joi.string()
        .max(255)
        .required()
        .guid({ version: 'uuidv4' })
        .messages(errorIdMessages(param, 'uuid'))
    }
  });
