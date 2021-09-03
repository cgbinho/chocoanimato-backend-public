import Coupon from '@modules/orders/infra/typeorm/entities/Coupon';

export default {
  render(coupon: Coupon) {
    return {
      id: coupon.id,
      code: coupon.code,
      amount: coupon.amount,
      is_percent: coupon.is_percent,
      is_single_use: coupon.is_single_use
    };
  },
  renderMany(coupons: Coupon[]) {
    return coupons.map(coupon => this.render(coupon));
  }
};

/*
amount: 10
​​
code: "DESC10"
​​
created_at: "2020-11-10T17:25:36.113Z"
​​
expire_date: "2020-12-01T03:00:00.000Z"
​​
id: "7315b3ec-91bc-4c7e-ad3c-1ab442462d0d"
​​
is_active: true
​​
is_percent: true
​​
is_single_use: false
​​
updated_at: "2020-11-10T17:25:36.113Z"
*/
