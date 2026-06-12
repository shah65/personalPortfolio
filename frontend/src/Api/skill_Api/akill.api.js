import api, { handleError } from '../axiosConfig';

export async function addSkill(skillData) {
  try {
    const response = await api.post("/skill/skills", skillData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllSkills(category = null) {
  try {
    const params = category ? { category } : {};
    const response = await api.get("/skill/skills", { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateSkill(skillId, updates) {
  try {
    const response = await api.put(`/skill/skills/${skillId}`, updates);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteSkill(skillId) {
  try {
    const response = await api.delete(`/skill/skills/${skillId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}