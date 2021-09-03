import redisConfig from '@config/redis';
import * as jobs from '@shared/container/providers/QueueProvider/jobs/index';
import Bull, {
  Job,
  JobOptions,
  ProcessPromiseFunction,
  Queue,
  QueueOptions
} from 'bull';
import IQueueProvider from '../models/IQueueProvider';

// import ProcessSendForgotPasswordEmailService from '@modules/users/services/ProcessSendForgotPasswordEmailService';
// const jobs = [ProcessSendForgotPasswordEmailService]; // each new job will be included here

class BullQueueProvider implements IQueueProvider {
  private queue: Queue;
  static Queues: { [key: string]: Queue } = {};

  constructor() {}

  /*
  CHECK IF QUEUE ALREADY EXISTS
  */
  public async getQueue(
    topic: string,
    config?: QueueOptions
  ): Promise<Bull.Queue<any>> {
    let queue = BullQueueProvider.Queues[topic];
    if (queue) {
      return queue;
    }
    queue = new Bull(topic, {
      ...config,
      redis: { ...redisConfig.config }
    });
    BullQueueProvider.Queues[topic] = queue;
    return queue;
  }
  /*
  GET QUEUES
  */
  public async getQueues(): Promise<Bull.Queue<any> | Bull.Queue<any>[]> {
    let queues: Bull.Queue<any> | Bull.Queue<any>[] = [];

    for (const index in jobs) {
      if (Object.prototype.hasOwnProperty.call(jobs, index)) {
        const job = new jobs[index]();

        const queue = new Bull(job.queueName());
        queues.push(queue);
      }
    }
    return queues;
  }
  /*
  ADD JOB TO THE TOPIC QUEUE
  */
  public async add<T>(
    topic: string,
    data: object | object[],
    opts?: JobOptions
  ): Promise<Job<T>> {
    /*
     CHECK IF QUEUE ALREADY EXISTS
     */
    this.queue = await this.getQueue(topic);
    if (Array.isArray(data)) {
      const parsedJobs = data.map(jobData => {
        return { data: jobData };
      });

      await this.queue.addBulk(parsedJobs);

      return;
    }
    /*
    ADD TO QUEUE
    */
    return await this.queue.add(data, opts);
  }

  /*
  PROCESS THE QUEUE FOR THIS TOPIC
  */
  public async process(
    topic: string,
    processFunction: ProcessPromiseFunction<object>
  ): Promise<any> {
    this.queue = await this.getQueue(topic, {
      redis: { ...redisConfig.config }
    });
    return this.queue.process(15, processFunction);
  }

  // on<T>(
  //   job: Job,
  //   event: 'failed' | 'completed' | 'stalled' | 'error',
  //   eventFunction: (...args: any[]) => T
  // ): Queue<any> {
  //   // this.queue = this.getQueue(topic, {
  //   //   redis: { ...redisConfig.config.redis }
  //   // });
  //   this.queue = job.queue;
  //   return this.queue.on(event, eventFunction);
  // }
}

export default BullQueueProvider;

const Queues = () => {
  let queues: Bull.Queue<any> | Bull.Queue<any>[] = [];

  for (const index in jobs) {
    if (Object.prototype.hasOwnProperty.call(jobs, index)) {
      // queues.push(jobs[index].queueName());
      const job = new jobs[index]();
      /*
      CREATE A QUEUE with job name
      */
      const queue = new Bull(job.queueName());
      queues.push(queue);
    }
  }
  return queues;
};
