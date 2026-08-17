'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import { IconList, IconSearch, IconEdit, IconDownload, IconTrash, IconInbox } from '@/components/Icons';
import { generateCardImages, downloadCardImages } from '@/lib/cardImages';
import { getRoleBorderColor } from '@/lib/cardConstants';

export default function RecordsPage() {
  const [cards, setCards] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadCard, setDownloadCard] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  const frontRef = useRef(null);
  const backRef = useRef(null);

  async function load(query) {
    setLoading(true);
    const res = await fetch(`/api/cards${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    const data = await res.json();
    setCards(data);
    setLoading(false);
  }

  useEffect(() => {
    load('');
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this card record? This cannot be undone.')) return;
    await fetch(`/api/cards/${id}`, { method: 'DELETE' });
    load(q);
  }

  function handleDownload(card) {
    setDownloadingId(card.id);
    setDownloadCard(card);
  }

  useEffect(() => {
    if (!downloadCard) return;
    let cancelled = false;

    (async () => {
      try {
        // let the hidden card faces paint before capturing them
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const images = await generateCardImages(frontRef.current, backRef.current);
        if (cancelled) return;

        const baseName = `${(downloadCard.name || 'id-card').replace(/\s+/g, '_')}_${downloadCard.id}`;
        await downloadCardImages(images, baseName);
      } catch (err) {
        console.error(err);
        alert('Failed to generate the images for this card.');
      } finally {
        if (!cancelled) {
          setDownloadCard(null);
          setDownloadingId(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [downloadCard]);

  return (
    <div className="panel">
      <h1>
        <IconList size={20} />
        Saved ID Cards
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
        className="search-row"
      >
        <div className="search-input-wrap">
          <IconSearch size={15} />
          <input
            placeholder="Search by name or Card No."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          <IconSearch size={14} />
          Search
        </button>
      </form>

      {loading ? (
        <div className="state-block">
          <div className="spinner" />
          <p className="state-sub">Loading records…</p>
        </div>
      ) : cards.length === 0 ? (
        <div className="state-block">
          <IconInbox size={40} />
          <p className="state-title">No cards yet</p>
          <p className="state-sub">Cards you generate will show up here.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="records-table">
            <thead>
              <tr>
                <th>Card No.</th>
                <th>Name</th>
                <th>Role</th>
                <th>Designation</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="card-no-pill">#{c.id}</span>
                  </td>
                  <td>{c.name}</td>
                  <td>
                    {c.role && (
                      <span className="role-tag">
                        <span
                          className="role-dot"
                          style={{ background: getRoleBorderColor(c.role) }}
                        />
                        {c.role}
                      </span>
                    )}
                  </td>
                  <td className="designation-cell">{c.designation}</td>
                  <td className="designation-cell">{new Date(c.updated_at).toLocaleString()}</td>
                  <td className="actions">
                    <Link href={`/records/${c.id}`} className="action-btn edit">
                      <IconEdit size={14} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="action-btn download"
                      onClick={() => handleDownload(c)}
                      disabled={downloadingId === c.id}
                    >
                      <IconDownload size={14} />
                      {downloadingId === c.id ? 'Preparing…' : 'Download PNGs'}
                    </button>
                    <button type="button" className="action-btn delete" onClick={() => handleDelete(c.id)}>
                      <IconTrash size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {downloadCard && (
        <div style={{ position: 'absolute', left: -9999, top: 0 }}>
          <CardFront
            ref={frontRef}
            idNo={downloadCard.id}
            name={downloadCard.name}
            role={downloadCard.role}
            designation={downloadCard.designation}
            officeDept={downloadCard.office_dept}
            photoUrl={downloadCard.photo_path}
            signatureUrl={downloadCard.signature_path}
          />
          <CardBack
            ref={backRef}
            role={downloadCard.role}
            homeAddress={downloadCard.home_address}
            dob={downloadCard.dob}
            bloodGroup={downloadCard.blood_group}
            mobile={downloadCard.mobile}
            email={downloadCard.email}
            identificationMark={downloadCard.identification_mark}
            dateOfIssue={downloadCard.date_of_issue}
            validUpto={downloadCard.valid_upto}
          />
        </div>
      )}
    </div>
  );
}
