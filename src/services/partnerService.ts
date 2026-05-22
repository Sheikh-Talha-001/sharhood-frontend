import api from './api';

export interface PartnerApplicationData {
  email: string | number | readonly string[];
  fullName: string;
  phoneNumber: string;
  categoriesInterestedIn: string[];
  reasonForJoining: string;
  experienceDescription: string;
  businessName?: string;
  city: string;
}

export const partnerService = {
  getApplication: async () => {
    const response = await api.get('/partners/my-application');
    return response.data;
  },
  apply: async (data: PartnerApplicationData) => {
    const response = await api.post('/partners/apply', data);
    return response.data;
  }
};
