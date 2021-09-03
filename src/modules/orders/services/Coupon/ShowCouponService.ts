import { isBefore } from 'date-fns';
import AppError from '@shared/errors/AppError';

import Coupon from '@modules/orders/infra/typeorm/entities/Coupon';
import ICouponsRepository from '../../repositories/ICouponsRepository';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  code: any; // String
}

@injectable()
class ShowCouponService {
  constructor(
    @inject('CouponsRepository')
    private couponsRepository: ICouponsRepository
  ) {}

  public async execute({ code }: IRequest): Promise<Coupon> {
    /*
    SHOW A COUPON
    */
    const couponExists = await this.couponsRepository.findByCode(code);

    if (!couponExists) {
      throw new AppError('No coupon found');
    }

    /*
    CHECKS IF COUPON IS EXPIRED
    Compares expire_date with current time.
    */
    if (isBefore(couponExists.expire_date, new Date())) {
      throw new AppError('Coupon expired');
    }

    return couponExists;
  }
}

export default ShowCouponService;
