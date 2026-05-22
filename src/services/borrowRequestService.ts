import api from './api';

export const borrowRequestService = {
  getAll: async () => {
    const response = await api.get('/requests');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/requests', data);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/requests/${id}/status`, { status });
    return response.data;
  }
};
