import ICreateCouponDTO from '@modules/orders/dtos/ICreateCouponDTO';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import { formatNumber } from './formatNumbers';

interface IRequest {
  coupon: ICreateCouponDTO;
  net_amount: number;
  projects: ICreateProjectDTO[];
}

const validateOrderTotals = async ({
  coupon,
  net_amount,
  projects
}: IRequest): Promise<Boolean> => {
  /*
  GET CART TOTAL
  */
  const value_before_discount = projects.reduce(
    (total: number, project: ICreateProjectDTO) =>
      total + project.template.price,
    0
  );
  /*
 GET VALUE AFTER DISCOUNT
 */
  let value_after_discount: number;
  if (coupon) {
    value_after_discount = coupon.is_percent
      ? value_before_discount - (value_before_discount * coupon.amount) / 100
      : value_before_discount - coupon.amount;
  } else {
    value_after_discount = value_before_discount;
  }

  /*
  COMPARE VALUES
  */

  if (formatNumber(value_after_discount) !== formatNumber(net_amount)) {
    return false;
  }
  return true;
};

export default validateOrderTotals;
