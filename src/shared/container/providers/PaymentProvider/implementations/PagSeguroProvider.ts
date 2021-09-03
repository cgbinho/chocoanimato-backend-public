// import { compare, hash } from 'bcryptjs';
import paymentConfig from '@config/payment';
import AppError from '@shared/errors/AppError';
import axios from 'axios';
import { IPagSeguroTransactionRequestDTO } from '../dtos/IPagSeguroTransactionRequestDTO';
import {
  IPagSeguroBoletoTransactionResponseDTO,
  IPagSeguroCreditCardTransactionResponseDTO
} from '../dtos/IPagSeguroTransactionResponseDTO';
import IPaymentProvider from '../models/IPaymentProvider';

export default class PagSeguroProvider implements IPaymentProvider {
  /*
  CREATE PAYMENT
  */
  public async create(
    data: any
  ): Promise<
    | IPagSeguroBoletoTransactionResponseDTO
    | IPagSeguroCreditCardTransactionResponseDTO
  > {
    const {
      user,
      projects,
      coupon,
      payer: payerData,
      items,
      payment,
      reference_id
    } = data;

    /*
    GET PROJECTS INFORMATION
    */

    const description =
      projects.length > 1
        ? `Referente a compra de ${projects.length} vídeos na Choco Animato.`
        : `Referente a compra de um vídeo na Choco Animato.`;
    const notification_urls = [
      paymentConfig.pagseguro[paymentConfig.mode].notification_url
    ];

    const amount = {
      value: Number(payment.net_amount),
      currency: 'BRL'
    };

    // "country": "Brasil",
    // "region": "São Paulo",
    // "region_code": "SP",
    // "city": "Sao Paulo",
    // "postal_code": "01452002",
    // "street": "Avenida Brigadeiro Faria Lima",
    // "number": "1384",
    // "locality": "Pinheiros"

    /*
    CHECKS PAYMENT METHOD: 'CREDIT_CARD OR BOLETO'
    */
    let transferData: IPagSeguroTransactionRequestDTO;

    if (payment.method === 'CREDIT_CARD') {
      const creditCardPaymentMethod = {
        type: 'CREDIT_CARD',
        installments: 1,
        capture: true,
        card: {
          encrypted: payment.card.encrypted
        }
      };

      transferData = Object.assign(
        {},
        { reference_id, description, notification_urls },
        { payment_method: creditCardPaymentMethod },
        { amount }
      );
    }

    if (payment.method === 'BOLETO') {
      // TODO: CREATE A FUNCTION TO GENERATE REGION (STATE) VALUE:

      const region = 'região';
      const address = {
        ...payerData.address,
        country: 'Brasil',
        region
      };
      // Add region and Country to Address:
      const { name, email, tax_id } = payerData;
      const payer = {
        address,
        name,
        email,
        tax_id
      };

      const boletoPaymentMethod = {
        type: 'BOLETO',
        boleto: {
          due_date: '2021-05-08',
          instruction_lines: {
            line_1: 'Pagamento processado para DESC Fatura',
            line_2: 'Via PagSeguro'
          },
          holder: payer
        }
      };

      transferData = Object.assign(
        {},
        {
          reference_id,
          description,
          notification_urls
        },
        {
          payment_method: boletoPaymentMethod
        },
        { amount }
      );
    }

    console.dir('transfer data: ', transferData);
    /*
    PROCESS PAYMENT
    */
    try {
      const response = await axios({
        method: 'post',
        url: `${paymentConfig.pagseguro[paymentConfig.mode].charge_url}`,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'X-api-version': '1.0',
          authorization: `Bearer ${paymentConfig.pagseguro.token}`
        },
        data: transferData
      });
      return response.data;
    } catch (err) {
      throw new AppError('Error - Could not fulfill the payment.');
    }
  }
}
