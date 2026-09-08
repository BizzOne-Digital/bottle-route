import { useEffect, useState } from 'react';
import { X, Phone } from 'lucide-react';
import { settingsApi } from '../../utils/api';
import './OrderNowModal.css';

export default function OrderNowModal({ isOpen, onClose }) {
  const [phone, setPhone] = useState('');
  // Starts true: this component is rendered outside <BrowserRouter> (its
  // Provider wraps the router), so its first paint after opening — before
  // this effect has run — must never fall into the "no phone yet" fallback
  // branch, which used to render a react-router <Link> with no Router
  // context available and crash the whole app. Defaulting to the loading
  // state avoids that render path entirely; the fallback below also no
  // longer uses <Link> at all, as a second, independent safeguard.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    settingsApi.get()
      .then(({ data }) => setPhone(data?.data?.phone || ''))
      .catch(() => setPhone(''))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="order-now-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="order-now-modal">
        <button className="order-now-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="order-now-modal__icon">
          <Phone size={26} />
        </div>

        <h2 className="order-now-modal__title">Order Now</h2>

        {loading ? (
          <p className="order-now-modal__text">Loading...</p>
        ) : phone ? (
          <>
            <p className="order-now-modal__text">Give us a call to place your order.</p>
            <a href={`tel:${phone}`} className="order-now-modal__phone">
              {phone}
            </a>
          </>
        ) : (
          <p className="order-now-modal__text">
            Phone number coming soon — please use the{' '}
            <a href="/contact" className="order-now-modal__link" onClick={onClose}>
              contact form
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
