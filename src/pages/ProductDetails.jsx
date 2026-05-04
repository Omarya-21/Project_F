import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCcw, Star } from 'lucide-react';
import { motion } from 'motion/react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('specs');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-xl uppercase">Product Not Found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors"
            >
                <ArrowLeft size={18} /> Back to results
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Image Gallery */}
                <div className="flex-1">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden aspect-square flex items-center justify-center"
                    >
                        <img 
                            src={product.image_url || 'https://via.placeholder.com/800'} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* Info Container */}
                <div className="flex-1 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                                {product.category_name}
                            </span>
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{product.brand_name}</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star fill="currentColor" size={18} />
                                <Star fill="currentColor" size={18} />
                                <Star fill="currentColor" size={18} />
                                <Star fill="currentColor" size={18} />
                                <Star fill="currentColor" size={18} />
                            </div>
                            <span className="text-slate-500 font-medium">4.9 (42 Reviews)</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-black text-slate-900">${product.price.toLocaleString()}</span>
                            <span className="text-slate-400 font-medium mb-2">/ tax incl.</span>
                        </div>

                        <p className="text-slate-600 leading-relaxed font-medium">
                            {product.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition-colors"
                                >-</button>
                                <input 
                                    type="number"
                                    value={quantity}
                                    readOnly
                                    className="w-16 text-center bg-transparent font-bold text-lg outline-none cursor-default"
                                />
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition-colors"
                                >+</button>
                            </div>
                            <button 
                                onClick={() => addToCart(product.product_id, quantity)}
                                disabled={product.stock === 0}
                                className="flex-1 bg-blue-600 text-white font-black py-4 px-8 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
                            >
                                <ShoppingCart size={22} />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Build'}
                            </button>
                        </div>

                        {product.stock > 0 && (
                            <p className="text-emerald-600 text-sm font-bold flex items-center gap-1.5 justify-center sm:justify-start">
                                <ShieldCheck size={16} /> In stock and ready to ship ({product.stock} units)
                            </p>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <Truck className="text-blue-600" size={24} />
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">Fast Shipping</h4>
                                <p className="text-[10px] text-slate-500">24h Express</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <ShieldCheck className="text-emerald-600" size={24} />
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">1 Year Warranty</h4>
                                <p className="text-[10px] text-slate-500">Official Partner</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <RefreshCcw className="text-purple-600" size={24} />
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">Easy Returns</h4>
                                <p className="text-[10px] text-slate-500">30-day window</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tabs */}
            <div className="mt-20">
                <div className="flex gap-10 border-b border-slate-100 mb-10 overflow-x-auto pb-px">
                    <button 
                        onClick={() => setActiveTab('specs')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Specifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Customer Reviews
                    </button>
                    <button 
                        onClick={() => setActiveTab('support')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'support' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Technical Support
                    </button>
                </div>

                <div className="min-h-[200px]">
                    {activeTab === 'specs' && (
                        <div className="max-w-2xl bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-900 mb-8">Technical Specifications</h3>
                            <div className="space-y-4">
                                {product.specs?.length ? product.specs.map(spec => (
                                    <div key={spec.spec_id} className="flex justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-2 rounded-lg">
                                        <span className="font-bold text-slate-500 uppercase text-xs tracking-widest">{spec.key}</span>
                                        <span className="font-black text-slate-900">{spec.value}</span>
                                    </div>
                                )) : (
                                    <p className="text-slate-500 font-medium">Standard industrial specifications apply. Please refer to {product.brand_name}'s official documentation for detailed datasheet.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="text-slate-500 text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 italic">
                            No reviews yet for this model. Be the first to build with it!
                        </div>
                    )}
                    {activeTab === 'support' && (
                        <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white">
                            <h3 className="text-2xl font-bold mb-4">Installation Assistant</h3>
                            <p className="text-slate-400 mb-8 max-w-xl">
                                Need help installing this device? Contact our senior engineers for professional guidance on cable management and BIOS configuration.
                            </p>
                            <button className="bg-white text-slate-950 font-black px-8 py-3 rounded-xl hover:bg-white/90 transition-colors">
                                Download Manual (PDF)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
