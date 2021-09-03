export default interface ICreateCouponDTO {
  code?: string;
  expire_date: Date;
  amount: number;
  is_percent: boolean;
  is_single_use: boolean;
  is_active: boolean;
}
