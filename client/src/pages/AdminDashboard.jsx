import { useState, useEffect, useCallback } from 'react';
import { socket }         from '../socket';
import TransactionsTab    from '../components/admin/TransactionsTab';
import BookIntakeTab      from '../components/admin/BookIntakeTab';
import InventoryTab       from '../components/admin/InventoryTab';
import ContributorsTab    from '../components/admin/ContributorsTab';
import GiftBooksTab       from '../components/admin/GiftBooksTab';

/* ── Icons ─────────────────────────────────────────────────────────────── */
function IconBolt({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
function IconPlusSquare({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
}
function IconGrid({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function IconUsers({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function IconBook({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
}
function IconClock({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IconHeart({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function IconList({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
}
function IconUserPlus({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
}
function IconTrophy({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
}
function IconChevronDown({ className = 'w-4 h-4' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
}
function IconX({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}

const TABS = [
  { id: 'transactions', label: 'Jonli Tasma',  icon: IconBolt },
  { id: 'intake',       label: 'Kitob Qabuli', icon: IconPlusSquare },
  { id: 'inventory',    label: 'Ombor',        icon: IconGrid },
  { id: 'giftbooks',    label: "Sovg'a kitoblar", icon: IconHeart },
  { id: 'contributors', label: 'Hissadorlar',  icon: IconUsers },
];

function Toast({ message, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 5000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className="flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm max-w-xs animate-slide-in-right border"
      style={{ background: 'white', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 animate-gradient"
        style={{ background: 'var(--nis-gradient-warm)', backgroundSize: '200% 200%' }}>
        <IconBolt className="w-4 h-4 text-white" />
      </div>
      <span className="flex-1 text-slate-700 leading-snug pt-0.5">{message}</span>
      <button onClick={onDismiss} className="text-slate-300 hover:text-slate-600 transition shrink-0 p-0.5"><IconX className="w-4 h-4" /></button>
    </div>
  );
}

function StatTile({ active, onClick, label, value, icon: Icon, pulse }) {
  return (
    <div
      className={`flex-1 rounded-[20px] px-5 py-3.5 flex items-center justify-between cursor-pointer transition-all duration-300 ${active ? 'animate-gradient' : 'surface surface-hover'}`}
      style={active
        ? { background: 'var(--nis-gradient)', backgroundSize: '200% 200%', borderColor: 'transparent' }
        : { background: 'white', border: '1.5px solid var(--border-subtle)' }
      }
      onClick={onClick}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)' }}>
            {label}
          </p>
          {pulse && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
        </div>
        <p className="font-black text-2xl leading-none"
          style={{ color: active ? 'white' : 'var(--text-primary)' }}>
          {value}
        </p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white">
        <Icon className="w-5 h-5" style={{ color: active ? 'var(--primary)' : 'var(--text-tertiary)' }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab,       setActiveTab]       = useState('transactions');
  const [contributorsSub, setContributorsSub] = useState('list');
  const [transactions,    setTransactions]    = useState([]);
  const [books,           setBooks]           = useState([]);
  const [contributors,    setContributors]    = useState([]);
  const [toasts,          setToasts]          = useState([]);
  const [loading,         setLoading]         = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [t, b, c] = await Promise.all([
        fetch('/api/transactions').then(r => r.json()),
        fetch('/api/books').then(r => r.json()),
        fetch('/api/contributors').then(r => r.json()),
      ]);
      setTransactions(t); setBooks(b); setContributors(c);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const addToast = msg => setToasts(p => [...p, { id: Date.now(), msg }]);
    const onNewTxn   = t => { setTransactions(p => [t, ...p]); addToast(`Yangi ${t.type === 'buy' ? 'xarid' : 'ijara'}: "${t.book_title}"`); };
    const onTxnUpd   = t => setTransactions(p => p.map(x => x.id === t.id ? { ...x, ...t } : x));
    const onBookAdd  = b => setBooks(p => p.some(x => x.id === b.id) ? p : [b, ...p]);
    const onBookUpd  = b => setBooks(p => p.map(x => x.id === b.id ? b : x));
    const onBookDel  = ({ id }) => setBooks(p => p.filter(x => x.id !== id));
    const onCtribUpd = c => setContributors(p => p.map(x => x.id === c.id ? c : x));

    socket.on('new_transaction',     onNewTxn);
    socket.on('transaction_updated', onTxnUpd);
    socket.on('book_added',          onBookAdd);
    socket.on('book_updated',        onBookUpd);
    socket.on('book_deleted',        onBookDel);
    socket.on('contributor_updated', onCtribUpd);
    return () => {
      socket.off('new_transaction',     onNewTxn);
      socket.off('transaction_updated', onTxnUpd);
      socket.off('book_added',          onBookAdd);
      socket.off('book_updated',        onBookUpd);
      socket.off('book_deleted',        onBookDel);
      socket.off('contributor_updated', onCtribUpd);
    };
  }, []);

  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const charityTotal = transactions
    .filter(t => t.status === 'confirmed')
    .reduce((sum, t) => sum + (t.charity_amount || 0), 0);
  const giftBooksCount = books.filter(b => b.is_gift).length;

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ── Top stats row ── */}
      <div className="flex gap-3 p-4 pb-0 shrink-0">
        {/* Logo tile */}
        <div className="bg-white rounded-[20px] px-5 py-3.5 flex items-center gap-3.5 shrink-0 surface surface-hover cursor-pointer"
          onClick={() => window.location.reload()}>
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
            <img src="/logo.png" alt="NIS" className="w-11 h-11 object-contain"
              onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="background:var(--nis-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:900;font-size:13px">NIS</span>'; }} />
          </div>
          <div>
            <h1 className="text-sm font-black leading-tight gradient-text">Admin Panel</h1>
            <p className="text-[11px] text-slate-400 font-medium">NIS Kutubxonasi</p>
          </div>
        </div>

        {/* Books stat */}
        <StatTile
          active={activeTab === 'inventory'}
          onClick={() => setActiveTab('inventory')}
          label="Kitoblar"
          value={books.length}
          icon={IconBook}
        />

        {/* Contributors stat */}
        <StatTile
          active={activeTab === 'contributors'}
          onClick={() => setActiveTab('contributors')}
          label="Hissadorlar"
          value={contributors.length}
          icon={IconUsers}
        />

        {/* Pending stat */}
        <StatTile
          active={activeTab === 'transactions'}
          onClick={() => setActiveTab('transactions')}
          label="Kutilmoqda"
          value={pendingCount}
          icon={IconClock}
          pulse={pendingCount > 0}
        />

        {/* Charity stat */}
        <StatTile
          active={activeTab === 'giftbooks'}
          onClick={() => setActiveTab('giftbooks')}
          label="Xayriya"
          value={charityTotal.toLocaleString() + " so'm"}
          icon={IconHeart}
        />
      </div>

      {/* ── Main row: nav + content ── */}
      <div className="flex-1 flex gap-3 p-4 overflow-hidden">

        {/* Vertical tab nav */}
        <div className="bg-white rounded-[20px] p-3 flex flex-col gap-1 shrink-0 w-56 surface">
          <p className="text-[10px] font-black uppercase tracking-widest px-3 py-2 text-slate-300">
            Menyu
          </p>

          {TABS.map(tab => {
            let badge = null;
            if (tab.id === 'transactions' && pendingCount > 0) badge = pendingCount;
            else if (tab.id === 'giftbooks' && giftBooksCount > 0) badge = giftBooksCount;
            const active = activeTab === tab.id;
            const Icon   = tab.icon;
            const isContributors = tab.id === 'contributors';
            const expanded = isContributors && active;

            return (
              <div key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isContributors && !active) setContributorsSub('list');
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left w-full"
                  style={active
                    ? { background: 'var(--nis-gradient)', color: 'white', backgroundSize: '200% 200%' }
                    : { color: 'var(--text-tertiary)', background: 'transparent' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--primary)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}
                >
                  <span className="text-base leading-none shrink-0"><Icon className="w-[18px] h-[18px]" /></span>
                  <span className="flex-1 truncate">{tab.label}</span>
                  {badge && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full leading-none shrink-0 shadow-sm">
                      {badge}
                    </span>
                  )}
                  {isContributors && (
                    <IconChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {/* Sub-menu items — only shown when Hissadorlar is active */}
                {expanded && (
                  <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l-2 border-slate-100 pl-3">
                    {[
                      { key: 'list',    label: "Umumiy ro'yxat",   icon: IconList },
                      { key: 'create',  label: 'Hissador yaratish', icon: IconUserPlus },
                      { key: 'liderlar',label: 'Liderlar doskasi',  icon: IconTrophy },
                    ].map(({ key, label, icon: SubIcon }) => {
                      const subActive = contributorsSub === key;
                      return (
                        <button key={key} onClick={() => setContributorsSub(key)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left w-full"
                          style={subActive
                            ? { background: 'rgba(2,132,199,0.1)', color: 'var(--primary)' }
                            : { color: 'var(--text-tertiary)', background: 'transparent' }}
                          onMouseEnter={e => { if (!subActive) { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--primary)'; } }}
                          onMouseLeave={e => { if (!subActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; } }}
                        >
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Content tile */}
        <div className="flex-1 bg-white rounded-[20px] overflow-hidden surface">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 animate-spin"
                  style={{ borderTopColor: 'var(--primary)' }} />
                <span className="text-sm font-medium">Yuklanmoqda…</span>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto custom-scrollbar p-6">
              <div className="animate-fade-in">
                {activeTab === 'transactions' && <TransactionsTab transactions={transactions} setTransactions={setTransactions} />}
                {activeTab === 'intake'       && <BookIntakeTab   contributors={contributors} onBookAdded={b => setBooks(p => [b, ...p])} />}
                {activeTab === 'inventory'    && <InventoryTab    books={books} setBooks={setBooks} contributors={contributors} />}
                {activeTab === 'giftbooks'    && <GiftBooksTab    books={books} />}
                {activeTab === 'contributors' && <ContributorsTab contributors={contributors} setContributors={setContributors} books={books} subPage={contributorsSub} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast message={t.msg} onDismiss={() => setToasts(p => p.filter(x => x.id !== t.id))} />
          </div>
        ))}
      </div>
    </div>
  );
}
