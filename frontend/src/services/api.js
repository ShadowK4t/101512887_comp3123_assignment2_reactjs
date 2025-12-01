import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User APIs
export const signup = (userData) => api.post('/user/signup', userData);
export const login = (credentials) => api.post('/user/login', credentials);

// Employee APIs
export const getAllEmployees = () => api.get('/emp/employees');
export const getEmployeeById = (id) => api.get(`/emp/employees/${id}`);
export const createEmployee = (employeeData) => {
  const formData = new FormData();
  Object.keys(employeeData).forEach(key => {
    formData.append(key, employeeData[key]);
  });
  return api.post('/emp/employees', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateEmployee = (id, employeeData) => {
  const formData = new FormData();
  Object.keys(employeeData).forEach(key => {
    if (employeeData[key] !== null && employeeData[key] !== undefined) {
      formData.append(key, employeeData[key]);
    }
  });
  return api.put(`/emp/employees/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteEmployee = (id) => api.delete(`/emp/employees?eid=${id}`);
export const searchEmployees = (params) => api.get('/emp/employees/search', { params });

export default api;
