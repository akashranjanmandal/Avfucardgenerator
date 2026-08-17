// Builds a repeating diagonal watermark, baked directly into an SVG data URI
// sized to the card so it renders crisply both on screen and in html2canvas.
export function buildWatermarkDataUri(width, height) {
  const line = 'ASSAM VETERINARY AND FISHERY UNIVERSITY   •   KHANAPARA, GUWAHATI, ASSAM, INDIA';
  const rowHeight = 46;
  const rows = [];
  let y = -40;
  while (y < height + 60) {
    rows.push(
      `<text x="-260" y="${y}" transform="rotate(-24 ${width / 2} ${y})" ` +
        `font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="13" ` +
        `fill="#0d1f6e" fill-opacity="0.09" letter-spacing="0.5">${line}   ${line}   ${line}</text>`
    );
    y += rowHeight;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rows.join('')}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
