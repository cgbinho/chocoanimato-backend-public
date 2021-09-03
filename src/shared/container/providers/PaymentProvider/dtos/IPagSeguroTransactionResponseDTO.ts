interface IPagSeguroTransactionDTO {
  reference_id: string;
  description: string;
  links: ILinksDTO[];
  notification_urls: string[];
  metadata?: object;
}

export interface IPagSeguroCreditCardTransactionResponseDTO
  extends IPagSeguroTransactionDTO {
  amount: ICreditCardAmountDTO;
  payment_response: ICreditCardPaymentResponseDTO;
  payment_method: PaymentMethodCreditCardDTO;
}

export interface IPagSeguroBoletoTransactionResponseDTO
  extends IPagSeguroTransactionDTO {
  amount: IBoletoAmountDTO;
  payment_response: IBoletoPaymentResponseDTO;
  payment_method: PaymentMethodBoletoDTO;
}

interface ILinksDTO {
  rel: string;
  href: string;
  media: string;
  type: string;
}

interface IBoletoAmountDTO {
  value: number;
  currency: string;
}

interface ICreditCardAmountDTO {
  value: number;
  currency: string;
  summary: ISummaryDTO;
}
interface ISummaryDTO {
  total: number;
  paid: number;
  refunded: number;
}

interface PaymentMethodCreditCardDTO {
  type: string;
  installments?: number;
  capture: boolean;
  capture_before: string;
  card: ICardDTO;
}

interface PaymentMethodBoletoDTO {
  type: string;
  boleto: IBoletoDTO;
}

interface ICardDTO {
  brand: string;
  first_digits: string;
  last_digits: string;
  exp_month: string;
  exp_year: string;
  holder: ICreditCardHolderDTO;
}

interface ICreditCardHolderDTO {
  name: string;
}

interface IBoletoDTO {
  due_date: string;
  instruction_lines: IInstructionLinesDTO;
  holder: IBoletoHolderDTO;
}

interface IBoletoHolderDTO {
  name: string;
  tax_id: string;
  email: string;
  address: IAddressDTO;
}

interface IAddressDTO {
  country: string;
  region: string;
  region_code: string;
  city: string;
  postal_code: string;
  street: string;
  number: string;
  locality: string;
}

interface IInstructionLinesDTO {
  line_1: string;
  line_2: string;
}

interface IBoletoPaymentResponseDTO {
  code: string;
  message: string;
}
interface ICreditCardPaymentResponseDTO {
  code: string;
  message: string;
  reference: string;
}
