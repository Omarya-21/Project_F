import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Cpu, Layout, Disc, Activity, Zap, HardDrive, Monitor, Mouse, Keyboard, Headphones, Gamepad, Armchair, Table } from 'lucide-react';

const categoryIcons = {
  CPU: <Cpu size={40} />,
  GPU: <Activity size={40} />,
  Motherboards: <Layout size={40} />,
  Ram: <Disc size={40} />,
  Rom: <HardDrive size={40} />,
  PSU: <Zap size={40} />,
  cases: <Activity size={40} />,
  Monitors: <Monitor size={40} />,
  mouses: <Mouse size={40} />,
  keyboards: <Keyboard size={40} />,
  headphones: <Headphones size={40} />,
  controllers: <Gamepad size={40} />,
  'gaming-chairs': <Armchair size={40} />,
  'pc-tables': <Table size={40} />
};

const categoryNames = {
  CPU: 'Processors',
  GPU: 'Graphics Cards',
  Motherboards: 'Motherboards',
  Ram: 'Memory (RAM)',
  Rom: 'Storage (ROM/SSD)',
  PSU: 'Power Supplies',
  cases: 'Chassis & Cases',
  Monitors: 'Gaming Monitors',
  mouses: 'Gaming Mice',
  keyboards: 'Mechanical Keyboards',
  headphones: 'Audio & Headsets',
  controllers: 'Game Controllers',
  'gaming-chairs': 'Pro Gaming Chairs',
  'pc-tables': 'Gaming Desks'
};

export default function CategoryProducts({ categoryOverride }) {
  const { categoryName: paramCategory } = useParams();
  const categoryName = categoryOverride || paramCategory;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const filtered = allProducts.filter(p => 
          p.category?.toLowerCase() === categoryName?.toLowerCase()
        );
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const groupedProducts = products.reduce((acc, product) => {
    const brand = product.brand || 'Other';
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(product);
    return acc;
  }, {});

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
          {categoryIcons[categoryName] || 
           categoryIcons[Object.keys(categoryIcons).find(k => k.toLowerCase() === categoryName?.toLowerCase())] || 
           <Cpu size={40} />}
        </div>
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            {categoryNames[categoryName] || 
             categoryNames[Object.keys(categoryNames).find(k => k.toLowerCase() === categoryName?.toLowerCase())] || 
             categoryName}
          </h1>
          <p className="text-gray-400 mt-2">
            Explore our elite selection of high-performance {categoryName} hardware.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-900 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : Object.keys(groupedProducts).length > 0 ? (
        <div className="space-y-16">
          {Object.entries(groupedProducts).sort().map(([brand, brandProducts]) => (
            <div key={brand}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black italic uppercase tracking-widest text-blue-500">
                  {brand}
                </h2>
                <div className="h-px bg-gray-800 grow"></div>
                <span className="text-[10px] font-black bg-gray-800 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest">
                  {brandProducts.length} Units
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {brandProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900 rounded-3xl border border-gray-800">
          <p className="text-gray-500 text-lg">No components found in this category.</p>
        </div>
      )}
    </div>
  );
}
