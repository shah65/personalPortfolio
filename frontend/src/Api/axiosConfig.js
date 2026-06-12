import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 10000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  constructor(message, status, originalError) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.originalError = originalError;
  }
}

function handleError(error) {
  if (!error.response) {
    throw new ApiError(
      "Network error — please check your connection.",
      null,
      error
    );
  }
  const { status, data } = error.response;
  const message = data?.message || data?.error || "Something went wrong.";
  throw new ApiError(message, status, error);
}

export default api;
export { handleError };