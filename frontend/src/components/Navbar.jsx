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
              Store <span className="text-[10px] opacity-50">▼</span>
            </span>
            <div className="absolute top-full left-0 w-64 bg-black border border-gray-800 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-6 grid grid-cols-1 gap-1 shadow-2xl z-50 overflow-y-auto max-h-[80vh]">
              <div className="px-6 pb-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Components</div>
              <Link to="/store/cpu" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Processors (CPU)</Link>
              <Link to="/store/gpu" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Graphics Cards (GPU)</Link>
              <Link to="/store/ram" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Memory (RAM)</Link>
              <Link to="/store/rom" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Storage (SSD/HDD)</Link>
              <Link to="/store/psu" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Power Supplies</Link>
              <Link to="/store/cases" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Chassis/Cases</Link>
              
              <div className="px-6 pt-4 pb-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Peripherals</div>
              <Link to="/store/screens" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Monitors</Link>
              <Link to="/store/mouses" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Mice</Link>
              <Link to="/store/keyboards" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Keyboards</Link>
              <Link to="/store/headphones" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Audio/Headsets</Link>
              <Link to="/store/controllers" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Controllers</Link>

              <div className="px-6 pt-4 pb-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Setup</div>
              <Link to="/store/gaming-chairs" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Gaming Chairs</Link>
              <Link to="/store/pc-tables" className="px-6 py-2 hover:bg-blue-600/10 hover:text-blue-500 transition-colors">Gaming Desks</Link>
            </div>
          </div>
          
          <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
          
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
