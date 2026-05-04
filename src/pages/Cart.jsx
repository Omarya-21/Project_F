import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Cpu, Package } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'motion/react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [compatibility, setCompatibility] = useState(null);
    const [checking, setChecking] = useState(false);
    const navigate = useNavigate();

    const checkComp = async () => {
        if (cartItems.length < 2) {
            setCompatibility(null);
            return;
        }
        setChecking(true);
        try {
            const res = await api.post('/products/check-compatibility', { parts: cartItems });
            setCompatibility(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        checkComp();
    }, [cartItems]);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 border-4 border-slate-50 shadow-inner">
                    <ShoppingBag size={48} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Your build is empty.</h1>
                <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                    Start adding components to check for compatibility and build your dream setup.
                </p>
                <Link to="/products" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 inline-block">
                    Explore Components
                </Link>
            </div>
        );
    }

    const hasCriticalError = compatibility?.messages?.some((m) => m.type === 'error');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
            <h1 className="text-4xl font-black text-slate-900 mb-10 flex items-center gap-4">
                <Package className="text-blue-600" size={36} /> Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cart Items */}
                <div className="flex-grow space-y-4">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div 
                                key={item.cart_item_id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-200 flex flex-col sm:flex-row items-center gap-6 group hover:border-blue-200 transition-colors shadow-sm"
                            >
                                <img 
                                    src={item.image_url || 'https://via.placeholder.com/150'} 
                                    alt={item.name} 
                                    className="w-24 h-24 object-cover rounded-2xl bg-slate-100"
                                />
                                <div className="flex-grow text-center sm:text-left">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.category_name}</span>
                                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">{item.name}</h3>
                                    <p className="text-sm font-black text-blue-600">${item.price.toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1">
                                        <button 
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white rounded-lg transition-colors"
                                        >-</button>
                                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center font-bold hover:bg-white rounded-lg transition-colors"
                                        >+</button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.cart_item_id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary / Compatibility */}
                <aside className="w-full lg:w-96 space-y-6">
                    {/* Compatibility Checker Result */}
                    <div className={`p-6 rounded-[2.5rem] border-2 transition-all shadow-sm ${
                        !compatibility ? 'bg-slate-100 border-slate-200' :
                        compatibility.compatible ? 'bg-emerald-50 border-emerald-100' : 
                        hasCriticalError ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                    }`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Build Validation</h3>
                            <Cpu className={`animate-pulse ${checking ? 'text-blue-600' : 'text-slate-400'}`} size={20} />
                        </div>

                        {!compatibility ? (
                             <p className="text-slate-500 text-sm font-medium italic">Add 2 or more components to trigger active compatibility scans.</p>
                        ) : (
                            <div className="space-y-4">
                                {compatibility.compatible && (
                                    <div className="flex gap-3 text-emerald-700">
                                        <CheckCircle2 className="shrink-0" size={20} />
                                        <p className="text-sm font-bold leading-tight">All systems green. Your components are perfectly matched.</p>
                                    </div>
                                )}
                                {compatibility.messages?.map((msg, i) => (
                                    <div key={i} className={`flex gap-3 ${msg.type === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                                        {msg.type === 'error' ? <ShieldAlert className="shrink-0" size={20} /> : <AlertTriangle className="shrink-0" size={20} />}
                                        <p className="text-sm font-bold leading-tight">{msg.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Total Summary */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20">
                        <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-slate-400 border-b border-white/5 pb-4">Order Summary</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400 font-medium tracking-wide">
                                <span>Subtotal</span>
                                <span>${cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 font-medium tracking-wide">
                                <span>Shipping</span>
                                <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Free</span>
                            </div>
                            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                <span className="text-sm font-bold uppercase text-slate-500 tracking-tighter">Total Price</span>
                                <p className="text-4xl font-black tracking-tighter hover:text-blue-400 transition-colors cursor-default animate-in fade-in duration-1000">
                                    ${cartTotal.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <button 
                            disabled={hasCriticalError}
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed group"
                        >
                            {hasCriticalError ? 'Incompatible Build' : 'Proceed to Checkout'}
                            {!hasCriticalError && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        {hasCriticalError && (
                            <p className="text-[10px] text-red-500 font-bold text-center mt-4 tracking-wider uppercase">Resolve errors before checkout</p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Cart;
