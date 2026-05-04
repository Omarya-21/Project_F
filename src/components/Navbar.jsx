import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Cpu, Search, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Cpu className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            NEXUS<span className="text-blue-600">PC</span>
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search processors, GPUs, builds..."
                                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        </div>
                    </form>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Products</Link>
                        
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                                <LayoutDashboard size={16} />
                                Dashboard
                            </Link>
                        )}

                        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                                <ShoppingCart size={22} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                        {cartItems.reduce((a, b) => a + b.quantity, 0)}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/profile" className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            <User size={18} className="text-slate-600 group-hover:text-blue-600" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 hidden lg:block">{user.name}</span>
                                    </Link>
                                    <button 
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2 text-slate-600">
                            <ShoppingCart size={22} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isMenuOpen && (
                <div className="md:hidden bg-white px-4 pt-2 pb-6 border-t border-slate-100 animate-in slide-in-from-top duration-200">
                    <form onSubmit={handleSearch} className="mb-4">
                         <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 outline-none text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        </div>
                    </form>
                    <div className="flex flex-col gap-4">
                        <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2">Products</Link>
                        {user?.role === 'admin' && (
                             <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2 text-blue-600">Admin Dashboard</Link>
                        )}
                         {user ? (
                            <>
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2">Account: {user.name}</Link>
                                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-base font-medium py-2">My Orders</Link>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-base font-medium py-2 text-red-500 underline">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold">Login / Sign Up</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
