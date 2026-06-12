const { createClient } = require('redis');

// Simple URL - works with Docker
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisUrl = `redis://${redisHost}:6379`;

const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => console.error('❌ Redis error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
  }
};

module.exports = { redisClient, connectRedis };