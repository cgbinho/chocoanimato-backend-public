import { ICancelOrderDTO } from '@modules/orders/dtos/ICancelOrderDTO';

export default interface IPaymentProvider {
  create(data: any): Promise<any>;
}
