import { useState } from 'react';
import { fmtUZS } from '../../utils/pricing';

function IconSearch({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function IconPencil({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
}
function IconTrash({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}
function IconX({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconAlert({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function IconInbox({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}
function IconUpload({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}

const STATUS_OPTS  = ['available', 'rented', 'sold'];
const STATUS_LABEL = { available: 'Mavjud', rented: 'Ijarada', sold: 'Sotilgan' };
const STATUS_STYLE = {
  available: { background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success)' },
  rented:    { background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', color: 'var(--warning)' },
  sold:      { background: 'var(--danger-bg)',  border: '1px solid var(--danger-border)',  color: 'var(--danger)' },
};
const CATEGORIES = ['Badiiy', 'Ilmiy-ommabop', 'Fantastika', 'Fan', 'Tarix', 'Klassika', 'Dystopiya', 'Biografiya', 'Boshqa'];
const COVER_TYPES = ['yumshoq', 'qattiq'];
const SCRIPTS = ['lotin', 'kirill'];

function FI({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EditModal({ book, contributors, onSave, onClose }) {
  const parseImages = (raw) => {
    try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  };
  const [form, setForm] = useState({
    title: book.title, author: book.author, category: book.category || 'Badiiy',
    pages: book.pages, shelf: book.shelf, aisle: book.aisle, price: book.price,
    status: book.status,
    contributor_id: book.contributor_id || '',
    reward_percentage: book.reward_percentage ? (book.reward_percentage * 100).toFixed(0) : '',
    cover_image: book.cover_image || '',
    images: parseImages(book.images),
    cover_type: book.cover_type || 'yumshoq',
    script: book.script || 'lotin',
    condition: book.condition != null ? book.condition : 100,
  });
  const [saving, setSaving] = useState(false);
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  async function submit(e) {
    e.preventDefault(); setSaving(true);
    const body = {
      ...form, pages: Number(form.pages), price: Number(form.price),
      contributor_id: form.contributor_id ? Number(form.contributor_id) : null,
      reward_percentage: form.reward_percentage ? Number(form.reward_percentage) / 100 : 0,
      cover_image: form.cover_image || null,
      images: form.images || [],
      cover_type: form.cover_type,
      script: form.script,
      condition: Number(form.condition),
    };
    const res = await fetch(`/api/books/${book.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    onSave(await res.json()); setSaving(false);
  }

  function handleImagesChange(files) {
    if (!files.length) return;
    let readCount = 0;
    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        newImages.push(evt.target.result);
        readCount++;
        if (readCount === files.length) {
          if (!form.cover_image) {
            set('cover_image', newImages[0]);
            set('images', [...form.images, ...newImages.slice(1)]);
          } else {
            set('images', [...form.images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    const all = [form.cover_image, ...form.images];
    all.splice(index, 1);
    set('cover_image', all[0] || '');
    set('images', all.slice(1));
  }

  function moveImage(index, direction) {
    const all = [form.cover_image, ...form.images];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= all.length) return;
    const [item] = all.splice(index, 1);
    all.splice(newIndex, 0, item);
    set('cover_image', all[0] || '');
    set('images', all.slice(1));
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-7 bg-white border border-slate-100 shadow-2xl animate-fade-in-scale">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 text-base">Kitobni tahrirlash</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 transition text-lg leading-none p-1 rounded-lg hover:bg-slate-50"><IconX className="w-5 h-5"/></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FI label="Sarlavha *"><input required value={form.title} onChange={e => set('title', e.target.value)} className="input-dark" /></FI>
            <FI label="Muallif *"><input required value={form.author} onChange={e => set('author', e.target.value)} className="input-dark" /></FI>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FI label="Turkum">
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input-dark">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </FI>
            <FI label="Holat">
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input-dark">
                {STATUS_OPTS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </FI>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FI label="Sahifalar *"><input required type="number" min="1" value={form.pages} onChange={e => set('pages', e.target.value)} className="input-dark" /></FI>
            <FI label="Narxi (so'm) *"><input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} className="input-dark" /></FI>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FI label="Javon *"><input required value={form.shelf} onChange={e => set('shelf', e.target.value.toUpperCase())} className="input-dark" /></FI>
            <FI label="Qator *"><input required value={form.aisle} onChange={e => set('aisle', e.target.value)} className="input-dark" /></FI>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FI label="Muqova turi">
              <select value={form.cover_type} onChange={e => set('cover_type', e.target.value)} className="input-dark">
                {COVER_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </FI>
            <FI label="Kitob Shifiri">
              <select value={form.script} onChange={e => set('script', e.target.value)} className="input-dark">
                {SCRIPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </FI>
            <FI label="Kitobning Holati">
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="100" value={form.condition}
                  onChange={e => set('condition', Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                <span className="text-sm font-black text-sky-600 w-10 text-right">{form.condition}%</span>
              </div>
            </FI>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Rasmlar</p>
            <div className="flex flex-wrap gap-3 mb-3">
              {[form.cover_image, ...form.images].filter(Boolean).map((img, i) => (
                <div key={`${i}-${img.slice(-20)}`} className="relative group">
                  <div className={`w-16 h-[88px] rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-sky-400' : 'border-slate-200'} bg-slate-50`}>
                    <img src={img} alt={`rasm ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  {i === 0 && (
                    <span className="absolute -top-2 -right-2 bg-sky-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Asosiy</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                    {i > 0 && (
                      <button type="button" onClick={() => moveImage(i, -1)}
                        className="p-1 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                    )}
                    {i < [form.cover_image, ...form.images].filter(Boolean).length - 1 && (
                      <button type="button" onClick={() => moveImage(i, 1)}
                        className="p-1 rounded-lg bg-white/90 text-slate-700 hover:bg-white transition">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(i)}
                      className="p-1 rounded-lg bg-white/90 text-red-500 hover:bg-white transition">
                      <IconTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              <label className="w-16 h-[88px] rounded-xl border-2 border-dashed border-slate-200 hover:border-[var(--primary-light)] bg-slate-50 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer">
                <IconUpload className="w-5 h-5 text-slate-300" />
                <span className="text-[8px] text-slate-400 font-medium">Qo'shish</span>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={e => { handleImagesChange(Array.from(e.target.files)); e.target.value = ''; }} />
              </label>
            </div>
          </div>

          <FI label="Hissador">
            <select value={form.contributor_id} onChange={e => set('contributor_id', e.target.value)} className="input-dark">
              <option value="">— Kutubxona kitobi —</option>
              {contributors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FI>
          {form.contributor_id && (
            <FI label="Mukofot %">
              <input type="number" min="0" max="100" value={form.reward_percentage}
                onChange={e => set('reward_percentage', e.target.value)} className="input-dark" placeholder="20" />
            </FI>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1 py-2.5 rounded-xl text-sm">Bekor qilish</button>
            <button type="submit" disabled={saving} className="btn btn-primary flex-1 py-2.5 rounded-xl text-sm">{saving ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ book, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="w-full max-w-sm rounded-3xl p-7 bg-white border border-slate-100 shadow-2xl animate-fade-in-scale">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <IconAlert className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="font-black text-slate-900 mb-2 text-center">Kitobni o'chirish?</h3>
        <p className="text-sm text-slate-400 mb-6 text-center">
          <strong className="text-slate-700">"{book.title}"</strong> kutubxonadan butunlay o'chiriladi.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1 py-2.5 rounded-xl text-sm">Bekor qilish</button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger flex-1 py-2.5 rounded-xl text-sm font-semibold">{loading ? 'Oʻchirilmoqda…' : 'Oʻchirish'}</button>
        </div>
      </div>
    </div>
  );
}

const FILTER_OPTS = [['all', 'Barchasi'], ...STATUS_OPTS.map(s => [s, STATUS_LABEL[s]])];

export default function InventoryTab({ books, setBooks, contributors }) {
  const [search,   setSearch]   = useState('');
  const [statusF,  setStatusF]  = useState('all');
  const [editing,  setEditing]  = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = books
    .filter(b => statusF === 'all' || b.status === statusF)
    .filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id) {
    setDeleteLoading(true);
    try {
      await fetch(`/api/books/${id}`, { method: 'DELETE' });
      setBooks(prev => prev.filter(b => b.id !== id));
    } finally {
      setDeleteLoading(false);
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-slate-300"><IconSearch className="w-4 h-4"/></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ombordan qidirish…"
            className="input-dark pl-10" />
        </div>
        <div className="flex gap-1.5">
          {FILTER_OPTS.map(([val, lbl]) => {
            const active = statusF === val;
            return (
              <button key={val} onClick={() => setStatusF(val)}
                className="btn px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={active
                  ? { background: 'var(--nis-gradient)', color: 'white', backgroundSize: '200% 200%' }
                  : { background: 'var(--bg-subtle)', color: 'var(--text-tertiary)', border: '1.5px solid var(--border-subtle)' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}}
              >{lbl}</button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 font-medium">{filtered.length} ta kitob</p>

      <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center"></th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Sarlavha</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Muallif</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Turkum</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Joylashuvi</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Sahifa</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Narxi</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Holat</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center">Hissador</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap text-center"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(book => (
              <tr key={book.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/80">
                <td className="px-4 py-3">
                  {book.cover_image ? (
                    <img src={book.cover_image} alt="" className="w-8 h-11 object-cover rounded-md border border-slate-100" />
                  ) : (
                    <div className="w-8 h-11 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: 'var(--nis-gradient)' }}>
                      {book.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-slate-900 max-w-xs truncate">{book.title}</td>
                <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap">{book.author}</td>
                <td className="px-4 py-3 text-center text-slate-400">{book.category || '—'}</td>
                <td className="px-4 py-3 text-center text-slate-400 whitespace-nowrap">Javon {book.shelf}, {book.aisle}</td>
                <td className="px-4 py-3 text-center text-slate-400">{book.pages}</td>
                <td className="px-4 py-3 text-center font-bold text-amber-600 whitespace-nowrap">{fmtUZS(book.price)}</td>
                <td className="px-4 py-3 text-center">
                  <span className="badge badge-sm inline-block"
                    style={STATUS_STYLE[book.status] || STATUS_STYLE.available}>
                    {STATUS_LABEL[book.status] || book.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs text-violet-600 whitespace-nowrap">
                  {book.contributor_name
                    ? `${book.contributor_name} · ${(book.reward_percentage * 100).toFixed(0)}%`
                    : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => setEditing(book)}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1">
                      <IconPencil className="w-3 h-3"/> Tahrirlash
                    </button>
                    <button onClick={() => setDeleting(book)}
                      className="text-xs font-semibold text-red-300 hover:text-red-500 transition-colors flex items-center gap-1">
                      <IconTrash className="w-3 h-3"/> O'chirish
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
              <IconInbox className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">Ushbu filtrga mos kitob topilmadi.</p>
          </div>
        )}
      </div>
      </div>

      {editing  && <EditModal book={editing} contributors={contributors} onSave={upd => { setBooks(p => p.map(b => b.id === upd.id ? upd : b)); setEditing(null); }} onClose={() => setEditing(null)} />}
      {deleting && <DeleteConfirm book={deleting} onConfirm={() => handleDelete(deleting.id)} onClose={() => setDeleting(null)} loading={deleteLoading} />}
    </div>
  );
}
