'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecordsPage() {
  const [cards, setCards] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

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
          placeholder="Search by name or ID No."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>ID No.</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id}>
                <td>{c.id_no}</td>
                <td>{c.name}</td>
                <td>{c.designation}</td>
                <td>{new Date(c.updated_at).toLocaleString()}</td>
                <td className="actions">
                  <Link href={`/records/${c.id}`}>Edit</Link>
                  {c.pdf_path ? (
                    <a href={`/api/cards/${c.id}/pdf`}>Download PDF</a>
                  ) : (
                    <span className="muted">No PDF yet</span>
                  )}
                  <button type="button" onClick={() => handleDelete(c.id)}>
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
      )}
    </div>
  );
}
