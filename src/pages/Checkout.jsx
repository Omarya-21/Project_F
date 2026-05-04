import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Truck, CreditCard, Lock, ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Checkout = () => {
    const { cartItems, cartTotal, refreshCart } = useCart();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/orders', {
                total_price: cartTotal,
                shipping_address: address,
                items: cartItems.map(i => ({ 
                    product_id: i.product_id, 
                    quantity: i.quantity, 
                    price: i.price 
                }))
            });
            await refreshCart();
            setStep(3); // Success step
            toast.success('Order placed successfully!');
        } catch (err) {
            toast.error('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && step !== 3) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10"></div>
                {[1, 2, 3].map((num) => (
                    <div 
                        key={num}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            step >= num ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/30' : 'bg-slate-200 text-slate-500'
                        }`}
                    >
                        {step > num ? <CheckCircle size={20} /> : num}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <MapPin className="text-blue-600" /> Shipping Information
                        </h2>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Shipping Address</label>
                                <textarea 
                                    required
                                    rows={4}
                                    placeholder="Enter your full street address, apartment, city, and zip code..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => address ? setStep(2) : toast.error('Please enter an address')}
                                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                            >
                                Continue to Payment <ArrowRight size={20} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <CreditCard className="text-blue-600" /> Payment Simulation
                        </h2>
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8 flex items-center gap-4">
                            <Lock className="text-blue-600" size={24} />
                            <p className="text-sm font-bold text-blue-800">Secure end-to-end encrypted payment. This is a university project simulation.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-6 border-2 border-blue-600 rounded-2xl bg-blue-50/30 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                     <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm font-black text-blue-600">VISA</div>
                                     <div>
                                        <p className="font-bold text-slate-900">Ends in 4242</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Exp: 12/28</p>
                                     </div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                    <span>Build Subtotal</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-900 font-black text-xl border-t border-slate-100 pt-4">
                                    <span>Pay Total</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all font-bold"
                                >
                                    Modify Address
                                </button>
                                <button 
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:bg-slate-300"
                                >
                                    {loading ? 'Authorizing...' : 'Charge & Finalize Build'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white p-16 rounded-[3rem] border border-slate-200 shadow-2xl shadow-emerald-500/10">
                    <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
                        <CheckCircle size={64} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Build Initialized!</h1>
                    <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg font-medium">
                        Your hardware components have been secured. We are preparing them for priority shipment.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                            onClick={() => navigate('/orders')}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all"
                        >
                            Track Build Status
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                             className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
                        >
                            Return Home
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Checkout;
