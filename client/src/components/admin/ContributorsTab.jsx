import { useState, useEffect } from 'react';
import { fmtUZS } from '../../utils/pricing';
import { formatUzPhone } from '../../utils/phoneFormat';

function fmtCard(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 16);
  return d.replace(/(.{4})/g, '$1 ').trim();
}
function fmtExpiry(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + '/' + d.slice(2);
}
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';

function IconX({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconUsers({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function IconWallet({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
}
function IconTrendingUp({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function IconInbox({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}
function IconAlert({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function IconTrash({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}

function EarningsDrawer({ contributor, onClose }) {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contributors/${contributor.id}/earnings`)
      .then(r => r.json())
      .then(d => { setRows(d); setLoading(false); });
  }, [contributor.id]);

  const TYPE = { buy: 'Xarid', rent: 'Ijara' };

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-2xl animate-fade-in-scale">

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900">{contributor.name} — Daromadlar</h3>
            <p className="text-xs text-slate-400 mt-0.5">Faqat tasdiqlangan tranzaksiyalar</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition text-lg leading-none p-1 rounded-lg hover:bg-slate-50"><IconX className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {loading && (
            <div className="flex items-center justify-center py-8 gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-slate-200 animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
              <p className="text-sm text-slate-400">Yuklanmoqda…</p>
            </div>
          )}
          {!loading && rows.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                <IconInbox className="w-5 h-5 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400">Hali tasdiqlangan daromad yo'q.</p>
            </div>
          )}
          {!loading && rows.map(row => (
            <div key={row.id} className="flex items-center justify-between py-3.5 border-b border-slate-50 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{row.book_title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {TYPE[row.type] || row.type}
                  {row.rental_days ? ` · ${row.rental_days} kun` : ''}
                  {` · ${fmtUZS(row.price)} · ${(row.reward_percentage * 100).toFixed(0)}%`}
                </p>
                <p className="text-xs text-slate-300">{new Date(row.created_at).toLocaleDateString('uz-UZ')}</p>
              </div>
              <span className="font-black text-violet-600 whitespace-nowrap">+{fmtUZS(row.reward_amount)}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 flex justify-between items-center border-t border-slate-100 animate-gradient"
          style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', backgroundSize: '200% 200%' }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-1">Jami qarzdorlik</p>
            <p className="text-2xl font-black text-violet-700">{fmtUZS(contributor.total_earnings_owed)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Jami to'langan</p>
            <p className="text-sm font-bold text-slate-600">{fmtUZS(contributor.total_earnings_paid)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContributorsTab({ contributors, setContributors, books = [], subPage = 'list' }) {
  const [form,    setForm]    = useState({ name: '', contact: '+998 ', address: '', card_number: '', card_expiry: '', card_type: '' });
  const [payModal, setPayModal] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [created, setCreated] = useState(null);
  const [paying, setPaying] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [error,  setError]  = useState(null);
  const [editId, setEditId]  = useState(null);
  const [editForm, setEditForm] = useState({ name: '', contact: '+998 ' });
  const [editSaving, setEditSaving] = useState(false);
  const [filter, setFilter] = useState('all'); // all | owed | active | paid
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const totalOwed = contributors.reduce((s, c) => s + c.total_earnings_owed, 0);

  const bookCounts = contributors.map(c => ({
    ...c,
    bookCount: books.filter(b => b.contributor_id === c.id).length,
  })).sort((a, b) => b.bookCount - a.bookCount);

  const filteredContributors = contributors.filter(c => {
    if (filter === 'owed') return c.total_earnings_owed > 0;
    if (filter === 'active') return c.total_earnings_owed > 0;
    if (filter === 'paid') return c.total_earnings_paid > 0;
    return true;
  });

  async function addContributor(e) {
    e.preventDefault(); setSaving(true); setError(null);
    try {
      const res = await fetch('/api/contributors', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), contact: form.contact.trim(), address: form.address.trim(), card_number: form.card_number.trim(), card_expiry: form.card_expiry.trim(), card_type: form.card_type }),
      });
      const contributor = await res.json();
      if (!res.ok) throw new Error(contributor.error);
      setContributors(p => [...p, contributor]);
      setForm({ name: '', contact: '+998 ', address: '', card_number: '', card_expiry: '', card_type: '' });
      setCreated(contributor);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function markPaid(c) {
    setPaying(c.id);
    setError(null);
    try {
      const res = await fetch(`/api/contributors/${c.id}/pay`, { method: 'POST' });
      const upd = await res.json();
      if (!res.ok) throw new Error(upd.error);
      setContributors(p => p.map(x => x.id === upd.id ? upd : x));
    } catch (err) { setError(err.message); setTimeout(() => setError(null), 4000); }
    finally { setPaying(null); }
  }

  async function saveEdit(e) {
    e.preventDefault();
    setEditSaving(true);
    try {
      const res = await fetch(`/api/contributors/${editId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name.trim(), contact: editForm.contact.trim() }),
      });
      const upd = await res.json();
      if (!res.ok) throw new Error(upd.error);
      setContributors(p => p.map(x => x.id === upd.id ? upd : x));
      setEditId(null);
    } catch (err) { setError(err.message); setTimeout(() => setError(null), 4000); }
    finally { setEditSaving(false); }
  }

  async function handleDelete(id) {
    setDeleteLoading(true);
    try {
      await fetch(`/api/contributors/${id}`, { method: 'DELETE' });
      setContributors(p => p.filter(x => x.id !== id));
      setDeleting(null);
    } catch (err) { setError(err.message); setTimeout(() => setError(null), 4000); }
    finally { setDeleteLoading(false); }
  }

  return (
    <div>
      {/* ══════════ PAGE: Umumiy ro'yxat ══════════ */}
      {subPage === 'list' && (
        <div>
          {contributors.length === 0 ? (
            <div className="py-16 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                <IconUsers className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400">Hali hissador yo'q.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">#</th>
                    <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hissador</th>
                    <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Jamg'arilgan summa</th>
                    <th className="text-center py-3 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.map((c, i) => (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-300">{i + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 animate-gradient"
                            style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                            {c.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs leading-tight truncate">{c.name}</p>
                            {c.contact && <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{c.contact}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-sm font-black text-violet-600">{fmtUZS(c.total_earnings_owed + c.total_earnings_paid)}</span>
                        {c.total_earnings_owed > 0 && (
                          <p className="text-[10px] text-amber-500 mt-0.5">{fmtUZS(c.total_earnings_owed)} to'lanmagan</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button onClick={() => { setEditId(c.id); setEditForm({ name: c.name, contact: c.contact || '+998 ' }); }}
                            className="btn btn-ghost px-3 py-1.5 rounded-lg text-[11px] font-semibold">Tahrirlash</button>
                          <button onClick={() => setPayModal(c)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-100 hover:bg-violet-100 transition-colors">
                            Summani to'lash
                          </button>
                          <button onClick={() => setDeleting(c)}
                            className="btn btn-danger px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1">
                            <IconTrash className="w-3 h-3"/> O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════ PAGE: Hissador yaratish ══════════ */}
      {subPage === 'create' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-lg p-8">

            {/* ── Success state ── */}
            {created ? (
              <div className="flex flex-col items-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 animate-gradient"
                  style={{ background: 'linear-gradient(135deg,#0284c7,#0ea5e9)', backgroundSize: '200% 200%' }}>
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Hissador yaratildi!</h2>
                <p className="text-sm text-slate-400 mb-1">{created.name}</p>
                {created.contact && <p className="text-xs text-slate-300 mb-1">{created.contact}</p>}
                {created.address && <p className="text-xs text-slate-300 mb-6">{created.address}</p>}
                {!created.contact && !created.address && <div className="mb-6" />}
                <button
                  onClick={() => setCreated(null)}
                  className="w-full py-3.5 rounded-2xl text-sm font-black text-white animate-gradient"
                  style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                  + Yana qo'shish
                </button>
              </div>
            ) : (
              <>
                {/* header */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 animate-gradient"
                    style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                    <IconUsers className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 text-center">Yangi Hissador</h2>
                  <p className="text-xs text-slate-400 mt-1 text-center">Quyidagi ma'lumotlarni to'ldiring</p>
                </div>

                {error && (
                  <p className="text-xs mb-5 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-500 flex items-center gap-1.5">
                    <IconAlert className="w-3.5 h-3.5"/> {error}
                  </p>
                )}

                <form onSubmit={addContributor} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">To'liq ismi *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Masalan: KARIMOV ALISHER" className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Telefon raqam</label>
                    <input value={form.contact} onChange={e => set('contact', formatUzPhone(e.target.value))}
                      placeholder="+998 90 123 45 67" type="tel" className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Manzil</label>
                    <input value={form.address} onChange={e => set('address', e.target.value)}
                      placeholder="Masalan: Namangan sh., Uychi ko'ch. 12" className="input-dark" />
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Bank kartasi (ixtiyoriy)</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Karta raqami</label>
                        <input value={form.card_number} onChange={e => set('card_number', fmtCard(e.target.value))}
                          placeholder="XXXX XXXX XXXX XXXX" maxLength={19} className="input-dark font-mono tracking-widest" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Muddati</label>
                          <input value={form.card_expiry} onChange={e => set('card_expiry', fmtExpiry(e.target.value))}
                            placeholder="MM/YY" maxLength={5} className="input-dark font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Karta turi</label>
                          <select value={form.card_type} onChange={e => set('card_type', e.target.value)} className="input-dark">
                            <option value="">— Tanlang —</option>
                            <option value="Humo">Humo</option>
                            <option value="UZCARD">UZCARD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={saving}
                    className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient mt-2"
                    style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                    {saving ? "Qo'shilmoqda…" : "+ Hissador qo'shish"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════ PAGE: Liderlar doskasi ══════════ */}
      {subPage === 'liderlar' && (
        <div>
          {/* summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Jami hissadorlar</p>
              <p className="text-2xl font-black text-slate-900">{contributors.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Jami kitoblar</p>
              <p className="text-2xl font-black text-slate-900">{bookCounts.reduce((s, c) => s + c.bookCount, 0)} ta</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Eng faol</p>
              <p className="text-sm font-black text-slate-900 truncate">{bookCounts[0]?.name || '—'}</p>
            </div>
          </div>

          {/* two-column: table left, chart right */}
          <div className="flex gap-4" style={{ minWidth: 0 }}>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto" style={{ flex: '1 1 0', minWidth: 0 }}>
              <div className="px-5 py-4 border-b border-slate-100 text-center">
                <h3 className="text-sm font-black text-slate-900">🏆 Liderlar jadvali</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Eng ko'p kitob hadya qilganlar</p>
              </div>
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '40px' }} />
                  <col />
                  <col style={{ width: '68px' }} />
                  <col style={{ width: '72px' }} />
                  <col style={{ width: '72px' }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-center py-2.5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">O'rin</th>
                    <th className="text-left   py-2.5 px-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Hissador</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Kitob</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">To'landi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookCounts.map((c, i) => {
                    const rankBg = i === 0 ? 'bg-amber-50/50' : i === 1 ? 'bg-slate-50/30' : i === 2 ? 'bg-orange-50/30' : '';
                    const medal = ['🥇', '🥈', '🥉'][i] ?? null;
                    return (
                      <tr key={c.id} className={`border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50 ${rankBg}`}>
                        <td className="py-3 px-2 text-center">
                          {medal
                            ? <span className="text-base">{medal}</span>
                            : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black text-slate-400">{i + 1}</span>
                          }
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white animate-gradient shrink-0"
                              style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs leading-tight truncate">{c.name}</p>
                              {c.contact && <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{c.contact}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-black bg-sky-50 text-sky-600 border border-sky-100">
                            {c.bookCount}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-xs font-bold text-violet-600 whitespace-nowrap">{fmtUZS(c.total_earnings_paid)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Horizontal bar chart ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col" style={{ flex: '1 1 0', minWidth: 0 }}>
              <div className="mb-5 text-center">
                <h3 className="text-sm font-black text-slate-900 mb-0.5">📊 Kitoblar taqsimoti</h3>
                <p className="text-[11px] text-slate-400">Har bir hissadordagi kitoblar ulushi</p>
              </div>

              {(() => {
                const total = bookCounts.reduce((s, c) => s + c.bookCount, 0) || 1;
                const BARS = [
                  { gradient: 'linear-gradient(90deg,#1e40af,#0ea5e9)', glow: 'rgba(14,165,233,0.25)' },
                  { gradient: 'linear-gradient(90deg,#0369a1,#38bdf8)', glow: 'rgba(56,189,248,0.2)' },
                  { gradient: 'linear-gradient(90deg,#0c4a6e,#0284c7)', glow: 'rgba(2,132,199,0.2)' },
                  { gradient: 'linear-gradient(90deg,#075985,#7dd3fc)', glow: 'rgba(125,211,252,0.2)' },
                ];
                return (
                  <div className="flex flex-col gap-4 flex-1 justify-center">
                    {bookCounts.map((c, i) => {
                      const pct = Math.round((c.bookCount / total) * 100);
                      const { gradient, glow } = BARS[i % BARS.length];
                      const medal = ['🥇', '🥈', '🥉'][i] ?? null;
                      return (
                        <div key={c.id}>
                          {/* name row */}
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                                style={{ background: gradient }}>
                                {c.name.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-slate-800 truncate">{c.name}</span>
                              {medal && <span className="text-sm shrink-0">{medal}</span>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-xs font-black text-slate-500">{c.bookCount} ta</span>
                              <span className="text-[10px] font-bold text-slate-300">{pct}%</span>
                            </div>
                          </div>
                          {/* bar track */}
                          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                background: gradient,
                                boxShadow: `0 2px 8px ${glow}`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* total footer */}
                    <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jami</span>
                      <span className="text-lg font-black text-slate-900">{total} <span className="text-xs font-bold text-slate-400">ta kitob</span></span>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in" style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="w-full max-w-sm rounded-3xl p-7 bg-white border border-slate-100 shadow-2xl animate-fade-in-scale">
            <h3 className="font-black text-slate-900 text-base mb-5">Hissadorni tahrirlash</h3>
            <form onSubmit={saveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Ism</label>
                <input required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input-dark" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Aloqa</label>
                <input value={editForm.contact} onChange={e => setEditForm(p => ({ ...p, contact: formatUzPhone(e.target.value) }))} className="input-dark" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditId(null)} className="btn btn-ghost flex-1 py-2.5 rounded-xl text-sm">Bekor qilish</button>
                <button type="submit" disabled={editSaving} className="btn btn-primary flex-1 py-2.5 rounded-xl text-sm">{editSaving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {drawer && (
        <EarningsDrawer
          contributor={contributors.find(c => c.id === drawer.id) || drawer}
          onClose={() => setDrawer(null)}
        />
      )}

      {/* ── Payment modal ── */}
      {payModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in"
          style={{ background: 'rgba(15,23,42,0.5)' }} onClick={() => setPayModal(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-100 shadow-2xl p-7 animate-fade-in-scale"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900 text-base">Summani to'lash</h3>
              <button onClick={() => setPayModal(null)} className="text-slate-300 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-50">
                <IconX className="w-5 h-5"/>
              </button>
            </div>

            {/* Contributor info */}
            <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                {payModal.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{payModal.name}</p>
                {payModal.contact && <p className="text-[11px] text-slate-400">{payModal.contact}</p>}
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-2xl p-5 text-center mb-5 animate-gradient"
              style={{ background: 'var(--nis-gradient-soft)', backgroundSize: '200% 200%' }}>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">To'lanadigan summa</p>
              <p className="text-white font-black text-3xl">{fmtUZS(payModal.total_earnings_owed)}</p>
            </div>

            {/* Card info */}
            {payModal.card_number ? (
              <div className="mb-5 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank kartasi</span>
                  {payModal.card_type && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-100">
                      {payModal.card_type}
                    </span>
                  )}
                </div>
                <p className="font-mono font-bold text-slate-900 tracking-widest">{payModal.card_number}</p>
                {payModal.card_expiry && <p className="text-xs text-slate-400 mt-0.5">Muddati: {payModal.card_expiry}</p>}
              </div>
            ) : (
              <div className="mb-5 p-3 rounded-2xl border border-amber-100 bg-amber-50 text-xs text-amber-600 font-medium">
                ⚠ Karta ma'lumotlari kiritilmagan
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 transition-all bg-white">
                Bekor qilish
              </button>
              <button onClick={() => { markPaid(payModal); setPayModal(null); }} disabled={paying === payModal.id}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                {paying === payModal.id ? "To'lanmoqda…" : "To'lash ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in"
          style={{ background: 'rgba(15,23,42,0.5)' }}>
          <div className="w-full max-w-sm rounded-3xl p-7 bg-white border border-slate-100 shadow-2xl animate-fade-in-scale">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <IconAlert className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-black text-slate-900 mb-2 text-center">Hissadorni o'chirish?</h3>
            <p className="text-sm text-slate-400 mb-6 text-center">
              <strong className="text-slate-700">"{deleting.name}"</strong> o'chiriladi. Barcha kitoblari kutubxona kitobiga aylanadi.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="btn btn-ghost flex-1 py-2.5 rounded-xl text-sm">Bekor qilish</button>
              <button onClick={() => handleDelete(deleting.id)} disabled={deleteLoading} className="btn btn-danger flex-1 py-2.5 rounded-xl text-sm font-semibold">{deleteLoading ? 'Oʻchirilmoqda…' : 'Oʻchirish'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, active, onClick, gradient }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${active ? 'animate-gradient' : ''}`}
      style={active
        ? { background: gradient, backgroundSize: '200% 200%', borderColor: 'transparent' }
        : { background: 'white', borderColor: 'var(--border-subtle)' }
      }
      onClick={onClick}>
      <div className="flex items-center gap-2 mb-2">
        {Icon && (
          <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white">
            <Icon className="w-3.5 h-3.5" style={{ color: active ? 'var(--primary)' : 'var(--text-tertiary)' }} />
          </div>
        )}
        <p className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: active ? 'rgba(255,255,255,0.9)' : 'var(--text-tertiary)' }}>{label}</p>
      </div>
      <p className="text-xl font-black"
        style={{ color: active ? 'white' : 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

function MiniStat({ label, value, highlight }) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-black" style={{ color: highlight ? '#7c3aed' : '#475569' }}>{value}</p>
    </div>
  );
}
