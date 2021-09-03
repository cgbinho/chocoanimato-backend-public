import { isBefore } from 'date-fns';
// import IFieldsDTO from '../dtos/IFieldsDTO';
import ICreateCouponDTO from '../dtos/ICreateCouponDTO';

const validateOrderTotals = async (
  coupon: ICreateCouponDTO
): Promise<Boolean> => {
  /*
 VALIDATE COUPON
 Checks if coupon.expire_date is after current day/time.
  */
  if (isBefore(coupon.expire_date, Date.now())) {
    return false;
  }
  /*
  CHECKS IF COUPON IS ALREADY USED
  */
  if (coupon.is_single_use && coupon.is_active === false) {
    return false;
  }
  return true;
};

export default validateOrderTotals;
