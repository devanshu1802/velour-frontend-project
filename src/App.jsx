import { useState, useEffect, useCallback } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Home from './components/Home';
import Shop from './components/Shop';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import CustomCursor from './components/CustomCursor';
import Toast from './components/Toast';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';

const Navbar = ({ currentView, navigateTo, theme, toggleTheme, handleSmoothScroll }) => {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const { setIsCartOpen, totalItems } = useCart();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setNavHidden(false);
      }

      lastScrollY = currentScrollY;

      const heroWrapper = document.getElementById('hero-wrapper');
      if (heroWrapper && currentView === 'home') {
        setOverHero(currentScrollY < heroWrapper.clientHeight - 50);
      } else {
        setOverHero(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleNavClick = (e, targetId, view) => {
    e.preventDefault();
    if (view && currentView !== view) {
      navigateTo(view);
      setTimeout(() => {
        if (targetId !== '#') handleSmoothScroll(null, targetId);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 450);
    } else {
      if (targetId !== '#') handleSmoothScroll(null, targetId);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${navHidden ? 'hidden' : ''} ${overHero ? 'force-dark' : ''}`} id="navbar">
      <div className="nav-container">
        <a href="#" className="brand-logo" onClick={(e) => handleNavClick(e, '#', 'home')}>VELOUR</a>
        <ul className="nav-links" style={{ alignItems: 'center' }}>
          <li><a href="#" onClick={(e) => handleNavClick(e, '#', 'home')}>Home</a></li>
          <li><a href="#" onClick={(e) => handleNavClick(e, '#', 'shop')}>Shop</a></li>

          <li style={{ marginLeft: 'var(--space-2)' }}>
            <div className="cart-icon-wrapper" onClick={() => setIsCartOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); toggleTheme(); }} aria-label="Toggle Theme">
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const MainApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState('dark');

  const navigateTo = useCallback((view) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setIsTransitioning(false);
    }, 400);
  }, [currentView]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSmoothScroll = (e, targetId) => {
    if (e) e.preventDefault();
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: offsetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
  };

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar
        currentView={currentView}
        navigateTo={navigateTo}
        theme={theme}
        toggleTheme={toggleTheme}
        handleSmoothScroll={handleSmoothScroll}
      />

      <div className={`page-transition-wrapper ${isTransitioning ? 'fade-out' : ''}`}>
        {currentView === 'home' ? (
          <Home onSubscribe={handleSubscribe} />
        ) : (
          <Shop />
        )}

        <footer className="footer section-dark">
          <div className="container footer-container">
            <div className="footer-logo">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>VELOUR</a>
            </div>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Shop</a>
              <a href="#">Terms &amp; Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
            <div className="footer-copyright">
              <p>&copy; 2026 Velour Chocolatier. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      <CartDrawer />
      <CheckoutModal />
      <Toast />
      <BackToTop />
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

export default App;
