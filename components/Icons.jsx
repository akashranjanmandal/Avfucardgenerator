'use client';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconIdCard({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5 16c.5-1.5 1.8-2.5 3-2.5s2.5 1 3 2.5" />
      <path d="M14 9.5h6" />
      <path d="M14 13h4" />
    </svg>
  );
}

export function IconFlip({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M6 10.5h6" />
      <path d="M6 14h11" />
    </svg>
  );
}

export function IconSearch({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function IconEdit({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function IconDownload({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function IconTrash({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <path d="M4 7h16" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export function IconPlusCircle({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function IconList({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <path d="M9 6h12" />
      <path d="M9 12h12" />
      <path d="M9 18h12" />
      <path d="M4 6h.01" />
      <path d="M4 12h.01" />
      <path d="M4 18h.01" />
    </svg>
  );
}

export function IconShield({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconInbox({ size = 40, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={1.5} {...base} {...props}>
      <path d="M3.5 12h4.5l2 3h4l2-3h4.5" />
      <path d="M5.5 6h13l2.5 6v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7l2.5-6Z" />
    </svg>
  );
}

export function IconCheckCircle({ size = 16, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3L16 10" />
    </svg>
  );
}
