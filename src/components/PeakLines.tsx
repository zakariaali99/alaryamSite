import React from 'react';
import { useLang } from '../i18n/context';

export type PeakLinesToken =
  | 'brand-50'
  | 'brand-100'
  | 'brand-600'
  | 'brand-700'
  | 'brand-800'
  | 'white'
  | 'line'
  | 'currentColor';

interface PeakLinesProps {
  token?: PeakLinesToken;
  className?: string;
  lines?: number;
  width?: number;
  height?: number;
}

export const PeakLines: React.FC<PeakLinesProps> = ({
  token = 'brand-800',
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

  const colorVal = token === 'currentColor' ? 'currentColor' : `var(--${token})`;

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
        stroke={colorVal}
        strokeWidth="2"
        strokeLinecap="square"
        className="peak-line-stroke"
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
      {strokes}
      <line
        x1="0"
        y1={baseY}
        x2={width}
        y2={baseY}
        stroke={colorVal}
        strokeWidth="2"
        strokeLinecap="square"
        className="peak-line-base"
      />
    </svg>
  );
};
