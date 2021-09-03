import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCouponsRepository from '../../../orders/repositories/fakes/FakeCouponsRepository';
import CreateCouponService from './CreateCouponService';

describe('CreateCoupon', () => {
  it('should be able to create a valid coupon', async () => {
    const fakeCouponsRepository = new FakeCouponsRepository();

    const createCoupon = new CreateCouponService(fakeCouponsRepository);

    const coupon = await createCoupon.execute({
      code: 'DESC10',
      expire_date: new Date('2040-12-01T00:00:00-03:00'),
      amount: 10,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    expect(coupon).toHaveProperty('code');
  });

  it('should NOT be able to create a coupon with a code already registered', async () => {
    const fakeCouponsRepository = new FakeCouponsRepository();

    const createCoupon = new CreateCouponService(fakeCouponsRepository);

    /*
    CREATES A COUPON
    */
    await createCoupon.execute({
      code: 'DESC10',
      expire_date: new Date('2040-10-01T00:00:00-03:00'),
      amount: 10,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    /*
    TRIES TO CREATE A SECOND COUPON
    */
    expect(
      createCoupon.execute({
        code: 'DESC10',
        expire_date: new Date('2020-10-01T00:00:00-03:00'),
        amount: 10,
        is_percent: true,
        is_single_use: false,
        is_active: true
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
