import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { saveUploadedFile, deletePublicFile } from '@/lib/files';

export async function POST(request, { params }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from('cards')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const form = await request.formData();
  const pdfPath = await saveUploadedFile(form.get('pdf'), 'pdfs');
  if (!pdfPath) {
    return NextResponse.json({ error: 'Missing pdf file' }, { status: 400 });
  }

  await deletePublicFile(existing.pdf_path);

  const { error: updateError } = await supabase
    .from('cards')
    .update({ pdf_path: pdfPath, updated_at: new Date().toISOString() })
    .eq('id', Number(id));

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ pdf_path: pdfPath });
}

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: existing, error } = await supabase
    .from('cards')
    .select('pdf_path')
    .eq('id', Number(id))
    .maybeSingle();

  if (error || !existing || !existing.pdf_path) {
    return NextResponse.json({ error: 'PDF not generated yet' }, { status: 404 });
  }

  return NextResponse.redirect(new URL(existing.pdf_path, request.url));
}
