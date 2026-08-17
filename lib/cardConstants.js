// Card physical size: 8.5cm x 5.4cm (ratio ~1.574:1).
export const CARD_WIDTH_CM = 8.5;
export const CARD_HEIGHT_CM = 5.4;

// On-screen / DOM render size in CSS px (80px per cm, same ratio). html2canvas
// is asked to capture at CAPTURE_SCALE for a crisp, print-ready raster
// independent of this on-screen size.
export const CARD_WIDTH_PX = 680;
export const CARD_HEIGHT_PX = 432;

// Bumped for PVC-print-quality PNG export (~800dpi at this card size).
export const CAPTURE_SCALE = 4;

export const DEFAULT_OFFICE_DEPT =
  'Assam Veterinary and Fishery University, Khanapara, Guwahati,\nAssam, India, PIN-781022';

export const SIGNATORY_LINE_2 =
  'Assam Veterinary and Fishery University, Khanapara, Guwahati, 781022';

// Role controls the card's border color and who signs it: the Registrar
// signs everyone's card except their own, which the Vice Chancellor signs.
export const ROLES = [
  { value: 'Registrar', borderColor: '#c11423' },
  { value: 'Teaching Staff', borderColor: '#1450a3' },
  { value: 'Non-Teaching Staff', borderColor: '#15803d' },
  { value: 'Officer', borderColor: '#6b21a8' },
];

export function getRoleBorderColor(role) {
  return ROLES.find((r) => r.value === role)?.borderColor || ROLES[0].borderColor;
}

export function getSignatoryLine1(role) {
  return role === 'Registrar' ? 'Signature of Vice Chancellor' : 'Signature of Registrar';
}
