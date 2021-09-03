import { IJobDTO } from '../dtos/IJobDTO';
import { Queue, Job } from 'bull';

export default interface IQueueProvider {
  getQueue(topic: string, config?: any): Promise<Queue<any>>;
  getQueues(): any;
  add(topic: string, data: object | object[], opts?: any): Promise<Job | null>;
  process<T>(
    topic: string,
    processFunction: (job: Job) => Promise<any>
  ): Promise<T>;
}
