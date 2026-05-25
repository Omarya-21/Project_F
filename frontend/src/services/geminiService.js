import api from './api';

// The client NO LONGER imports @google/genai directly.
// Instead it calls the backend API which is secure.

export const getBuildAdvice = async (messages, products) => {
  try {
    const response = await api.post('/ai/advice', {
      messages,
      products
    });
    
    return response.data.text;
  } catch (error) {
    console.error("Frontend AI Service Error:", error);
    if (error.response?.data?.text) {
      return error.response.data.text;
    }
    throw error;
  }
};
