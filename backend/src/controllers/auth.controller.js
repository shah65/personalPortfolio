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
 
  async getProfile(req,res,next){
    try{
      const user = await userModel.findById(req.userId).select("-password");
      if(!user){
        throw new NotFoundError("User not found!");
      }
      res.status(200).json({
        success:true,
        data:user
      })
    }catch(er){
      next(er);
    }
  }
}

module.exports = new AuthController();