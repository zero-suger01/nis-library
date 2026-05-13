import { useState, useRef, useEffect, useCallback } from 'react';

/* ── Icons ─────────────────────────────────────────────────────────────── */
function IconUpload({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
function IconTrash({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}
function IconCheck({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IconGift({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
}
function IconAlert({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function IconX({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconSearch({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function IconBook({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
}
function IconSparkles({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>;
}
function IconMapPin({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconUser({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

const CATEGORIES  = ['Badiiy', 'Roman', 'Ilmiy-ommabop', 'Fantastika', 'Fan', 'Tarix', 'Klassika', 'Dystopiya', 'Biografiya', 'Boshqa'];
const LANGUAGES   = ["O'zbek", 'Rus', 'Ingliz', 'Nemis', 'Fransuz', 'Arab', 'Boshqa'];
const PAPER_TYPES = ["oq qog'oz", "gazeta qog'oz"];
const BOOK_SIZES  = ['A4', 'A5', "Cho'ntak (Pocket)", 'Katta format', 'Boshqa'];
const COVER_TYPES = ['yumshoq', 'qattiq'];
const SCRIPTS     = ['lotin', 'kirill'];

const EMPTY = {
  title: '', author: '', category: 'Badiiy', pages: '', shelf: '', aisle: '', price: '',
  contributor_id: '', reward_percentage: '',
  cover_image: '', images: [], language: "O'zbek", paper_type: "oq qog'oz", book_size: 'A5', is_gift: false,
  cover_type: 'yumshoq', script: 'lotin', condition: 100,
};

/* ── Reusable field wrapper ────────────────────────────────────────────── */
function Field({ label, required, children, className = '' }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1.5 tracking-wide">
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Section card ──────────────────────────────────────────────────────── */
function Section({ icon: Icon, title, children, accent }) {
  const accentColors = {
    blue:   'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600',
    rose:   'bg-rose-50 text-rose-600',
    amber:  'bg-amber-50 text-amber-600',
  };
  return (
    <div className="rounded-[20px] bg-white border border-slate-100 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-50">
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentColors[accent] || accentColors.blue}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Contributor picker ────────────────────────────────────────────────── */
function ContributorPicker({ contributors, value, onChange }) {
  const [query, setQuery] = useState('');
  const [open,  setOpen]  = useState(false);
  const wrapRef           = useRef(null);

  const selected = contributors.find(c => c.id === Number(value));
  const filtered = contributors.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase()) ||
    (c.contact && c.contact.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    function h(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  function select(id) { onChange(id); setQuery(''); setOpen(false); }
  function clear()    { onChange(''); setQuery(''); setOpen(false); }

  return (
    <div ref={wrapRef} className="relative">
      {selected ? (
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 border border-slate-200 bg-white">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-gradient"
            style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
            {selected.name.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 text-sm text-slate-900 font-medium">{selected.name}{selected.contact ? ` · ${selected.contact}` : ''}</span>
          <button type="button" onClick={clear} className="text-slate-300 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-50"><IconX className="w-3.5 h-3.5"/></button>
        </div>
      ) : (
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-slate-300"><IconSearch className="w-4 h-4"/></span>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Hissador qidirish…"
            className="input-dark pl-10"
          />
        </div>
      )}
      {open && !selected && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl shadow-xl z-30 max-h-52 overflow-y-auto bg-white border border-slate-100">
          <button type="button" onMouseDown={() => select('')}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-400 border-b border-slate-50 hover:bg-slate-50 transition-colors">
            — Kutubxona kitobi —
          </button>
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-sm text-center text-slate-400">Hissador topilmadi</p>
          )}
          {filtered.map(c => (
            <button key={c.id} type="button" onMouseDown={() => select(String(c.id))}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 hover:bg-slate-50 transition-colors">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-900">{c.name}</span>
                {c.contact && <span className="text-xs text-slate-400 ml-2">{c.contact}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Multi-image upload ────────────────────────────────────────────────── */
function MultiImageUpload({ coverImage, images, onCoverChange, onImagesChange }) {
  const fileRef = useRef(null);

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    let readCount = 0;
    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        newImages.push(evt.target.result);
        readCount++;
        if (readCount === files.length) {
          if (!coverImage && newImages.length > 0) {
            onCoverChange(newImages[0]);
            onImagesChange([...(images || []), ...newImages.slice(1)]);
          } else {
            onImagesChange([...(images || []), ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = '';
  }

  const allImages = [...(coverImage ? [coverImage] : []), ...(images || [])];

  function moveImage(fromIndex, toIndex) {
    const arr = [...allImages];
    const [item] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, item);
    onCoverChange(arr[0] || '');
    onImagesChange(arr.slice(1));
  }

  function removeImage(index) {
    const arr = [...allImages];
    arr.splice(index, 1);
    onCoverChange(arr[0] || '');
    onImagesChange(arr.slice(1));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {allImages.map((img, i) => (
          <div key={i} className="relative group">
            <div className={`w-[72px] h-[100px] rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-sky-400 ring-2 ring-sky-100' : 'border-slate-200'} bg-slate-50`}>
              <img src={img} alt={`rasm ${i + 1}`} className="w-full h-full object-cover" />
            </div>
            {i === 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">Asosiy</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-0.5">
              {i > 0 && (
                <button type="button" onClick={() => moveImage(i, i - 1)}
                  className="p-1 rounded-md bg-white/90 text-slate-700 hover:bg-white transition" title="Oldinga">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                </button>
              )}
              <button type="button" onClick={() => removeImage(i)}
                className="p-1 rounded-md bg-white/90 text-red-500 hover:bg-white transition" title="O'chirish">
                <IconTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => fileRef.current?.click()}
          className="w-[72px] h-[100px] rounded-xl border-2 border-dashed border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 bg-slate-50 flex flex-col items-center justify-center gap-1 transition-all group">
          <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition">
            <IconUpload className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <span className="text-[9px] text-slate-400 font-medium">Rasm qo'shish</span>
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      <p className="text-[11px] text-slate-400 mt-2.5">Birinchi rasm asosiy muqova sifatida ko'rsatiladi. Bir nechta rasm tanlash mumkin.</p>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────────── */
export default function BookIntakeTab({ contributors, onBookAdded }) {
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(null);
  const [error,   setError]   = useState(null);

  const dismissSuccess = useCallback(() => setSuccess(null), []);
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(dismissSuccess, 4000);
    return () => clearTimeout(t);
  }, [success, dismissSuccess]);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const hasContrib = Boolean(form.contributor_id);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const body = {
        title: form.title.trim(), author: form.author.trim(), category: form.category,
        pages: Number(form.pages), shelf: form.shelf.trim().toUpperCase(), aisle: form.aisle.trim(),
        price: Number(form.price), language: form.language, paper_type: form.paper_type,
        book_size: form.book_size, is_gift: form.is_gift ? 1 : 0,
        cover_type: form.cover_type, script: form.script, condition: Number(form.condition),
        cover_image: form.cover_image || null,
        images: form.images || [],
        ...(hasContrib && {
          contributor_id:    Number(form.contributor_id),
          reward_percentage: Number(form.reward_percentage) / 100,
        }),
      };
      const res = await fetch('/api/books', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const book = await res.json();
      setSuccess(`"${book.title}" muvaffaqiyatli qo'shildi!`);
      setForm(EMPTY);
      onBookAdded?.(book);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
            <IconBook className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">Kitob Qabul Formasi</h2>
            <p className="text-xs text-slate-400 mt-0.5">Yangi kitob qo'shing — darhol kioskda ko'rinadi.</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-2xl mb-5 text-sm bg-emerald-50 border border-emerald-100 animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="flex-1 text-emerald-700 font-medium">{success}</p>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600 transition p-0.5"><IconX className="w-4 h-4"/></button>
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-2xl mb-5 text-sm bg-red-50 border border-red-100 text-red-600 flex items-center gap-2 animate-fade-in">
          <IconAlert className="w-4 h-4 shrink-0"/> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">

          {/* Images */}
          <Section icon={IconUpload} title="Muqova Rasmi" accent="blue">
            <MultiImageUpload
              coverImage={form.cover_image}
              images={form.images}
              onCoverChange={v => set('cover_image', v)}
              onImagesChange={v => set('images', v)}
            />
          </Section>

          {/* Main info */}
          <Section icon={IconBook} title="Asosiy Ma'lumotlar" accent="blue">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Sarlavha" required>
                <input required value={form.title} onChange={e => set('title', e.target.value)} className="input-dark" placeholder="Alpomish" />
              </Field>
              <Field label="Muallif" required>
                <input required value={form.author} onChange={e => set('author', e.target.value)} className="input-dark" placeholder="Abdulla Qodiriy" />
              </Field>
              <Field label="Turkum">
                <select value={form.category} onChange={e => set('category', e.target.value)} className="input-dark">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Sahifalar soni" required>
                <input required type="number" min="1" value={form.pages} onChange={e => {
                  const pages = e.target.value;
                  set('pages', pages);
                  if (pages && Number(pages) > 0) {
                    set('price', String(Number(pages) * 97));
                  }
                }} className="input-dark" placeholder="320" />
              </Field>
            </div>
          </Section>

          {/* Physical */}
          <Section icon={IconSparkles} title="Kitob farmati" accent="amber">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Kitob tili">
                <select value={form.language} onChange={e => set('language', e.target.value)} className="input-dark">
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Qog'oz turi">
                <select value={form.paper_type} onChange={e => set('paper_type', e.target.value)} className="input-dark">
                  {PAPER_TYPES.map(p => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Kitob o'lchami">
                <select value={form.book_size} onChange={e => set('book_size', e.target.value)} className="input-dark">
                  {BOOK_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Muqova turi">
                <select value={form.cover_type} onChange={e => set('cover_type', e.target.value)} className="input-dark">
                  {COVER_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Kitob Shifiri">
                <select value={form.script} onChange={e => set('script', e.target.value)} className="input-dark">
                  {SCRIPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Kitobning Holati">
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="100" value={form.condition}
                    onChange={e => set('condition', Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                  <span className="text-sm font-black text-sky-600 w-10 text-right">{form.condition}%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">100% = yangi, 1% = eskirgan</p>
              </Field>
            </div>
          </Section>

          {/* Location */}
          <Section icon={IconMapPin} title="Joylashuv va Narx" accent="violet">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Field label="Javon" required>
                <input required value={form.shelf} onChange={e => set('shelf', e.target.value.toUpperCase())} className="input-dark" placeholder="A1" />
              </Field>
              <Field label="Qator" required>
                <input required value={form.aisle} onChange={e => set('aisle', e.target.value)} className="input-dark" placeholder="1-qator" />
              </Field>
              <Field label="Narxi (so'm)" required>
                <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} className="input-dark" placeholder="Avtomatik: sahifa × 97" />
              </Field>
            </div>
          </Section>

          {/* Gift */}
          <div className="rounded-[20px] bg-white border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-5 py-4">
              <label className="flex items-center gap-3.5 cursor-pointer">
                <div className="relative shrink-0">
                  <input type="checkbox" checked={form.is_gift} onChange={e => set('is_gift', e.target.checked)} className="sr-only" />
                  <div className="relative w-11 h-7 rounded-full transition-colors duration-200"
                    style={{ background: form.is_gift ? '#e11d48' : '#e2e8f0' }}>
                    <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                      style={{ transform: form.is_gift ? 'translateX(16px)' : 'translateX(0)' }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <IconGift className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Sovg'a (Hadya)</p>
                    <p className="text-[11px] text-slate-400">Egasi kutubxonaga bepul hadya qilmoqda</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Contributor */}
          <Section icon={IconUser} title="Konsignatsiya / Hissador" accent="violet">
            <p className="text-[11px] text-slate-400 mb-3">Kutubxona kitobi bo'lsa, bo'sh qoldiring.</p>
            <Field label="Hissador (ixtiyoriy)">
              <ContributorPicker contributors={contributors} value={form.contributor_id} onChange={v => set('contributor_id', v)} />
            </Field>
            {hasContrib && (
              <div className="mt-3">
                <Field label="Mukofot foizi %">
                  <div className="relative">
                    <input type="number" min="0" max="100" step="1"
                      value={form.reward_percentage}
                      onChange={e => set('reward_percentage', e.target.value)}
                      className="input-dark pr-8" placeholder="20" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                  </div>
                </Field>
                {form.reward_percentage && form.price && (
                  <p className="text-xs mt-2 text-violet-600 bg-violet-50 inline-block px-2.5 py-1 rounded-lg">
                    → {Number(form.price).toLocaleString()} so'mdan hissador{' '}
                    <strong className="text-violet-800">{Math.round(Number(form.price) * Number(form.reward_percentage) / 100).toLocaleString()} so'm</strong> oladi
                  </p>
                )}
              </div>
            )}
          </Section>

          <button type="submit" disabled={saving}
            className="w-full py-4 rounded-2xl text-sm font-black text-white shadow-lg animate-gradient transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 animate-spin" style={{ borderTopColor: 'white' }} />
                "Qo'shilmoqda…"
              </>
            ) : (
              <>
                <IconCheck className="w-4 h-4" />
                "Kutubxonaga Kitob Qo'shish"
              </>
            )}
          </button>
        </form>
    </div>
  );
}
