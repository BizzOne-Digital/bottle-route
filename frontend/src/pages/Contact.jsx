import { useState, useEffect } from 'react';
import { Phone, Mail, Clock, MapPin, Send, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Reveal from '../components/ui/Reveal';
import { settingsApi } from '../utils/api';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsApi.get().then(({ data }) => setSettings(data.data)).catch(() => {});
  }, []);

  const phoneNumber = settings?.phone || '';
  const email = settings?.email || 'info@bottleroute.ca';

  const CONTACT_INFO = [
    ...(phoneNumber ? [{ icon: Phone, label: 'Phone', value: phoneNumber, href: `tel:${phoneNumber}` }] : []),
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Clock, label: 'Hours', value: 'Daily: 10:00 AM – 3:00 AM', href: null },
    { icon: MapPin, label: 'Service Area', value: 'Mississauga, Oakville, Milton & Etobicoke', href: null },
  ];

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send — wire up to your backend/email service
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    toast.success('Message sent! We\'ll get back to you shortly.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <main className="contact-page">
      {/* Hero */}
      <section className="contact-page__hero">
        <div className="contact-page__hero-bg" />
        <Reveal className="container contact-page__hero-content">
          <p className="section-eyebrow">Get In Touch</p>
          <h1 className="section-title">CONTACT US</h1>
          <p className="contact-page__sub">Questions, bulk orders, or just want to say hi — we're here.</p>
        </Reveal>
      </section>

      <section className="section contact-page__main">
        <div className="container contact-page__grid">
          {/* Info side */}
          <Reveal as="div" className="contact-page__info">
            <h2 className="contact-page__info-title">We'd love to hear from you.</h2>
            <p className="contact-page__info-sub">
              Reach out for order support, bulk inquiries, business partnerships,
              or anything else. Our team responds within a few hours during operating hours.
            </p>

            <div className="contact-page__cards">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="contact-info-card">
                  <div className="contact-info-card__icon"><Icon size={18} /></div>
                  <div>
                    <p className="contact-info-card__label">{label}</p>
                    {href
                      ? <a href={href} className="contact-info-card__value">{value}</a>
                      : <p className="contact-info-card__value">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-page__age-notice">
              <Shield size={16} />
              <p>Bottle Route is a 19+ service. ID is required upon delivery. Please drink responsibly.</p>
            </div>
          </Reveal>

          {/* Form side */}
          <Reveal as="div" className="contact-page__form-wrap" delay={120}>
            <form onSubmit={handleSubmit} className="contact-form">
              <h3 className="contact-form__title">Send a Message</h3>
              <div className="contact-form__row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" {...f('name')} required placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" {...f('email')} required placeholder="you@example.com" />
                </div>
              </div>
              <div className="contact-form__row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" {...f('phone')} placeholder="(optional)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-select" {...f('subject')} required>
                    <option value="">Select a topic</option>
                    <option>Order Support</option>
                    <option>Bulk / Corporate Order</option>
                    <option>Partnership Inquiry</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  {...f('message')}
                  required
                  placeholder="Tell us how we can help..."
                  rows={5}
                />
              </div>
              <button type="submit" className="btn btn-primary contact-form__submit" disabled={sending}>
                <Send size={16} />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
