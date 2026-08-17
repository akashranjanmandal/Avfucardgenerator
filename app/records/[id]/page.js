'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import CardForm from '@/components/CardForm';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import { generateCardPdf } from '@/lib/pdf';

export default function EditCardPage() {
  const { id } = useParams();

  const [values, setValues] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [existingSignatureUrl, setExistingSignatureUrl] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    fetch(`/api/cards/${id}`)
      .then((r) => r.json())
      .then((card) => {
        setValues({
          idNo: card.id_no || '',
          name: card.name || '',
          designation: card.designation || '',
          officeDept: card.office_dept || '',
          homeAddress: card.home_address || '',
          dob: card.dob || '',
          bloodGroup: card.blood_group || '',
          mobile: card.mobile || '',
          email: card.email || '',
          identificationMark: card.identification_mark || '',
          dateOfIssue: card.date_of_issue || '',
          validUpto: card.valid_upto || '',
        });
        setExistingPhotoUrl(card.photo_path || null);
        setExistingSignatureUrl(card.signature_path || null);
      });
  }, [id]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoUrl(existingPhotoUrl);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile, existingPhotoUrl]);

  useEffect(() => {
    if (!signatureFile) {
      setSignatureUrl(existingSignatureUrl);
      return;
    }
    const url = URL.createObjectURL(signatureFile);
    setSignatureUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [signatureFile, existingSignatureUrl]);

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus('Updating record…');
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (photoFile) fd.append('photo', photoFile);
      if (signatureFile) fd.append('signature', signatureFile);

      const res = await fetch(`/api/cards/${id}`, { method: 'PUT', body: fd });
      if (!res.ok) throw new Error('Failed to update card record.');

      setStatus('Regenerating PDF…');
      const pdfBlob = await generateCardPdf(frontRef.current, backRef.current);
      const pdfFd = new FormData();
      pdfFd.append('pdf', pdfBlob, `${values.idNo || id}.pdf`);
      const pdfRes = await fetch(`/api/cards/${id}/pdf`, { method: 'POST', body: pdfFd });
      if (!pdfRes.ok) throw new Error('Card was updated, but storing the PDF failed.');

      setStatus('Updated successfully.');
    } catch (err) {
      console.error(err);
      setStatus(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (!values) {
    return <div className="panel">Loading…</div>;
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <h1>Edit ID Card</h1>
        <CardForm
          values={values}
          onChange={handleChange}
          onPhotoChange={setPhotoFile}
          onSignatureChange={setSignatureFile}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Update & Regenerate PDF"
        />
        {status && <p className="status-msg">{status}</p>}
      </section>

      <section className="panel preview-panel">
        <h2>Live Preview</h2>
        <div className="preview-stack">
          <div>
            <div className="preview-label">Front</div>
            <CardFront
              ref={frontRef}
              idNo={values.idNo}
              name={values.name}
              designation={values.designation}
              officeDept={values.officeDept}
              photoUrl={photoUrl}
              signatureUrl={signatureUrl}
            />
          </div>
          <div>
            <div className="preview-label">Back</div>
            <CardBack
              ref={backRef}
              homeAddress={values.homeAddress}
              dob={values.dob}
              bloodGroup={values.bloodGroup}
              mobile={values.mobile}
              email={values.email}
              identificationMark={values.identificationMark}
              dateOfIssue={values.dateOfIssue}
              validUpto={values.validUpto}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
