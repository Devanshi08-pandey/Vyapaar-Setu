const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/ai/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return response.json();
  },
  
  rankVendors: async () => {
    const response = await fetch(`${API_BASE_URL}/vendors`);
    return response.json();
  },
  
  generateDescription: async (productName, keywords = '') => {
    const response = await fetch(`${API_BASE_URL}/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_name: productName, keywords }),
    });
    return response.json();
  },
  
  analyzeSentiment: async (reviewText) => {
    const response = await fetch(`${API_BASE_URL}/ai/sentiment?review_text=${encodeURIComponent(reviewText)}`, {
      method: 'POST',
    });
    return response.json();
  },
  
  chat: async (message) => {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response.json();
  }
};
