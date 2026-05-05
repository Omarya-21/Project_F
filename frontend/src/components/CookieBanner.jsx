import { useState, useEffect } from 'react';
import { ShieldCheck, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-32 md:w-[450px] z-50 bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-2xl"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold leading-tight uppercase italic text-sm tracking-tight">Security & Analytics</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Omar's PC uses cookies to optimize your hardware configuration experience and secure your transactions.
              </p>
            </div>
            <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={acceptAll}
              className="flex-grow bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-3 rounded-xl uppercase transition-all"
            >
              Optimize Content
            </button>
            <button 
              onClick={acceptNecessary}
              className="flex-grow bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-black py-3 rounded-xl uppercase transition-all"
            >
              Essential Only
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button className="text-[10px] text-gray-500 hover:text-blue-500 flex items-center gap-1 uppercase font-bold transition-colors">
              <Settings size={10} /> Customize Matrix
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
