'use client';

import { CAPTURE_SCALE } from './cardConstants';

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode PNG.'));
    }, 'image/png');
  });
}

// Captures the front/back card faces as separate, best-quality PNGs
// (lossless, rendered at CAPTURE_SCALE for PVC-print resolution).
export async function generateCardImages(frontEl, backEl) {
  if (!frontEl || !backEl) {
    throw new Error('Card preview is not ready yet.');
  }

  const { default: html2canvas } = await import('html2canvas');

  const captureOptions = {
    scale: CAPTURE_SCALE,
    useCORS: true,
    backgroundColor: '#ffffff',
  };

  const [frontCanvas, backCanvas] = await Promise.all([
    html2canvas(frontEl, captureOptions),
    html2canvas(backEl, captureOptions),
  ]);

  const [frontBlob, backBlob] = await Promise.all([
    canvasToBlob(frontCanvas),
    canvasToBlob(backCanvas),
  ]);

  return { frontBlob, backBlob };
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Browsers can silently drop the second of two downloads triggered back-to-back
// with no pause between them, so stagger the two PNG files slightly.
export async function downloadCardImages({ frontBlob, backBlob }, baseName) {
  downloadBlob(frontBlob, `${baseName}_front.png`);
  await new Promise((resolve) => setTimeout(resolve, 400));
  downloadBlob(backBlob, `${baseName}_back.png`);
}
