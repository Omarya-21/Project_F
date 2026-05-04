import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="pt-24 text-center">Deploying Hardware...</div>;

  return (
    <div className="pt-24 pb-20">
      <h2 className="text-3xl font-black mb-10 text-white border-l-4 border-blue-600 pl-4">CURRENT INVENTORY</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products.length === 0 && <p className="text-gray-500 col-span-full">No hardware detected in local sectors.</p>}
      </div>
    </div>
  );
}
