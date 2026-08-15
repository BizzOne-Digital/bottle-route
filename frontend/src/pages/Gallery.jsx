import { useState } from 'react';
import { X } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import './Gallery.css';

// Placeholder gallery items — replace with real Cloudinary URLs once uploaded
const GALLERY = [
  { id: 1, category: 'products', src: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80', alt: 'Premium Whisky' },
  { id: 2, category: 'products', src: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=600&q=80', alt: 'Vodka Selection' },
  { id: 3, category: 'lifestyle', src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80', alt: 'Night Out' },
  { id: 4, category: 'products', src: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80', alt: 'Tequila' },
  { id: 5, category: 'delivery', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', alt: 'Delivery' },
  { id: 6, category: 'lifestyle', src: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=600&q=80', alt: 'Party Vibes' },
  { id: 7, category: 'products', src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80', alt: 'Craft Spirits' },
  { id: 8, category: 'delivery', src: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80', alt: 'Fast Delivery' },
  { id: 9, category: 'lifestyle', src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80', alt: 'Bar Setup' },
];

const TABS = ['all', 'products', 'lifestyle', 'delivery'];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeTab === 'all' ? GALLERY : GALLERY.filter(g => g.category === activeTab);

  return (
    <main className="gallery-page">
      {/* Hero */}
      <section className="gallery-page__hero">
        <div className="gallery-page__hero-bg" />
        <Reveal className="container gallery-page__hero-content">
          <p className="section-eyebrow">Our World</p>
          <h1 className="section-title">GALLERY</h1>
          <p className="gallery-page__sub">A look inside Bottle Route — our products, our deliveries, our vibe.</p>
        </Reveal>
      </section>

      <section className="section gallery-page__main">
        <div className="container">
          {/* Filter tabs */}
          <div className="gallery-page__tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`gallery-page__tab${activeTab === t ? ' gallery-page__tab--active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <Reveal>
            <div className="gallery-page__grid">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="gallery-page__item"
                  onClick={() => setLightbox(item)}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <div className="gallery-page__item-overlay">
                    <span>{item.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="gallery-lightbox" onClick={() => setLightbox(null)}>
          <button className="gallery-lightbox__close" onClick={() => setLightbox(null)}>
            <X size={22} />
          </button>
          <img
            src={lightbox.src.replace('w=600', 'w=1200')}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="gallery-lightbox__caption">{lightbox.alt}</p>
        </div>
      )}
    </main>
  );
}
