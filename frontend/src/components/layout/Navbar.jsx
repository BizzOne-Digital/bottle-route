import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useOrderNowModal } from '../../context/OrderNowModalContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { openOrderNowModal } = useOrderNowModal();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close the mobile menu as soon as the user scrolls, instead of it
  // staying open and floating over the page content.
  useEffect(() => {
    if (!menuOpen) return;
    const handler = () => setMenuOpen(false);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [menuOpen]);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/logo.png" alt="Bottle Route" className="navbar__logo-img" />
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className={`navbar__link${pathname === l.href ? ' navbar__link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar__actions">
          <button type="button" onClick={openOrderNowModal} className="btn btn-accent navbar__cta">
            <ShoppingBag size={16} />
            Order Now
          </button>
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <Link key={l.label} to={l.href} className="navbar__mobile-link">
            {l.label}
          </Link>
        ))}
        <button type="button" onClick={openOrderNowModal} className="btn btn-accent" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
          <ShoppingBag size={16} /> Order Now
        </button>
      </div>
    </header>
  );
}
