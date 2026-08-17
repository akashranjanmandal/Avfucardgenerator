'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { CARD_WIDTH_PX, CARD_HEIGHT_PX } from '@/lib/cardConstants';

// Shrinks a fixed-size card (CardFront/CardBack are rendered at their true
// physical-size pixel dimensions, which html2canvas depends on) down to fit
// any viewport, purely visually. CSS transform doesn't change the target
// element's offsetWidth/offsetHeight, so the ref passed through `children`
// still captures at full native resolution regardless of this scaling.
export default function CardScaler({ children }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    function updateScale() {
      const width = el.offsetWidth;
      if (!width) return;
      setScale(Math.min(1, width / CARD_WIDTH_PX));
    }

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: CARD_WIDTH_PX }}>
      <div
        style={{
          width: CARD_WIDTH_PX * scale,
          height: CARD_HEIGHT_PX * scale,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: CARD_WIDTH_PX,
            height: CARD_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
