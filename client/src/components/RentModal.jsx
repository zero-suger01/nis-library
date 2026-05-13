import { useState } from 'react';
import { fmtUZS, calculateRentPrice } from '../utils/pricing';
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

const PRESETS = [15, 30, 45];

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

export default function RentModal({ book, onClose }) {
  const [step,    setStep]    = useState('configure');
  const [info,    setInfo]    = useState({ renter_name:'', renter_phone1:'+998 ', renter_phone2:'+998 ', renter_address:'' });
  const [days,    setDays]    = useState(45);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const setI = (f, v) => setInfo(p => ({ ...p, [f]: v }));

  const total = calculateRentPrice(days, book.pages);

  function validateInfo() {
    const e = {};
    if (!info.renter_name.trim())    e.renter_name    = 'Ism majburiy';
    if (!info.renter_phone1.trim())  e.renter_phone1  = 'Shaxsiy telefon majburiy';
    if (!info.renter_phone2.trim())  e.renter_phone2  = 'Oilaviy telefon majburiy';
    if (!info.renter_address.trim()) e.renter_address = 'Manzil majburiy';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: book.id, book_title: book.title, type: 'rent', price: total, rental_days: days, ...info }),
      });
      if (!res.ok) throw new Error();
      setStep('receipt');
    } catch { setStep('error'); }
    finally  { setLoading(false); }
  }

  function handleTasdiqlash() {
    if (!validateInfo()) return;
    setStep('warning');
  }

  function handleClose() {
    setInfo({ renter_name:'', renter_phone1:'+998 ', renter_phone2:'+998 ', renter_address:'' });
    setErrors({}); setStep('configure'); onClose();
  }

  const INPUT     = "w-full bg-white border border-slate-200 focus:border-[var(--primary-light)] focus:shadow-[var(--shadow-glow)] text-slate-900 placeholder-slate-300 transition-all rounded-2xl py-3.5 px-5 text-sm outline-none font-medium";
  const INPUT_ERR = "w-full bg-white border border-red-200 focus:border-red-300 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.06)] text-slate-900 placeholder-slate-300 transition-all rounded-2xl py-3.5 px-5 text-sm outline-none font-medium";

  const steps = ['configure', 'info', 'warning', 'receipt', 'success'];
  const currentStepIndex = steps.indexOf(step === 'error' ? 'configure' : step);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.5)' }}>
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl border border-slate-100 animate-fade-in-scale my-auto">

        {/* Close button */}
        <button onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all rounded-full bg-white/80 backdrop-blur-sm border border-slate-100">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
                {i < 4 && <div className={`flex-1 h-0.5 mx-2 transition-all ${i < currentStepIndex ? 'bg-gradient-to-r from-blue-800 to-indigo-700' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: Duration ── */}
        {step === 'configure' && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 animate-gradient"
                style={{ background: 'var(--nis-gradient-soft)', backgroundSize: '200% 200%' }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p className="text-slate-900 font-black text-sm">Ijara muddati</p>
                <p className="text-slate-400 text-xs truncate max-w-[280px]">{book.title}</p>
              </div>
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Tez tanlash</p>
            <div className="flex gap-2 flex-wrap mb-5">
              {PRESETS.map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className="px-4 py-2 rounded-full text-xs font-black transition-all"
                  style={{
                    background: days === d ? 'var(--nis-gradient)' : 'var(--bg-subtle)',
                    backgroundSize: days === d ? '200% 200%' : undefined,
                    color:      days === d ? 'white'   : 'var(--text-tertiary)',
                    border:     days === d ? 'none'    : '1.5px solid var(--border-subtle)',
                  }}>
                  {d} kun
                </button>
              ))}
            </div>

            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Yoki kiriting</p>
            <input type="number" min="1" max="45" value={days}
              onChange={e => setDays(Math.max(1, Math.min(45, Number(e.target.value) || 1)))}
              className="w-full bg-white border border-slate-200 focus:border-[var(--primary-light)] focus:shadow-[var(--shadow-glow)] text-slate-900 transition-all rounded-2xl py-3.5 px-5 text-center text-2xl font-black outline-none mb-5" />

            <div className="rounded-3xl p-5 mb-6 animate-gradient"
              style={{ background: 'var(--nis-gradient-hero)', backgroundSize: '200% 200%' }}>
              <div className="flex justify-between text-sm text-white/70 mb-1">
                <span>Asosiy narx ({book.pages || 0} bet × 45 so'm)</span>
                <span className="font-semibold">{fmtUZS((book.pages || 0) * 45)}</span>
              </div>
              {days <= 30 && (
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>Chegirma ({days <= 15 ? '40%' : '20%'})</span>
                  <span className="font-semibold">-{fmtUZS((book.pages || 0) * 45 - total)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-1 border-t border-white/20">
                <span className="text-white font-black text-sm">Jami ({days} kun)</span>
                <span className="text-white font-black text-lg">{fmtUZS(total)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleClose}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 transition-all bg-white">
                Bekor qilish
              </button>
              <button onClick={() => setStep('info')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                Keyingisi →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Renter info ── */}
        {step === 'info' && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 animate-gradient"
                style={{ background: 'var(--nis-gradient-soft)', backgroundSize: '200% 200%' }}>
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-slate-900 font-black text-sm">Ijarachi ma'lumotlari</p>
                <p className="text-slate-400 text-xs">{days} kun · {fmtUZS(total)}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <Field label="To'liq ismi" error={errors.renter_name}>
                <input value={info.renter_name} onChange={e => setI('renter_name', e.target.value)}
                  placeholder="Alisher Karimov" className={errors.renter_name ? INPUT_ERR : INPUT} />
              </Field>
              <Field label="Shaxsiy telefon" error={errors.renter_phone1}>
                <input value={info.renter_phone1} onChange={e => setI('renter_phone1', formatUzPhone(e.target.value))}
                  placeholder="+998 90 123 45 67" type="tel" className={errors.renter_phone1 ? INPUT_ERR : INPUT} />
              </Field>
              <Field label="Oilaviy telefon" error={errors.renter_phone2}>
                <input value={info.renter_phone2} onChange={e => setI('renter_phone2', formatUzPhone(e.target.value))}
                  placeholder="+998 91 765 43 21" type="tel" className={errors.renter_phone2 ? INPUT_ERR : INPUT} />
              </Field>
              <Field label="Yashash manzili" error={errors.renter_address}>
                <textarea value={info.renter_address} onChange={e => setI('renter_address', e.target.value)}
                  placeholder="Ko'cha, uy raqami, shahar" rows={2}
                  className={(errors.renter_address ? INPUT_ERR : INPUT) + ' resize-none'} />
              </Field>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('configure')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 transition-all bg-white">
                ← Orqaga
              </button>
              <button onClick={handleTasdiqlash} disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg disabled:opacity-40 animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                {loading ? 'Yuborilmoqda…' : 'Keyingisi →'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Receipt ── */}
        {step === 'receipt' && (
          <div className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 border border-emerald-100">
                <IconCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-900 font-black text-sm">Ijara so'rovi yuborildi!</p>
                <p className="text-slate-400 text-xs">{days} kun · {fmtUZS(total)}</p>
              </div>
            </div>

            {/* Receipt card */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-5 mb-6 font-mono text-xs text-slate-700">
              <p className="text-center font-black text-sm text-slate-900 mb-0.5">NIS KUTUBXONASI</p>
              <p className="text-center text-[10px] text-slate-500 mb-0.5">Namangan International School</p>
              <p className="text-center text-[10px] text-slate-400 mb-3">{new Date().toLocaleString('uz-UZ')}</p>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <p className="text-center font-bold text-[11px] text-slate-900 mb-2">IJARA CHEKI</p>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <div className="space-y-1">
                <div className="flex justify-between"><span>Kitob</span><span className="font-semibold text-right max-w-[60%]">{book.title}</span></div>
                <div className="flex justify-between"><span>Muallif</span><span className="text-right max-w-[60%]">{book.author || '—'}</span></div>
                <div className="flex justify-between"><span>Ijara muddati</span><span>{days} kun</span></div>
                <div className="flex justify-between"><span>Sahifalar soni</span><span>{book.pages || 0} bet</span></div>
              </div>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <p className="text-center font-black text-sm text-slate-900 py-1">JAMI: {fmtUZS(total)}</p>
              <div className="border-t border-dashed border-slate-300 my-2" />
              <p className="text-center text-[10px] text-slate-500">Iltimos, bu chekni saqlang.</p>
              <p className="text-center text-[10px] text-slate-400">NIS Kutubxonasidan foydalanganingiz uchun rahmat!</p>
            </div>

            <button onClick={() => { printReceipt({ type: 'rent', bookTitle: book.title, bookAuthor: book.author, price: total, rentalDays: days, pages: book.pages }); setStep('success'); }}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient flex items-center justify-center gap-2"
              style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Chekni chiqarish
            </button>
          </div>
        )}

        {/* ── Step 5: Success ── */}
        {step === 'success' && (
          <div className="p-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-gradient"
              style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', backgroundSize: '200% 200%' }}>
              <IconCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">Tayyor!</h3>
            <p className="text-slate-400 text-sm mb-8">Chekni saqlab qo'ying. Kutubxonachi stoliga olib boring.</p>
            <button onClick={handleClose}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg animate-gradient"
              style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
              Yopish
            </button>
          </div>
        )}

        {/* ── Step 3: Warning ── */}
        {step === 'warning' && (
          <div className="p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 border border-amber-100">
                <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
                </svg>
              </div>
              <div>
                <p className="text-slate-900 font-black text-sm">Ogohlantirish</p>
                <p className="text-slate-400 text-xs truncate max-w-[280px]">{book.title}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                Kitobni ijaraga olayotganingizda quyidagi qoidalarga amal qilishingizni so'raymiz:
              </p>
              <ul className="space-y-2.5">
                {[
                  'Kitobni ehtiyotkorlik bilan foydalaning, unga zarar yetkazmang.',
                  "Kitobni belgilangan muddatda o'z vaqtida qaytaring.",
                  "Kechiktirilgan har bir kun uchun qo'shimcha to'lov olinishi mumkin.",
                  "Kitobni yo'qotish yoki shikastlash holatida javobgarlik sizning zimmangizda bo'ladi.",
                  "Kitobni uchinchi shaxslarga bermang.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-px border border-sky-100">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <span className="text-amber-500 text-sm shrink-0">📌</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Qoidalarni buzgan taqdirda, keyingi ijaraga olish cheklanishi mumkin.
              </p>
            </div>

            <p className="text-center text-xs text-slate-400 mb-6">Rahmat, tushunganingiz uchun!</p>

            <div className="flex gap-3">
              <button onClick={() => setStep('info')}
                className="flex-1 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50 transition-all bg-white">
                ← Orqaga
              </button>
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 py-3.5 rounded-2xl text-sm font-black text-white transition-all shadow-lg disabled:opacity-40 animate-gradient"
                style={{ background: 'var(--nis-gradient)', backgroundSize: '200% 200%' }}>
                {loading ? 'Yuborilmoqda…' : 'Roziman'}
              </button>
            </div>
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
              <button onClick={() => setStep('configure')}
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
