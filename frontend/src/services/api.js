import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || '/api';

// Check if baseUrl is a fully qualified URL and doesn't end with /api
if (baseUrl && baseUrl !== '/api' && !baseUrl.endsWith('/api') && !baseUrl.endsWith('/api/')) {
  baseUrl = baseUrl.endsWith('/') ? `${baseUrl}api` : `${baseUrl}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
});

// Add auth header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
