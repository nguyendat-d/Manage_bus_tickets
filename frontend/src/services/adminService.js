// Admin Service
import api from './api';
import { handleError } from '../utils/messageHandler';

const adminService = {
  // User Management
  getUsers: async (page = 1, limit = 10, role = null) => {
    const params = { page, limit };
    if (role) params.role = role;
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Bus Company Management
  getBusCompanies: async (page = 1, limit = 10, status = null) => {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await api.get('/admin/bus-companies', { params });
    return response.data;
  },

  approveBusCompany: async (companyId, status) => {
    const response = await api.put(`/admin/bus-companies/${companyId}/status`, { status });
    return response.data;
  },

  // Route Management
  getRoutes: async (page = 1, limit = 10) => {
    const response = await api.get('/admin/routes', { params: { page, limit } });
    return response.data;
  },

  createRoute: async (routeData) => {
    const response = await api.post('/admin/routes', routeData);
    return response.data;
  },

  updateRoute: async (routeId, routeData) => {
    const response = await api.put(`/admin/routes/${routeId}`, routeData);
    return response.data;
  },

  deleteRoute: async (routeId) => {
    const response = await api.delete(`/admin/routes/${routeId}`);
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  }
};

export default adminService;
