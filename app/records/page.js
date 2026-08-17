'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import { generateCardPdf } from '@/lib/pdf';

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
        const pdfBlob = await generateCardPdf(frontRef.current, backRef.current);
        if (cancelled) return;

        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(downloadCard.name || 'id-card').replace(/\s+/g, '_')}_${downloadCard.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
        alert('Failed to generate the PDF for this card.');
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
      <h1>Saved ID Cards</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
        className="search-row"
      >
        <input
          placeholder="Search by name or Card No."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="table-scroll">
          <table className="records-table">
            <thead>
              <tr>
                <th>Card No.</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.designation}</td>
                  <td>{new Date(c.updated_at).toLocaleString()}</td>
                  <td className="actions">
                    <Link href={`/records/${c.id}`}>Edit</Link>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => handleDownload(c)}
                      disabled={downloadingId === c.id}
                    >
                      {downloadingId === c.id ? 'Preparing…' : 'Download PDF'}
                    </button>
                    <button type="button" className="danger-btn" onClick={() => handleDelete(c.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {cards.length === 0 && (
                <tr>
                  <td colSpan={5}>No records found.</td>
                </tr>
              )}
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
            designation={downloadCard.designation}
            officeDept={downloadCard.office_dept}
            photoUrl={downloadCard.photo_path}
            signatureUrl={downloadCard.signature_path}
          />
          <CardBack
            ref={backRef}
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
