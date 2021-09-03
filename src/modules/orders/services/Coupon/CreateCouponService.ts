import AppError from '@shared/errors/AppError';

import Coupon from '@modules/orders/infra/typeorm/entities/Coupon';
import ICouponsRepository from '../../repositories/ICouponsRepository';
import { injectable, inject } from 'tsyringe';
import ICreateCouponDTO from '../../dtos/ICreateCouponDTO';

@injectable()
class CreateCouponService {
  constructor(
    @inject('CouponsRepository')
    private couponsRepository: ICouponsRepository
  ) {}

  public async execute(data: ICreateCouponDTO): Promise<Coupon> {
    const findCoupon = await this.couponsRepository.findByCode(data.code);

    /*
    FIND IF A COUPON ALREADY EXISTS WITH SAME NAME
    */
    if (findCoupon) {
      throw new AppError('This coupon already exist');
    }

    const coupon = await this.couponsRepository.create(data);

    return coupon;
  }
}

export default CreateCouponService;
