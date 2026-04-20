import React from 'react';

const GlowStat = ({ value, label }) => {
  return (
    <article className="xp-glow-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
};

export default GlowStat;
