import * as ProductModel from '../models/productModel.js';

export const getProducts = (req, res) => {
  try {
    const products = ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = (req, res) => {
  try {
    const product = ProductModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addProduct = (req, res) => {
  const { name, price, stock, category } = req.body;
  try {
    const id = ProductModel.createProduct(name, price, stock, category);
    res.status(201).json({ id, name, price, stock, category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
