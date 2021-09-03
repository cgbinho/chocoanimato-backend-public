import { getRepository, Repository } from 'typeorm';

import ICouponsRepository from '@modules/orders/repositories/ICouponsRepository';
import ICreateCouponDTO from '@modules/orders/dtos/ICreateCouponDTO';

import Coupon from '../entities/Coupon';

class CouponsRepository implements ICouponsRepository {
  private ormRepository: Repository<Coupon>;

  constructor() {
    this.ormRepository = getRepository(Coupon);
  }

  public async findByCode(code: string): Promise<Coupon | undefined> {
    const findCoupon = await this.ormRepository.findOne({ where: { code } });

    return findCoupon || null;
  }

  public async findById(id: string): Promise<Coupon | undefined> {
    const findCoupon = await this.ormRepository.findOne(id);

    return findCoupon || null;
  }

  public async create(data: ICreateCouponDTO): Promise<Coupon> {
    const coupon = this.ormRepository.create({
      code: data.code,
      expire_date: data.expire_date,
      amount: data.amount,
      is_percent: data.is_percent,
      is_single_use: data.is_single_use,
      is_active: data.is_active
    });

    await this.ormRepository.save(coupon);

    return coupon;
  }

  public async deleteByCode(code: string): Promise<void> {
    await this.ormRepository.delete(code);
  }
}
export default CouponsRepository;
