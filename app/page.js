'use client';

import { useEffect, useRef, useState } from 'react';
import CardForm from '@/components/CardForm';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import { generateCardPdf } from '@/lib/pdf';
import { DEFAULT_OFFICE_DEPT } from '@/lib/cardConstants';

const emptyValues = {
  idNo: '',
  name: '',
  designation: '',
  officeDept: DEFAULT_OFFICE_DEPT,
  homeAddress: '',
  dob: '',
  bloodGroup: '',
  mobile: '',
  email: '',
  identificationMark: '',
  dateOfIssue: '',
  validUpto: '',
};

export default function GeneratePage() {
  const [values, setValues] = useState(emptyValues);
  const [photoFile, setPhotoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    if (!photoFile) {
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  useEffect(() => {
    if (!signatureFile) {
      setSignatureUrl(null);
      return;
    }
    const url = URL.createObjectURL(signatureFile);
    setSignatureUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [signatureFile]);

  function handleChange(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleReset() {
    setValues(emptyValues);
    setPhotoFile(null);
    setSignatureFile(null);
    setStatus('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus('Saving record…');
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (photoFile) fd.append('photo', photoFile);
      if (signatureFile) fd.append('signature', signatureFile);

      const res = await fetch('/api/cards', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Failed to save card record.');
      const created = await res.json();

      setStatus('Rendering PDF…');
      const pdfBlob = await generateCardPdf(frontRef.current, backRef.current);

      const pdfFd = new FormData();
      pdfFd.append('pdf', pdfBlob, `${values.idNo || created.id}.pdf`);
      const pdfRes = await fetch(`/api/cards/${created.id}/pdf`, { method: 'POST', body: pdfFd });
      if (!pdfRes.ok) throw new Error('Card was saved, but storing the PDF failed.');

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${(values.name || 'id-card').replace(/\s+/g, '_')}_${values.idNo || created.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(downloadUrl);

      setStatus('Saved to records and PDF downloaded.');
    } catch (err) {
      console.error(err);
      setStatus(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <h1>Generate ID Card</h1>
        <CardForm
          values={values}
          onChange={handleChange}
          onPhotoChange={setPhotoFile}
          onSignatureChange={setSignatureFile}
          onSubmit={handleSubmit}
          onReset={handleReset}
          saving={saving}
          submitLabel="Save & Generate PDF"
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
