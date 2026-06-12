const projectM = require("../module/project.module");
const { protect } = require('../middlewares/auth.middleware');
const CacheMiddleware = require('../middlewares/cache.middleware');
const {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError
} = require('../utils/AppError');

class projectController {

  // Store project
  async storeProject(req, res, next) {
    const { projectUserName, projectName, projectDetails, projectTechnology, githubUrl } = req.body;

    // Check if required fields are present
    if (!projectUserName || !projectName || !projectDetails || !projectTechnology || !githubUrl) {
      throw new ValidationError("Missing required fields: projectUserName, projectName, projectDetails, projectTechnology and githubUrl are required");
    }

    try {
      const project = await projectM.create({
        projectUserName,
        projectName,
        projectDetails,
        projectTechnology,
        githubUrl,
        updatedAt: new Date()
      });

      return res.status(201).json({
        message: "Project created successfully!",
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  }

  // Get All Projects (FIXED)
  async getAllProjects(req, res, next) {
    try {
      const availableProjects = await projectM.find()
        .populate("projectUserName", "userName email")  // FIXED: was "prijectUserName"
        .sort({ createdAt: -1 });

      // Don't throw error - just return empty array if no projects
      return res.status(200).json({
        success: true,
        count: availableProjects.length,
        data: availableProjects
      });
    } catch (err) {
      next(err);
    }
  }

  // Get specific project
  async getSingleProject(req, res, next) {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new ValidationError("Project ID is required!");
      }

      const availableProject = await projectM.findById(projectId)
        .populate("projectUserName", "userName email");

      if (!availableProject) {
        throw new NotFoundError(`Project with ID ${projectId} not found`);
      }

      return res.status(200).json({
        success: true,
        data: availableProject
      });
    } catch (error) {
      next(error);
    }
  }

  // Update specific project
  async updateProject(req, res, next) {
    try {
      const projectId = req.params.id;
      const updates = req.body;

      if (!projectId) {
        throw new ValidationError("ProjectId is required!");
      }

      // Check if project exists
      const existingProject = await projectM.findById(projectId);
      if (!existingProject) {
        throw new NotFoundError(`Project with ID ${projectId} not found`);
      }

      // Remove fields that shouldn't be updated
      const allowedUpdates = ['projectName', 'projectDetails', 'projectTechnology', 'status', 'githubUrl'];
      const filteredUpdates = {};

      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      const updatedProject = await projectM.findByIdAndUpdate(
        projectId,
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      ).populate("projectUserName", "userName email");

      // Clear cache for project lists
      if (CacheMiddleware && CacheMiddleware.clearCache) {
        await CacheMiddleware.clearCache(`cache:/api/v1/projects*`);
      }

      return res.status(200).json({
        success: true,
        message: "Project updated successfully!",
        data: updatedProject
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete project (FIXED)
  // DELETE PROJECT - With better error handling
  async deleteProject(req, res, next) {
    try {
      const projectId = req.params.id;

      if (!projectId) {
        throw new ValidationError("Project id is required!");
      }

      // Check if ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ValidationError("Invalid project ID format!");
      }

      // Use projectM model to delete
      const deletedProject = await projectM.findByIdAndDelete(projectId);

      if (!deletedProject) {
        throw new NotFoundError(`Project with ID ${projectId} not found!`);
      }

      // Clear cache after deletion
      if (CacheMiddleware && CacheMiddleware.clearCache) {
        await CacheMiddleware.clearCache(`cache:/api/v1/projects*`);
      }

      return res.status(200).json({
        success: true,
        message: "Project deleted successfully!",
        data: deletedProject
      });
    } catch (error) {
      next(error);
    }
  }

  // Get Project by status (FIXED)
  async getProjectByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const validStatuses = ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "ARCHIVED"]; // FIXED spelling

      if (!status) {
        throw new ValidationError("Status parameter is required!");
      }

      if (!validStatuses.includes(status.toUpperCase())) {
        throw new ValidationError(`Invalid status. Valid statuses: ${validStatuses.join(', ')}`);
      }

      const projects = await projectM.find({ status: status.toUpperCase() })
        .populate("projectUserName", "userName email")
        .sort({ createdAt: -1 });

      if (!projects || projects.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }

      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new projectController();