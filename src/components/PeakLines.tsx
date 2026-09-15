import React from 'react';
import { useLang } from '../i18n/context';

interface PeakLinesProps {
  color?: string;
  className?: string;
  lines?: number;
  width?: number;
  height?: number;
}

export const PeakLines: React.FC<PeakLinesProps> = ({
  color = 'currentColor',
  className = '',
  lines = 4,
  width = 280,
  height = 160,
}) => {
  const { isRtl } = useLang();

  // Angle ~60.9° matching logo blade angle (dx = height / 1.795)
  const dx = height / 1.795;
  const spacing = 26;
  const startX = 30;
  const baseY = height - 10;
  const topY = 10;

  const strokes = [];
  for (let i = 0; i < lines; i++) {
    const xBase = startX + i * spacing;
    const xTop = xBase + dx;
    strokes.push(
      <line
        key={i}
        x1={xTop}
        y1={topY}
        x2={xBase}
        y2={baseY}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none transition-transform duration-300 ${className}`}
      style={{
        transform: isRtl ? 'scaleX(-1)' : 'none',
        transformOrigin: 'center',
      }}
      aria-hidden="true"
    >
      {/* Parallel slanted strokes at ~60.9° meeting baseline */}
      {strokes}
      {/* Horizontal baseline */}
      <line
        x1="0"
        y1={baseY}
        x2={width}
        y2={baseY}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
};
