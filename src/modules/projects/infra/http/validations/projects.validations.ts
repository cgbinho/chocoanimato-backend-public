import { celebrate, Segments, Joi } from 'celebrate';
import { Request, Response, NextFunction, Errback } from 'express';

import {
  errorIdMessages,
  errorStringMessages,
  errorNumberMessages
} from '@shared/infra/http/validations/shared.validations';
import multer from 'multer';

export const createProjectValidation = celebrate({
  [Segments.BODY]: {
    template_id: Joi.string()
      .max(255)
      .required()
      .guid({ version: 'uuidv4' })
      .messages(errorIdMessages('template_id', 'uuid'))
  }
});

export const updateProjectValidation = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      project_name: Joi.string()
        .min(3)
        .max(255)
        .messages(errorStringMessages('project_name', 'text'))
    })
    .unknown(true)
});

// export const multerFileSizeValidation = (
//   request: Request,
//   response: Response,
//   err: Errback
// ) => {
//   if (err instanceof multer.MulterError) {
//     console.log('A Multer error occurred when uploading.');
//   } else if (err) {
//     console.log('An unknown error occurred when uploading.');
//   }
// };
