const express = require("express");
const skillController = require("../controllers/skill.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// ALL SKILL ROUTES REQUIRE AUTHENTICATION
router.use(protect);

// Basic CRUD - No rate limiter for now
router.post("/skills", skillController.addSkill);
router.get("/skills", skillController.getAllSkills);
router.get("/skills/:id", skillController.getSingleSkill);
router.put("/skills/:id", skillController.updateSkill);
router.delete("/skills/:id", skillController.deleteSkill);

module.exports = router;