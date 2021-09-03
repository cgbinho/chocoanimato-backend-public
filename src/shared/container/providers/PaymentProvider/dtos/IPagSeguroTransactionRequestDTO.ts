export interface IPagSeguroTransactionRequestDTO {
  reference_id: string;
  description: string;
  amount: {
    value: number;
    currency: string; // 'BRL'
  };
  notification_urls: string[];
}

export interface IPagSeguroCreditCardPaymentDTO
  extends IPagSeguroTransactionRequestDTO {
  payment_method: {
    type: string; // 'CREDIT_CARD'
    installments: number;
    capture: boolean;
    card: {
      number: string;
      exp_month: string;
      exp_year: string;
      security_code: string;
      holder: {
        name: string;
      };
    };
  };
}

export interface IPagSeguroBoletoPaymentDTO
  extends IPagSeguroTransactionRequestDTO {
  payment_method: {
    type: string; // 'BOLETO'
    boleto: {
      due_date: string;
      instruction_lines: {
        line_1: string;
        line_2: string;
      };
      holder: {
        name: string;
        tax_id: string;
        email: string;
        address: {
          country: string;
          region: string;
          region_code: string;
          city: string;
          postal_code: string;
          street: string;
          number: string;
          locality: string;
        };
      };
    };
  };
}
