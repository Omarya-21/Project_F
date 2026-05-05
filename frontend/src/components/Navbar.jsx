import { useAuth } from '../context/AuthContext';
import { LogOut, User, LogIn, ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-white uppercase tracking-tighter italic">
          <Package className="text-blue-600" size={24} /> OMAR'S<span className="text-blue-600">PC</span>
        </Link>
        
        <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <div className="relative group h-16 flex items-center">
            <span className="text-gray-400 cursor-default flex items-center gap-1 group-hover:text-white transition-colors">
              Hardware <span className="text-[10px] opacity-50">▼</span>
            </span>
            <div className="absolute top-full left-0 w-48 bg-black border border-gray-800 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-4 flex flex-col gap-2 shadow-2xl">
              <Link to="/category/CPU" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Processors</Link>
              <Link to="/category/GPU" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Graphics Cards</Link>
              <Link to="/category/Motherboard" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Motherboards</Link>
              <Link to="/category/RAM" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Memory</Link>
              <Link to="/category/PSU" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Power Supplies</Link>
            </div>
          </div>
          
          <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 transition-colors">Admin</Link>
          )}
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
