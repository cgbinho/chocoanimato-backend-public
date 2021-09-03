/*
UPDATES THE PROJECT STATUS BASED ON ORDER STATUS.
*/
const pagarmeFormatProjectStatus = (order_status: string) =>
  ({
    processing: 'ordered',
    authorized: 'ordered',
    waiting_payment: 'ordered',
    pending_refund: 'ordered',
    analyzing: 'ordered',
    pending_review: 'ordered',
    paid: 'delivered',
    refused: 'editing',
    chargedback: 'editing',
    refunded: 'editing',
    cancelled: 'editing'
  }[order_status] || 'editing');

export default pagarmeFormatProjectStatus;
