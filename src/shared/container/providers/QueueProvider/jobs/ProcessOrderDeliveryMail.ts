import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';

@injectable()
class ProcessDeliveryEmail {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  queueName(): string {
    return 'OrderDeliveryMail';
  }

  execute(): void {
    this.queueProvider.process('OrderDeliveryMail', async job => {
      const {
        subject,
        order,
        projects,
        is_multiple_videos,
        payment,
        file,
        attachments
      } = job.data as any;

      await this.mailProvider.sendMail({
        to: {
          name: order.user.name,
          email: order.user.email
        },
        subject,
        templateData: {
          file,
          variables: {
            order,
            projects,
            is_multiple_videos,
            payment
          }
        },
        attachments
      });
    });
  }
}

export default ProcessDeliveryEmail;
