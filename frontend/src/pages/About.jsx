import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, Shield, MapPin, Heart } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import { useOrderNowModal } from '../context/OrderNowModalContext';
import './About.css';

const VALUES = [
  { icon: Clock, title: 'Reliable Delivery', desc: 'We guarantee dependable delivery — your order at your door, every time.' },
  { icon: Shield, title: 'Responsible Service', desc: 'We take compliance seriously. ID verification on every delivery. 19+ only, always.' },
  { icon: MapPin, title: 'Locally Rooted', desc: 'Built in Canada, for Canadians. We proudly serve Mississauga, Oakville, Milton & Etobicoke.' },
  { icon: Heart, title: 'Customer First', desc: 'Your experience matters. We\'re here 7 days a week to make sure every order is perfect.' },
];

const STATS = [
  { value: '500+', unit: '', label: 'Products available' },
  { value: '19+', unit: '', label: 'Age verification, always' },
  { value: '24/7', unit: '', label: 'Late-night delivery' },
  { value: '4', unit: '', label: 'Cities served' },
];

export default function About() {
  const { openOrderNowModal } = useOrderNowModal();
  return (
    <main className="about">
      {/* Hero */}
      <section className="about__hero">
        <div className="about__hero-bg" />
        <Reveal className="container about__hero-content">
          <p className="section-eyebrow">Our Story</p>
          <h1 className="section-title">BUILT FOR THE<br /><span className="text-accent">NIGHT CROWD.</span></h1>
          <p className="about__hero-sub">
            Bottle Route was created with one simple idea: getting your favourite drinks
            delivered reliably and without any hassle. After-hours cravings deserve
            after-hours solutions.
          </p>
        </Reveal>
      </section>

      {/* Stats bar */}
      <div className="about__stats-bar">
        <div className="container about__stats-grid">
          {STATS.map(({ value, unit, label }, i) => (
            <Reveal key={label} delay={i * 80}>
              <div className="about__stat">
                <p className="about__stat-value">{value}<span className="about__stat-unit">{unit}</span></p>
                <p className="about__stat-label">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Story section */}
      <section className="section about__story">
        <Reveal className="container about__story-grid">
          <div className="about__story-visual">
            <div className="about__story-card">
              <div className="about__story-card-inner">
                <div className="about__story-emblem">🍁</div>
                <p className="about__story-card-title">Proudly Canadian</p>
                <p className="about__story-card-sub">Serving Mississauga, Oakville, Milton & Etobicoke</p>
              </div>
            </div>
            <div className="about__story-badge">
              <Clock size={16} />
              <span>Delivering since day one</span>
            </div>
          </div>
          <div className="about__story-text">
            <p className="section-eyebrow">Who We Are</p>
            <h2 className="section-title">YOUR LATE-NIGHT<br />DELIVERY PARTNER.</h2>
            <p>
              Bottle Route started as a response to a simple frustration — why is it so hard
              to get a good bottle of whisky delivered when you actually need it? We built
              the answer. A reliable, easy-to-use platform that brings premium
              alcohol and convenience products straight to your door.
            </p>
            <p style={{ marginTop: '1rem' }}>
              We partner with trusted suppliers to stock top brands — Grey Goose, Macallan,
              Patrón, Johnnie Walker — alongside local favourites and everyday convenience
              items. Whether it's a celebration, a quiet night in, or an unexpected gathering,
              Bottle Route has you covered.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/shop" className="btn btn-primary">
                <ShoppingBag size={16} /> Shop Now
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="section about__values">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="section-eyebrow">What We Stand For</p>
              <h2 className="section-title">OUR VALUES</h2>
            </div>
          </Reveal>
          <div className="about__values-grid">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="about__value-card">
                  <div className="about__value-icon"><Icon size={22} /></div>
                  <h3 className="about__value-title">{title}</h3>
                  <p className="about__value-desc">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section about__cta">
        <Reveal className="container about__cta-inner">
          <h2 className="section-title">READY TO ORDER?</h2>
          <p>Your next drink is just a few clicks away.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
            <button type="button" className="btn btn-accent" onClick={openOrderNowModal}>Order Now</button>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
