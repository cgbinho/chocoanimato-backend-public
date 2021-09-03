// FORMAT PAYMENT_METHOD WITH BOLETO INFO OR NULL FOR CREDITCARD:
import appConfig from '@config/app';

export const FormatBoleto = async transaction => {
  if (transaction.payment_method === 'boleto') {
    const { boleto_url, boleto_barcode, boleto_expiration_date } = transaction;

    if (appConfig.node_env === 'development') {
      return {
        boleto_url: 'http://localhost/boleto',
        boleto_barcode: '01234567890',
        boleto_expiration_date: '12/12/2021'
      };
    }

    return { boleto_url, boleto_barcode, boleto_expiration_date };
  }
  // Payment 'CREDIT_CARD', return null:
  return null;
};
