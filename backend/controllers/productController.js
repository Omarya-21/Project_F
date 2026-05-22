import * as ProductModel from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('❌ Error getting products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
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
  try {
    const productId = await ProductModel.createProduct(req.body);
    res.status(201).json({ id: productId, ...req.body });
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ error: 'Could not add product' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await ProductModel.updateProduct(id, req.body);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};
