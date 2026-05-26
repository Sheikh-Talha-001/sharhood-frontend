import api from './api';

export const agreementService = {
  getAll: async () => {
    const response = await api.get('/agreements');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/agreements/${id}`);
    return response.data;
  },
  generatePDF: async (id: string) => {
    const response = await api.get(`/agreements/${id}/download`, { responseType: 'blob' });
    return response.data;
  }
};
