import { useState } from 'react';
import { fmtUZS } from '../../utils/pricing';

function IconGift({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="2"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
}
function IconInbox({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}

export default function GiftBooksTab({ books }) {
  const giftBooks = books.filter(b => b.is_gift);
  const [search, setSearch] = useState('');

  const visible = search.trim()
    ? giftBooks.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
    : giftBooks;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Sovg'a kitoblar</h2>
          <p className="text-xs text-slate-400 mt-0.5">Kutubxonaga hadya qilingan kitoblar</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100">
          <IconGift className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-bold text-rose-600">{giftBooks.length} ta</span>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Kitob nomi yoki muallif..."
          className="w-full bg-white border border-slate-200 focus:border-[var(--primary-light)] focus:shadow-[var(--shadow-glow)] text-slate-900 placeholder-slate-300 transition-all rounded-2xl py-3 px-5 text-sm outline-none font-medium"
        />
      </div>

      {visible.length === 0 && (
        <div className="py-20 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
            <IconInbox className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Hozircha sovg'a kitob yo'q</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((book, i) => (
          <div key={book.id} className="p-5 rounded-2xl border bg-white animate-fade-in-up"
            style={{
              animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
              opacity: 0,
              borderColor: 'var(--border-subtle)',
            }}>
            <div className="flex items-start gap-3">
              <div className="w-12 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                {book.cover_image ? (
                  <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">
                    {book.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-rose-50 text-rose-600 border border-rose-100">
                    <IconGift className="w-3 h-3" /> Sovg'a
                  </span>
                  {book.category && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-slate-50 text-slate-500 border border-slate-100">
                      {book.category}
                    </span>
                  )}
                </div>
                <p className="font-bold text-slate-900 text-sm truncate">{book.title}</p>
                <p className="text-xs text-slate-400 truncate">{book.author}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                  <span>{book.pages} bet</span>
                  <span>{fmtUZS(book.price)}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${book.status === 'available' ? 'bg-emerald-50 text-emerald-600' : book.status === 'rented' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {book.status === 'available' ? 'Mavjud' : book.status === 'rented' ? 'Ijarada' : 'Sotilgan'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
