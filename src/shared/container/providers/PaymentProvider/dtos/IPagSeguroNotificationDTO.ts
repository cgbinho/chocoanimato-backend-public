export interface IPagSeguroNotificationDTO {
  date: string;
  code: string;
  reference: string;
  type: number;
  status: number;
  lastEventDate: string;
  paymentMethod: {
    type: number;
    code: number;
  };
  paymentLink: string;
  grossAmount: number;
  discountAmount: number;
  creditorFees: {
    intermediationRateAmount: number;
    intermediationFeeAmount: number;
  };
  netAmount: number;
  extraAmount: number;
  installmentCount: number;
  itemCount: number;
  items: {
    item: {
      id: string;
      description: string;
      quantity: number;
      amount: number;
    };
  };
  sender: {
    name: string;
    email: string;
    phone: {
      areaCode: number;
      number: number;
    };
    documents: {
      document: {
        type: string;
        value: number;
      };
    };
  };
  primaryReceiver: {
    publicKey: string;
  };
}
