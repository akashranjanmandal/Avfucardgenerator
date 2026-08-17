import { NextResponse } from 'next/server';
import { getStoredFile } from '@/lib/files';

export async function GET(request, { params }) {
  const { key } = await params;
  const blobKey = key.join('/');

  const result = await getStoredFile(blobKey);
  if (!result || !result.data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data, metadata } = result;
  const contentType = metadata?.contentType || 'application/octet-stream';
  const headers = { 'Content-Type': contentType };

  if (contentType === 'application/pdf') {
    const filename = metadata?.originalName || 'card.pdf';
    headers['Content-Disposition'] = `attachment; filename="${filename}"`;
  }

  return new NextResponse(data, { headers });
}
