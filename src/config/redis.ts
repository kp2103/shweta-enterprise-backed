import { Redis } from 'ioredis';
import { env } from './env.js';

export const redisClient = new Redis(env.REDIS_CLI, {
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.error('[Redis] Reached maximum connection retries. Stopping.');
      return null; // Returning null tells ioredis to STOP reconnecting
    }
    // 2. Exponential backoff: Wait 50ms, then 100ms, maxing out at 2 seconds between retries
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redisClient.on('connecting', () => {
  console.log('[redis] is connecting');
});

redisClient.on('ready', () => {
  console.log('[Redis] is ready for listening event');
});

redisClient.on('reconnecting', () => {
  console.log('[Redis] is reconnecting');
});

redisClient.on('error', (error) => {
  console.log('[Redis] get an error', error);
});

redisClient.on('close', () => {
  console.log('[Redis] is connection is closed retry');
});

redisClient.on('end', () => {
  console.log('[Redis] is closed permenetly');
  process.exit(1);
});
