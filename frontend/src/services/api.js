import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' });
api.interceptors.request.use(config => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const authApi = { login: d => api.post('/auth/login', d), register: d => api.post('/auth/register', d), me: () => api.get('/auth/me') };
export const taskApi = { list: p => api.get('/tasks', { params: p }), get: id => api.get(`/tasks/${id}`), create: d => api.post('/tasks', d), update: (id,d) => api.put(`/tasks/${id}`, d), status: (id,status) => api.patch(`/tasks/${id}/status`, { status }), remove: id => api.delete(`/tasks/${id}`), upload: (id,file) => { const f = new FormData(); f.append('file', file); return api.post(`/tasks/${id}/attachment`, f); }, stats: () => api.get('/tasks/stats') };
export const usersApi = { list: () => api.get('/users') };
export const attendanceApi = { checkIn: image => { const f = new FormData(); f.append('image', image); return api.post('/attendance/check-in', f); }, checkOut: () => api.post('/attendance/check-out'), mine: () => api.get('/attendance/me') };
export default api;
