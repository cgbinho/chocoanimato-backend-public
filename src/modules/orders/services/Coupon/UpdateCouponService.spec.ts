import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCouponsRepository from '../../../orders/repositories/fakes/FakeCouponsRepository';
import UpdateCouponService from './UpdateCouponService';

let fakeCouponsRepository: FakeCouponsRepository;
let updateCouponService: UpdateCouponService;

beforeEach(() => {
  fakeCouponsRepository = new FakeCouponsRepository();
  updateCouponService = new UpdateCouponService(fakeCouponsRepository);
});

describe('UpdateCoupon', () => {
  it('should be able to update a coupon', async () => {
    /*
    CREATES A COUPON
    */
    await fakeCouponsRepository.create({
      code: 'DESC10',
      expire_date: new Date('2040-12-01T00:00:00-03:00'),
      amount: 10,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    /*
    UPDATES COUPON
    */
    const couponUpdated = await updateCouponService.execute({
      code: 'DESC10',
      expire_date: new Date('2040-12-01T00:00:00-03:00'),
      amount: 15,
      is_percent: true,
      is_single_use: false,
      is_active: true
    });

    expect(couponUpdated.amount).toBe(15);
  });

  it('should NOT be able to update an INEXISTENT coupon', async () => {
    /*
    RETURN AN INVALID COUPON (ERROR)
    */
    expect(
      updateCouponService.execute({
        code: 'DESC10',
        expire_date: new Date('2000-09-01T00:00:00-03:00'),
        amount: 10,
        is_percent: true,
        is_single_use: false,
        is_active: true
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
