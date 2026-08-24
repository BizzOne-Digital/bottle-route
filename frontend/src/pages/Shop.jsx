import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import Reveal from '../components/ui/Reveal';
import { productsApi } from '../utils/api';
import './Shop.css';

const CATEGORIES = ['all', 'vodka', 'whisky', 'tequila', 'rum', 'brandy', 'beer', 'cooler', 'convenience', 'other'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'all' ? { category: activeCategory } : {};
    productsApi.getAll(params)
      .then(({ data }) => setProducts(data.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="shop">
      {/* Page header */}
      <div className="shop__header">
        <Reveal className="container">
          <p className="section-eyebrow">Our Selection</p>
          <h1 className="section-title">SHOP ALL PRODUCTS</h1>
          <p className="shop__sub">Premium alcohol & convenience delivered to your door.</p>
        </Reveal>
      </div>

      <div className="container shop__body">
        {/* Filters row */}
        <div className="shop__filters">
          <div className="shop__cats">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`shop__cat-btn${activeCategory === cat ? ' shop__cat-btn--active' : ''}`}
                onClick={() => setSearchParams(cat === 'all' ? {} : { category: cat })}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="shop__search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shop__search-input"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="shop__loading">
            <div className="shop__spinner" />
            <p>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="shop__empty">
            <p>No products found. Try a different category or search.</p>
          </div>
        ) : (
          <>
            <p className="shop__count">{filtered.length} products</p>
            <div className="shop__grid">
              {filtered.map((p, i) => (
                <Reveal key={p._id} delay={(i % 6) * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
