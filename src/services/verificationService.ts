import api from './api';

export const verificationService = {
  getStatus: async () => {
    const response = await api.get('/verification/status');
    return response.data;
  },
  submit: async (data: FormData) => {
    const response = await api.post('/verification/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};
