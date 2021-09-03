import * as jobs from '@shared/container/providers/QueueProvider/jobs/index';
import Bull from 'bull';
import { BullAdapter } from 'bull-board';

export const Queues = () => {
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

export const BullBoardQueues = () => {
  let queues = [];

  for (const index in jobs) {
    if (Object.prototype.hasOwnProperty.call(jobs, index)) {
      // queues.push(jobs[index].queueName());
      const job = new jobs[index]();
      /*
      CREATE A QUEUE with job name
      */
      const queue = new Bull(job.queueName());

      queues.push(new BullAdapter(queue));
    }
  }
  return queues;
};

// export default Queues;
