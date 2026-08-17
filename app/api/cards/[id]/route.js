import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { saveUploadedFile, deletePublicFile } from '@/lib/files';

export async function GET(request, { params }) {
  const { id } = await params;
  const row = await db.get(`SELECT * FROM cards WHERE id = $1`, [Number(id)]);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const existing = await db.get(`SELECT * FROM cards WHERE id = $1`, [Number(id)]);
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

  const now = new Date().toISOString();

  await db.run(
    `UPDATE cards SET
      id_no = $1, name = $2, designation = $3, office_dept = $4, photo_path = $5, signature_path = $6,
      home_address = $7, dob = $8, blood_group = $9, mobile = $10, email = $11, identification_mark = $12,
      date_of_issue = $13, valid_upto = $14, updated_at = $15
    WHERE id = $16`,
    [
      get('idNo'),
      get('name'),
      get('designation'),
      get('officeDept'),
      photoPath,
      signaturePath,
      get('homeAddress'),
      get('dob'),
      get('bloodGroup'),
      get('mobile'),
      get('email'),
      get('identificationMark'),
      get('dateOfIssue'),
      get('validUpto'),
      now,
      Number(id),
    ]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const existing = await db.get(`SELECT * FROM cards WHERE id = $1`, [Number(id)]);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await deletePublicFile(existing.photo_path);
  await deletePublicFile(existing.signature_path);
  await deletePublicFile(existing.pdf_path);

  await db.run(`DELETE FROM cards WHERE id = $1`, [Number(id)]);
  return NextResponse.json({ ok: true });
}
