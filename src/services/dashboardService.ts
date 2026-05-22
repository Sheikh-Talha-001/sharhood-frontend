import api from './api';

export const dashboardService = {
  getUserSummary: async () => {
    const response = await api.get('/dashboard/user-summary');
    return response.data;
  },
  getAdminSummary: async () => {
    const response = await api.get('/dashboard/admin-summary');
    return response.data;
  }
};

