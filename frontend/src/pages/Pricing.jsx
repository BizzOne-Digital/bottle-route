import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { pricingApi } from '../utils/api';
import Reveal from '../components/ui/Reveal';
import './Pricing.css';

const DEFAULT_NOTE =
  'All prices shown exclude applicable taxes. Minimum order value may apply. Product prices visible in the shop.';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pricingApi
      .get()
      .then(({ data }) => {
        setPlans(data.data.plans || []);
        setDeliveryFees(data.data.deliveryFees || []);
        setNote(data.data.note || DEFAULT_NOTE);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pricing-page">
      {/* Hero */}
      <section className="pricing-page__hero">
        <div className="pricing-page__hero-bg" />
        <Reveal className="container pricing-page__hero-content">
          <p className="section-eyebrow">Transparent Pricing</p>
          <h1 className="section-title">SIMPLE PRICING.<br /><span className="text-accent">NO SURPRISES.</span></h1>
          <p className="pricing-page__sub">Choose how you order. All plans include fast delivery and full product access.</p>
        </Reveal>
      </section>

      {/* Plans */}
      <section className="section pricing-page__plans">
        <div className="container">
          {loading && <p className="pricing-page__sub">Loading pricing…</p>}
          <div className="pricing-page__grid">
            {plans.map(({ name, price, period, desc, features, cta, href, highlight }, i) => (
              <Reveal key={name} delay={i * 80}>
                <div className={`pricing-card${highlight ? ' pricing-card--highlight' : ''}`}>
                  {highlight && <div className="pricing-card__badge">Most Popular</div>}
                  <div className="pricing-card__header">
                    <h3 className="pricing-card__name">{name}</h3>
                    <div className="pricing-card__price">
                      <span className="pricing-card__amount">{price}</span>
                      {period && <span className="pricing-card__period">{period}</span>}
                    </div>
                    <p className="pricing-card__desc">{desc}</p>
                  </div>
                  <ul className="pricing-card__features">
                    {features.map(f => (
                      <li key={f}>
                        <span className="pricing-card__check"><Check size={14} /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={href}
                    className={`btn ${highlight ? 'btn-accent' : 'btn-outline-green'} pricing-card__cta`}
                  >
                    {cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery fees table */}
      <section className="section pricing-page__fees">
        <Reveal className="container pricing-page__fees-inner">
          <div>
            <p className="section-eyebrow">Delivery Fees</p>
            <h2 className="section-title">ZONE PRICING</h2>
            <p style={{ color: 'var(--br-gray)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Delivery fees are calculated at checkout based on your location. Members always get free delivery.
            </p>
          </div>
          <div className="pricing-fees-table">
            <div className="pricing-fees-table__header">
              <span>Zone</span>
              <span>Delivery Fee</span>
            </div>
            {deliveryFees.map(({ zone, fee }) => (
              <div key={zone} className={`pricing-fees-table__row${fee === 'FREE' ? ' pricing-fees-table__row--free' : ''}`}>
                <span>{zone}</span>
                <span className="pricing-fees-table__fee">{fee}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FAQ note */}
      <section className="pricing-page__note">
        <Reveal className="container">
          <p>{note}</p>
          <Link to="/contact" className="btn btn-outline-green" style={{ marginTop: '1.25rem' }}>Have a Question?</Link>
        </Reveal>
      </section>
    </main>
  );
}
