import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Checkout.css';

export default function Checkout() {
  return (
    <div className="pt-24 pb-20 flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-4xl font-black mb-4 uppercase tracking-[0.2em] text-blue-600 italic">Checkout</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We're currently setting up our secure payment gateway. This part of the shop is almost ready!
        </p>
        <Link to="/cart" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </motion.div>
    </div>
  );
}
