import { useState } from 'react';
import { fmtUZS }       from '../utils/pricing';
import { formatUzPhone } from '../utils/phoneFormat';
import { printReceipt } from '../utils/printReceipt';

function IconX({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
function IconCheck({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IconAlert({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function IconBook({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
        {label} <span className="text-amber-500">*</span>
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1.5 font-medium flex items-center gap-1"><IconAlert className="w-3 h-3"/> {error}</p>}
    </div>
  );
}

export default function BuyModal({ book, onClose }) {
  const [step,    setStep]    = useState('info');
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('+998 ');
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim())  e.name  = 'Ism majburiy';
    if (!phone.trim()) e.phone = 'Telefon raqam majburiy';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: book.id, book_title: book.title, type: 'buy', price: book.price, renter_name: name.trim(), renter_phone1: phone.trim() }),
      });
      if (!res.ok) throw new Error();
      setStep('receipt');
    } catch { setStep('error'); }
    finally  { setLoading(false); }
  }

  function handleClose() {
    setName(''); setPhone('+998 '); setErrors({}); setStep('info'); onClose();
  }

  function handlePrint() {
    printReceipt({ type: 'buy', bookTitle: book.title, bookAuthor: book.author, price: book.price });
  }

  const INPUT = "w-full bg-white border border-slate-200 focus:border-[var(--primary-light)] focus:shadow-[var(--shadow-glow)] text-slate-900 placeholder-slate-300 transition-all rounded-2xl py-3.5 px-5 text-sm outline-none font-medium";
  const INPUT_ERR = "w-full bg-white border border-red-200 focus:border-red-300 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.06)] text-slate-900 placeholder-slate-300 transition-all rounded-2xl py-3.5 px-5 text-sm outline-none font-medium";

  const steps = ['info', 'confirm', 'receipt', 'success'];
  const currentStepIndex = steps.indexOf(step === 'error' ? 'info' : step);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl border border-slate-100 animate-fade-in-scale">

        {/* Close button */}
        <button onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all rounded-full bg-white/80 backdrop-blur-sm border border-slate-100">
          <IconX className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        {step !== 'error' && (
          <div className="flex items-center gap-0 px-8 pt-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  i <= currentStepIndex
                    ? 'text-white animate-gradient'
                    : 'bg-slate-100 text-slate-400'
                }`}
                style={i <= currentStepIndex ? { background: 'var(--nis-gradient)', backgroundSize: '200% 200%' } : {}}>
                  {i + 1}
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 mx-2 transition-all ${i < currentStepIndex ? 'bg-gradient-to-r from-blue-800 to-indigo-700' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── info ── */}
        {step === 'info' && (
          <div className="p-8">
            <div className="flex items-center gap-4 mb-7 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg shrink-0 animate-gradient"
                style={{ background: 'var(--nis-gradient-soft)', backgroundSize: '200% 200%' }}>
                <IconBook className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-900 font-bold text-sm leading-tight truncate">{book.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{book.author}</p>
              </div>
              <span className="text-slate-900 font-black text-sm shrink-0">{fmtUZS(book.price)}</span>
            </div>

            <p className="text-slate-900 font-black text-base mb-5">Ma'lumotlaringiz</p>

            <div className="space-y-4 mb-6">
              <Field label="To'liq ism" error={errors.name}>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Alisher Karimov"
                  className={errors.name ? INPUT_ERR : INPUT} />
              </Field>
              <Field label="Telefon raqam" error={errors.phone}>
                <input value={phone} onChange={e => setPhone(formatUzPhone(e.target.value))}
                  placeholder="+998 90 123 45 67" type="tel"
                  className={errors.phone ? INPUT_ERR : INPUT} />
              </Field>
            </div>

            <div className="flex gap-3">
              <button onClick={handleClose}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700 transition-all bg-white">
                Bekor qilish
              </button>
              <button onClick={() => validate() && setStep('confirm')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                Keyingisi →
              </button>
            </div>
          </div>
        )}

        {/* ── confirm ── */}
        {step === 'confirm' && (
          <div className="p-8">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Xaridni tasdiqlash</p>
            <h3 className="text-slate-900 font-black text-xl leading-tight mb-1">{book.title}</h3>
            <p className="text-slate-400 text-sm mb-6">{name} · {phone}</p>

            <div className="rounded-3xl p-6 text-center mb-6 animate-gradient"
              style={{ background: 'var(--nis-gradient-soft)', backgroundSize: '200% 200%' }}>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">Umumiy narx</p>
              <p className="text-white font-black text-4xl tracking-tight">{fmtUZS(book.price)}</p>
            </div>

            <p className="text-slate-400 text-xs text-center mb-6">
              So'rovingiz kutubxonachiga yuboriladi. Chek avtomatik chop etiladi.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setStep('info')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 transition-all bg-white">
                ← Orqaga
              </button>
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg disabled:opacity-40 animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                {loading ? 'Yuborilmoqda…' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        )}

        {/* ── receipt ── */}
        {step === 'receipt' && (
          <div className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 border border-emerald-100">
                <IconCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-900 font-black text-sm">Xarid so'rovi yuborildi!</p>
                <p className="text-slate-400 text-xs">{book.title} · {fmtUZS(book.price)}</p>
              </div>
            </div>

            {/* Receipt card */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-5 mb-5 font-mono text-xs text-slate-700">
              <p className="text-center font-black text-sm text-slate-900 mb-0.5">NIS KUTUBXONASI</p>
              <p className="text-center text-[10px] text-slate-500 mb-0.5">Namangan International School</p>
              <p className="text-center text-[10px] text-slate-400 mb-3">{new Date().toLocaleString('uz-UZ')}</p>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <p className="text-center font-bold text-[11px] text-slate-900 mb-2">XARID CHEKI</p>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <div className="space-y-1">
                <div className="flex justify-between"><span>Kitob</span><span className="font-semibold text-right max-w-[60%]">{book.title}</span></div>
                <div className="flex justify-between"><span>Muallif</span><span className="text-right max-w-[60%]">{book.author || '—'}</span></div>
                <div className="flex justify-between"><span>Xaridor</span><span className="text-right">{name}</span></div>
                <div className="flex justify-between"><span>Telefon</span><span className="text-right">{phone}</span></div>
              </div>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <p className="text-center font-black text-sm text-slate-900 py-1">JAMI: {fmtUZS(book.price)}</p>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <p className="text-center text-[10px] text-slate-500">Iltimos, bu chekni saqlang.</p>
              <p className="text-center text-[10px] text-slate-400">NIS Kutubxonasidan foydalanganingiz uchun rahmat!</p>
            </div>

            <button onClick={() => { handlePrint(); setStep('success'); }}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient flex items-center justify-center gap-2"
              style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Chekni chiqarish
            </button>
          </div>
        )}

        {/* ── success ── */}
        {step === 'success' && (
          <div className="p-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-gradient"
              style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', backgroundSize: '200% 200%' }}>
              <IconCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">So'rov yuborildi!</h3>
            <p className="text-slate-400 text-sm mb-8">Kutubxonachi stoliga olib boring.</p>
            <button onClick={handleClose}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient"
              style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
              Tayyor
            </button>
          </div>
        )}

        {/* ── error ── */}
        {step === 'error' && (
          <div className="p-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
              <IconAlert className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">Xatolik yuz berdi</h3>
            <p className="text-slate-400 text-sm mb-8">Server bilan bog'lanib bo'lmadi.</p>
            <div className="flex gap-3">
              <button onClick={handleClose}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 transition-all bg-white">
                Yopish
              </button>
              <button onClick={() => setStep('confirm')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                Qayta urinish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
