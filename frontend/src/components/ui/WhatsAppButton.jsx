import { useEffect, useState } from 'react';
import { settingsApi } from '../../utils/api';
import './WhatsAppButton.css';

// lucide-react has no official WhatsApp glyph — inline brand mark instead.
function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.15a8.14 8.14 0 0 1-4.15-1.14l-.3-.18-3.05.8.82-2.97-.2-.3a8.13 8.13 0 0 1-1.25-4.36c0-4.5 3.66-8.16 8.16-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.15-8.19 8.15Zm4.48-6.11c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.19 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

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
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
