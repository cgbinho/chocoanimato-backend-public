import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface ICreateOrderDTO {
  user_id: string;
  reference_id: string;
  transaction_id: string;
  project_ids: string[];
  payment_method: string;
  boleto: BoletoDTO;
  gross_amount: number;
  discount_amount: number;
  net_amount: number;
  installment_count: number;
  status: string;
  user?: ICreateUserDTO;
  created_at?: string;
  updated_at?: string;
}

interface BoletoDTO {
  boleto_url: string;
  boleto_barcode: string;
  boleto_expiration_date: string;
}
