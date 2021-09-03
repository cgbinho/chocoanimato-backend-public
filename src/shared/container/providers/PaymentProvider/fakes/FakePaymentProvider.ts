import IPaymentProvider from '../models/IPaymentProvider';

export default class FakePaymentProvider implements IPaymentProvider {
  public async create(data: any): Promise<any> {
    return;
  }
}
