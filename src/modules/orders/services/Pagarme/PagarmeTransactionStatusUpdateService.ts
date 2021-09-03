import FormatPaymentConstants from '@modules/orders/utils/formatPaymentConstants';
// import { IPaymentStatusNotificationDTO } from '@shared/container/providers/PaymentProvider/dtos/IPaymentStatusNotificationDTO';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import pagarmeFormatProjectStatus from '@modules/projects/utils/pagarmeFormatProjectStatus';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPaymentProvider from '@shared/container/providers/PaymentProvider/models/IPaymentProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import IOrdersRepository from '../../repositories/IOrdersRepository';
import { formatMoney } from '../../utils/formatNumbers';
import { formatOrderStatusByString } from '../../utils/formatOrderStatus';

@injectable()
class PagarmeTransactionStatusUpdateService {
  constructor(
    @inject('PaymentProvider')
    private paymentProvider: IPaymentProvider,
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute(request: Request, response: Response): Promise<void> {
    // const body = {
    //   id: '11426098',
    //   fingerprint: '2df06c4ae1c98f680a984a6a5b809e418dbce8f0',
    //   event: 'transaction_status_changed',
    //   old_status: 'processing',
    //   desired_status: 'waiting_payment',
    //   current_status: 'waiting_payment',
    //   object: 'transaction',
    //   'transaction[object]': 'transaction',
    //   'transaction[status]': 'waiting_payment',
    //   'transaction[refuse_reason]': '',
    //   'transaction[status_reason]': 'acquirer',
    //   'transaction[acquirer_response_code]': '',
    //   'transaction[acquirer_name]': 'pagarme',
    //   'transaction[acquirer_id]': '5fb3b95107318c0016fb023e',
    //   'transaction[authorization_code]': '',
    //   'transaction[soft_descriptor]': '',
    //   'transaction[tid]': '11426098',
    //   'transaction[nsu]': '11426098',
    //   'transaction[date_created]': '2021-02-22T19:51:49.301Z',
    //   'transaction[date_updated]': '2021-02-22T19:51:49.549Z',
    //   'transaction[amount]': '10000',
    //   'transaction[authorized_amount]': '10000',
    //   'transaction[paid_amount]': '0',
    //   'transaction[refunded_amount]': '0',
    //   'transaction[installments]': '1',
    //   'transaction[id]': '11426098',
    //   'transaction[cost]': '0',
    //   'transaction[card_holder_name]': '',
    //   'transaction[card_last_digits]': '',
    //   'transaction[card_first_digits]': '',
    //   'transaction[card_brand]': '',
    //   'transaction[card_pin_mode]': '',
    //   'transaction[card_magstripe_fallback]': 'false',
    //   'transaction[cvm_pin]': 'false',
    //   'transaction[postback_url]':
    //     'https://cff2213b4ca3a8ab042a0cb2db43b3bd.m.pipedream.net',
    //   'transaction[payment_method]': 'boleto',
    //   'transaction[capture_method]': 'ecommerce',
    //   'transaction[antifraud_score]': '',
    //   'transaction[boleto_url]': 'https://pagar.me',
    //   'transaction[boleto_barcode]': '1234 5678',
    //   'transaction[boleto_expiration_date]': '2021-03-01T03:00:00.000Z',
    //   'transaction[referer]': 'api_key',
    //   'transaction[ip]': '186.220.199.133',
    //   'transaction[subscription_id]': '',
    //   'transaction[phone]': '',
    //   'transaction[address]': '',
    //   'transaction[customer][object]': 'customer',
    //   'transaction[customer][id]': '4760841',
    //   'transaction[customer][external_id]':
    //     '2fc7d410-89ad-4abb-bc34-10ae98414929',
    //   'transaction[customer][type]': 'individual',
    //   'transaction[customer][country]': 'br',
    //   'transaction[customer][document_number]': '',
    //   'transaction[customer][document_type]': 'cpf',
    //   'transaction[customer][name]': 'Jose da Silva',
    //   'transaction[customer][email]': 'comprador@sandbox.pagseguro.com.br',
    //   'transaction[customer][phone_numbers]': '',
    //   'transaction[customer][born_at]': '',
    //   'transaction[customer][birthday]': '',
    //   'transaction[customer][gender]': '',
    //   'transaction[customer][date_created]': '2021-02-22T19:51:49.265Z',
    //   'transaction[customer][documents][0][object]': 'document',
    //   'transaction[customer][documents][0][id]':
    //     'doc_cklgzxa8p0dog0h9tboszd93s',
    //   'transaction[customer][documents][0][type]': 'cpf',
    //   'transaction[customer][documents][0][number]': '33236597836',
    //   'transaction[billing]': '',
    //   'transaction[shipping]': '',
    //   'transaction[card]': '',
    //   'transaction[split_rules]': '',
    //   'transaction[reference_key]': '',
    //   'transaction[device]': '',
    //   'transaction[local_transaction_id]': '',
    //   'transaction[local_time]': '',
    //   'transaction[fraud_covered]': 'false',
    //   'transaction[fraud_reimbursed]': '',
    //   'transaction[order_id]': '',
    //   'transaction[risk_level]': 'unknown',
    //   'transaction[receipt_url]': '',
    //   'transaction[payment]': '',
    //   'transaction[addition]': '',
    //   'transaction[discount]': '',
    //   'transaction[private_label]': '',
    //   'transaction[pix_qr_code]': '',
    //   'transaction[pix_expiration_date]': ''
    // };

    const {
      id: transaction_id,
      old_status,
      object,
      desired_status,
      current_status
    } = request.body;

    /*
    GET ORDER STATUS FORMATTED ( {en: 'paid', pt: 'Paga'})
    */
    // const status = formatOrderStatusByString(current_status);
    const status = { en: 'paid', pt: 'Paga' };
    /*
    GET ORDER
    */
    const order = await this.ordersRepository.findByTransactionIdAndStatus(
      transaction_id
    );

    if (!order) {
      throw new AppError('No Order found');
      // return null;
    }

    /*
    GET USER PROJECTS
    */
    const projects = await this.projectsRepository.findByIds(order.project_ids);

    if (!projects) {
      throw new AppError('No Order Projects found');
    }
    const project_ids = projects.map((project: { id: string }) => project.id);

    const is_multiple_videos = projects.length > 1 ? true : false;

    /*
    GET PROJECT IDS TO GENERATE LINKS
    */
    const projectsFormatted = projects.map((project: ICreateProjectDTO) => ({
      id: project.id,
      name: project.name,
      price_formatted: formatMoney(project.template.price),
      ...project
    }));

    /*
    FORMAT ORDER CONSTANTS ( R$ 99,99 , 'Cartão de Crédito', etc. )
    */
    const paymentData = await FormatPaymentConstants(order);

    /*
    STATUS PAID
    Queue Projects Render, update order status to delivered, update projects to 'delivered' and send delivery email.
    */
    if (status.en === 'paid') {
      /*
      ADD PROJECTS TO ORDER RENDERS QUEUE
      First step in a chain of jobs to deliver the goods, generate receipt and emails.
      OrderRenders ( loop 'RenderVideo' job for all projects ) > OrderLinksAndReceipt > DeliverMail
      */
      await this.queueProvider.add('OrderRenders', {
        order,
        projects
      });
    }

    /*
    ALL OTHER STATUSES
    */
    const otherStatuses = [
      'processing',
      'authorized',
      'refunded',
      'pending_refund',
      'refused',
      'chargeback',
      'analyzing',
      'pending_review',
      'waiting_payment',
      'waiting'
    ];

    if (otherStatuses.includes(status.en)) {
      // GET ORDER STATUS UPDATE EMAIL TEMPLATE
      const orderStatusUpdateMailTemplate = resolve(
        'src',
        'modules',
        'orders',
        'views',
        'emails',
        'order_status_update.hbs'
      );
      /*
      QUEUE ORDER STATUS UPDATE MAIL
      */
      await this.queueProvider.add('OrderStatusUpdateEmail', {
        order,
        status,
        projects: projectsFormatted,
        payment: paymentData,
        is_multiple_videos,
        file: orderStatusUpdateMailTemplate
      });
    }

    // /*
    // UPDATE PROJECTS STATUS ACCORDINGLY WITH ORDER STATUS UPDATE.
    // */
    await this.projectsRepository.update({
      ids: project_ids,
      columns: {
        status: pagarmeFormatProjectStatus(status.en) // 'editing' | 'ordered' | 'delivered' ( item goes from 'editing' to 'ordered' because 'checkout' is just item added to cart in frontend.)
      }
    });

    // /*
    // UPDATE ORDER | TRANSACTION STATUS ( waiting_payment, paid, refused, etc)
    // */
    order.status = status.en;
    await this.ordersRepository.save(order);
  }
}

export default PagarmeTransactionStatusUpdateService;
