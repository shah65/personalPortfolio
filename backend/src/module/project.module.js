const mongo = require("mongoose");

const projectSchema = new  mongo.Schema({
  projectUserName:{
    type:mongo.Schema.Type.ObjectId,
    ref:"User",
    required:[true,"Project must have an owner (User name is required"],
    index:true
  },
  projectName:{
    type:String,
    required:[true,"Project name is required"],
    trim:true,
    index: true // Improves search performance
  },
  projectDetails:{
    type:String,
    trim: true,
    minlength: [50, "Project details must be at least 50 characters long"],
    validate: {
      validator: function (text) {
        if (!text) return false;
        const wordCount = text.trim().split(/\s+/).length;
        return wordCount >= 20; // Minimum 20 words
      },
      message: "Project details must be at least 20 words long (current: {VALUE} words)",
    },
  },
  projectTechnology:{
    type:String,
    required: [true, "At least one technology is required"],
    enum:{
      values: ["MERN STACK", "AI AGENTIC", "JAVA SPRINGBOOT", "PYTHON DJANGO", "FLUTTER", "REACT NATIVE"],
    },
    uppercase:true,
    trim:true,
    index:true,
  },
  status:{
    type:String,
    enum:{
      values: ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "ARCHIVED"],
    }, default: "PLANNING",
    uppercase: true,
  },
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (url) {
        if (!url) return true; // Optional field
        // Basic URL validation for GitHub links
        return /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/.test(url);
      },
      message: "Please provide a valid GitHub repository URL",
    },
  },
  uploadedAt: {
    type: Date,
    default: null,
  },
 
},{timestamps:true})

module.exports = mongo.model("Project",projectSchema);