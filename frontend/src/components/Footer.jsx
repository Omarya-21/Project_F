import { Package, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-2xl font-black text-white mb-6 italic">
            <Package className="text-blue-600" size={32} /> NEXUS<span className="text-blue-600">PC</span>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            The world's leading provider of military-grade PC components. Built for performance, tested in extreme conditions.
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all"><Twitter size={20} /></a>
            <a href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all"><Github size={20} /></a>
            <a href="#" className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all"><Instagram size={20} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-blue-500 transition-colors">Inventory</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Build Guides</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Support Center</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">System Status</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors">Cookie Settings</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-900 flex flex-col md:row justify-between items-center text-xs text-gray-600 font-mono">
        <p>&copy; 2026 NEXUS PC HARDWARE INC. ALL RIGHTS RESERVED.</p>
        <p className="mt-4 md:mt-0">DESIGNED BY ANTIGRAVITY SYSTEMS</p>
      </div>
    </footer>
  );
}
