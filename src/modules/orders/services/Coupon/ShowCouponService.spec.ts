import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCouponsRepository from '../../../orders/repositories/fakes/FakeCouponsRepository';
import CreateCouponService from './CreateCouponService';
import ShowCouponService from './ShowCouponService';

let fakeCouponsRepository: FakeCouponsRepository;
let createCoupon: CreateCouponService;
let showCoupon: ShowCouponService;

beforeEach(() => {
  fakeCouponsRepository = new FakeCouponsRepository();
  createCoupon = new CreateCouponService(fakeCouponsRepository);
  showCoupon = new ShowCouponService(fakeCouponsRepository);
});

describe('ShowCoupon', () => {
  it('should be able to show a valid coupon', async () => {
    /*
    CREATES A COUPON
    */
    await createCoupon.execute({
      code: 'DESC10',
      expire_date: new Date('2040-12-01T00:00:00-03:00'),
      amount: 10,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    /*
    SHOW A COUPON
    */
    const coupon = await showCoupon.execute({
      code: 'DESC10'
    });

    expect(coupon).toHaveProperty('code');
  });

  it('should NOT be able to show an expired coupon', async () => {
    /*
    CREATES A COUPON
    */
    await createCoupon.execute({
      code: 'DESC10',
      expire_date: new Date('2000-09-01T00:00:00-03:00'),
      amount: 10,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    const showCoupon = new ShowCouponService(fakeCouponsRepository);

    /*
    RETURN AN INVALID COUPON (ERROR)
    */
    expect(
      showCoupon.execute({
        code: 'DESC10'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to show an inexistent coupon', async () => {
    /*
    CREATES A COUPON
    */
    await createCoupon.execute({
      code: 'DESC10',
      expire_date: new Date('2040-12-01T00:00:00-03:00'),
      amount: 10,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    const showCoupon = new ShowCouponService(fakeCouponsRepository);

    /*
    RETURN AN INVALID COUPON (ERROR)
    */
    expect(
      showCoupon.execute({
        code: 'invalid_code'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
