import { useState } from 'react';
import { fmtUZS } from '../../utils/pricing';

function IconCheck({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IconX({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconInbox({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}

const STATUS_STYLE = {
  pending:   { background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', color: 'var(--warning)' },
  confirmed: { background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' },
  rejected:  { background: 'var(--danger-bg)',  border: '1px solid var(--danger-border)',  color: 'var(--danger)' },
  returned:  { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' },
};
const STATUS_LABEL = { pending: 'Kutilmoqda', confirmed: 'Tasdiqlangan', rejected: 'Rad etilgan', returned: 'Qaytarildi' };
const TYPE_LABEL   = { buy: 'Xarid', rent: 'Ijara' };
const BOOK_STATUS  = { buy: 'sold', rent: 'rented' };

const FILTER_OPTS = [
  ['all',       'Barchasi'],
  ['pending',   'Kutilmoqda'],
  ['confirmed', 'Tasdiqlangan'],
  ['rejected',  'Rad etilgan'],
  ['sold',      'Sotilgan'],
  ['rented',    'Ijarada'],
];

export default function TransactionsTab({ transactions, setTransactions }) {
  const [filter,  setFilter]  = useState('all');
  const [loading, setLoading] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const visible = filter === 'all'    ? transactions
    : filter === 'rented' ? transactions.filter(t => t.type === 'rent' && t.status === 'confirmed')
    : filter === 'sold'   ? transactions.filter(t => t.type === 'buy'  && t.status === 'confirmed')
    : transactions.filter(t => t.status === filter);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const rentedCount  = transactions.filter(t => t.type === 'rent' && t.status === 'confirmed').length;
  const soldCount    = transactions.filter(t => t.type === 'buy'  && t.status === 'confirmed').length;

  const [errorId, setErrorId] = useState(null);

  const allVisibleSelected = visible.length > 0 && visible.every(t => selectedIds.has(t.id));

  function enterDeleteMode() {
    setDeleteMode(true);
    setSelectedIds(new Set());
  }

  function cancelDeleteMode() {
    setDeleteMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        visible.forEach(t => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        visible.forEach(t => next.add(t.id));
        return next;
      });
    }
  }

  async function handleDelete() {
    setConfirmLoading(true);
    try {
      const ids = Array.from(selectedIds);
      const res = await fetch('/api/transactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids.length > 0 ? { ids } : {}),
      });
      if (!res.ok) throw new Error();
      if (ids.length > 0) {
        setTransactions(prev => prev.filter(t => !selectedIds.has(t.id)));
      } else {
        setTransactions([]);
      }
      setSelectedIds(new Set());
      setShowConfirm(false);
      setDeleteMode(false);
    } catch {
      alert("O'chirishda xatolik yuz berdi");
    } finally {
      setConfirmLoading(false);
    }
  }

  async function updateStatus(txn, status) {
    setLoading(txn.id);
    setErrorId(null);
    try {
      const book_status = status === 'confirmed' ? BOOK_STATUS[txn.type]
                        : status === 'returned'  ? 'available'
                        : undefined;
      const res = await fetch(`/api/transactions/${txn.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, book_status }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Xatolik');
      const updated = await res.json();
      setTransactions(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
    } catch (err) {
      setErrorId(txn.id);
      setTimeout(() => setErrorId(null), 3000);
    } finally { setLoading(null); }
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTS.map(([val, lbl]) => {
          const active = filter === val;
          return (
            <button key={val} onClick={() => setFilter(val)}
              className="btn flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={active
                ? { background: 'var(--nis-gradient)', color: 'white', backgroundSize: '200% 200%' }
                : { background: 'var(--bg-subtle)', color: 'var(--text-tertiary)', border: '1.5px solid var(--border-subtle)' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}
            >
              {lbl}
              {val === 'pending' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ minWidth: '18px', textAlign: 'center' }}>{pendingCount}</span>
              )}
              {val === 'rented' && rentedCount > 0 && (
                <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ minWidth: '18px', textAlign: 'center' }}>{rentedCount}</span>
              )}
              {val === 'sold' && soldCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ minWidth: '18px', textAlign: 'center' }}>{soldCount}</span>
              )}
            </button>
          );
        })}
        </div>

        {!deleteMode ? (
          <button onClick={enterDeleteMode}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            O'chirish
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={cancelDeleteMode}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5">
              Bekor qilish
            </button>
            <button onClick={() => setShowConfirm(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-red-500 text-white hover:bg-red-600 flex items-center gap-1.5">
              O'chirish {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          style={{ background: 'rgba(15,23,42,0.5)' }} onClick={() => setShowConfirm(false)}>
          <div className="w-full max-w-sm bg-white rounded-[24px] shadow-2xl border border-slate-100 p-6 animate-fade-in-scale"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-50 border border-red-100">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </div>
              <div>
                <p className="text-slate-900 font-black text-sm">O'chirishni tasdiqlang</p>
                <p className="text-slate-400 text-xs">
                  {selectedIds.size > 0
                    ? `${selectedIds.size} ta tranzaksiya o'chiriladi`
                    : "Barcha tranzaksiyalar o'chiriladi"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 transition-all bg-white">
                Bekor qilish
              </button>
              <button onClick={handleDelete} disabled={confirmLoading}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all shadow-lg disabled:opacity-40 bg-red-500 hover:bg-red-600">
                {confirmLoading ? 'Ochirilmoqda…' : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {visible.length === 0 && (
        <div className="py-20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
            <IconInbox className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Hozircha hech narsa yo'q</p>
        </div>
      )}

      {/* Select all bar — only in delete mode */}
      {deleteMode && visible.length > 0 && (
        <div className="flex items-center gap-3 mb-3 px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-500" />
            <span className="text-xs font-semibold text-slate-500">Barchasini tanlash</span>
          </label>
          <span className="text-xs text-slate-300">{selectedIds.size} ta tanlandi</span>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((txn, i) => (
          <div key={txn.id}
            className="p-5 rounded-2xl transition-all border animate-fade-in-up"
            style={{
              animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
              opacity: 0,
              background: txn.status === 'pending' ? 'var(--warning-bg)' : 'white',
              borderColor: txn.status === 'pending' ? 'var(--warning-border)' : 'var(--border-subtle)',
            }}>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {deleteMode && (
                  <label className="shrink-0 mt-0.5 cursor-pointer">
                    <input type="checkbox" checked={selectedIds.has(txn.id)} onChange={() => toggleSelect(txn.id)}
                      className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-500" />
                  </label>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="badge badge-sm"
                      style={txn.type === 'buy'
                        ? { background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' }
                        : { background: 'var(--info-bg)', border: '1px solid var(--info-border)', color: 'var(--info)' }}>
                      {TYPE_LABEL[txn.type] || txn.type}
                    </span>
                    <span className="badge badge-sm"
                      style={STATUS_STYLE[txn.status] || STATUS_STYLE.pending}>
                      {STATUS_LABEL[txn.status] || txn.status}
                    </span>
                    {txn.charity_amount > 0 && (
                      <span className="badge badge-sm bg-rose-50 text-rose-600 border border-rose-100">
                        ❤ Xayriya
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-slate-900 truncate mb-0.5">{txn.book_title}</p>
                  {txn.author && <p className="text-sm text-slate-400 mb-2">{txn.author}</p>}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="font-bold text-amber-600">{fmtUZS(txn.price)}</span>
                    {txn.type === 'rent' && txn.rental_days && <span>{txn.rental_days} kun</span>}
                    {txn.shelf && <span>Javon {txn.shelf}, {txn.aisle}</span>}
                    {txn.return_date && (
                      <span className="font-semibold" style={{ color: new Date(txn.return_date) < new Date() ? '#dc2626' : '#0284c7' }}>
                        Qaytarish: {new Date(txn.return_date).toLocaleDateString('uz-UZ')}
                      </span>
                    )}
                    <span>{new Date(txn.created_at).toLocaleString('uz-UZ')}</span>
                  </div>

                  {txn.renter_name && (
                    <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-100">
                      <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span className="font-semibold text-slate-700">{txn.renter_name}</span>
                    </div>
                  )}

                  {txn.contributor_name && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-violet-50 border border-violet-100 ml-2">
                      <span className="font-semibold text-violet-700">{txn.contributor_name}</span>
                      {txn.reward_amount > 0 && (
                        <span className="text-violet-400">· {fmtUZS(txn.reward_amount)}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pending — approve / reject */}
              {txn.status === 'pending' && (
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(txn, 'rejected')} disabled={loading === txn.id}
                      className="btn btn-danger px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <IconX className="w-3.5 h-3.5"/> Rad etish
                    </button>
                    <button onClick={() => updateStatus(txn, 'confirmed')} disabled={loading === txn.id}
                      className="btn btn-confirm px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      {loading === txn.id ? '…' : <><IconCheck className="w-3.5 h-3.5"/> Tasdiqlash</>}
                    </button>
                  </div>
                  {errorId === txn.id && (
                    <p className="text-[10px] text-red-500 font-semibold animate-fade-in">Amal bajarilmadi</p>
                  )}
                </div>
              )}

              {/* Confirmed rent — return to library */}
              {txn.type === 'rent' && txn.status === 'confirmed' && (
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button onClick={() => updateStatus(txn, 'returned')} disabled={loading === txn.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                    style={{ borderColor: '#bbf7d0', background: '#f0fdf4', color: '#15803d' }}>
                    {loading === txn.id ? '…' : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                        </svg>
                        Kutubxonaga qaytarildi
                      </>
                    )}
                  </button>
                  {errorId === txn.id && (
                    <p className="text-[10px] text-red-500 font-semibold animate-fade-in">Amal bajarilmadi</p>
                  )}
                </div>
              )}

              {/* Confirmed buy — sold badge */}
              {txn.type === 'buy' && txn.status === 'confirmed' && (
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Sotilgan
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
