import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabaseClient';

// Define response types
interface PingResponse {
  message: string;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL as string || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session?.access_token) {
    // Ensure headers object exists
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

// Define your API endpoints here
export const apiService = {
  // Example endpoint
  ping: async (): Promise<PingResponse> => {
    try {
      const response = await api.get<PingResponse>('/');
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
  
  // Add more API methods as needed
};

// Game API
export const gameAPI = {
  getStats: () => {
    return api.get('/api/game/stats');
  },
};

export default api; 