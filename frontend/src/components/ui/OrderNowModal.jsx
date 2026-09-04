import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Phone } from 'lucide-react';
import { settingsApi } from '../../utils/api';
import './OrderNowModal.css';

export default function OrderNowModal({ isOpen, onClose }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

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
            <Link to="/contact" className="order-now-modal__link" onClick={onClose}>
              contact form
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
