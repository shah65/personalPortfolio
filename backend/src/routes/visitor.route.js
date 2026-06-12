const express = require('express');
const visitorController = require('../controllers/visitor.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/count', visitorController.getVisitorCount);
router.post('/increment', visitorController.incrementVisitor);

// Admin only routes
router.delete('/reset', protect, visitorController.resetVisitorCount);

module.exports = router;
