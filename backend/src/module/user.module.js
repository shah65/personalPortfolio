const mongo = require("mongoose")

const userSchema = new mongo.Schema({
  userName: {
    type: String,
    required: [true, "username is required. Please provide your full name"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."],
    index: true,
  },
  password: {
    type: String, // Changed from Number to String
    required: [true, "password is required"],
    minlength: [8, "Password must be at least 8 characters long."],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    lowercase: true, // Fixed typo: was 'lowecase'
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address (e.g., user@example.com)",
    ],
    index: true,
  },
  role: {
    type: String,
    enum: {
      values: ["FRONTEND", "BACKEND", "FULLSTACK", "BLOCKCHAIN", "DEVOPS", "AI_ENGINEER"],
      message: "Role must be one of: FRONTEND, BACKEND, FULLSTACK, BLOCKCHAIN, DEVOPS, AI_ENGINEER",
    },
    default: 'FRONTEND',
    uppercase: true,
    required: [true, "User role is required"]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true }) // Fixed: was {timestamp:true}

const userModel = mongo.model("User", userSchema)
module.exports = userModel;