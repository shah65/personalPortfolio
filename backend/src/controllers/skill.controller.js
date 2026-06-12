const skillModel = require("../module/skill.module");
const {
  ValidationError,
  NotFoundError,
  AuthenticationError
} = require("../utils/AppError");

class SkillController {
  async addSkill(req, res, next) {
    try {
      console.log("addSkill called", req.body); // Debug log

      const { name, category, proficiency, yearsOfExperience } = req.body;
      const userId = req.userId;

      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }

      if (!name || !category) {
        throw new ValidationError("Skill name and category are required!");
      }

      // Check if skill already exists
      const existingSkill = await skillModel.findOne({
        userId,
        name: name.toLowerCase(),
        category: category.toUpperCase()
      });

      if (existingSkill) {
        throw new ValidationError(`Skill "${name}" already exists in ${category} category`);
      }

      // Create skill
      const skill = await skillModel.create({
        userId,
        name: name.toLowerCase(),
        category: category.toUpperCase(),
        proficiency: proficiency || 50,
        yearsOfExperience: yearsOfExperience || 0,
        displayOrder: 0
      });

      res.status(201).json({
        success: true,
        message: "Skill added successfully!",
        data: skill
      });

    } catch (error) {
      next(error);
    }
  }

  async getAllSkills(req, res, next) {
    try {
      console.log("getAllSkills called"); // Debug log

      const userId = req.userId;
      const { category } = req.query;

      if (!userId) {
        throw new AuthenticationError("User not authenticated");
      }

      let filter = { userId };
      if (category) filter.category = category.toUpperCase();

      const skills = await skillModel.find(filter)
        .sort({ displayOrder: 1, proficiency: -1, name: 1 });

      const groupedByCategory = skills.reduce((acc, skill) => {
        const cat = skill.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        count: skills.length,
        data: skills,
        groupedByCategory: groupedByCategory,
        summary: {
          totalSkills: skills.length,
          categories: Object.keys(groupedByCategory),
          averageProficiency: skills.length > 0
            ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length)
            : 0
        }
      });

    } catch (error) {
      next(error);
    }
  }

  async getSingleSkill(req, res, next) {
    try {
      const skillId = req.params.id;
      const userId = req.userId;

      if (!skillId) {
        throw new ValidationError("Skill ID is required");
      }

      const skill = await skillModel.findOne({ _id: skillId, userId });

      if (!skill) {
        throw new NotFoundError("Skill not found");
      }

      res.status(200).json({
        success: true,
        data: skill
      });

    } catch (error) {
      next(error);
    }
  }

  async updateSkill(req, res, next) {
    try {
      const skillId = req.params.id;
      const userId = req.userId;
      const updates = req.body;

      if (!skillId) {
        throw new ValidationError("Skill ID is required");
      }

      const existingSkill = await skillModel.findOne({ _id: skillId, userId });
      if (!existingSkill) {
        throw new NotFoundError("Skill not found or doesn't belong to you");
      }

      const allowedUpdates = ['name', 'category', 'proficiency', 'yearsOfExperience', 'displayOrder'];
      const filteredUpdates = {};

      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = field === 'name' ? updates[field].toLowerCase() :
            field === 'category' ? updates[field].toUpperCase() :
              updates[field];
        }
      });

      if (filteredUpdates.name || filteredUpdates.category) {
        const newName = filteredUpdates.name || existingSkill.name;
        const newCategory = filteredUpdates.category || existingSkill.category;

        const duplicate = await skillModel.findOne({
          userId,
          name: newName,
          category: newCategory,
          _id: { $ne: skillId }
        });

        if (duplicate) {
          throw new ValidationError(`Skill "${newName}" already exists`);
        }
      }

      const updatedSkill = await skillModel.findByIdAndUpdate(
        skillId,
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "Skill updated successfully!",
        data: updatedSkill
      });

    } catch (error) {
      next(error);
    }
  }

  async deleteSkill(req, res, next) {
    try {
      const skillId = req.params.id;
      const userId = req.userId;

      if (!skillId) {
        throw new ValidationError("Skill ID is required");
      }

      const deletedSkill = await skillModel.findOneAndDelete({ _id: skillId, userId });

      if (!deletedSkill) {
        throw new NotFoundError("Skill not found or doesn't belong to you");
      }

      res.status(200).json({
        success: true,
        message: "Skill deleted successfully!",
        data: deletedSkill
      });

    } catch (error) {
      next(error);
    }
  }
}

// IMPORTANT: This must be exactly this
module.exports = new SkillController();