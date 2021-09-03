import {
  formatCreateDateString,
  formatDownloadExpireDateString
} from './formatDates';
import { formatMoney } from './formatNumbers';

export default async function formatPaymentConstants(order: any): Promise<any> {
  /*
  FORMAT ORDER COSTS AND DATES
  */
  const paymentMethod =
    order.payment_method === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Boleto';
  /*
  MONEY
  */
  const grossAmount = formatMoney(order.gross_amount);
  const discountAmount = formatMoney(order.discount_amount);
  const netAmount = formatMoney(order.net_amount);
  /*
  DATES
  */
  const orderCreateDate = await formatCreateDateString(order.created_at);
  const downloadExpirationDate = await formatDownloadExpireDateString(
    order.created_at
  );

  return {
    payment_method: paymentMethod,
    gross_amount: grossAmount,
    discount_amount: discountAmount,
    net_amount: netAmount,
    installment_count: order.installment_count,
    order_create_date: orderCreateDate,
    download_expiration_date: downloadExpirationDate
  };
}
