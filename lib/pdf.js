'use client';

import { CARD_WIDTH_CM, CARD_HEIGHT_CM, CAPTURE_SCALE } from './cardConstants';

export async function generateCardPdf(frontEl, backEl) {
  if (!frontEl || !backEl) {
    throw new Error('Card preview is not ready yet.');
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'cm',
    format: [CARD_WIDTH_CM, CARD_HEIGHT_CM],
  });

  const frontCanvas = await html2canvas(frontEl, {
    scale: CAPTURE_SCALE,
    useCORS: true,
    backgroundColor: '#ffffff',
  });
  pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, CARD_WIDTH_CM, CARD_HEIGHT_CM);

  pdf.addPage([CARD_WIDTH_CM, CARD_HEIGHT_CM], 'landscape');
  const backCanvas = await html2canvas(backEl, {
    scale: CAPTURE_SCALE,
    useCORS: true,
    backgroundColor: '#ffffff',
  });
  pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, CARD_WIDTH_CM, CARD_HEIGHT_CM);

  return pdf.output('blob');
}
