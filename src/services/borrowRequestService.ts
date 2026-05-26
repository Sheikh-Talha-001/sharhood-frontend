import api from './api';

export const borrowRequestService = {
  getMyRequests: async () => {
    const response = await api.get('/requests/my-requests');
    return response.data;
  },
  getReceivedRequests: async () => {
    const response = await api.get('/requests/received');
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
    // Map status strings to specific backend routes
    const validEndpoints = {
      'approved': 'approve',
      'rejected': 'reject',
      'cancelled': 'cancel',
      'returned': 'return'
    };
    
    const endpoint = validEndpoints[status as keyof typeof validEndpoints];
    
    if (!endpoint) {
      throw new Error(`Invalid status transition: ${status}`);
    }

    const response = await api.put(`/requests/${id}/${endpoint}`);
    return response.data;
  }
};
