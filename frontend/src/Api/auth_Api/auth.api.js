import api, { handleError } from '../axiosConfig';

export async function login({ email, password }) {
  try {
    const response = await api.post("/authentication/login", { email, password });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function logout() {
  try {
    const response = await api.post("/authentication/logout");
    return response.data;
  } catch (error) {
    console.warn('Logout error:', error.message);
    return { success: true };
  }
}

export async function getProfile() {
  try {
    const response = await api.get("/authentication/profile");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}