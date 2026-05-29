import api from './api';

export const adminService = {
  getSummary: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  suspendUser: async (id: string, isSuspended: boolean, reason?: string) => {
    const endpoint = isSuspended ? 'suspend' : 'activate';
    const payload = isSuspended ? { suspensionReason: reason || "No reason provided" } : {};
    const response = await api.put(`/admin/users/${id}/${endpoint}`, payload);
    return response.data;
  },
  getVerifications: async () => {
    const response = await api.get('/admin/verifications');
    return response.data;
  },
  updateVerification: async (id: string, status: string, rejectionReason?: string) => {
    const endpoint = status === 'approved' ? 'approve' : 'reject';
    const response = await api.put(`/admin/verifications/${id}/${endpoint}`, { rejectionReason });
    return response.data;
  },
  getPartners: async () => {
    const response = await api.get('/admin/partner-applications');
    return response.data;
  },
  updatePartner: async (id: string, status: string) => {
    const endpoint = status === 'approved' ? 'approve' : 'reject';
    const response = await api.put(`/admin/partner-applications/${id}/${endpoint}`, {});
    return response.data;
  },
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
  updateReport: async (id: string, status: string) => {
    const endpoint = status === 'resolved' ? 'resolve' : 'dismiss';
    const response = await api.put(`/admin/reports/${id}/${endpoint}`, {});
    return response.data;
  },
  getItems: async () => {
    const response = await api.get('/admin/items');
    return response.data;
  },
  removeItem: async (id: string, isRemoved: boolean, reason?: string) => {
    const endpoint = isRemoved ? 'remove' : 'restore';
    const payload = isRemoved ? { adminRemovalReason: reason || "No reason provided" } : {};
    const response = await api.put(`/admin/items/${id}/${endpoint}`, payload);
    return response.data;
  },
  getAppeals: async () => {
    const response = await api.get('/admin/suspension-appeals');
    return response.data;
  },
  updateAppeal: async (id: string, status: string) => {
    const endpoint = status === 'approved' ? 'approve' : 'reject';
    const response = await api.put(`/admin/suspension-appeals/${id}/${endpoint}`, {});
    return response.data;
  }
};
