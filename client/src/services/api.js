import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const multipartConfig = {
  headers: { 'Content-Type': undefined },
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yash_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('yash_admin_token');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getProjects = () => api.get('/projects');
export const getSkills = () => api.get('/skills');
export const getExperience = () => api.get('/experience');
export const getDocuments = () => api.get('/documents');
export const getProfile = () => api.get('/profile');
export const submitContact = (data) => api.post('/contact', data);

export const login = (credentials) => api.post('/auth/login', credentials);
export const getMessages = () => api.get('/messages');

export const createProject = (formData) => api.post('/projects', formData, multipartConfig);
export const updateProject = (id, formData) => api.put(`/projects/${id}`, formData, multipartConfig);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const createSkill = (data) => api.post('/skills', data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);

export const createExperience = (data) => api.post('/experience', data);
export const updateExperience = (id, data) => api.put(`/experience/${id}`, data);
export const deleteExperience = (id) => api.delete(`/experience/${id}`);

export const uploadDocument = (formData) => api.post('/documents', formData, multipartConfig);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
// Plain <a href> links can't carry the admin's auth token, so viewing/downloading
// a document goes through this authenticated request and is turned into a blob URL.
export const fetchDocumentBlob = (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' });

export const updateProfile = (formData) => api.put('/profile', formData, multipartConfig);

export const markMessageRead = (id) => api.patch(`/messages/${id}/read`);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);

export default api;
