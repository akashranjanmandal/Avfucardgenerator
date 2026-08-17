import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { saveUploadedFile, deletePublicFile } from '@/lib/files';

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('cards').select('*').eq('id', Number(id)).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(request, { params }) {
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
  const get = (name) => {
    const v = form.get(name);
    return typeof v === 'string' ? v : '';
  };

  let photoPath = existing.photo_path;
  const newPhoto = await saveUploadedFile(form.get('photo'), 'photos');
  if (newPhoto) {
    await deletePublicFile(existing.photo_path);
    photoPath = newPhoto;
  }

  let signaturePath = existing.signature_path;
  const newSignature = await saveUploadedFile(form.get('signature'), 'signatures');
  if (newSignature) {
    await deletePublicFile(existing.signature_path);
    signaturePath = newSignature;
  }

  const { error: updateError } = await supabase
    .from('cards')
    .update({
      name: get('name'),
      designation: get('designation'),
      office_dept: get('officeDept'),
      photo_path: photoPath,
      signature_path: signaturePath,
      home_address: get('homeAddress'),
      dob: get('dob'),
      blood_group: get('bloodGroup'),
      mobile: get('mobile'),
      email: get('email'),
      identification_mark: get('identificationMark'),
      date_of_issue: get('dateOfIssue'),
      valid_upto: get('validUpto'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', Number(id));

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await supabase
    .from('cards')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();
  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await deletePublicFile(existing.photo_path);
  await deletePublicFile(existing.signature_path);

  const { error: deleteError } = await supabase.from('cards').delete().eq('id', Number(id));
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
