import { motion } from 'framer-motion';
import { ShoppingCart, Package, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group p-5 flex flex-col"
    >
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-black rounded-xl mb-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Package size={64} className="text-gray-900 group-hover:text-blue-900/40 transition-colors" />
          )}
        </div>
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="text-white" size={32} />
        </div>
      </Link>

      <div className="flex-grow">
        <p className="text-[10px] text-blue-500 uppercase tracking-[0.3em] font-black mb-2 italic">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-500 transition-colors uppercase italic leading-tight">{product.name}</h3>
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-2xl font-black text-white">{formatPrice(product.price)}</span>
        <button 
          onClick={() => addToCart(product)}
          className="bg-white text-black p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-90"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </motion.div>
  );
}
