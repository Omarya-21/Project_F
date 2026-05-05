import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Cpu, Layout, Disc, Activity, Zap } from 'lucide-react';

const categoryIcons = {
  CPU: <Cpu size={40} />,
  GPU: <Activity size={40} />,
  Motherboard: <Layout size={40} />,
  RAM: <Disc size={40} />,
  PSU: <Zap size={40} />
};

const categoryNames = {
  CPU: 'Processors',
  GPU: 'Graphics Cards',
  Motherboard: 'Motherboards',
  RAM: 'Memory',
  PSU: 'Power Supplies'
};

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const filtered = allProducts.filter(p => p.category === categoryName);
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
          {categoryIcons[categoryName] || <Cpu size={40} />}
        </div>
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            {categoryNames[categoryName] || categoryName}
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
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
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
