import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Shield, MapPin } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      {/* Background layer */}
      <div className="hero__bg">
        <div className="hero__bg-image" />
      </div>

      <div className="hero__inner">
        {/* Left Content */}
        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__badge hero__badge--maple">🍁 Proudly Canadian</span>
          </div>

          <h1 className="hero__headline">
            <span className="hero__headline-line">DRINKS AT</span>
            <span className="hero__headline-line hero__headline-accent">YOUR DOOR.</span>
          </h1>

          <p className="hero__sub">
            Premium alcohol & convenience delivered to your door.
            19+ service in Mississauga, Oakville, Milton & Etobicoke.
          </p>

          <div className="hero__actions">
            <Link to="/shop" className="btn btn-accent hero__btn-primary">
              <ShoppingBag size={18} />
              Order Now
            </Link>
            <Link to="/shop" className="btn btn-outline hero__btn-secondary">
              View Products <ChevronRight size={16} />
            </Link>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <MapPin size={15} />
              <span>Mississauga, Oakville, Milton & Etobicoke</span>
            </div>
            <div className="hero__trust-sep" />
            <div className="hero__trust-item">
              <Shield size={15} />
              <span>19+ Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hero__bar">
        <div className="container hero__bar-inner">
          {[
            { icon: '📍', text: 'Serving Mississauga, Oakville, Milton & Etobicoke' },
            { icon: '🍾', text: 'Top Brands & Local Favourites' },
            { icon: '📱', text: 'Easy Online Ordering' },
          ].map(({ icon, text }) => (
            <div key={text} className="hero__bar-item">
              <span className="hero__bar-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
