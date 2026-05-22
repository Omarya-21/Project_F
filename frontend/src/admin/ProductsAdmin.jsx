import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct } from '../services/productService';
import { Plus, Package, LayoutGrid, CheckCircle2, Image as ImageIcon, Sliders, DollarSign, Layers, Edit } from 'lucide-react';

const KNOWN_CATEGORIES = [
  'CPU',
  'GPU',
  'Motherboards',
  'Ram',
  'Rom',
  'PSU',
  'Cooling',
  'cases',
  'mouses',
  'keyboards',
  'gaming-chairs',
  'Monitors'
];

const CATEGORY_DEFAULT_IMAGES = {
  'CPU': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600&h=600',
  'GPU': 'https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=600&h=600',
  'Motherboards': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=600',
  'Ram': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=600&h=600',
  'Rom': 'https://images.unsplash.com/photo-1597852074816-d933c4d2b988?auto=format&fit=crop&q=80&w=600&h=600',
  'PSU': 'https://images.unsplash.com/photo-1631284562080-60f9ee06f32e?auto=format&fit=crop&q=80&w=600&h=600',
  'Cooling': 'https://images.unsplash.com/photo-1588600101460-b635f7959082?auto=format&fit=crop&q=80&w=600&h=600',
  'cases': 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=600&h=600',
  'mouses': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600',
  'keyboards': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600&h=600',
  'gaming-chairs': 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600&h=600',
  'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600&h=600'
};

const DEFAULT_GENERIC_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=600';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formCategory, setFormCategory] = useState('CPU');
  const [customCategory, setCustomCategory] = useState('');
  
  // Edit mode state
  const [editingProduct, setEditingProduct] = useState(null);
  
  // High fidelity state fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Technical specs
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [specsList, setSpecsList] = useState({});

  const [notif, setNotif] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchOnMount = async () => {
      try {
        const data = await getProducts();
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchOnMount();
    return () => {
      active = false;
    };
  }, []);

  const handleAddSpec = (e) => {
    e.preventDefault();
    if (specKey.trim() && specVal.trim()) {
      setSpecsList(prev => ({
        ...prev,
        [specKey.trim()]: specVal.trim()
      }));
      setSpecKey('');
      setSpecVal('');
    }
  };

  const handleRemoveSpec = (key) => {
    setSpecsList(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleStartEdit = (p) => {
    setEditingProduct(p);
    setName(p.name || '');
    setBrand(p.brand || '');
    setPrice(String(p.price) || '0');
    setStock(String(p.stock) || '0');
    setImageUrl(p.image || '');
    setDescription(p.description || '');
    
    let parsedSpecs = {};
    if (p.specs) {
      try {
        parsedSpecs = typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs;
      } catch (err) {
        console.error("Error parsing specs in edit mode:", err);
      }
    }
    setSpecsList(parsedSpecs);

    const cat = p.category;
    if (KNOWN_CATEGORIES.includes(cat)) {
      setFormCategory(cat);
      setCustomCategory('');
    } else {
      setFormCategory('custom');
      setCustomCategory(cat || '');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setDescription('');
    setSpecsList({});
    setFormCategory('CPU');
    setCustomCategory('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine exact category name
    const finalCategory = formCategory === 'custom' ? customCategory.trim() : formCategory;
    if (!finalCategory) {
      setNotif('Please specify a category.');
      return;
    }

    // Work out images representation
    const finalImage = imageUrl.trim() || CATEGORY_DEFAULT_IMAGES[finalCategory] || DEFAULT_GENERIC_IMAGE;

    const productPayload = {
      name: name.trim(),
      brand: brand.trim() || 'Generic',
      price: parseFloat(price) || 0.00,
      stock: parseInt(stock, 10) || 0,
      category: finalCategory,
      image: finalImage,
      description: description.trim() || `${brand} ${name} high quality PC component.`,
      specs: specsList
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
        setNotif('✅ Product updated successfully!');
        setEditingProduct(null);
      } else {
        await addProduct(productPayload);
        setNotif('✅ Product added successfully!');
      }
      
      // Reset form fields
      setName('');
      setBrand('');
      setPrice('');
      setStock('');
      setImageUrl('');
      setDescription('');
      setSpecsList({});
      setFormCategory('CPU');
      setCustomCategory('');
      
      // Auto reload
      fetchProducts();
      
      setTimeout(() => setNotif(''), 4000);
    } catch (err) {
      console.error("Save error:", err);
      setNotif(editingProduct ? '❌ Failed to update product.' : '❌ Failed to add product.');
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Inventory Console</h1>
          <p className="text-gray-400 text-sm mt-1">Deploy new hardware units to dynamic categories</p>
        </div>
      </div>

      {notif && (
        <div className={`p-4 rounded-2xl mb-6 text-sm flex items-center gap-2 border ${notif.startsWith('✅') ? 'bg-green-500/10 border-green-500/25 text-green-400' : 'bg-red-500/10 border-red-500/25 text-red-400'}`}>
          <CheckCircle2 size={16} />
          <span>{notif}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Form Container */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 p-8 rounded-3xl h-fit space-y-6 shadow-xl">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wide flex items-center gap-2 text-white italic">
              {editingProduct ? (
                <>
                  <Edit size={20} className="text-yellow-500 animate-pulse" /> Edit Premium Unit
                </>
              ) : (
                <>
                  <Plus size={20} className="text-blue-500 animate-pulse" /> Add Premium Unit
                </>
              )}
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              {editingProduct ? `Modifying Unit #${editingProduct.id}` : 'Configure specification metrics and asset path'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1">
                <Package size={12} className="text-blue-500" /> COMPONENT NAME
              </label>
              <input 
                type="text" 
                placeholder="Core i9-14900KS" 
                className="w-full bg-black border border-gray-800/80 rounded-xl p-4 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1">
                  <Layers size={11} className="text-blue-500" /> BRAND
                </label>
                <input 
                  type="text" 
                  placeholder="Intel / AMD" 
                  className="w-full bg-black border border-gray-800/80 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1">
                  <DollarSign size={11} className="text-blue-500" /> PRICE ($)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="599.99" 
                  className="w-full bg-black border border-gray-800/80 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1">
                  <LayoutGrid size={11} className="text-blue-500" /> STOCK
                </label>
                <input 
                  type="number" 
                  placeholder="30" 
                  className="w-full bg-black border border-gray-800/80 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1">
                  <LayoutGrid size={11} className="text-blue-500" /> CATEGORY
                </label>
                <select 
                  className="w-full bg-black border border-gray-800/80 rounded-xl p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                >
                  {KNOWN_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">-- Custom Category --</option>
                </select>
              </div>
            </div>

            {formCategory === 'custom' && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5">CUSTOM CATEGORY NAME</label>
                <input 
                  type="text" 
                  placeholder="Enter custom category" 
                  className="w-full bg-black border border-gray-800/80 rounded-xl p-4 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5 flex items-center gap-1">
                <ImageIcon size={11} className="text-blue-500" /> IMAGE URL (OPTIONAL)
              </label>
              <input 
                type="url" 
                placeholder="Leave blank for smart defaults" 
                className="w-full bg-black border border-gray-800/80 rounded-xl p-3 text-white text-xs focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-1.5">DESCRIPTION</label>
              <textarea 
                placeholder="Provide a detailed hardware synopsis..." 
                rows="2"
                className="w-full bg-black border border-gray-800/80 rounded-xl p-4 text-white text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Sub-form for Technical Specs object */}
            <div className="border-t border-gray-800/80 pt-4">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-550 mb-2 flex items-center gap-1">
                <Sliders size={11} className="text-blue-500" /> TECHNICAL SPECIFICATIONS
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <input 
                  type="text" 
                  placeholder="e.g. Socket" 
                  className="bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="e.g. LGA1700" 
                  className="bg-black border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  value={specVal}
                  onChange={(e) => setSpecVal(e.target.value)}
                />
              </div>
              <button 
                type="button" 
                onClick={handleAddSpec}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 rounded-xl text-xs uppercase tracking-widest transition-colors mb-3"
              >
                Add Spec Key
              </button>

              {/* Current Active Specs chips */}
              {Object.keys(specsList).length > 0 && (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto bg-black/40 p-2.5 rounded-xl border border-gray-850/60">
                  {Object.entries(specsList).map(([k, v]) => (
                    <span key={k} className="text-[10px] bg-blue-600/10 border border-blue-500/25 text-blue-400 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <span>{k}: {v}</span>
                      <button type="button" onClick={() => handleRemoveSpec(k)} className="text-red-500 hover:text-white ml-1 font-black">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button type="submit" className={`w-full text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs italic shadow-lg cursor-pointer ${editingProduct ? 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/10' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/10'}`}>
                {editingProduct ? 'Save Component Details' : 'Deploy Component'}
              </button>
              {editingProduct && (
                <button type="button" onClick={handleCancelEdit} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-colors cursor-pointer">
                  Cancel Modification
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Container */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <h2 className="text-xl font-black uppercase tracking-wide text-white italic">Authorized Stock</h2>
            <span className="text-xs bg-gray-800 text-gray-400 font-mono px-3 py-1 rounded-full">{products.length} Units Online</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 italic font-mono uppercase tracking-widest animate-pulse">
              Syncing stock matrices...
            </div>
          ) : (
            <div className="overflow-x-auto pr-2 max-h-[640px] overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-gray-800">
                    <th className="pb-4">Product Descriptor</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {products.map(p => (
                    <tr key={p.id} className="group hover:bg-gray-800/15 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} className="w-10 h-10 object-cover rounded-lg border border-gray-800" alt={p.name} />
                        ) : (
                          <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-gray-600">
                            <Package size={14} />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-sm text-white block truncate max-w-xs">{p.name}</span>
                          <span className="text-[10px] text-gray-650 tracking-wider uppercase font-mono">{p.brand || 'Generic'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-mono text-blue-500 uppercase font-semibold">{p.category}</td>
                      <td className="py-4 text-sm font-bold font-mono text-gray-300">${parseFloat(p.price).toFixed(2)}</td>
                      <td className="py-4 text-sm">
                        <span className={`font-bold transition-colors ${p.stock <= 2 ? 'text-red-500 font-extrabold' : 'text-gray-300'}`}>{p.stock}</span>
                      </td>
                      <td className="py-4 text-sm text-right">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-yellow-600 text-gray-300 hover:text-black rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Edit size={12} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500 italic">No inventory detected in local servers.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
