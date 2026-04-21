import { useEffect, useRef, useCallback, useState } from 'react';
import Marquee from './Marquee';

const Home = ({ onSubscribe }) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameCount = 80;
  const [isLoaded, setIsLoaded] = useState(false);

  const storyImgRef = useRef(null);
  const parallaxRefs = useRef([]);

  const drawFrame = useCallback((frameIndex) => {
    if (!canvasRef.current || imagesRef.current.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex];

    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    }

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }, []);

  useEffect(() => {
    let loadedCount = 0;
    const loadedImages = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/images/heroAnimation/Chocolate_unwrapping_exploding_202604191801_${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Draw the frame if it's the first one, and hide the preloader immediately
        if (i === 0) {
          drawFrame(0);
          setIsLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [drawFrame]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const updateFrame = () => {
      if (prefersReducedMotion) {
        drawFrame(frameCount - 1);
        return;
      }

      const scrollY = window.scrollY;
      const heroWrapper = document.getElementById('hero-wrapper');

      if (!heroWrapper) return;

      const maxScroll = heroWrapper.clientHeight - window.innerHeight;

      if (scrollY <= maxScroll && maxScroll > 0) {
        const scrollFraction = scrollY / maxScroll;
        const frameIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(scrollFraction * frameCount))
        );
        drawFrame(frameIndex);
      } else if (scrollY > maxScroll) {
        drawFrame(frameCount - 1);
      }
    };

    const applyParallax = () => {
      parallaxRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.bottom < 0 || rect.top > windowH) return;
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const offset = (progress - 0.5) * 60;
        el.style.transform = `translateY(${offset}px)`;
      });
    };

    const handleScrollAnim = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateFrame();
          applyParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollAnim, { passive: true });
    window.addEventListener('resize', handleScrollAnim);

    updateFrame();

    return () => {
      window.removeEventListener('scroll', handleScrollAnim);
      window.removeEventListener('resize', handleScrollAnim);
    };
  }, [drawFrame]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

      const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerInstance.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const animatedElements = document.querySelectorAll('.fade-in-up');
      animatedElements.forEach(el => observer.observe(el));

      return () => {
        animatedElements.forEach(el => observer.unobserve(el));
      };
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
      <div className={`preloader ${isLoaded ? 'hidden' : ''}`} role="status" aria-label="Loading">
        <p className="preloader-brand">VELOUR</p>
        <div className="preloader-line"></div>
      </div>

      <main>
        <div id="hero-wrapper" className="hero-wrapper">
          <header id="hero" className="hero-section section-dark">
            <div className="hero-canvas-container">
              <canvas ref={canvasRef}></canvas>
            </div>
            <div className="hero-content fade-in-up">
              <h1 className="hero-title">Crafted for Those Who Savor</h1>
              <p className="hero-subtitle">The finest artisan chocolate, created with passion and precision.</p>
            </div>
            <div className="scroll-indicator">
              <span className="scroll-text">Discover</span>
              <div className="scroll-line"></div>
            </div>
          </header>
        </div>

        <Marquee />

        <section id="story" className="story-section section-light">
          <div className="container story-container">
            <div className="story-text fade-in-up">
              <h2 className="section-heading">A Legacy of Indulgence</h2>
              <p className="body-text">Velour was born from a singular obsession: to create the perfect chocolate experience. Every piece we craft is a testament to heritage, blending time-honored techniques with unparalleled artistry to awaken your senses.</p>
            </div>
            <div className="story-image-container fade-in-up delay-1" style={{ overflow: 'hidden' }}>
              <img
                ref={el => parallaxRefs.current[0] = el}
                src="/images/brand_story_chocolate_1776598171546.png"
                alt="An elegant piece of artisan dark chocolate with gold accents"
                className="story-image"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>
        </section>

        <section id="pillars" className="pillars-section section-dark">
          <div className="container">
            <h2 className="section-heading text-center fade-in-up" style={{ marginBottom: 'var(--space-12)' }}>Our Philosophy</h2>

            <div className="craft-row fade-in-up">
              <div className="craft-image-container" style={{ overflow: 'hidden' }}>
                <img
                  ref={el => parallaxRefs.current[1] = el}
                  src="/images/craft_cacao_1776605165010.png"
                  alt="Raw cacao pods in rainforest"
                  className="craft-image"
                  style={{ willChange: 'transform' }}
                />
              </div>
              <div className="craft-text">
                <h3 className="craft-title">Ethically Sourced Cacao</h3>
                <p className="craft-desc">We partner directly with small-batch farmers, ensuring fair wages and unparalleled flavor profiles rooted deeply in their origin.</p>
              </div>
            </div>

            <div className="craft-row reverse fade-in-up delay-1">
              <div className="craft-image-container" style={{ overflow: 'hidden' }}>
                <img
                  ref={el => parallaxRefs.current[2] = el}
                  src="/images/craft_tempering_1776605183585.png"
                  alt="Chocolatier tempering chocolate"
                  className="craft-image"
                  style={{ willChange: 'transform' }}
                />
              </div>
              <div className="craft-text">
                <h3 className="craft-title">Handcrafted in Batches</h3>
                <p className="craft-desc">Every piece is meticulously tempered and molded by our master chocolatiers on marble slabs, preserving the crisp snap and silken melt.</p>
              </div>
            </div>

            <div className="craft-row fade-in-up delay-2">
              <div className="craft-image-container" style={{ overflow: 'hidden' }}>
                <img
                  ref={el => parallaxRefs.current[3] = el}
                  src="/images/craft_pouring_1776605202590.png"
                  alt="Molten chocolate pouring"
                  className="craft-image"
                  style={{ willChange: 'transform' }}
                />
              </div>
              <div className="craft-text">
                <h3 className="craft-title">Pure Indulgence</h3>
                <p className="craft-desc">No artificial ingredients, just pure, unadulterated artisan chocolate crafted to awaken your senses and elevate your palate.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="products-section section-light">
          <div className="container">
            <h2 className="section-heading text-center fade-in-up">Signature Collections</h2>
            <div className="products-grid">
              <article className="product-card fade-in-up delay-1">
                <figure className="product-image-wrapper">
                  <img src="/images/product_midnight_reserve_1776598191020.png" alt="Midnight Reserve Artisan Chocolate Bar" className="product-image" />
                </figure>
                <div className="product-info">
                  <h3 className="product-name">Midnight Reserve</h3>
                  <p className="product-price">$24.00</p>
                </div>
              </article>
              <article className="product-card fade-in-up delay-2">
                <figure className="product-image-wrapper">
                  <img src="/images/product_golden_truffle_1776598209802.png" alt="Golden Truffle Collection" className="product-image" />
                </figure>
                <div className="product-info">
                  <h3 className="product-name">Golden Truffle Collection</h3>
                  <p className="product-price">$48.00</p>
                </div>
              </article>
              <article className="product-card fade-in-up delay-3">
                <figure className="product-image-wrapper">
                  <img src="/images/product_cacao_noir_1776598227790.png" alt="Cacao Noir Block" className="product-image" />
                </figure>
                <div className="product-info">
                  <h3 className="product-name">Cacao Noir</h3>
                  <p className="product-price">$32.00</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="testimonials" className="testimonials-section section-dark">
          <div className="container">
            <h2 className="section-heading text-center fade-in-up">Acclaimed by Experts</h2>
            <div className="testimonials-grid">
              <article className="testimonial-card fade-in-up delay-1">
                <p className="testimonial-quote">"A masterclass in texture and flavor. Velour has redefined what modern luxury chocolate should taste like."</p>
                <p className="testimonial-author">- The Culinary Review</p>
              </article>
              <article className="testimonial-card fade-in-up delay-2">
                <p className="testimonial-quote">"The Midnight Reserve is simply breathtaking. Notes of dark cherry and roasted espresso that linger beautifully."</p>
                <p className="testimonial-author">- Epicurean Digest</p>
              </article>
            </div>
          </div>
        </section>

        <section id="cta" className="cta-section section-dark">
          <div className="container cta-container fade-in-up">
            <h2 className="section-heading">Experience Velour</h2>
            <p className="body-text cta-desc">Join our inner circle for exclusive releases and invitations to private tastings.</p>
            <form className="cta-form" onSubmit={onSubscribe}>
              <div className="input-group">
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input type="email" id="email" className="email-input" placeholder="Enter your email address" required />
                <button type="submit" className="btn-primary">Subscribe</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
