// Card physical size: 8.5cm x 5.4cm (ratio ~1.574:1).
export const CARD_WIDTH_CM = 8.5;
export const CARD_HEIGHT_CM = 5.4;

// On-screen / DOM render size in CSS px (80px per cm, same ratio). html2canvas
// is asked to capture at CAPTURE_SCALE for a crisp, print-ready raster
// independent of this on-screen size.
export const CARD_WIDTH_PX = 680;
export const CARD_HEIGHT_PX = 432;

export const CAPTURE_SCALE = 3;

export const DEFAULT_OFFICE_DEPT =
  'Assam Veterinary and Fishery University, Khanapara, Guwahati,\nAssam, India, PIN-781022';

export const VC_SIGNATURE_LINE_1 = 'Signature of Vice Chancellor';
export const VC_SIGNATURE_LINE_2 =
  'Assam Veterinary and Fishery University, Khanapara, Guwahati, 781022';
