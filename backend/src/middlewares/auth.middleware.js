const userModel = require('../module/user.module');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  AppError,
  ValidationError,
  AuthenticationError,
  EmailAlreadyExistsError
} = require('../utils/AppError');

 

// Authentication middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies first, then headers
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AuthenticationError('You are not logged in. Please log in to access this resource');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    next(error);
  }
}
