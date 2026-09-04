import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Instagram, Facebook, Twitter } from 'lucide-react';
import { settingsApi } from '../../utils/api';
import './Footer.css';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsApi.get().then(({ data }) => setSettings(data.data)).catch(() => {});
  }, []);

  const phone = settings?.phone || '';
  const email = settings?.email || 'info@bottleroute.ca';

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              {settings?.logo ? (
                <img src={settings.logo} alt="Bottle Route" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
              ) : (
                <>
                  <span className="navbar__logo-icon" style={{ background: 'var(--br-green-bright)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6 }}>
                    <Zap size={18} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em' }}>BOTTLE ROUTE</span>
                </>
              )}
            </Link>
            <p className="footer__tagline">Drinks Delivered. Good Times Guaranteed.</p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul>
              {['Home', 'About', 'Shop', 'Services', 'Gallery', 'Contact'].map((item) => (
                <li key={item}><Link to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}>{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer__col">
            <h4 className="footer__col-title">Categories</h4>
            <ul>
              {['Vodka', 'Whisky', 'Tequila', 'Rum', 'Brandy', 'Beers', 'Coolers', 'Convenience', 'All Products'].map((item) => (
                <li key={item}><Link to="/shop">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__contact">
              {phone && <li><span>Phone:</span> <a href={`tel:${phone}`}>{phone}</a></li>}
              <li><span>Email:</span> <a href={`mailto:${email}`}>{email}</a></li>
              <li><span>Hours:</span> 10 AM — 3 AM daily</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__legal">
            🍁 Proudly Canadian &nbsp;|&nbsp; 19+ ID Required on Delivery &nbsp;|&nbsp; © {new Date().getFullYear()} Bottle Route. All rights reserved.
          </p>
          <p className="footer__age-warning">
            You must be 19 years of age or older to order. Please have valid ID ready upon delivery.
          </p>
        </div>
      </div>
    </footer>
  );
}
