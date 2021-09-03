import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import { inject, injectable } from 'tsyringe';

@injectable()
class ProcessTest {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  queueName(): string {
    return 'ProcessTest';
  }

  async execute(): Promise<any> {
    const result = await this.queueProvider.process(
      'TestService',
      async job => {
        const { name } = job.data as any;
        // await this.cacheProvider.saveWithExpiration(`test:${name}`, 'test', 5000);
        await job.moveToCompleted('done', true);
        return { message: 'ok' };
      }
    );
    return result;
    // await this.queueProvider.process('TestService', async job => {
    //   const { name } = job.data as any;
    //   // await this.cacheProvider.saveWithExpiration(`test:${name}`, 'test', 5000);
    //   await job.moveToCompleted('done', true);
    //   return { message: 'ok' };
    // });
  }
}

export default ProcessTest;
