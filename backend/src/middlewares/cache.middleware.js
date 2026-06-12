const { redisClient } = require('../config/redis.config');

// Cache duration in seconds
const CACHE_TTL = 60 * 5; // 5 minutes

const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  try {
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Override res.json to also save to cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(data));
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    // If Redis fails, just skip cache — don't break the app
    console.error('Cache middleware error:', error);
    next();
  }
};

// Call this after any write operation to keep data fresh
const clearCache = async (keyPrefix) => {
  const keys = await redisClient.keys(`${keyPrefix}:*`);
  if (keys.length > 0) await redisClient.del(keys);
};

module.exports = { cacheMiddleware, clearCache };