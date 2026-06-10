const express = require("express");
import protect  from '../middlewares/auth.middleware';
const projectController = require("../controllers/project.controller");

const router = express.Router();

//CRUD OPERATION
router.post('/projects', projectController.storeProject);
router.get('/projects', projectController.getAllProjects);
router.get('/project/:id', projectController.getSingleProject);
router.put('/project/:id', projectController.updateProject);
router.delete('/project/:id', projectController.deleteProject);

// Additional Query Routes
router.get('/project/status/:status', projectController.getProjectByStatus);

module.exports = router;
