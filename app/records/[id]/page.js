'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import CardForm from '@/components/CardForm';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import CardScaler from '@/components/CardScaler';
import { IconFlip, IconInbox } from '@/components/Icons';
import { generateCardImages, downloadCardImages } from '@/lib/cardImages';
import { validUptoFromIssue } from '@/lib/dateHelpers';

export default function EditCardPage() {
  const { id } = useParams();

  const [values, setValues] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [validUptoTouched, setValidUptoTouched] = useState(false);
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
        if (card.error) {
          setNotFound(true);
          return;
        }
        setValues({
          name: card.name || '',
          role: card.role || '',
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
      })
      .catch(() => setNotFound(true));
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

      setStatus('Rendering images…');
      const images = await generateCardImages(frontRef.current, backRef.current);

      const baseName = `${(values.name || 'id-card').replace(/\s+/g, '_')}_${id}`;
      await downloadCardImages(images, baseName);

      setStatus('Updated and PNGs downloaded.');
    } catch (err) {
      console.error(err);
      setStatus(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (notFound) {
    return (
      <div className="panel">
        <div className="state-block">
          <IconInbox size={40} />
          <p className="state-title">Card not found</p>
          <p className="state-sub">This card may have been deleted. Go back to Records to pick another one.</p>
        </div>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="panel">
        <div className="state-block">
          <div className="spinner" />
          <p className="state-sub">Loading card…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <h1>
          <IconFlip size={20} />
          Edit ID Card
        </h1>
        <CardForm
          values={values}
          onChange={handleChange}
          onPhotoChange={setPhotoFile}
          onSignatureChange={setSignatureFile}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Update & Download PNGs"
          cardNo={id}
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
                idNo={id}
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
