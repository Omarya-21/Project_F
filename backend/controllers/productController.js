import * as ProductModel from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  const { name, price, stock, category, image, specs } = req.body;
  try {
    const specsString = typeof specs === 'object' ? JSON.stringify(specs) : specs;
    const id = await ProductModel.createProduct(name, price, stock, category, image, specsString);
    res.status(201).json({ id, name, price, stock, category, image, specs: specsString });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
