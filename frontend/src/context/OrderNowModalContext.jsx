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
      <OrderNowModal isOpen={isOpen} onClose={closeOrderNowModal} />
    </OrderNowModalContext.Provider>
  );
};

export const useOrderNowModal = () => {
  const ctx = useContext(OrderNowModalContext);
  if (!ctx) throw new Error('useOrderNowModal must be used within OrderNowModalProvider');
  return ctx;
};
