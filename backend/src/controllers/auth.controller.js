const userModel = require('../module/user.module');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  AppError,
  ValidationError,
  AuthenticationError,
  EmailAlreadyExistsError
} = require('../utils/AppError');

class AuthController {
  async createAccount(req, res, next) {
    try {
      const { userName, password, email, role } = req.body;

      // Validation
      if (!userName || !email || !password) {
        throw new ValidationError('All fields (userName, email, password) are required!');
      }

      // Check if email already exists
      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        throw new EmailAlreadyExistsError(email);
      }

      // Check if username already exists
      const existingUsername = await userModel.findOne({ userName });
      if (existingUsername) {
        throw new ValidationError('Username already taken!');
      }

      // Password length validation
      if (password.length < 6) {
        throw new ValidationError('Password must be at least 6 characters!');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format!');
      }

      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await userModel.create({
        userName,
        password: hashedPassword,
        email,
        role: role || 'FRONTEND'
      });

      // Create token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Setup cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Remove password from response
      user.password = undefined;

      res.status(201).json({
        success: true,
        message: "Account successfully created",
        data: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError('Please provide both email and password');
      }

      // Find user by email and include password field
      const user = await userModel.findOne({ email }).select('+password');

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (user.isActive === false) {
        throw new AuthenticationError('Account is deactivated. Please contact support');
      }

      // Compare password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Update last login time
      user.lastLoginAt = new Date();
      await user.save({ validateBeforeSave: false });

      // Generate token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Setup cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Remove password from response
      user.password = undefined;

      res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            role: user.role
          }
        },
        message: 'Login successful!'
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.cookie('token', "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully!'
      });
    } catch (error) {
      next(error);
    }
  }
 
}

module.exports = new AuthController();