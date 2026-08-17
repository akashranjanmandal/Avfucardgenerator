import { getStore } from '@netlify/blobs';
import crypto from 'crypto';
import path from 'path';

const FILES_URL_PREFIX = '/api/files/';

const EXT_BY_MIME = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

function store() {
  return getStore('avfu-uploads');
}

export async function saveUploadedFile(file, subfolder) {
  if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') return null;
  if (file.size === 0) return null;

  const ext = path.extname(file.name || '') || EXT_BY_MIME[file.type] || '';
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const key = `${subfolder}/${filename}`;

  const buffer = await file.arrayBuffer();
  await store().set(key, buffer, {
    metadata: {
      contentType: file.type || 'application/octet-stream',
      originalName: file.name || filename,
    },
  });

  return `${FILES_URL_PREFIX}${key}`;
}

export async function deletePublicFile(url) {
  if (!url || !url.startsWith(FILES_URL_PREFIX)) return;
  const key = url.slice(FILES_URL_PREFIX.length);
  try {
    await store().delete(key);
  } catch {
    // best-effort cleanup
  }
}

export async function getStoredFile(key) {
  return store().getWithMetadata(key, { type: 'arrayBuffer' });
}
