import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

export default function NotFound() {
  return (
    <div className="pt-40 text-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-red-500 font-black text-9xl italic tracking-tighter uppercase mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest">Sector Not Found</h2>
        <Link to="/" className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">
          Recall to Base
        </Link>
      </motion.div>
    </div>
  );
}
