interface IUser {
  id: number;
  nickname: string;
  password: string;
  site_status: string;
  email: string;
}

interface IPaymentConfig {
  driver: 'pagseguro' | 'pagarme';
  mode: 'sandbox' | 'live';

  pagseguro: {
    sandbox: {
      charge_url: string;
      notification_url: string;
      pg_notification_url: string;
    };
    live: {
      charge_url: string;
      notification_url: string;
      pg_notification_url: string;
    };
    email: string;
    token: string;
  };

  pagarme: {
    notification_url: string;
    sandbox: {
      api_key: string;
      encryption_key: string;
    };
    live: {
      api_key: string;
      encryption_key: string;
    };
  };
}

export default {
  driver: process.env.PAYMENT_DRIVER, // 'pagarme' | 'pagseguro'
  mode: process.env.PAYMENT_MODE, //'sandbox' | 'live'

  pagseguro: {
    sandbox: {
      charge_url: 'https://sandbox.api.pagseguro.com/charges',
      notification_url: 'http://localhost:3333/payments/notifications',
      pg_notification_url:
        'https://ws.sandbox.pagseguro.uol.com.br/v3/transactions/notifications/',
      mock_status: 1
    },
    live: {
      charge_url: 'https://api.pagseguro.com/charges',
      notification_url: 'http://api.chocoanimato.com/pagseguro/notifications',
      pg_notification_url:
        'https://ws.pagseguro.uol.com.br/v3/transactions/notifications/'
    },
    email: process.env.PS_EMAIL,
    token: process.env.PS_TOKEN
  },
  pagarme: {
    notification_url: process.env.PAGARME_NOTIFICATION_URL,
    sandbox: {
      api_key: process.env.PAGARME_SANDBOX_API_KEY,
      encryption_key: process.env.PAGARME_SANDBOX_ENCRYPTION_KEY
    },
    live: {
      api_key: process.env.PAGARME_PRODUCTION_API_KEY,
      encryption_key: process.env.PAGARME_PRODUCTION_ENCRYPTION_KEY
    }
  }
} as IPaymentConfig;
