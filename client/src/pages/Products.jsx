import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const [category, setCategory] = useState(queryParams.get('category') || '');
    const [brand, setBrand] = useState(queryParams.get('brand') || '');
    const [search, setSearch] = useState(queryParams.get('search') || '');
    const [sort, setSort] = useState('newest');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products', {
                params: { category, brand, search, sort }
            });
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    api.get('/products/categories'),
                    api.get('/products/brands')
                ]);
                setCategories(catRes.data);
                setBrands(brandRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [category, brand, search, sort, location.search]);

    const clearFilters = () => {
        setCategory('');
        setBrand('');
        setSearch('');
        setSort('newest');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row gap-10">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-8 shrink-0">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Filter size={20} /> Filters
                            </h3>
                            {(category || brand || search) && (
                                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-medium">Clear All</button>
                            )}
                        </div>
                        
                        <div className="relative mb-6">
                            <input 
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Category</h4>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setCategory('')} 
                                    className={`text-sm py-1 px-3 rounded-lg text-left transition-colors ${category === '' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    All Categories
                                </button>
                                {categories.map((cat) => (
                                    <button 
                                        key={cat.category_id}
                                        onClick={() => setCategory(cat.name)}
                                        className={`text-sm py-1 px-3 rounded-lg text-left transition-colors ${category === cat.name ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 mt-8">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Brands</h4>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => setBrand('')} 
                                    className={`text-sm py-1 px-3 rounded-lg text-left transition-colors ${brand === '' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    All Brands
                                </button>
                                {brands.map((b) => (
                                    <button 
                                        key={b.brand_id}
                                        onClick={() => setBrand(b.name)}
                                        className={`text-sm py-1 px-3 rounded-lg text-left transition-colors ${brand === b.name ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        {b.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-1 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{products.length}</span>
                            <span className="text-slate-500 text-sm">Products Found</span>
                            {search && (
                                <div className="ml-4 flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                                    "{search}"
                                    <button onClick={() => setSearch('')}><X size={12} /></button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <SlidersHorizontal size={16} className="text-slate-400" />
                            <select 
                                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="h-[400px] bg-slate-200 rounded-2xl" />)}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((p) => (
                                <ProductCard key={p.product_id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                            <button onClick={clearFilters} className="mt-6 text-blue-600 font-bold hover:underline">Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
