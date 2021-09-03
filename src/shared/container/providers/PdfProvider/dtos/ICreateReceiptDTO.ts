import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import { IVideoFilePathDTO } from '@modules/orders/dtos/IVideoFilePathDTO';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export interface ICreateReceiptDTO {
  order: ICreateOrderDTO;
  projects: ICreateProjectDTO[];
  payment: IPaymentDTO;
}

interface IPaymentDTO {
  payment_method: string;
  gross_amount: string;
  discount_amount: string;
  net_amount: string;
  installment_count: any;
  order_create_date: string;
  download_expiration_date: string;
}
