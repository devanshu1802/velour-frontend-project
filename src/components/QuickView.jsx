import { useCart } from '../context/CartContext';

const QuickView = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} />
      <div className="quickview-modal" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="cart-close-btn quickview-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="quickview-content">
          <div className="quickview-image-wrap">
            <img src={product.image} alt={product.name} className="quickview-image" />
          </div>
          <div className="quickview-details">
            <p className="quickview-label">Velour Chocolatier</p>
            <h2 className="quickview-name">{product.name}</h2>
            <p className="quickview-price">${product.price.toFixed(2)}</p>
            <p className="quickview-desc">{product.description}</p>
            <div className="quickview-badges">
              <span className="qv-badge">Handcrafted</span>
              <span className="qv-badge">Ethically Sourced</span>
              <span className="qv-badge">Artisan</span>
            </div>
            <button className="btn-primary quickview-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickView;
