import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import fs from 'fs-extra';
import { inject, injectable } from 'tsyringe';

@injectable()
class ProcessFileExpiration {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider
  ) {}

  queueName(): string {
    return 'FileExpiration';
  }

  /*
  EXPIRE VIDEO FILES AFTER A GIVEN TIME.
  */
  execute(): void {
    this.queueProvider.process('FileExpiration', async job => {
      const { file } = job.data as any;
      try {
        await fs.remove(file);
      } catch (err) {}
    });
  }
}

export default ProcessFileExpiration;
