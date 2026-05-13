import { useState, useEffect, useMemo } from 'react';
import { socket }  from '../socket';
import { calculateRentPrice } from '../utils/pricing';
import BuyModal    from '../components/BuyModal';
import RentModal   from '../components/RentModal';

const STATUS = {
  available: { label: 'Mavjud',   dot: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  rented:    { label: 'Ijarada',  dot: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  sold:      { label: 'Sotilgan', dot: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
};

const CATEGORIES = ['Barchasi', 'Badiiy', 'Roman', 'Ilmiy-ommabop', 'Fantastika', 'Fan', 'Tarix', 'Klassika', 'Dystopiya', 'Biografiya', 'Boshqa'];

const GRADIENTS = [
  'linear-gradient(135deg, #0c4a6e, #0369a1)',
  'linear-gradient(135deg, #0369a1, #0284c7)',
  'linear-gradient(135deg, #075985, #0ea5e9)',
  'linear-gradient(135deg, #082f49, #0c4a6e)',
  'linear-gradient(135deg, #0284c7, #38bdf8)',
  'linear-gradient(135deg, #0ea5e9, #7dd3fc)',
];

/* ── Icons ─────────────────────────────────────────────────────────────── */
function IconSearch({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
}
function IconX({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconArrowLeft({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}
function IconChevronLeft({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}
function IconChevronRight({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}

/* ── Cover thumb ───────────────────────────────────────────────────────── */
function getAllImages(book) {
  const imgs = [];
  if (book.cover_image) imgs.push(book.cover_image);
  try { const parsed = JSON.parse(book.images); if (Array.isArray(parsed)) imgs.push(...parsed); } catch {}
  return imgs;
}

function CoverThumb({ book, className = '', style = {}, imageIndex = 0 }) {
  const all = getAllImages(book);
  const src = all[imageIndex] || all[0];
  if (src)
    return <img src={src} alt={book.title} className={'object-cover ' + className} style={style} />;
  return (
    <div className={'flex items-center justify-center ' + className}
      style={{ background: GRADIENTS[Math.abs(book.id) % GRADIENTS.length], ...style }}>
      <span className="text-white/30 font-black text-5xl select-none">
        {book.title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

/* ── Book card ─────────────────────────────────────────────────────────── */
function BookCard({ book, onClick, index }) {
  const s = STATUS[book.status] || STATUS.available;
  const unavailable = book.status !== 'available';
  return (
    <button onClick={onClick} className="group text-left focus:outline-none w-full animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s`, opacity: 0 }}>
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-3 transition-all duration-500 group-hover:-translate-y-2 shadow-sm border border-slate-100 bg-white group-hover:shadow-xl">
        <CoverThumb book={book} className="w-full h-full transition-transform duration-700 group-hover:scale-110" />
        {unavailable && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border shadow-sm"
          style={{ background: 'rgba(255,255,255,0.9)', borderColor: s.border }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
          <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: s.dot }}>{s.label}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <h3 className="text-slate-900 text-xs font-bold leading-tight truncate group-hover:text-[var(--primary)] transition-colors">
          {book.title}
        </h3>
        <span className="text-slate-300 text-[10px] shrink-0">·</span>
        <p className="text-slate-400 text-[10px] truncate">{book.author}</p>
      </div>
      <p className="text-slate-900 font-black text-xs">
        {(book.price || 0).toLocaleString()}
        <span className="text-[9px] text-slate-300 font-normal ml-0.5">so'm</span>
      </p>
    </button>
  );
}

/* ── Detail overlay ────────────────────────────────────────────────────── */
function DetailOverlay({ book, onClose, onBuy, onRent }) {
  if (!book) return null;
  const ok = book.status === 'available';
  const s  = STATUS[book.status] || STATUS.available;
  const allImages = getAllImages(book);
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.5)' }} onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[32px] flex flex-col md:flex-row animate-fade-in-scale shadow-2xl border border-slate-100"
        onClick={e => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-5 right-5 z-10 p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all rounded-full bg-white/80 backdrop-blur-sm border border-slate-100">
          <IconX className="w-5 h-5" />
        </button>

        <div className="w-full md:w-72 shrink-0 flex flex-col p-5">
          <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 md:translate-y-14 md:translate-x-3">
            <CoverThumb book={book} className="w-full h-full" imageIndex={activeImg} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
            {allImages.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-600 hover:bg-white transition">
                  <IconChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-600 hover:bg-white transition">
                  <IconChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? 'bg-white w-4' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>

        <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="badge badge-sm" style={{ background: s.bg, color: s.dot, border: `1px solid ${s.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
              {s.label}
            </span>
            {book.category && (
              <span className="badge badge-sm bg-slate-50 text-slate-500 border border-slate-100">
                {book.category}
              </span>
            )}
            {!!book.is_gift && (
              <span className="badge badge-sm bg-rose-50 text-rose-600 border border-rose-100">
                Sovg'a
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight leading-tight">{book.title}</h2>
          <p className="text-lg text-slate-400 font-medium mb-8">{book.author}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {[
              { k: 'Javon',           v: book.shelf  || '—' },
              { k: 'Qator',           v: book.aisle  || '—' },
              { k: 'Sahifalar',       v: book.pages  || '—' },
              { k: 'Kitobning holati', v: (book.condition || 100) >= 70 ? 'Yangi' : (book.condition || 100) >= 40 ? "O'rtacha" : 'Eski' },
              { k: 'Narxi',           v: `${(book.price || 0).toLocaleString()} so'm` },
              { k: "Ijara narxi",     v: `${calculateRentPrice(45, book.pages || 0).toLocaleString()} so'm` },
            ].map(({ k, v }) => (
              <div key={k} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-slate-100/50 transition-colors text-center">
                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1">{k}</p>
                <p className="text-base font-bold text-slate-800">{v}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => ok && onBuy(book)} disabled={!ok}
              className="flex-1 py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg animate-gradient"
              style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
              Sotib olish
            </button>
            <button onClick={() => ok && onRent(book)} disabled={!ok}
              className="flex-1 py-4 rounded-2xl font-black text-sm border-2 border-slate-100 text-slate-800 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed bg-white">
              Ijaraga olish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────────── */
export default function StudentKiosk() {
  const [currentView, setCurrentView]   = useState('home');
  const [query,       setQuery]         = useState('');
  const [category,    setCategory]      = useState('Barchasi');
  const [allBooks,    setAllBooks]      = useState([]);
  const [selected,    setSelected]      = useState(null);
  const [buyBook,     setBuyBook]       = useState(null);
  const [rentBook,    setRentBook]      = useState(null);
  const [isLoading,   setIsLoading]     = useState(true);

  useEffect(() => {
    fetch('/api/books')
      .then(r => r.json())
      .then(data => { setAllBooks(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const add = b => setAllBooks(p => [b, ...p]);
    const upd = b => {
      setAllBooks(p => p.map(x => x.id === b.id ? b : x));
      setSelected(p => p?.id === b.id ? b : p);
    };
    const del = ({ id }) => {
      setAllBooks(p => p.filter(x => x.id !== id));
      setSelected(p => p?.id === id ? null : p);
    };
    socket.on('book_added',   add);
    socket.on('book_updated', upd);
    socket.on('book_deleted', del);
    return () => {
      socket.off('book_added',   add);
      socket.off('book_updated', upd);
      socket.off('book_deleted', del);
    };
  }, []);

  const filteredBooks = useMemo(() => {
    let res = allBooks.filter(b => !b.is_gift);
    const q = query.trim().toLowerCase();
    if (q) {
      res = res.filter(b =>
        b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }
    if (category !== 'Barchasi') {
      res = res.filter(b => b.category === category);
    }
    return res;
  }, [query, category, allBooks]);



  function handleQueryChange(e) {
    const val = e.target.value;
    setQuery(val);
    setCurrentView(val.trim() || category !== 'Barchasi' ? 'results' : 'home');
  }

  function handleCategoryChange(cat) {
    setCategory(cat);
    setCurrentView('results');
  }

  function goHome() {
    setQuery('');
    setCategory('Barchasi');
    setCurrentView('home');
  }

  return (
    <div className="h-screen w-full flex flex-col font-sans overflow-hidden relative bg-slate-900">
      {/* Background image — using img tag for reliability */}
      <img
        src="/school-building.jpg"
        alt="NIS School"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/40" />

      {/* Modals */}
      <DetailOverlay
        book={selected}
        onClose={() => setSelected(null)}
        onBuy={book  => { setSelected(null); setBuyBook(book);  }}
        onRent={book => { setSelected(null); setRentBook(book); }}
      />
      {buyBook  && <BuyModal  book={buyBook}  onClose={() => setBuyBook(null)}  />}
      {rentBook && <RentModal book={rentBook} onClose={() => setRentBook(null)} />}

      {/* ── Main content ── */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden relative z-10">

        {/* ══ HOME VIEW ══ */}
        {currentView === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-start pt-[8vh] overflow-hidden animate-fade-in">

            {/* Title */}
            <div className="relative z-10 mb-6 text-center">
              <p className="text-white/70 font-bold text-sm tracking-[0.3em] uppercase mb-2"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                Kutubxonamizga
              </p>
              <h1 className="text-white font-black text-2xl md:text-3xl tracking-tight drop-shadow-xl uppercase"
                style={{ textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
                Xush kelibsiz
              </h1>
              <div className="mt-3 mx-auto w-16 h-0.5 rounded-full bg-amber-400 shadow-lg" />
            </div>

            {/* Big interactive search bar */}
            <div className="w-full max-w-2xl relative z-10 px-6 group">
              {/* Glow ring behind */}
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-sky-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-md" />
              
              <div className="relative flex items-center bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_12px_50px_rgba(0,0,0,0.18)] border border-white/60 transition-all duration-300 group-hover:shadow-[0_16px_60px_rgba(0,0,0,0.25)] group-focus-within:shadow-[0_16px_60px_rgba(0,0,0,0.25)] group-focus-within:border-sky-300/50">
                {/* Search icon circle */}
                <div className="ml-3 w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                  <IconSearch className="w-6 h-6 text-sky-500" />
                </div>
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Kitob nomi yoki muallifini qidiring..."
                  className="flex-1 py-5 px-4 text-lg outline-none bg-transparent text-slate-800 placeholder-slate-400 font-medium"
                  style={{ caretColor: '#0ea5e9' }}
                />
                {/* Search button */}
                <button 
                  type="button"
                  className="mr-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}
                  onClick={() => { if (query.trim()) setCurrentView('results'); }}
                >
                  Qidirish
                </button>
              </div>
            </div>

            {/* Quick category chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-4 relative z-10 px-6">
              {CATEGORIES.slice(0, 7).map(cat => (
                <button key={cat} onClick={() => handleCategoryChange(cat)}
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all bg-white/15 text-white/80 border border-white/20 backdrop-blur-sm hover:bg-white/30 hover:text-white">
                  {cat}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ══ RESULTS VIEW ══ */}
        {currentView === 'results' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden animate-fade-in">

            {/* Search header */}
            <div className="bg-white rounded-[24px] px-6 py-4 flex items-center gap-4 shrink-0 surface">
              <button onClick={goHome}
                className="p-2.5 rounded-2xl transition-all hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-100">
                <IconArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-300">
                  <IconSearch className="w-5 h-5" />
                </div>
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Kitob nomi yoki muallifini qidiring..."
                  className="w-full text-slate-900 placeholder-slate-300 transition-all rounded-full py-3 pl-12 pr-6 text-sm outline-none font-medium"
                  style={{ background: 'var(--bg-subtle)', border: '1.5px solid var(--border-subtle)', caretColor: 'var(--primary)' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary-light)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div className="px-5 py-2.5 rounded-full shrink-0 text-white text-[11px] font-black uppercase tracking-widest animate-gradient"
                style={{ background: 'var(--nis-gradient-soft)', backgroundSize: '200% 200%' }}>
                {filteredBooks.length} ta natija
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2 flex-wrap shrink-0 px-1">
              {CATEGORIES.map(cat => {
                const active = category === cat;
                return (
                  <button key={cat} onClick={() => handleCategoryChange(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={active
                      ? { background: 'var(--nis-gradient-soft)', color: 'white', backgroundSize: '200% 200%' }
                      : { background: 'white', color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; } }}>
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Book grid */}
            <div className="flex-1 bg-white rounded-[24px] overflow-hidden surface">
              <div className="h-full overflow-y-auto custom-scrollbar px-8 py-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full py-20">
                    <div className="w-10 h-10 rounded-full border-3 border-slate-200 animate-spin mb-4"
                      style={{ borderTopColor: 'var(--primary)' }} />
                    <p className="text-sm text-slate-400 font-medium">Kitoblar yuklanmoqda...</p>
                  </div>
                ) : filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6">
                    {filteredBooks.map((book, i) => (
                      <BookCard key={book.id} book={book} onClick={() => setSelected(book)} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-20 animate-fade-in">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-slate-50 border border-slate-100">
                      <IconSearch className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="font-bold text-sm text-slate-400 mb-1">Kitob topilmadi</p>
                    <p className="text-xs text-slate-300">Boshqa so'z bilan qidirib ko'ring</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Minimal footer ── */}
      <div className="relative z-10 shrink-0 pb-5 text-center">
        <p className="text-white/40 text-[10px] font-medium tracking-widest">© NIS Namangan · Kutubxona Tizimi</p>
      </div>
    </div>
  );
}
