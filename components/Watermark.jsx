'use client';

import { useMemo } from 'react';
import { buildWatermarkDataUri } from '@/lib/watermark';
import { CARD_WIDTH_PX, CARD_HEIGHT_PX } from '@/lib/cardConstants';

export default function Watermark() {
  const uri = useMemo(() => buildWatermarkDataUri(CARD_WIDTH_PX, CARD_HEIGHT_PX), []);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${uri}")`,
        backgroundSize: '100% 100%',
        zIndex: 0,
      }}
    />
  );
}
