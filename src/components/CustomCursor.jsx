import { useEffect, useRef, useState } from 'react';

const SECTION_COLORS = {
  dark: {
    dot: '#FFFFFF',
    glow: 'rgba(255, 255, 255, 0.5)',
    text: '#FFFFFF',
    ring: '#FFFFFF',
    hoverDot: '#C9A962',
    hoverGlow: 'rgba(201, 169, 98, 0.7)',
  },
  light: {
    dot: '#2C1810',
    glow: 'rgba(44, 24, 16, 0.35)',
    text: '#2C1810',
    ring: '#2C1810',
    hoverDot: '#C9A962',
    hoverGlow: 'rgba(201, 169, 98, 0.6)',
  },
};

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const arcTextRef = useRef(null);
  const ringInnerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const mouse = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    let rotation = 0;
    let animFrameId;
    let currentColors = SECTION_COLORS.dark;
    let hovering = false;

    const lerp = (a, b, t) => a + (b - a) * t;

    const getSectionColors = (x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return SECTION_COLORS.dark;
      const section = el.closest('.section-light, .section-dark');
      if (!section) return SECTION_COLORS.dark;
      return section.classList.contains('section-light')
        ? SECTION_COLORS.light
        : SECTION_COLORS.dark;
    };

    const applyColors = (colors, isHov) => {
      if (!dotRef.current || !ringRef.current) return;

      const dotColor = isHov ? colors.hoverDot : colors.dot;
      const glowColor = isHov ? colors.hoverGlow : colors.glow;

      dotRef.current.style.backgroundColor = dotColor;
      dotRef.current.style.boxShadow = `0 0 ${isHov ? 14 : 8}px ${glowColor}`;

      if (arcTextRef.current) {
        arcTextRef.current.style.fill = isHov ? dotColor : colors.text;
        arcTextRef.current.style.opacity = isHov ? '1' : '0.7';
      }

      if (ringInnerRef.current) {
        ringInnerRef.current.style.borderColor = isHov
          ? `${dotColor}55`
          : colors.ring;
      }
    };

    const animate = () => {
      ring.x = lerp(ring.x, mouse.x, 0.1);
      ring.y = lerp(ring.y, mouse.y, 0.1);
      rotation += 0.5;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`;
      }

      animFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setIsHidden(false);

      currentColors = getSectionColors(e.clientX, e.clientY);
      applyColors(currentColors, hovering);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const clickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.product-card') ||
        target.classList.contains('cart-icon-wrapper');

      hovering = !!clickable;
      setIsHovering(hovering);
      applyColors(currentColors, hovering);
    };

    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);

    const onClick = (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      const color = currentColors.hoverDot;
      ripple.style.borderColor = color;
      ripple.style.boxShadow = `0 0 8px ${color}`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('click', onClick);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot-new ${isHovering ? 'hovering' : ''} ${isHidden ? 'hidden' : ''}`}
      />
      <div
        ref={ringRef}
        className={`cursor-ring-new ${isHovering ? 'hovering' : ''} ${isHidden ? 'hidden' : ''}`}
      >
        <svg viewBox="0 0 100 100" className="cursor-ring-svg">
          <defs>
            <path id="circlePath" d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" />
          </defs>
          <text ref={arcTextRef} className="cursor-arc-text">
            <textPath href="#circlePath" startOffset="0%" textLength="188" lengthAdjust="spacing">
              VELOUR · ARTISAN · VELOUR · ARTISAN
            </textPath>
          </text>
        </svg>
        <div ref={ringInnerRef} className="cursor-ring-inner" />
      </div>
    </>
  );
};

export default CustomCursor;
