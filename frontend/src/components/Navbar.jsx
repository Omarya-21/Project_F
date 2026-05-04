import { useAuth } from '../context/AuthContext';
import { LogOut, User, LogIn, ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-white uppercase tracking-tighter italic">
          <Package className="text-blue-600" size={24} /> NEXUS<span className="text-blue-600">PC</span>
        </Link>
        
        <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link to="/products" className="text-gray-400 hover:text-white transition-colors">Inventory</Link>
          <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </Link>
          
          {user ? (
            <div className="flex items-center gap-6 border-l border-gray-800 pl-6 ml-2">
              <Link to="/profile" className="flex items-center gap-2 text-blue-500 hover:text-white transition-colors">
                <User size={16} /> {user.name.split(' ')[0]}
              </Link>
              <button 
                onClick={logout}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Logoff"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105">
              <LogIn size={16} /> LOGON
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
