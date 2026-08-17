'use client';

import { useEffect, useRef, useState } from 'react';
import CardForm from '@/components/CardForm';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import CardScaler from '@/components/CardScaler';
import { IconIdCard } from '@/components/Icons';
import { generateCardImages, downloadCardImages } from '@/lib/cardImages';
import { DEFAULT_OFFICE_DEPT } from '@/lib/cardConstants';
import { todayDMY, validUptoFromIssue } from '@/lib/dateHelpers';

function getDefaultValues() {
  const issue = todayDMY();
  return {
    name: '',
    role: '',
    designation: '',
    officeDept: DEFAULT_OFFICE_DEPT,
    homeAddress: '',
    dob: '',
    bloodGroup: '',
    mobile: '',
    email: '',
    identificationMark: '',
    dateOfIssue: issue,
    validUpto: validUptoFromIssue(issue),
  };
}

export default function GeneratePage() {
  const [values, setValues] = useState(getDefaultValues);
  const [validUptoTouched, setValidUptoTouched] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState(null);

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
    setCreatedId(null);
    if (field === 'validUpto') {
      setValidUptoTouched(true);
    }
    setValues((v) => {
      const next = { ...v, [field]: value };
      if (field === 'dateOfIssue' && !validUptoTouched) {
        next.validUpto = validUptoFromIssue(value);
      }
      return next;
    });
  }

  function handleReset() {
    setValues(getDefaultValues());
    setValidUptoTouched(false);
    setPhotoFile(null);
    setSignatureFile(null);
    setStatus('');
    setCreatedId(null);
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
      setCreatedId(created.id);

      setStatus('Rendering images…');
      const images = await generateCardImages(frontRef.current, backRef.current);

      const baseName = `${(values.name || 'id-card').replace(/\s+/g, '_')}_${created.id}`;
      await downloadCardImages(images, baseName);

      setStatus(`Saved as Card #${created.id} and PNGs downloaded.`);
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
        <h1>
          <IconIdCard size={20} />
          Generate ID Card
        </h1>
        <CardForm
          values={values}
          onChange={handleChange}
          onPhotoChange={setPhotoFile}
          onSignatureChange={setSignatureFile}
          onSubmit={handleSubmit}
          onReset={handleReset}
          saving={saving}
          submitLabel="Save & Download PNGs"
          cardNo={createdId}
        />
        {status && <p className="status-msg">{status}</p>}
      </section>

      <section className="panel preview-panel">
        <h2>Live Preview</h2>
        <div className="preview-stack">
          <div className="preview-card-wrap">
            <div className="preview-label">Front</div>
            <CardScaler>
              <CardFront
                ref={frontRef}
                idNo={createdId ?? '—'}
                name={values.name}
                role={values.role}
                designation={values.designation}
                officeDept={values.officeDept}
                photoUrl={photoUrl}
                signatureUrl={signatureUrl}
              />
            </CardScaler>
          </div>
          <div className="preview-card-wrap">
            <div className="preview-label">Back</div>
            <CardScaler>
              <CardBack
                ref={backRef}
                role={values.role}
                homeAddress={values.homeAddress}
                dob={values.dob}
                bloodGroup={values.bloodGroup}
                mobile={values.mobile}
                email={values.email}
                identificationMark={values.identificationMark}
                dateOfIssue={values.dateOfIssue}
                validUpto={values.validUpto}
              />
            </CardScaler>
          </div>
        </div>
      </section>
    </div>
  );
}
