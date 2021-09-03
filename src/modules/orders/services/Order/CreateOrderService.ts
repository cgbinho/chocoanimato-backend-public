import appConfig from '@config/app';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPaymentProvider from '@shared/container/providers/PaymentProvider/models/IPaymentProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import AppError from '@shared/errors/AppError';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import ICreateCouponDTO from '../../dtos/ICreateCouponDTO';
import ICouponsRepository from '../../repositories/ICouponsRepository';
import IOrdersRepository from '../../repositories/IOrdersRepository';
import { FormatBoleto } from '../../utils/FormatBoleto';
import { formatMoney } from '../../utils/formatNumbers';
import FormatPaymentConstants from '../../utils/formatPaymentConstants';
import ValidateCoupon from '../../utils/validateCoupon';
import ValidateOrderTotals from '../../utils/validateOrderTotals';

interface IRequest {
  user_id: string;
  payer: {
    name: string;
    email: string;
    tax_id: string;
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
  coupon: {
    id: string;
    code: string;
    amount: number;
    is_percent: boolean;
    is_single_use: boolean;
  };
  items: IItem[];
  payment: {
    payment_method: 'CREDIT_CARD' | 'BOLETO';
    installments: number;
    subtotal: number;
    total: number;
    card: {
      number: string;
      expiration_date: string;
      card_holder_name: string;
      card_hash: string;
    };
  };
  order: null;
}

interface IItem {
  id: string;
  name: string;
  template: {
    duration: number;
    ratio: string;
    price: number;
    category: string[];
    description: string;
  };
}

interface IBoletoDTO {
  id: string;
  barcode: string;
  formatted_barcode: string;
  due_date: string;
  pdf_url: string;
  img_url: string;
}

// interface transactionExample {
//   object: 'transaction';
//   status: 'processing';
//   refuse_reason: null;
//   status_reason: 'acquirer';
//   acquirer_response_code: null;
//   acquirer_name: null;
//   acquirer_id: null;
//   authorization_code: null;
//   soft_descriptor: null;
//   tid: null;
//   nsu: null;
//   date_created: '2021-02-19T20:02:59.057Z';
//   date_updated: '2021-02-19T20:02:59.057Z';
//   amount: 9000;
//   authorized_amount: 0;
//   paid_amount: 0;
//   refunded_amount: 0;
//   installments: 1;
//   id: 11406660;
//   cost: 0;
//   card_holder_name: null;
//   card_last_digits: null;
//   card_first_digits: null;
//   card_brand: null;
//   card_pin_mode: null;
//   card_magstripe_fallback: false;
//   cvm_pin: false;
//   postback_url: 'http://requestb.in/pkt7pgpk';
//   payment_method: 'boleto';
//   capture_method: 'ecommerce';
//   antifraud_score: null;
//   boleto_url: null;
//   boleto_barcode: null;
//   boleto_expiration_date: '2021-02-26T03:00:00.000Z';
//   referer: 'api_key';
//   ip: '186.220.199.133';
//   subscription_id: null;
//   phone: null;
//   address: null;
//   customer: {
//     object: 'customer';
//     id: 4748353;
//     external_id: '1234567890';
//     type: 'individual';
//     country: 'br';
//     document_number: null;
//     document_type: 'cpf';
//     name: 'Jose da Silva';
//     email: 'comprador@sandbox.pagseguro.com.br';
//     phone_numbers: null;
//     born_at: null;
//     birthday: null;
//     gender: null;
//     date_created: '2021-02-19T20:02:59.011Z';
//     documents: [];
//   };
//   billing: null;
//   shipping: null;
//   items: [];
//   card: null;
//   split_rules: null;
//   metadata: {};
//   antifraud_metadata: {};
//   reference_key: null;
//   device: null;
//   local_transaction_id: null;
//   local_time: null;
//   fraud_covered: false;
//   fraud_reimbursed: null;
//   order_id: null;
//   risk_level: 'unknown';
//   receipt_url: null;
//   payment: null;
//   addition: null;
//   discount: null;
//   private_label: null;
//   pix_qr_code: null;
//   pix_expiration_date: null;
// }

@injectable()
class CreateOrderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CouponsRepository')
    private couponsRepository: ICouponsRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('PaymentProvider')
    private paymentProvider: IPaymentProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider
  ) {}
  /*
  CREATES AN ORDER ( PEDIDO )
  */
  public async execute(data: IRequest): Promise<any> {
    // Promise returns an Order
    const { user_id, payer, items, coupon, payment } = data;
    const { subtotal, total, payment_method, installments } = payment;

    const formData = {
      items: [
        {
          id: '3e729990-0570-4fa4-9da7-15aba253c0a8',
          name: 'Projeto Teste',
          template: {
            duration: 60,
            ratio: 'paisagem',
            price: 10000,
            category: ['video-explicativo'],
            description: 'Descrição do template'
          }
        }
      ],
      coupon: {
        id: '7315b3ec-91bc-4c7e-ad3c-1ab442462d0d',
        code: 'DESC10',
        amount: 10,
        is_percent: true,
        is_single_use: false
      },
      payer: {
        name: 'Jose da Silva',
        tax_id: '33236597836',
        email: 'comprador@sandbox.pagseguro.com.br',
        address: {
          postal_code: '01452002',
          region: 'São Paulo',
          country: 'Brasil',
          street: 'Avenida Brigadeiro Faria Lima',
          number: '1384',
          locality: 'Pinheiros',
          city: 'São Paulo',
          region_code: 'SP'
        }
      },
      payment: {
        payment_method: 'CREDIT_CARD',
        installments: 1,
        card: {
          number: '************ 4242',
          expiration_date: '12/2030',
          card_holder_name: 'Jose da Silva',
          card_hash:
            '3737738_RkaSirtnIeUaVaC+9d5yV2gD5loj6OIJPZNzbqPXnAe9Z2r+ioV9jNdzsM0YheH9fYjoxx0b2j5ALDxjAO1CJIve/5TXg1eJ7pgy2GfclrviTOSd8iBwmRUNx0t0hpblgFOIOoWXBXN0UYmm1RO7F4lS1LAJ/p+znf6OT+z6CHFzCOH0AmwaSgQ5GUzwwsrR90FZ9NGn8+HKhjKlL0hXXwNKoBfw0Ce6D13A+AkZiEtQ12iF8NdWZBQFBsu3deQExmskeO66kKL34Qk9sDn4TbSqQukTcPhATVjfUlrQoL7nceoaXl+zZme1iGaEF5IRhv9iHnAsYJP8fwlJFu0Jdw=='
        }
      },
      order: null,
      subtotal: 10000,
      total: 9000
    };

    // VALIDATES INPUT DATA

    // GET USER PROJECTS:
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    /*
    GET ONLY THE ORDER PROJECTS
    */
    const project_ids = items.map((item: IItem) => item.id);
    const projects = await this.projectsRepository.findByIds(project_ids);

    if (!projects) {
      throw new AppError('Projects not found');
    }

    /*
    CHECK IF PROJECTS CAN BE ORDERED ( Project status is 'editing' )
    */
    const isProjectValidToOrder = Boolean(
      projects.find(project => {
        return project.status === 'editing';
      })
    );

    if (!isProjectValidToOrder) {
      throw new AppError("Error - Can't order a Project.");
    }

    /*
    GET COUPON IF EXISTS
    */
    let couponExists: ICreateCouponDTO;
    if (coupon?.code) {
      couponExists = await this.couponsRepository.findByCode(coupon.code);
      if (!coupon) {
        throw new AppError('Coupon does not exist or expired.');
      }
      /*
      VALIDATE COUPON
      */
      const validate_coupon = await ValidateCoupon(couponExists);
      if (!validate_coupon) {
        throw new AppError('Coupon does not exist or expired.');
      }
    }
    /*
    VALIDATE ORDER TOTAL
    */
    if (
      !(await ValidateOrderTotals({
        coupon: couponExists,
        net_amount: total,
        projects
      }))
    ) {
      throw new AppError('Error validating order amount');
    }
    // CREATE TRANSACTION_ID
    const reference_id = `CHOCO-${uuidv4()}`;
    // CREATE THE TRANSACTION
    const transaction = await this.paymentProvider.create({
      user,
      projects,
      coupon,
      payer,
      items,
      payment,
      reference_id
    });

    const boleto = await FormatBoleto(transaction);

    // SAVE ORDER TO DB
    const order = await this.ordersRepository.create({
      user_id,
      reference_id,
      transaction_id: transaction.id,
      project_ids,
      payment_method,
      boleto,
      gross_amount: subtotal,
      discount_amount: total - subtotal,
      net_amount: total,
      installment_count: installments,
      status: 'waiting_payment'
    });

    /*
    FORMAT ORDER CONSTANTS ( R$ 99,99 , 'Cartão de Crédito', etc. )
    */
    const paymentData = await FormatPaymentConstants(order);

    // GET ORDER CONFIRMATION  EMAIL TEMPLATE
    const orderConfirmationMailTemplate = resolve(
      'src',
      'modules',
      'orders',
      'views',
      'emails',
      'order_confirmation.hbs'
    );
    /*
    QUEUE ORDER CONFIRMATION MAIL
    */
    const projectsFormatted = projects.map(project => ({
      ...project,
      template: {
        ...project.template,
        price: formatMoney(project.template.price)
      }
    }));

    const is_multiple_videos = project_ids.length > 1 ? true : false;
    await this.queueProvider.add('OrderConfirmationEmail', {
      order: { user, ...order },
      projects: projectsFormatted,
      payment: { ...boleto, ...paymentData },
      is_multiple_videos,
      file: orderConfirmationMailTemplate
    });

    /*
    UPDATE PROJECTS STATUS TO ORDERED.
    */
    // Testing order does not change project status:
    const projectStatus =
      appConfig.node_env === 'development' ? 'editing' : 'ordered';

    await this.projectsRepository.update({
      ids: project_ids,
      columns: { status: projectStatus }
    });

    return { order, transaction, projects };
  }
}

export default CreateOrderService;
