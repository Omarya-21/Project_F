import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Shield, Truck, Zap, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import Loader from '../components/Loader';
import '../styles/ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!product) return <div className="pt-32 text-center text-red-500 font-bold">ERROR: HARDWARE SEGMENT NOT FOUND</div>;

  return (
    <div className="pt-24 pb-20">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Return to Inventory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center overflow-hidden"
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Package size={120} className="text-gray-800" />
          )}
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-blue-500 font-black text-xs tracking-[0.3em] uppercase mb-4 block italic">Authorized Component</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase italic leading-tight">{product.name}</h1>
          <p className="text-gray-400 text-lg mb-4 leading-relaxed">
            {product.description || 'Advanced hardware architecture designed for high-performance computing environments. Nexus certified and stress-tested for maximum stability and speed.'}
          </p>

          {product.specs && (
            <div className="mb-8 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(JSON.parse(product.specs)).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">{key.replace('_', ' ')}</span>
                    <span className="text-sm text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 mb-10">
            <span className="text-4xl font-black text-white">{formatPrice(product.price)}</span>
            <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-tighter ${product.stock > 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {product.stock > 0 ? `Stock: ${product.stock} Units` : 'Out of Stock'}
            </div>
          </div>

          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
          >
            <ShoppingCart size={24} /> Deploy to Cart
          </button>

          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-gray-800">
            <div className="flex flex-col items-center text-center gap-2">
              <Shield className="text-blue-600" size={24} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">3 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="text-blue-600" size={24} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Ops</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Zap className="text-blue-600" size={24} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pro Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
