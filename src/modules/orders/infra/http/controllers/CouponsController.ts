import CreateCouponService from '@modules/orders/services/Coupon/CreateCouponService';
import DeleteCouponByCodeService from '@modules/orders/services/Coupon/DeleteCouponByCodeService';
import ShowCouponService from '@modules/orders/services/Coupon/ShowCouponService';
import UpdateCouponService from '@modules/orders/services/Coupon/UpdateCouponService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import couponView from '../views/responses/coupons.response';

export default class CouponsController {
  /*
  CREATE A COUPON - DEV
  */
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      code,
      expire_date,
      amount,
      is_percent,
      is_single_use,
      is_active
    } = request.body;

    const createCoupon = container.resolve(CreateCouponService);

    const coupon = await createCoupon.execute({
      code,
      expire_date,
      amount,
      is_percent,
      is_single_use,
      is_active
    });

    return response.json(coupon);
  }

  /*
  SHOW A COUPON
  */
  public async show(request: Request, response: Response): Promise<Response> {
    const code = String(request.query.code);
    // const { code } = request.query;
    const showCoupon = container.resolve(ShowCouponService);

    const coupon = await showCoupon.execute({ code });

    return response.json(couponView.render(coupon));
  }

  /*
  UPDATE A COUPON - DEV
  */
  public async update(request: Request, response: Response): Promise<Response> {
    const {
      code,
      expire_date,
      amount,
      is_percent,
      is_single_use,
      is_active
    } = request.body;

    const updateCoupon = container.resolve(UpdateCouponService);

    const coupon = await updateCoupon.execute({
      code,
      expire_date,
      amount,
      is_percent,
      is_single_use,
      is_active
    });

    return response.json(coupon);
  }

  /*
  DELETE A COUPON BY CODE
  */
  public async deleteByCode(
    request: Request,
    response: Response
  ): Promise<Response> {
    const code = String(request.query.code);
    const deleteCoupon = container.resolve(DeleteCouponByCodeService);

    await deleteCoupon.execute(code);

    return response.json({ message: 'Coupon deleted sucessfully.' });
  }
}
