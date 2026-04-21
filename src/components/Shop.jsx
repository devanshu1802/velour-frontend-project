import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import QuickView from './QuickView';

const useCountUp = (target, isVisible) => {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;
    const duration = 1000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(current.toFixed(2)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, target]);

  return count;
};

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const animatedPrice = useCountUp(product.price, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={cardRef} className="product-card fade-in-up">
      <figure className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-quickview-overlay" onClick={() => onQuickView(product)}>
          <span className="quickview-trigger">Quick View</span>
        </div>
      </figure>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price" style={{ marginBottom: 'var(--space-2)' }}>
          ${animatedPrice.toFixed(2)}
        </p>
        <p className="pillar-desc" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-4)', minHeight: '60px' }}>
          {product.description}
        </p>
        <button
          className="btn-primary magnetic-btn"
          style={{ width: '100%' }}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

const Shop = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
      return () => observer.disconnect();
    } else {
      document.querySelectorAll('.fade-in-up').forEach(el => {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }, []);

  return (
    <>
      <main style={{ paddingTop: 'var(--space-20)' }} className="section-light">
        <div className="container" style={{ minHeight: '80vh', paddingBottom: 'var(--space-20)' }}>
          <div className="text-center fade-in-up">
            <h1 className="section-heading">The Boutique</h1>
            <p className="body-text" style={{ margin: '0 auto var(--space-10)' }}>
              Explore our full collection of handcrafted artisan chocolates.
            </p>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </main>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  );
};

export default Shop;
