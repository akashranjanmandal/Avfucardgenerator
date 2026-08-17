export const WATERMARK_LINE =
  'ASSAM VETERINARY AND FISHERY UNIVERSITY   •   KHANAPARA, GUWAHATI, ASSAM, INDIA';

const ROW_HEIGHT = 46;

// Returns the y-offsets for each repeated watermark row needed to cover
// a card of the given height.
export function buildWatermarkRows(height) {
  const rows = [];
  let y = -40;
  while (y < height + 60) {
    rows.push(y);
    y += ROW_HEIGHT;
  }
  return rows;
}
