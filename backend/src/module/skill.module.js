const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  // Link skill to a user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true
  },

  // Skill name
  name: {
    type: String,
    required: [true, "Skill name is required"],
    trim: true,
    lowercase: true,
    maxlength: [50, "Skill name cannot exceed 50 characters"]
  },

  // Skill category
  category: {
    type: String,
    required: [true, "Skill category is required"],
    enum: {
      values: [
        "PROGRAMMING_LANGUAGE",
        "FRAMEWORK",
        "DATABASE",
        "TOOL",
        "DEVOPS",
        "CLOUD",
        "SOFT_SKILL",
        "LANGUAGE"
      ],
      message: "Invalid category. Choose from: PROGRAMMING_LANGUAGE, FRAMEWORK, DATABASE, TOOL, DEVOPS, CLOUD, SOFT_SKILL, LANGUAGE"
    },
    uppercase: true
  },

  // Proficiency level (0-100 or descriptive)
  proficiency: {
    type: Number,
    min: [0, "Proficiency must be between 0 and 100"],
    max: [100, "Proficiency must be between 0 and 100"],
    default: 50,
    validate: {
      validator: Number.isInteger,
      message: "Proficiency must be an integer"
    }
  },

  // Years of experience
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },

  

  // Display order (for frontend sorting)
  displayOrder: {
    type: Number,
    default: 0
  },
 

  

}, {
  timestamps: true,
  // Compound index to prevent duplicate skills per user
  indexes: [
    { unique: true, fields: { userId: 1, name: 1, category: 1 } }
  ]
});

// Create text index for search functionality
skillSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model("Skill", skillSchema);