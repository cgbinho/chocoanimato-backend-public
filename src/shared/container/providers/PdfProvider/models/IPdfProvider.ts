import { ICreateReceiptDTO } from '../dtos/ICreateReceiptDTO';

export default interface IPdfProvider {
  createReceipt(data: ICreateReceiptDTO): Promise<string>;
}
