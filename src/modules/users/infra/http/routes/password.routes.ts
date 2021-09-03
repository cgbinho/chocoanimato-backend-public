import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import {
  resetPasswordValidation,
  forgotPasswordValidation
} from '../validations/users.validations';

const passwordRouter = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot-password',
  forgotPasswordValidation,
  forgotPasswordController.create
);

passwordRouter.post(
  '/reset-password',
  resetPasswordValidation,
  resetPasswordController.create
);

export default passwordRouter;
