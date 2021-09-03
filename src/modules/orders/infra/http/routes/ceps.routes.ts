import { Router } from 'express';

import CepsController from '../controllers/CepsController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import { cepValidation } from '../validations/orders.validations';

const cepRouter = Router();
const cepController = new CepsController();

cepRouter.use(ensureAuthenticated);

/*
SHOW A CEP BY CODE
*/
cepRouter.get('/', cepValidation, cepController.show);

export default cepRouter;
