import api, { handleError } from '../axiosConfig';

export async function storeProject(projectData) {
  try {
    const response = await api.post("/proj/projects", projectData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllProjects() {
  try {
    const response = await api.get("/proj/projects");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getSingleProject(projectId) {
  try {
    const response = await api.get(`/proj/project/${projectId}`);
    return response.data;
  } catch (error) {
    handleError(`'Get single project error:'${error}`);
    console.error('Get single project error:', error);
     
  }
}

export async function updateProject(projectId, updates) {
  try {
    const response = await api.put(`/proj/project/${projectId}`, updates);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteProject(projectId) {
  try {
    const response = await api.delete(`/proj/project/${projectId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}