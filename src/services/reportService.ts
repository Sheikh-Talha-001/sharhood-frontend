import api from './api';

export const reportService = {
  create: async (data: any) => {
    const response = await api.post('/reports', data);
    return response.data;
  },
  getMyReports: async () => {
    const response = await api.get('/reports/me');
    return response.data;
  }
};
