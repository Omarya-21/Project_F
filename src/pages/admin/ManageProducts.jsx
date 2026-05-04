import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, X, Package, Tag, Layers, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        brand_id: '',
        price: '',
        stock: '',
        description: '',
        image_url: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, cRes, bRes] = await Promise.all([
                api.get('/products'),
                api.get('/products/categories'),
                api.get('/products/brands')
            ]);
            setProducts(pRes.data);
            setCategories(cRes.data);
            setBrands(bRes.data);
        } catch (err) {
            toast.error('Failed to sync master inventory data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you absolutely sure? This action is irreversible.')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success('Product purged from database');
            setProducts(products.filter(p => p.product_id !== id));
        } catch (err) {
            toast.error('Purge failed: System constraint conflict');
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category_id: product.category_id,
                brand_id: product.brand_id,
                price: product.price,
                stock: product.stock,
                description: product.description,
                image_url: product.image_url || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category_id: categories[0]?.category_id || '',
                brand_id: brands[0]?.brand_id || '',
                price: '',
                stock: '',
                description: '',
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/products', {
                ...formData,
                product_id: editingProduct?.product_id
            });
            toast.success(editingProduct ? 'Product payload updated' : 'New hardware registered');
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error('Upload failed: Schema mismatch');
        }
    };

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Hardware <span className="text-blue-600">Inventory</span></h1>
                    <p className="text-slate-500 font-medium">Manage master components and technical specifications.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search catalog..."
                            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-3 text-slate-400" size={18} />
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 shrink-0"
                    >
                        <Plus size={20} /> Deploy New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification / Meta</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Availability</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((product) => (
                                <tr key={product.product_id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-4 text-center">
                                         <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden mx-auto border border-slate-200">
                                            <img src={product.image_url || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                                         </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="font-black text-slate-900 leading-tight">{product.name}</div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{product.brand_name}</div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            {product.category_name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 font-black text-slate-900 tracking-tight">
                                        ${product.price.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            {product.stock} Units
                                       </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.product_id)}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filtered.length === 0 && !loading && (
                    <div className="p-20 text-center text-slate-400 font-medium italic">
                        No hardware matches found in active logs.
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        ></motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    {editingProduct ? <Edit /> : <Plus />}
                                    {editingProduct ? 'Configuration Update' : 'New Component Registration'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Tag size={12} /> Component Title
                                    </label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                        placeholder="e.g. GeForce RTX 4090"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Layers size={12} /> Category Path
                                    </label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Database size={12} /> Manufacturer
                                    </label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                        value={formData.brand_id}
                                        onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                                    >
                                        {brands.map(b => <option key={b.brand_id} value={b.brand_id}>{b.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation ($)</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Stack</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                    />
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Asset (URL)</label>
                                    <input 
                                        type="url"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                        placeholder="https://..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                    />
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Overview</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="col-span-2 pt-4">
                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                    >
                                        Deploy Payload
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProducts;
