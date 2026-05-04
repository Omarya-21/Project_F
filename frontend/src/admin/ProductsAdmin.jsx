import { useState, useEffect } from 'react';
import { getProducts, addProduct } from '../services/productService';
import { Plus, Package, Trash2, Edit2 } from 'lucide-react';
import '../styles/ProductsAdmin.css';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(newProduct);
    fetchProducts();
    setNewProduct({ name: '', price: '', stock: '', category: '' });
  };

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-3xl font-black mb-10 text-white italic uppercase tracking-widest">Inventory Management</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 p-8 rounded-3xl h-fit">
          <h2 className="text-xl font-black mb-6 uppercase flex items-center gap-2 italic">
            <Plus size={20} className="text-blue-500" /> New Logistics Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="Hardware Name" 
              className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder="Unit Price" 
                className="bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
              />
              <input 
                type="number" 
                placeholder="Qty" 
                className="bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                required
              />
            </div>
            <input 
              type="text" 
              placeholder="Category" 
              className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest italic">
              Authorize Stock
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-800">
                <th className="pb-4">Hardware</th>
                <th className="pb-4">Sector</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {products.map(p => (
                <tr key={p.id} className="group hover:bg-gray-800/20 transition-colors">
                  <td className="py-4 flex items-center gap-3">
                    <Package size={16} className="text-blue-500" />
                    <span className="font-bold text-sm text-white">{p.name}</span>
                  </td>
                  <td className="py-4 text-xs font-mono text-gray-500">{p.category}</td>
                  <td className="py-4 text-sm font-bold text-gray-300">{p.stock}</td>
                  <td className="py-4 text-right space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                    <button className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
