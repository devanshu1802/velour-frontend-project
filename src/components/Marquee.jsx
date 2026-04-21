const MARQUEE_TEXT = [
  'Ethically Sourced',
  'Handcrafted in Batches',
  'Pure Indulgence',
  'Est. 2016',
  'Single-Origin Cacao',
  'Master Chocolatiers',
  'Gold-Dusted Truffles',
  'Zero Artificial Additives',
];

const MarqueeItem = ({ text }) => (
  <>
    <span className="marquee-text">{text}</span>
    <span className="marquee-separator" aria-hidden="true">·</span>
  </>
);

const Marquee = ({ reverse = false }) => {
  const items = [...MARQUEE_TEXT, ...MARQUEE_TEXT];

  return (
    <div className="marquee-section" aria-hidden="true">
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
        <div className="marquee-content">
          {items.map((t, i) => <MarqueeItem key={`a-${i}`} text={t} />)}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {items.map((t, i) => <MarqueeItem key={`b-${i}`} text={t} />)}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
