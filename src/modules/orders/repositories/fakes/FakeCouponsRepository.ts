import { v4 as uuidv4 } from 'uuid';

import ICouponsRepository from '@modules/orders/repositories/ICouponsRepository';
import ICreateCouponDTO from '@modules/orders/dtos/ICreateCouponDTO';

import Coupon from '../../infra/typeorm/entities/Coupon';

class CouponsRepository implements ICouponsRepository {
  private coupons: Coupon[] = [];

  public async findById(id: string): Promise<Coupon | undefined> {
    const findCoupon = this.coupons.find(coupon => coupon.id === id);

    return findCoupon;
  }

  public async findByCode(code: string): Promise<Coupon | undefined> {
    const findCoupon = this.coupons.find(coupon => coupon.code === code);

    return findCoupon;
  }

  public async create(couponData: ICreateCouponDTO): Promise<Coupon> {
    const coupon = new Coupon();

    Object.assign(coupon, { id: uuidv4() }, couponData);

    this.coupons.push(coupon);

    return coupon;
  }

  public async save(coupon: Coupon): Promise<Coupon> {
    const findIndex = this.coupons.findIndex(coupon => coupon.id === coupon.id);

    this.coupons[findIndex] = coupon;

    return coupon;
  }

  public async deleteByCode(code: string): Promise<void> {
    // Removes the item with the specified id:
    this.coupons = this.coupons.filter(coupon => coupon.code !== code);
  }
}
export default CouponsRepository;
