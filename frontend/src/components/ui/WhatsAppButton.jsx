import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { settingsApi } from '../../utils/api';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    settingsApi.get().then(({ data }) => setPhone(data.data.phone || '')).catch(() => {});
  }, []);

  if (!phone) return null;

  // Assumes a Canadian number (+1) with no existing country code prefix.
  const digits = phone.replace(/\D/g, '');
  const waNumber = digits.length === 10 ? `1${digits}` : digits;
  const message = encodeURIComponent("Hi! I'd like to place an order with Bottle Route.");

  return (
    <a
      href={`https://wa.me/${waNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="currentColor" />
    </a>
  );
}
