import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { saveUploadedFile, deletePublicFile } from '@/lib/files';

export async function POST(request, { params }) {
  const { id } = await params;
  const existing = await db.get(`SELECT * FROM cards WHERE id = $1`, [Number(id)]);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const form = await request.formData();
  const pdfPath = await saveUploadedFile(form.get('pdf'), 'pdfs');
  if (!pdfPath) {
    return NextResponse.json({ error: 'Missing pdf file' }, { status: 400 });
  }

  await deletePublicFile(existing.pdf_path);

  await db.run(`UPDATE cards SET pdf_path = $1, updated_at = $2 WHERE id = $3`, [
    pdfPath,
    new Date().toISOString(),
    Number(id),
  ]);

  return NextResponse.json({ pdf_path: pdfPath });
}

export async function GET(request, { params }) {
  const { id } = await params;
  const existing = await db.get(`SELECT * FROM cards WHERE id = $1`, [Number(id)]);
  if (!existing || !existing.pdf_path) {
    return NextResponse.json({ error: 'PDF not generated yet' }, { status: 404 });
  }
  return NextResponse.redirect(new URL(existing.pdf_path, request.url));
}
