import appConfig from '@config/app';
import { formatMoney } from '@modules/orders/utils/formatNumbers';
import FormatPaymentConstants from '@modules/orders/utils/formatPaymentConstants';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPdfProvider from '@shared/container/providers/PdfProvider/models/IPdfProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';

@injectable()
class ProcessOrderLinksAndReceipt {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('PdfProvider')
    private pdfProvider: IPdfProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}
  // @inject('ProjectsRepository')
  // private projectsRepository: IProjectsRepository,

  queueName(): string {
    return 'OrderLinksAndReceipt';
  }

  async execute(): Promise<any> {
    const result = await this.queueProvider.process(
      'OrderLinksAndReceipt',
      async job => {
        const { order, projects } = job.data as any;

        /*
        GET PROJECT IDS TO GENERATE LINKS
        */
        const projectsFormatted = projects.map(
          (project: ICreateProjectDTO) => ({
            id: project.id,
            name: project.name,
            link: `${appConfig.backend_url}/backend/assets/videos/delivery/${project.id}`,
            price_formatted: formatMoney(project.template.price),
            ...project
          })
        );

        /*
        FORMAT ORDER CONSTANTS ( R$ 99,99 , 'Cartão de Crédito', etc. )
        */
        const payment = await FormatPaymentConstants(order);

        const orderData = {
          order,
          projects: projectsFormatted,
          payment
        };
        /*
        CREATE PDF RECEIPT
        */
        const receipt = await this.pdfProvider.createReceipt(orderData);
        /*
        SAVE RECEIPT TO FILE
        */
        await this.storageProvider.saveFile({
          folder: 'receipts',
          path: `ChocoAnimato-Receipt-${order.reference_id}.pdf`,
          data: receipt,
          encoding: 'base64'
        });

        job.queue.on('completed', async (job, result) => {
          const { order, projects, payment, receipt } = result;

          /*
          FORMAT SUBJECT TEXT FOR SINGLE AND MULTIPLE VIDEOS:
          */
          const is_multiple_videos = projects.length > 1 ? true : false;
          const subject = is_multiple_videos
            ? `Choco Animato - Seus vídeos já estão disponíveis para download! - Cód. do Pedido: ${order.reference_id}`
            : `Choco Animato - Seu vídeo já está disponível para download! - Cód. do Pedido: ${order.reference_id}`;

          // GET DELIVERY EMAIL TEMPLATE
          const orderOrderDeliveryMailTemplate = resolve(
            'src',
            'modules',
            'orders',
            'views',
            'emails',
            'order_delivery.hbs'
          );

          /*
          QUEUE DELIVERY MAIL
          */
          await this.queueProvider.add('OrderDeliveryMail', {
            subject,
            order,
            projects,
            is_multiple_videos,
            payment,
            file: orderOrderDeliveryMailTemplate,
            attachments: [
              {
                filename: `ChocoAnimato_ReciboDeCompra_${order.reference_id}.pdf`,
                content: receipt,
                encoding: 'base64'
              }
            ]
          });

          /*
          UPDATE PROJECTS STATUS TO DELIVERED.
          */
          const project_ids = projects.map(
            (project: { id: string }) => project.id
          );
          // const projectsToUpdate = await this.projectsRepository.findByIds(
          //   project_ids
          // );
          // await this.projectsRepository.update({
          //   ids: project_ids,
          //   columns: { status: 'delivered' }
          // });
          // OLD:
          // await Promise.all(
          //   projectsToUpdate.map(async project => {
          //     project.status = 'deliver';
          //     await this.projectsRepository.save(project);
          //   })
          // );
        });

        return { receipt, ...orderData };
      }
    );
  }
}

export default ProcessOrderLinksAndReceipt;
