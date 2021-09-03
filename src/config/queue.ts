//import 'dotenv/config';
import { RedisOptions } from 'ioredis';
// import { QueueOptions } from 'bull';

interface IQueueConfig {
  driver: 'bull';

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'bull',
  config: {
    redis: {
      host: process.env.REDIS_CACHE_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_CACHE_PORT) || 6378,
      connectTimeout: 19000
      // host: process.env.REDIS_CACHE_HOST || '127.0.0.1',
      // port: Number(process.env.REDIS_CACHE_PORT) || 6379,
      // connectTimeout: 17000,
      // maxRetriesPerRequest: 4,
      // retryStrategy: times => Math.min(times * 30, 1000),
      // reconnectOnError: error => {
      //   const targetErrors = [/READONLY/, /ETIMEDOUT/];
      //   targetErrors.forEach(targetError => {
      //     if (targetError.test(error.message)) {
      //       return true;
      //     }
      //   });
      // }
    }
  }
} as IQueueConfig;
