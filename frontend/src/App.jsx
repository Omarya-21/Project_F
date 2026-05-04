import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Plus, RefreshCw } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', newProduct);
      fetchProducts();
      setNewProduct({ name: '', price: '', stock: '', category: '' });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-10 px-4">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 flex items-center gap-3"
      >
        <Package className="text-blue-500" /> Nexus Hardware
      </motion.h1>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Add Product Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card bg-gray-900 border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} /> Add New Part
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Product Name" 
              className="bg-gray-800 border-none rounded p-2 text-white"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                placeholder="Price" 
                className="bg-gray-800 border-none rounded p-2 text-white"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Stock" 
                className="bg-gray-800 border-none rounded p-2 text-white"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                required
              />
            </div>
            <input 
              type="text" 
              placeholder="Category" 
              className="bg-gray-800 border-none rounded p-2 text-white"
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            />
            <button type="submit" className="btn-primary mt-2">Add to Inventory</button>
          </form>
        </motion.div>

        {/* Product List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card bg-gray-900 border border-gray-800 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Inventory</h2>
            <button onClick={fetchProducts} className="text-gray-400 hover:text-white transition">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
            {products.length === 0 ? (
              <p className="text-gray-500 italic">No products found.</p>
            ) : (
              products.map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-400">${product.price}</p>
                    <p className="text-xs text-gray-500">Qty: {product.stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
