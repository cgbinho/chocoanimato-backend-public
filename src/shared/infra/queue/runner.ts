import 'reflect-metadata';
//import 'dotenv/config';
import { container } from 'tsyringe';
import '@shared/container';
import redisConfig from '@config/redis';
import * as jobs from '@shared/container/providers/QueueProvider/jobs/index';
// import redis from 'redis';

import Redis, { Redis as RedisClient } from 'ioredis';
const redisClient = new Redis(redisConfig.config);

redisClient.on('connect', () => console.log('connect'));
redisClient.on('ready', () => console.log('ready'));
redisClient.on('reconnecting', () => console.log('reconnecting'));
redisClient.on('error', () => console.log('error'));
redisClient.on('end', () => console.log('end'));

redisClient.on('ready', async () => {
  let response = await redisClient.ping();
  console.log(response);
  // do other stuff
});

console.log('redis: ', process.env.REDIS_CACHE_HOST);

// const redisClient = redis.createClient({
//   host: process.env.REDIS_CACHE_HOST,
//   port: Number(process.env.REDIS_CACHE_PORT)
//   // password: process.env.REDIS_CACHE_PASS || undefined
// });

/*
TIMEOUT BEFORE LOADING JOBS.
*/

function loadJobs() {
  for (const index in jobs) {
    if (Object.prototype.hasOwnProperty.call(jobs, index)) {
      const job = jobs[index];
      // console.table('job');
      const processQueue: any = container.resolve(job);
      processQueue.execute();
    }
  }
}

setTimeout(() => {
  loadJobs();
  console.log('All jobs loaded, processing queue...');
}, 4000);

// setTimeout(() => {
//   for (const index in jobs) {
//     if (Object.prototype.hasOwnProperty.call(jobs, index)) {
//       const job = jobs[index];
//       // console.table('job');
//       const processQueue: any = container.resolve(job);
//       processQueue.execute();
//     }
//   }
//   // console.log('jobs loaded');
//   console.log('All jobs loaded, processing queue...');
// }, 4000);

// for (const index in jobs) {
//   if (Object.prototype.hasOwnProperty.call(jobs, index)) {
//     const job = jobs[index];
//     // console.table('job');
//     const processQueue: any = container.resolve(job);
//     processQueue.execute();
//   }
// }

// console.log('Processing queue...');

// import ProcessSendForgotPasswordEmailService from '@shared/container/providers/QueueProvider/jobs/ProcessForgotPasswordEmail';
// const processQueue = container.resolve(ProcessSendForgotPasswordEmailService);
// processQueue.execute();
