import { inject, injectable } from 'tsyringe';

import ICouponsRepository from '../../repositories/ICouponsRepository';
import Coupon from '@modules/orders/infra/typeorm/entities/Coupon';

import AppError from '@shared/errors/AppError';

interface IRequest {
  code: any;
  expire_date: Date;
  amount: number;
  is_percent: boolean;
  is_single_use: boolean;
  is_active: boolean;
}

@injectable()
class UpdateCouponService {
  constructor(
    @inject('CouponsRepository')
    private couponsRepository: ICouponsRepository
  ) {}

  public async execute({
    code,
    amount,
    expire_date,
    is_percent,
    is_single_use,
    is_active
  }: IRequest): Promise<Coupon> {
    const checkCouponExists = await this.couponsRepository.findByCode(code);

    if (!checkCouponExists) {
      throw new AppError('Coupon does not exist');
    }

    const coupon = this.couponsRepository.create({
      code,
      amount,
      expire_date: new Date(expire_date),
      is_percent,
      is_single_use,
      is_active
    });

    return coupon;
  }
}

export default UpdateCouponService;
