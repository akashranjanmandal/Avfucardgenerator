'use client';

import { useMemo } from 'react';
import { buildWatermarkRows, WATERMARK_LINE } from '@/lib/watermark';
import { CARD_WIDTH_PX, CARD_HEIGHT_PX } from '@/lib/cardConstants';

// Rendered as real inline SVG (not a CSS background-image) — html2canvas
// renders inline SVG elements directly, avoiding a bug where it fails to
// rasterize data-URI SVG *backgrounds* via canvas createPattern at higher
// capture scales ("createPattern... canvas element with a width or height
// of 0").
export default function Watermark() {
  const rows = useMemo(() => buildWatermarkRows(CARD_HEIGHT_PX), []);
  const text = `${WATERMARK_LINE}   ${WATERMARK_LINE}   ${WATERMARK_LINE}`;

  return (
    <svg
      width={CARD_WIDTH_PX}
      height={CARD_HEIGHT_PX}
      viewBox={`0 0 ${CARD_WIDTH_PX} ${CARD_HEIGHT_PX}`}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    >
      {rows.map((y) => (
        <text
          key={y}
          x={-260}
          y={y}
          transform={`rotate(-24 ${CARD_WIDTH_PX / 2} ${y})`}
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          fontSize="13"
          fill="#0d1f6e"
          fillOpacity="0.09"
          letterSpacing="0.5"
        >
          {text}
        </text>
      ))}
    </svg>
  );
}
