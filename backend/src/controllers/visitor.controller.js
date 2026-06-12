const { redisClient } = require('../config/redis.config');

class VisitorController {
  // Get and increment visitor count
  async getVisitorCount(req, res, next) {
    try {
      const key = 'visitor:count';
      let count = await redisClient.get(key);
      
      if (!count) {
        count = '0';
      }
      
      res.status(200).json({
        success: true,
        data: {
          count: parseInt(count),
          message: 'Welcome to my portfolio!'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Increment visitor count (called when page loads)
  async incrementVisitor(req, res, next) {
    try {
      const key = 'visitor:count';
      const newCount = await redisClient.incr(key);
      
      // Set expiry to never (keep forever)
      await redisClient.persist(key);
      
      res.status(200).json({
        success: true,
        data: {
          count: newCount,
          message: 'Visitor count updated'
        }
      });
    } catch (error) {
      // Don't fail if Redis is down
      res.status(200).json({
        success: true,
        data: {
          count: 0,
          message: 'Visitor count temporarily unavailable'
        }
      });
    }
  }

  // Reset counter (admin only)
  async resetVisitorCount(req, res, next) {
    try {
      await redisClient.set('visitor:count', '0');
      res.status(200).json({
        success: true,
        message: 'Visitor counter reset successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VisitorController();
