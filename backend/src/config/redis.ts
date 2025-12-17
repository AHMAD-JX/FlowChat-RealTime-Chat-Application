import Redis from 'ioredis';

// Create Redis client
// Support both REDIS_URL (for Upstash/cloud) and individual config (for local)
let redis: Redis;

if (process.env.REDIS_URL) {
  // For Upstash and other cloud Redis providers with TLS
  // Parse the URL to check if it's an Upstash URL
  const redisUrl = process.env.REDIS_URL;
  const isUpstash = redisUrl.includes('upstash.io');
  
  redis = new Redis(redisUrl, {
    ...(isUpstash && {
      tls: {
        rejectUnauthorized: false, // Required for Upstash
      },
    }),
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    enableOfflineQueue: false,
  });
} else {
  // For local Redis or custom configuration
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });
}

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err: Error) => {
  console.error('❌ Redis connection error:', err);
});

// Helper functions for presence management
export const setUserOnline = async (userId: string, socketId: string): Promise<void> => {
  await redis.hset(`user:${userId}:presence`, 'socketId', socketId);
  await redis.hset(`user:${userId}:presence`, 'status', 'online');
  await redis.hset(`user:${userId}:presence`, 'lastSeen', Date.now().toString());
  await redis.sadd('users:online', userId);
};

export const setUserOffline = async (userId: string): Promise<void> => {
  await redis.hset(`user:${userId}:presence`, 'status', 'offline');
  await redis.hset(`user:${userId}:presence`, 'lastSeen', Date.now().toString());
  await redis.srem('users:online', userId);
  await redis.del(`user:${userId}:presence`);
};

export const getUserPresence = async (userId: string): Promise<any> => {
  const presence = await redis.hgetall(`user:${userId}:presence`);
  return presence;
};

export const isUserOnline = async (userId: string): Promise<boolean> => {
    return (await redis.sismember('users:online', userId)) === 1;

};

export const getOnlineUsers = async (): Promise<string[]> => {
  return await redis.smembers('users:online');
};

// Helper functions for typing indicators
export const setTyping = async (chatId: string, userId: string): Promise<void> => {
  await redis.sadd(`chat:${chatId}:typing`, userId);
  await redis.expire(`chat:${chatId}:typing`, 5); // Auto-expire after 5 seconds
};

export const removeTyping = async (chatId: string, userId: string): Promise<void> => {
  await redis.srem(`chat:${chatId}:typing`, userId);
};

export const getTypingUsers = async (chatId: string): Promise<string[]> => {
  return await redis.smembers(`chat:${chatId}:typing`);
};

export default redis;

