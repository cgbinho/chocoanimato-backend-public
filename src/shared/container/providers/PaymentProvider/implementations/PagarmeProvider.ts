// import { compare, hash } from 'bcryptjs';
import paymentConfig from '@config/payment';
import AppError from '@shared/errors/AppError';
import pagarme from 'pagarme';
import IPaymentProvider from '../models/IPaymentProvider';

export default class PagarmeProvider implements IPaymentProvider {
  /*
  CREATE PAYMENT
  */
  public async create(data: any): Promise<any> {
    const {
      user,
      projects,
      coupon,
      payer,
      items: itemsData,
      payment,
      reference_id
    } = data;

    const { name, email, tax_id, address } = payer;

    const {
      postal_code,
      region,
      country,
      street,
      number,
      locality,
      city,
      region_code
    } = address;

    const { payment_method, installments, subtotal, total } = payment;
    /*
{
  "items": [
    {
      "id": "3e729990-0570-4fa4-9da7-15aba253c0a8",
      "name": "Projeto Teste",
      "template": {
        "duration": 60,
        "ratio": "paisagem",
        "price": 10000,
        "category": [
          "video-explicativo"
        ],
        "description": "Descrição do template"
      }
    }
  ],
  "coupon": null,
  "payer": {
    "name": "Jose da Silva",
    "tax_id": "33236597836",
    "email": "comprador@sandbox.pagseguro.com.br",
    "address": {
      "postal_code": "01452002",
      "region": "São Paulo",
      "country": "Brasil",
      "street": "Avenida Brigadeiro Faria Lima",
      "number": "1384",
      "locality": "Pinheiros",
      "city": "São Paulo",
      "region_code": "SP"
    }
  },
  "payment": {
    "total": 10000,
    "subtotal": 10000,
    "payment_method": "CREDIT_CARD",
    "installments": 1,
    "card": {
      "number": "************ 4242",
      "expiration_date": "12/2030",
      "card_holder_name": "Jose da Silva",
      "card_hash": "3738399_pPP5m1P9sqIQsV3T42DcyElBY5gxGW7pfvRNlssPXDy0+Wh/XFIjICrrtkUQSSjimoXNny1Ue70zKexxAAfORJ26Q2tupy9fmbfiMQKPJLJb7qC006HG1mqFALKWbrZS05JcPtQ6MpIvR0OFrq545oUIBMPu2WlPxxVRnbQwjqF41O2bSvJORKFJnyWlqM5fpkkEs3gLoD+9sXGZq6AGz1pDlVAvvTF3xiDj80zJFyCzHyGu33NLbIKCoSBHRX/3TW8lmP9sz8WLuaDzt+KJ5iVZVDAwUF7fX3g+p28ob6ZlFWbmOxSA4ODZzpCweNaVHLmP+djadsDq1Tpc7KLBrQ=="
    }
  },
  "order": null
}
*/

    // Postback url where Pagarme sends in status updates:
    const postback_url = paymentConfig.pagarme.notification_url;

    const client = await pagarme.client.connect({
      api_key: paymentConfig.pagarme[paymentConfig.mode].api_key
    });

    // Formatting items:
    const items = itemsData.map(item => ({
      id: item.id,
      title: item.name,
      unit_price: item.template.price,
      quantity: 1,
      tangible: false
    }));

    /*
    CHECKS PAYMENT METHOD: 'CREDIT_CARD OR BOLETO'
    */
    let transferData = {};

    if (payment_method === 'CREDIT_CARD') {
      const {
        card: { number, expiration_date, card_holder_name, card_hash }
      } = payment;

      transferData = {
        api_key: paymentConfig.pagarme[paymentConfig.mode].api_key,
        amount: Number(total),
        payment_method: 'credit_card',
        soft_descriptor: 'chocoanimato',
        installments,
        postback_url,
        card_hash,
        card_holder_name,
        customer: {
          name: name,
          email: email,
          country: 'br',
          external_id: user.id,
          type: 'individual',
          phone_numbers: ['+5511999998888'],
          documents: [
            {
              type: 'cpf',
              number: tax_id
            }
          ]
        },
        billing: {
          name: card_holder_name,
          address: {
            country: 'br',
            state: region_code,
            city,
            neighborhood: region,
            street,
            street_number: number,
            zipcode: postal_code
          }
        },
        items
      };
    }

    if (payment_method === 'BOLETO') {
      transferData = {
        api_key: paymentConfig.pagarme[paymentConfig.mode].api_key,
        amount: Number(total),
        payment_method: 'boleto',
        postback_url,
        customer: {
          name: name,
          email: email,
          country: 'br',
          external_id: user.id,
          type: 'individual',
          documents: [
            {
              type: 'cpf',
              number: tax_id
            }
          ]
        }
      };
    }

    // console.dir({ transferData });
    /*
    PROCESS PAYMENT
    */
    try {
      const pagarmeTransaction = await client.transactions.create(transferData);

      return pagarmeTransaction;
    } catch (err) {
      throw new AppError('Error - Could not fulfill the payment.');
    }
  }
}
