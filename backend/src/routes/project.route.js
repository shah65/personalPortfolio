const express = require("express");
const  protect  = require('../middlewares/auth.middleware');
const projectController = require("../controllers/project.controller");
const { cacheMiddleware } = require('../middlewares/cache.middleware');

const router = express.Router();

//CRUD OPERATION
router.post('/projects', projectController.storeProject);
router.get('/projects', cacheMiddleware('projects'), projectController.getAllProjects);
router.get('/project/:id', cacheMiddleware('projects'), projectController.getSingleProject);
router.put('/project/:id', projectController.updateProject);
router.delete('/project/:id', projectController.deleteProject);

// Additional Query Routes
router.get('/project/status/:status', projectController.getProjectByStatus);

module.exports = router;
