// src/services/api.ts
import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
    LoginCredentials,
    RegisterData,
    Campaign,
    CampaignFormData,
    CandidateFormData,
    Candidate,
    Vote,
    VoteAvailability
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// ==================== CAMPAIGNS ====================

export const campaignAPI = {
  getAll: async (): Promise<{ campaigns: Campaign[] }> => {
    const response = await api.get('/campaigns');
    return response.data;
  },

  getById: async (id: string): Promise<{ campaign: Campaign; candidates: Candidate[] }> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  create: async (data: CampaignFormData) => {
    const response = await api.post('/campaigns', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CampaignFormData>) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  toggleVoting: async (id: string) => {
    const response = await api.patch(`/campaigns/${id}/toggle-voting`);
    return response.data;
  },

  getStats: async (id: string) => {
    const response = await api.get(`/campaigns/${id}/stats`);
    return response.data;
  },

  addCandidate: async (campaignId: string, data: CandidateFormData) => {
    const response = await api.post(`/campaigns/${campaignId}/candidates`, data);
    return response.data;
  },

  updateCandidate: async (campaignId: string, candidateId: string, data: Partial<CandidateFormData>) => {
    const response = await api.put(`/campaigns/${campaignId}/candidates/${candidateId}`, data);
    return response.data;
  },

  deleteCandidate: async (campaignId: string, candidateId: string) => {
    const response = await api.delete(`/campaigns/${campaignId}/candidates/${candidateId}`);
    return response.data;
  },
};

// ==================== VOTES ====================

export const voteAPI = {
  cast: async (campaignId: string, candidateId: string) => {
    const response = await api.post('/votes', { campaignId, candidateId });
    return response.data;
  },

  getMyVotes: async (): Promise<{ votes: Vote[] }> => {
    const response = await api.get('/votes/my-votes');
    return response.data;
  },

  getAvailable: async (campaignId: string): Promise<VoteAvailability> => {
    const response = await api.get(`/votes/available/${campaignId}`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/votes/all');
    return response.data;
  },

  getReport: async () => {
    const response = await api.get('/votes/report');
    return response.data;
  },
};

export default api;