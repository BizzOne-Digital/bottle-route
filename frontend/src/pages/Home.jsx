import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Package, Clock, Star } from 'lucide-react';
import Hero from '../components/sections/Hero';
import ProductCard from '../components/ui/ProductCard';
import Reveal from '../components/ui/Reveal';
import { productsApi } from '../utils/api';
import './Home.css';

const CATEGORIES = [
  { id: 'vodka', label: 'Vodka', desc: 'Premium vodka for any occasion.', emoji: '🧊' },
  { id: 'whisky', label: 'Whisky', desc: 'Smooth, bold & always classic.', emoji: '🥃' },
  { id: 'tequila', label: 'Tequila', desc: '100% agave. 100% good times.', emoji: '🌵' },
  { id: 'convenience', label: 'Convenience', desc: 'Mixers, snacks, essentials & more.', emoji: '🛒' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose', desc: 'Browse our wide selection of drinks & essentials.', icon: Package },
  { step: '02', title: 'Order', desc: 'Place your order quickly & securely online.', icon: Zap },
  { step: '03', title: 'Delivered', desc: 'We deliver to your door in as little as 30 minutes.', icon: Clock },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    productsApi.getAll({ featured: true })
      .then(({ data }) => setFeaturedProducts(data.data.slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <main className="home">
      <Hero />

      {/* Categories */}
      <section className="section home__categories">
        <div className="container">
          <div className="home__categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 80}>
                <Link to={`/shop?category=${cat.id}`} className="home__cat-card">
                  <span className="home__cat-emoji">{cat.emoji}</span>
                  <div>
                    <h3 className="home__cat-title">{cat.label}</h3>
                    <p className="home__cat-desc">{cat.desc}</p>
                  </div>
                  <span className="home__cat-arrow"><ChevronRight size={18} /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section home__how">
        <div className="container">
          <Reveal>
            <div className="home__how-header">
              <p className="section-eyebrow">Simple Process</p>
              <h2 className="section-title">HOW IT WORKS</h2>
            </div>
          </Reveal>
          <div className="home__how-grid">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
              <Reveal key={step} delay={i * 80}>
                <div className="home__how-card">
                  <div className="home__how-step">{step}</div>
                  <div className="home__how-icon"><Icon size={24} /></div>
                  <h3 className="home__how-title">{title}</h3>
                  <p className="home__how-desc">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section home__featured">
          <div className="container">
            <Reveal>
              <div className="home__featured-header">
                <div>
                  <p className="section-eyebrow">Top Picks</p>
                  <h2 className="section-title">FEATURED PRODUCTS</h2>
                </div>
                <Link to="/shop" className="btn btn-outline-green">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
            </Reveal>
            <div className="home__products-grid">
              {featuredProducts.map((p, i) => (
                <Reveal key={p._id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="home__cta-banner">
        <div className="home__cta-banner-bg" />
        <Reveal className="container home__cta-content">
          <div>
            <h2 className="home__cta-headline">
              THE NIGHT<br />
              <span className="text-accent">DOESN'T HAVE TO STOP.</span>
            </h2>
            <p>We bring the good stuff. You keep the night going.</p>
          </div>
          <div className="home__cta-right">
            <div className="home__cta-badge">
              <Star size={20} fill="currentColor" />
              <div>
                <p className="home__cta-badge-title">Fast Delivery</p>
                <p className="home__cta-badge-sub">Top Shelf. Your Route.</p>
              </div>
            </div>
            <Link to="/shop" className="btn btn-accent">Order Now →</Link>
          </div>
        </Reveal>
      </section>

      {/* Trust pillars */}
      <section className="section-sm home__pillars">
        <div className="container home__pillars-grid">
          {[
            { icon: '⚡', title: 'Fast Delivery', desc: 'As fast as 30 minutes to your door.' },
            { icon: '🍾', title: 'Wide Selection', desc: 'Top brands & local favourites.' },
            { icon: '📱', title: 'Easy Ordering', desc: 'Simple, secure & hassle-free.' },
            { icon: '📍', title: 'Local Service', desc: 'Proudly serving communities across Canada.' },
          ].map(({ icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="home__pillar">
                <span className="home__pillar-icon">{icon}</span>
                <h4 className="home__pillar-title">{title}</h4>
                <p className="home__pillar-desc">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
