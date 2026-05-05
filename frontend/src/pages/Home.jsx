import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="pt-20">
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-white mb-6 leading-none"
        >
          ULTIMATE <span className="text-blue-500">HARDWARE</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
        >
          Premium components for elite builders. Experience performance without compromise with Omar's PC parts.
        </motion.p>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
        >
          <Link to="/category/CPU" className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 italic uppercase">
            Start Your Build <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-20 border-t border-gray-800">
        <div className="flex flex-col items-center text-center p-6">
          <Cpu className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold text-white mb-2">Next-Gen Tech</h3>
          <p className="text-gray-400">The latest processors and GPUs from industry leaders.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <Zap className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
          <p className="text-gray-400">High-speed RAM and NVMe storage for zero latency.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <Shield className="text-blue-500 mb-4" size={40} />
          <h3 className="text-xl font-bold text-white mb-2">Build Warranty</h3>
          <p className="text-gray-400">Full protection and lifetime support for your build.</p>
        </div>
      </section>
    </div>
  );
}
