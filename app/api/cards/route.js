import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { saveUploadedFile } from '@/lib/files';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const supabase = getSupabaseAdmin();

  let query = supabase.from('cards').select('*').order('updated_at', { ascending: false });
  if (q) {
    const safe = q.replace(/[,()]/g, ' ').trim();
    if (safe) {
      query = query.or(`name.ilike.%${safe}%,id_no.ilike.%${safe}%`);
    }
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const form = await request.formData();
  const fields = extractFields(form);

  const photoPath = await saveUploadedFile(form.get('photo'), 'photos');
  const signaturePath = await saveUploadedFile(form.get('signature'), 'signatures');

  const now = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('cards')
    .insert({
      id_no: fields.idNo,
      name: fields.name,
      designation: fields.designation,
      office_dept: fields.officeDept,
      photo_path: photoPath,
      signature_path: signaturePath,
      home_address: fields.homeAddress,
      dob: fields.dob,
      blood_group: fields.bloodGroup,
      mobile: fields.mobile,
      email: fields.email,
      identification_mark: fields.identificationMark,
      date_of_issue: fields.dateOfIssue,
      valid_upto: fields.validUpto,
      created_at: now,
      updated_at: now,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id }, { status: 201 });
}

function extractFields(form) {
  const get = (name) => {
    const v = form.get(name);
    return typeof v === 'string' ? v : '';
  };
  return {
    idNo: get('idNo'),
    name: get('name'),
    designation: get('designation'),
    officeDept: get('officeDept'),
    homeAddress: get('homeAddress'),
    dob: get('dob'),
    bloodGroup: get('bloodGroup'),
    mobile: get('mobile'),
    email: get('email'),
    identificationMark: get('identificationMark'),
    dateOfIssue: get('dateOfIssue'),
    validUpto: get('validUpto'),
  };
}
