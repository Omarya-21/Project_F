import axios from 'axios';

export const getProducts = async () => {
  const response = await axios.get('/api/products');
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await axios.post('/api/products', productData);
  return response.data;
};
