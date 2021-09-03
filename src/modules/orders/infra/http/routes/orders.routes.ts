import { Router } from 'express';
import multer from 'multer';

import Order from '@modules/orders/infra/typeorm/entities/Order';

import OrdersController from '../controllers/OrdersController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import {
  ParamsIdv4Validation,
  ParamsStringValidation
} from '@shared/infra/http/validations/shared.validations';

import {
  ensureCanViewEntity,
  setEntity
} from '@modules/users/infra/http/middlewares/ensureCanViewEntity';

const ordersRouter = Router();
const ordersController = new OrdersController();

ordersRouter.use(ensureAuthenticated);

/*
INDEX ALL ORDERS
*/
ordersRouter.get('/', ordersController.index);

/*
SHOW AN ORDER BY ID
*/
ordersRouter.get(
  '/:id',
  ParamsIdv4Validation('id'),
  setEntity(Order, 'order'),
  ensureCanViewEntity('order'),
  ordersController.show
);

/*
POST AN ORDER
*/
ordersRouter.post('/', ordersController.create);

export default ordersRouter;
