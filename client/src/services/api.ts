import axios from 'axios';

// Define response types
interface PingResponse {
  message: string;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
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

export default api; 