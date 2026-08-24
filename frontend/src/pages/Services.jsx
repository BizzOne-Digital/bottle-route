import { Link } from 'react-router-dom';
import { Zap, Package, Clock, Shield, Truck, Star, UtensilsCrossed } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import './Services.css';

const SERVICES = [
  {
    icon: Truck,
    title: 'Express Alcohol Delivery',
    desc: 'Vodka, whisky, tequila, rum, brandy, beer, coolers & wine — delivered straight to your door. No minimum order, no fuss.',
    features: ['All major spirit categories', 'Top brands & local labels', 'Chilled or ambient delivery'],
  },
  {
    icon: Package,
    title: 'Convenience Delivery',
    desc: 'Need mixers, snacks, or last-minute essentials? We\'ve got you covered alongside your liquor order.',
    features: ['Soft drinks & mixers', 'Snacks & chips', 'Ice, cups & party supplies'],
  },
  {
    icon: UtensilsCrossed,
    title: 'Food Delivery',
    desc: 'Order food alongside your drinks — a full night in, sorted in one order.',
    features: ['Order food with your drinks', 'Local restaurant favourites', 'One simple checkout'],
  },
  {
    icon: Clock,
    title: 'Late Night Service',
    desc: 'Open until 3 AM. When other stores close, we keep delivering so the night doesn\'t have to stop.',
    features: ['Daily until 3:00 AM', 'Weekend extended hours', 'No curfew on good times'],
  },
  {
    icon: Star,
    title: 'Curated Gift Sets',
    desc: 'Premium gift bundles for birthdays, celebrations, and corporate events — ready to deliver.',
    features: ['Pre-packaged gift bundles', 'Custom selection available', 'Gift messaging included'],
  },
  {
    icon: Shield,
    title: 'ID-Verified Safe Delivery',
    desc: 'Every delivery includes age verification. We take responsible service seriously. 19+ only.',
    features: ['Government ID required', 'Trained delivery staff', 'Fully compliant service'],
  },
];

export default function Services() {
  return (
    <main className="services">
      {/* Hero */}
      <section className="services__hero">
        <div className="services__hero-bg" />
        <Reveal className="container services__hero-content">
          <p className="section-eyebrow">What We Offer</p>
          <h1 className="section-title">EVERYTHING DELIVERED.<br /><span className="text-accent">NOTHING COMPLICATED.</span></h1>
          <p className="services__sub">Premium alcohol, convenience & food delivered across Mississauga, Oakville, Milton & Etobicoke.</p>
        </Reveal>
      </section>

      {/* Services Grid */}
      <section className="section services__grid-section">
        <div className="container">
          <div className="services__grid">
            {SERVICES.map(({ icon: Icon, title, desc, features }, i) => (
              <Reveal key={title} delay={(i % 3) * 80}>
                <div className="services__card">
                  <div className="services__card-icon"><Icon size={24} /></div>
                  <h3 className="services__card-title">{title}</h3>
                  <p className="services__card-desc">{desc}</p>
                  <ul className="services__card-features">
                    {features.map(f => (
                      <li key={f}>
                        <span className="services__check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery area */}
      <section className="section services__area">
        <Reveal className="container services__area-inner">
          <div>
            <p className="section-eyebrow">Coverage</p>
            <h2 className="section-title">WHERE WE DELIVER</h2>
            <p>Bottle Route currently serves Mississauga, Oakville, Milton & Etobicoke. Enter your postal code at checkout to confirm delivery availability in your area. We're expanding regularly — if we're not in your area yet, we're coming soon.</p>
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Check My Area
            </Link>
          </div>
          <div className="services__area-map">
            <div className="services__area-map-inner">
              <span>🍁</span>
              <p>Serving Mississauga,<br />Oakville, Milton & Etobicoke</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="section services__cta">
        <Reveal className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">READY TO ORDER?</h2>
          <p style={{ color: 'var(--br-gray)', marginBottom: '2rem' }}>Browse our full selection and place your order today.</p>
          <Link to="/shop" className="btn btn-accent">Shop Now →</Link>
        </Reveal>
      </section>
    </main>
  );
}
