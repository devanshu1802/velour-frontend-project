import { useCart } from '../context/CartContext';
import { useState } from 'react';

const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cartTotal, 
    totalItems, 
    clearCart 
  } = useCart();
  
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isCheckoutOpen) return null;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
    
    
    setTimeout(() => {
      setOrderPlaced(false);
      setIsCheckoutOpen(false);
    }, 3000);
  };

  const closeCheckout = () => {
    if (!orderPlaced) {
      setIsCheckoutOpen(false);
    }
  };

  return (
    <>
      <div className="cart-backdrop" onClick={closeCheckout}></div>
      <div className="checkout-modal">
        <button className="cart-close-btn" onClick={closeCheckout} style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {orderPlaced ? (
          <div className="checkout-success text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto var(--space-4)' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h2 className="section-heading" style={{ fontSize: '2rem' }}>Order Confirmed</h2>
            <p className="body-text">Thank you for your purchase. Your luxury artisan chocolate is being prepared.</p>
          </div>
        ) : (
          <div className="checkout-content">
            <h2 className="section-heading" style={{ fontSize: '2rem', marginBottom: 'var(--space-6)' }}>Checkout Summary</h2>
            
            <div className="checkout-summary-box">
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total-row">
                <span>Grand Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 'var(--space-6)', textAlign: 'center' }}>
              This is a frontend-only demonstration. No payment will be processed.
            </p>

            <button className="btn-primary" style={{ width: '100%' }} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutModal;
