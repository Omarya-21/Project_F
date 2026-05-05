import * as ProductModel from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('❌ Error in getProducts:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  const { name, brand, price, stock, category, image, description } = req.body;
  try {
    const id = await ProductModel.createProduct(name, brand, price, stock, category, image, description);
    res.status(201).json({ id, name, brand, price, stock, category, image, description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
