import Redis from 'ioredis';

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

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

