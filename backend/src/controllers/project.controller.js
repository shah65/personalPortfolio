const projectM  = require("../module/project.module")
import { protect } from '../middlewares/auth.middleware';
const {
  AppError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  AuthorizationError
} = require('../utils/AppError');

class projectController {
  //method for storing product in first time
  async storeProject (req,res,next){
    const {projectUserName,projectName,projectDetails,projectTechnology,githubUrl} = req.body;

    // Check if required fields are present
    if (!projectUserName || !projectName || !projectDetails || !projectTechnology || !githubUrl) {
      throw new ValidationError("Missing required fields: projectUserName, projectName, projectDetails, projectTechnology And githubUrl are required");
    }
    try{
      const project = await projectM.create({
        projectUserName,
        projectName,
        projectDetails,
        projectTechnology,
        githubUrl,
        updatedAt:new Date()
      })
      return res.status(201).json({
        message:"Project created succfully!",
        success:true,
        data:project
      })
    }catch(error){
      next(error);
    }
  }

  //get All Prpjects
  async getAllProjects(req,res,next){
    try{
      const avaliableProjects = await projectM.find()
        .populate("prijectUserName","name email")
         .sort({createdAt: -1});  
     
      if (!avaliableProjects || avaliableProjects.length ===0){
        throw new NotFoundError("No projects found!");
    }
    return res.status(200).json({
      success:true,
      count:avaliableProjects.length,
      data:avaliableProjects
    });

    }catch(err){
      next(err);
    }
  }

  //get specific project
  async getSingleProject(req,res,next){
   try {
     const projectId = req.params.id;
     if(!projectId){
      throw new ValidationError("project ID is required!");
     }
     const avaliableProject = await projectM.findById(projectId)
          .populate("projectUserName","name email");
     if(!avaliableProject){
       throw new NotFoundError(`Project with ID ${projectId} not found`);
     }

     return res.status(200).json({
      success:true,
      data:avaliableProject
     })

   } catch (error) {
   next(error);
   }
  }


  //update Specfic project
  async updateProject(req,res,next){
    try{
      const projectId = req.params.id;
      const updates = req.body;
      if(!projectId){
        throw new ValidationError(`ProjectId is required!`);
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
        {$set :filteredUpdates},
        {new: true,runValidators:true}
      ).populate("projectUserName","name email");

      return res.status(201).json({
        success:true,
        message:"project updated Successfully!",
        data:updatedProject
      });
    }catch(error){
      next(error)
    }
  }

  async deleteProject(req,res,next){
    try{
      const projectId = req.params.id;
      if(!projectId){
        throw new ValidationError("Project id is required!");
      }
      const delateProject = await projectId.findByIdAndDelete(projectId);
      if(!delateProject){
        throw new NotFoundError(`project with ID${projectId} is not found!`);
      }
      return res.status(200).json({
        success:true,
        message:"Project deleted succfully!",
        data:deletedProject
      });
    }catch(error){
      next(error);
    }
  }

  //get Project by status
  async getProjectByStatus(req,res,next){
    const{status} = req.params;
    const validStatus = ["PLANNING","IN_PROGRESS","COMPLETED","ARCHIEVED"];
    if(!status){
      throw new ValidationError("stauts paramater is required!");
    }
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new ValidationError(`Invalid status. Valid statuses: ${validStatuses.join(', ')}`);
    }
    const protects = await projectM.find({status:status.toUpperCase()})
        .populate("projectUserName","name email")
        .sort({createdAt:-1});

    if(!projects || project.length ===0){
      throw new NotFoundError(`No project found with status:${status}`);
    }
    return res.status(200).json({
      success:true,
      count:projects.length,
      data:projects
    });
  }catch(error){
    next(error);
  }
}

module.exports = projectController();