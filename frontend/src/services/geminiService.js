import axios from 'axios';

export const getBuildAdvice = async (messages, products) => {
  try {
    const response = await axios.post('/api/ai/advice', { messages, products });
    return response.data.text;
  } catch (error) {
    console.error("AI Advice Service Error:", error);
    throw error;
  }
};
