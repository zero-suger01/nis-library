import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import StudentKiosk    from './pages/StudentKiosk';
import AdminDashboard  from './pages/AdminDashboard';

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Dev nav — remove or hide in production kiosk deployment */}
      <nav className="fixed bottom-4 right-4 z-50 flex gap-2 animate-fade-in">
        <Link
          to="/kiosk"
          className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all duration-200 flex items-center gap-1.5
            ${pathname === '/kiosk'
              ? 'bg-[var(--primary)] text-white shadow-[var(--primary)]/25'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Talaba Kioski
        </Link>
        <Link
          to="/admin"
          className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all duration-200 flex items-center gap-1.5
            ${pathname === '/admin'
              ? 'bg-[var(--primary)] text-white shadow-[var(--primary)]/25'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:border-stone-300'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Admin
        </Link>
      </nav>

      <Routes>
        <Route path="/kiosk" element={<StudentKiosk />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*"      element={<Navigate to="/kiosk" replace />} />
      </Routes>
    </>
  );
}
