export interface IItemDTO {
  id?: string;
  currency_id?: string;
  category_id?: string;
  description?: string;
  picture_url?: string;
  quantity?: number;
  unit_price?: number;
  title?: string;
  [k: string]: any;
}

export interface IMerchantOrderDTO {
  preference_id?: string;
  date_created?: string;
  order_status: string;
  last_updated?: string;
  items?: IItemDTO[];
  status?: 'opened' | 'closed';
  payments?: IMPPaymentDTO[];
  application_id?: string;
  site_id?: string;
  payer?: {
    id?: string;
    email?: string;
    nickname?: string;
    [k: string]: any;
  };
  collector?: {
    id?: number;
    email?: string;
    nickname?: string;
    [k: string]: any;
  };
  sponsor_id?: number;
  cancelled?: boolean;
  shipments?: {
    id?: number;
    shipment_type?: string;
    shipping_mode?: string;
    picking_type?: string;
    status?: string;
    substatus?: string;
    items?: IItemDTO[];
    date_created?: string;
    last_modified?: string;
    date_first_printed?: string;
    service_id?: string;
    sender_id?: number;
    receiver_id?: number;
    receiver_address?: {
      zip_code?: string;
      street_name?: string;
      street_number?: number;
      floor?: string;
      apartment?: string;
      [k: string]: any;
    };
    [k: string]: any;
  };
  notification_url?: string;
  additional_info?: string;
  external_reference?: string;
  marketplace?: string;
}
export interface IMPPaymentDTO {
  id?: string;
  status?:
    | 'pending'
    | 'approved'
    | 'authorized'
    | 'in_process'
    | 'in_mediation'
    | 'rejected'
    | 'cancelled'
    | 'refunded'
    | 'charged_back';
  payer?: {
    entity_type?: 'individual' | 'association';
    type?: 'customer' | 'registered' | 'guest';
    id?: string;
    email?: string;
    identification?: {
      type?: string;
      number?: string;
      [k: string]: any;
    };
    phone?: {
      area_code?: string;
      number?: string;
      extension?: string;
      [k: string]: any;
    };
    first_name?: string;
    last_name?: string;
    [k: string]: any;
  };
  binary_mode?: boolean;
  order?: {
    type?: 'mercadolibre' | 'mercadopago';
    id?: number;
    [k: string]: any;
  };
  external_reference?: string;
  description?: string;
  metadata?: {
    [k: string]: any;
  };
  transaction_amount?: number;
  coupon_amount?: number;
  campaign_id?: number;
  coupon_code?: string;
  differential_pricing_id?: number;
  application_fee?: number;
  capture?: boolean;
  payment_method_id?: string;
  issuer_id?: string;
  token?: string;
  statement_descriptor?: string;
  installments?: number;
  notification_url?: string;
  callback_url?: string;
  additional_info?: {
    ip_address?: string;
    items?: IItemDTO[];
    payer?: {
      first_name?: string;
      last_name?: string;
      phone?: {
        area_code?: string;
        number?: string;
        [k: string]: any;
      };
      address?: {
        zip_code?: string;
        street_name?: string;
        street_number?: number;
        [k: string]: any;
      };
      registration_date?: string;
      [k: string]: any;
    };
    shipments?: {
      receiver_address?: string;
      zip_code?: string;
      street_name?: string;
      street_number?: number;
      floor?: number;
      apartment?: string;
      [k: string]: any;
    };
    [k: string]: any;
  };
  transaction_details?: {
    net_received_amount?: number;
    total_paid_amount?: number;
    overpaid_amount?: number;
    external_resource_url?: string;
    installment_amount?: number;
    financial_institution?: unknown;
    payment_method_reference_id?: unknown;
    payable_deferral_period?: unknown;
    acquirer_reference?: unknown;
  };
}
export interface IMPPreferenceDTO {
  id?: string;
  binary_mode?: boolean;
  items?: IItemDTO[];
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: number;
      [k: string]: any;
    };
    identification?: {
      type?: string;
      number?: string;
      [k: string]: any;
    };
    address?: {
      zip_code?: string;
      street_name?: string;
      street_number?: number;
      [k: string]: any;
    };
    [k: string]: any;
  };
  payment_methods?: {
    excluded_payment_methods?: {
      id?: string;
      [k: string]: any;
    }[];
    excluded_payment_types?: {
      id?: string;
      [k: string]: any;
    }[];
    default_payment_method_id?: string;
    installments?: number;
    default_installments?: number;
    [k: string]: any;
  };
  shipments?: {
    mode?: 'custom' | 'me2' | 'not_specified';
    local_pickup?: boolean;
    dimensions?: string;
    default_shipping_method?: number;
    free_methods?: {
      id?: number;
      [k: string]: any;
    }[];
    cost?: number;
    free_shipping?: boolean;
    receiver_address?: {
      zip_code?: string;
      street_name?: string;
      street_number?: number;
      floor?: string;
      apartment?: string;
      [k: string]: any;
    };
    [k: string]: any;
  };
  back_urls?: {
    success?: string;
    pending?: string;
    failure?: string;
    [k: string]: any;
  };
  notification_url?: string;
  mode?: 'regular_payment' | 'money_transfer';
  additional_info?: string;
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
  collector_id?: number;
  client_id?: number;
  marketplace?: string;
  marketplace_fee?: number;
  differential_pricing?: {
    id?: number;
    [k: string]: any;
  };
  taxes?: {
    type?: 'IVA' | 'INC';
    value?: number;
    [k: string]: any;
  }[];
}
