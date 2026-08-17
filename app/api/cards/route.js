import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { saveUploadedFile } from '@/lib/files';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  let rows;
  if (q) {
    const like = `%${q}%`;
    rows = await db.all(
      `SELECT * FROM cards WHERE name ILIKE $1 OR id_no ILIKE $2 ORDER BY updated_at DESC`,
      [like, like]
    );
  } else {
    rows = await db.all(`SELECT * FROM cards ORDER BY updated_at DESC`);
  }

  return NextResponse.json(rows);
}

export async function POST(request) {
  const form = await request.formData();
  const fields = extractFields(form);

  const photoPath = await saveUploadedFile(form.get('photo'), 'photos');
  const signaturePath = await saveUploadedFile(form.get('signature'), 'signatures');

  const now = new Date().toISOString();

  const rows = await db.run(
    `INSERT INTO cards (
      id_no, name, designation, office_dept, photo_path, signature_path,
      home_address, dob, blood_group, mobile, email, identification_mark,
      date_of_issue, valid_upto, pdf_path, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NULL, $15, $16)
    RETURNING id`,
    [
      fields.idNo,
      fields.name,
      fields.designation,
      fields.officeDept,
      photoPath,
      signaturePath,
      fields.homeAddress,
      fields.dob,
      fields.bloodGroup,
      fields.mobile,
      fields.email,
      fields.identificationMark,
      fields.dateOfIssue,
      fields.validUpto,
      now,
      now,
    ]
  );

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
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
