import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

@injectable()
class ProcessOrderCancellationEmail {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  queueName(): string {
    return 'OrderStatusUpdateEmail';
  }

  execute(): void {
    this.queueProvider.process('OrderStatusUpdateEmail', async job => {
      const {
        order,
        projects,
        status,
        payment,
        is_multiple_videos,
        file
      } = job.data as any;

      await this.mailProvider.sendMail({
        to: {
          name: order.user.name,
          email: order.user.email
        },
        subject: `[Choco Animato] Seu Pedido foi atualizado para o status '${status.pt}' ${order.reference_id}`,
        templateData: {
          file,
          variables: {
            order,
            status,
            projects,
            is_multiple_videos,
            payment
          }
        }
      });
    });
  }
}

export default ProcessOrderCancellationEmail;
