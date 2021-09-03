import { Router } from 'express';

import CouponsController from '../controllers/CouponsController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ensureRole from '@modules/users/infra/http/middlewares/ensureRole';

import { createCouponValidation } from '../validations/orders.validations';
import { QueryStringValidation } from '@shared/infra/http/validations/shared.validations';

const couponRouter = Router();
const couponsController = new CouponsController();

couponRouter.use(ensureAuthenticated);

/*
SHOW A COUPON BY CODE
*/
couponRouter.get('/', QueryStringValidation('code'), couponsController.show);

/*
SHOW A COUPON BY CODE
*/
couponRouter.get('/', QueryStringValidation('code'), couponsController.show);

/* ADMIN ROUTES */
/*
POST A COUPON
*/
couponRouter.post(
  '/',
  createCouponValidation,
  ensureRole('admin'),
  couponsController.create
);
/*
UPDATE A COUPON
*/
couponRouter.patch(
  '/',
  createCouponValidation,
  ensureRole('admin'),
  couponsController.update
);
/*
DELETE A COUPON BY CODE
*/
couponRouter.delete(
  '/',
  QueryStringValidation('code'),
  ensureRole('admin'),
  couponsController.deleteByCode
);

export default couponRouter;
