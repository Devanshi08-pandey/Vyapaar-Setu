import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchVendors = async () => {
  try {
    const response = await api.get('/vendors');
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

export const smartSearch = async (query) => {
  try {
    const response = await api.post('/ai/search', { query });
    return response.data;
  } catch (error) {
    console.error('Error in smart search:', error);
    throw error;
  }
};

export const generateDescription = async (productName, keywords = '') => {
  try {
    const response = await api.post('/ai/generate-description', {
      product_name: productName,
      keywords: keywords,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
};

export const chatWithAI = async (message) => {
  try {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw error;
  }
};

export default api;
