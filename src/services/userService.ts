import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  updateAvatar: async (data: FormData) => {
    const response = await api.put('/users/avatar', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updatePassword: async (data: any) => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },
  getPublicProfile: async (id: string) => {
    const response = await api.get(`/users/${id}/public`);
    return response.data;
  }
};
