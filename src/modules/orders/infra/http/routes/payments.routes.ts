import { Router } from 'express';

import PaymentsController from '../controllers/PaymentsController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';
import paymentConfig from '@config/payment';

import {
  ParamsStringValidation,
  QueryStringValidation
} from '@shared/infra/http/validations/shared.validations';
import { pagarmeValidatePostback } from '../middlewares/pagarmeValidatePostback';

const paymentsRouter = Router();
const paymentController = new PaymentsController();

/*
POST PAYMENT STATUS NOTIFICATION ( PAYMENT PROCESSOR WEBHOOK )
*/
paymentsRouter.post(
  '/pagarme-notifications',
  pagarmeValidatePostback,
  paymentController.pagarmeStatusUpdate
);

export default paymentsRouter;
