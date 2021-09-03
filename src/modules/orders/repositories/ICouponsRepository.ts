import Coupon from '@modules/orders/infra/typeorm/entities/Coupon';
import ICreateCouponDTO from '../dtos/ICreateCouponDTO';

export default interface ICouponsRepository {
  findById(id: string): Promise<Coupon | undefined>;
  findByCode(code: string): Promise<Coupon | undefined>;
  create(data: ICreateCouponDTO): Promise<Coupon>;
  deleteByCode(code: string): Promise<void>;
}
