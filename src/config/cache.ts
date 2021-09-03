//import 'dotenv/config';
import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
  token: { expiresIn: number };
}

export default {
  driver: 'redis',
  config: {
    redis: {
      // tls: {},
      // password: process.env.REDIS_CACHE_PASSWORD
      host: process.env.REDIS_CACHE_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_CACHE_PORT) || 6379,
      connectTimeout: 19000
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
  },
  token: {
    expiresIn: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 : 60 * 15000 // 1 dia ou 15 minutos
  }
};
