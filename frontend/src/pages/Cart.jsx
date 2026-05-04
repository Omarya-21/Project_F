import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import '../styles/Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShoppingBag size={80} className="text-gray-800 mb-8" />
          <h2 className="text-4xl font-black text-white mb-4 uppercase italic">Cart is Empty</h2>
          <p className="text-gray-500 mb-10 max-w-sm">No hardware detected in the deployment queue. Return to inventory to source components.</p>
          <Link to="/products" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
            Browse Inventory
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-4xl font-black mb-12 text-white border-l-4 border-blue-600 pl-4 uppercase italic">Deployment Queue</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-6 bg-gray-900 border border-gray-800 rounded-2xl group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center">
                    <Package className="text-gray-700" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-500 transition-colors uppercase italic">{item.name}</h3>
                    <p className="text-xs text-gray-500 font-mono tracking-tighter uppercase">{item.category}</p>
                    <p className="text-blue-500 font-black mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center bg-black rounded-lg border border-gray-800 overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-900 text-gray-400 hover:text-white transition-colors border-r border-gray-800"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 text-sm font-black text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-900 text-gray-400 hover:text-white transition-colors border-l border-gray-800"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-black mb-8 border-b border-gray-800 pb-4 uppercase tracking-widest italic">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span>Components</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span>Logistics</span>
                <span className="text-green-500 font-mono">FREE</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span>Tax Rate</span>
                <span className="text-white font-mono">0.00%</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-gray-800 mb-8">
              <span className="text-lg font-black uppercase tracking-[0.2em] italic">Total Ops</span>
              <span className="text-3xl font-black text-blue-500">{formatPrice(subtotal)}</span>
            </div>
            <Link to="/checkout" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest">
              Initiate Checkout <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
