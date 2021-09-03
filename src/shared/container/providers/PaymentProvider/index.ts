import { container } from 'tsyringe';

import IPaymentProvider from './models/IPaymentProvider';
import paymentConfig from '@config/payment';
// import PagSeguroProvider from './implementations/PagSeguroProvider';
import PagarmeProvider from './implementations/PagarmeProvider';

const providers = {
  // pagseguro: PagSeguroProvider,
  pagarme: PagarmeProvider
};

container.registerSingleton<IPaymentProvider>(
  'PaymentProvider',
  providers[paymentConfig.driver]
);
