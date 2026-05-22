import { ReactNode } from 'react';
import api from './api';

export interface Item {
  price: string;
  id: string;
  available: any;
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  availability: boolean;
  images: string[];
  owner: {
    memberSince: ReactNode;
    isPartner: any;
    isVerified: any;
    _id: string;
    name: string;
    avatar?: string;
  };
  borrowRequestCount: number;
  createdAt: string;
}

export const itemService = {
  getAll: async (params?: any) => {
    const response = await api.get('/items', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  create: async (itemData: FormData) => {
    // Requires FormData for image uploads
    const response = await api.post('/items', itemData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id: string, itemData: any) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  }
};

