import React from 'react';

const SectionHeader = ({ kicker, title, subtitle, align = 'left' }) => {
  return (
    <header className={`xp-section-header xp-align-${align}`}>
      {kicker && <p className="xp-kicker">{kicker}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="xp-subtitle">{subtitle}</p>}
    </header>
  );
};

export default SectionHeader;
