import { createContext, useContext, useState, useCallback } from 'react';
import OrderNowModal from '../components/ui/OrderNowModal';

const OrderNowModalContext = createContext(null);

export const OrderNowModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openOrderNowModal = useCallback(() => setIsOpen(true), []);
  const closeOrderNowModal = useCallback(() => setIsOpen(false), []);

  return (
    <OrderNowModalContext.Provider value={{ openOrderNowModal }}>
      {children}
      {/* Wrapped in .site so the modal picks up the public light-theme
          color variables — this Provider sits above PublicLayout's own
          .site wrapper, so without this it inherited the dark admin
          theme's :root values instead (dark bg + near-black text). */}
      <div className="site" style={{ minHeight: 0 }}>
        <OrderNowModal isOpen={isOpen} onClose={closeOrderNowModal} />
      </div>
    </OrderNowModalContext.Provider>
  );
};

export const useOrderNowModal = () => {
  const ctx = useContext(OrderNowModalContext);
  if (!ctx) throw new Error('useOrderNowModal must be used within OrderNowModalProvider');
  return ctx;
};
