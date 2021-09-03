// import Bull, {
//   Queue,
//   QueueOptions,
//   ProcessPromiseFunction,
//   JobOptions,
//   Job
// } from 'bull';

import IQueueProvider from '../models/IQueueProvider';

class FakeQueueProvider implements IQueueProvider {
  private queue: { topic: string; config: any };
  static Queues: { [key: string]: {} } = {};

  constructor() {}

  /*
  CHECK IF QUEUE ALREADY EXISTS
  */
  public async getQueue(topic: string, config?: any): Promise<any> {
    let queue = FakeQueueProvider.Queues[topic];
    if (queue) {
      return queue;
    }
    queue = { topic, config };
    FakeQueueProvider.Queues[topic] = queue;
    return queue;
  }
  /*
  GET QUEUES
  */
  public async getQueues(): Promise<any> {}
  /*
  ADD JOB TO THE TOPIC QUEUE
  */
  public async add(
    topic: string,
    data: object | object[],
    opts?: any
  ): Promise<any> {
    return { message: 'Job added.' };
  }

  /*
  PROCESS THE QUEUE FOR THIS TOPIC
  */
  public async process(topic: string, processFunction: any): Promise<any> {}
}

export default FakeQueueProvider;
