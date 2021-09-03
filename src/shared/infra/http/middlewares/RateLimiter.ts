import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
// import redis from 'redis';
import Redis, { Redis as RedisClient } from 'ioredis';
import redisConfig from '@config/redis';
import AppError from '@shared/errors/AppError';

// Working redis client:
// const redisClient = redis.createClient({
//   host: process.env.REDIS_CACHE_HOST,
//   port: Number(process.env.REDIS_CACHE_PORT),
//   password: process.env.REDIS_CACHE_PASS || undefined
// });

const redisClient = new Redis(redisConfig.config);

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 1
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
