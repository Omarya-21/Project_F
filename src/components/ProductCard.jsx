import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
        >
            <Link to={`/product/${product.product_id}`} className="relative block overflow-hidden aspect-square">
                <img 
                    src={product.image_url || 'https://via.placeholder.com/400'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        Low Stock: {product.stock} left
                    </span>
                )}
                {product.stock === 0 && (
                     <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2 rounded-lg">Out of Stock</span>
                     </div>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">
                        {product.category_name}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-bold text-slate-400">4.9 (120+)</span>
                    </div>
                </div>

                <Link to={`/product/${product.product_id}`} className="block group-hover:text-blue-600 transition-colors">
                    <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[2.5rem] leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-slate-900">
                            ${product.price.toLocaleString()}
                        </span>
                    </div>
                    <button 
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product.product_id)}
                        className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                    >
                        <ShoppingCart size={20} className="group-hover/btn:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
