import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeCouponsRepository from '../../../orders/repositories/fakes/FakeCouponsRepository';
import DeleteCouponByCodeService from './DeleteCouponByCodeService';
import ShowCouponService from './ShowCouponService';
import CreateCouponService from './CreateCouponService';

let createCoupon: CreateCouponService;

let fakeCouponsRepository: FakeCouponsRepository;
let deleteCouponByCodeService: DeleteCouponByCodeService;

beforeEach(() => {
  fakeCouponsRepository = new FakeCouponsRepository();
  createCoupon = new CreateCouponService(fakeCouponsRepository);

  deleteCouponByCodeService = new DeleteCouponByCodeService(
    fakeCouponsRepository
  );
});

describe('DeleteCoupon', () => {
  it('should be able to delete a coupon by code', async () => {
    const couponsRepo = jest.spyOn(fakeCouponsRepository, 'deleteByCode');
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
    DELETES A COUPON
    */
    await deleteCouponByCodeService.execute('DESC10');

    expect(couponsRepo).toHaveBeenCalled();
  });

  it('should NOT be able to delete an INEXISTENT coupon', async () => {
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

    /*
    RETURN AN INVALID DELETE COUPON (ERROR)
    */
    await expect(deleteCouponByCodeService.execute('DESC11')).rejects
      .toBeUndefined;
  });
});
