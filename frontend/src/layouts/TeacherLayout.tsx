import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  User,
  Bell,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from '../components/common/BrandLogo';

export const TeacherLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Bottom Navigation specified:
  // 🏠 Home, 👨🎓 Students, ✅ Attendance, 📚 Tests, 👤 Profile
  const bottomNavItems = [
    { name: 'Home', href: '/teacher', icon: Home },
    { name: 'Students', href: '/teacher/students', icon: GraduationCap },
    { name: 'Attendance', href: '/teacher/attendance', icon: CalendarCheck },
    { name: 'Tests', href: '/teacher/tests', icon: BookOpen },
    { name: 'Profile', href: '/teacher/reset-password', icon: User },
  ];

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F8FAFC]"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Mobile Top Header (Fixed/Sticky, Minimal, ≤60px) ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <Link to="/teacher" className="flex items-center gap-2">
          <BrandLogo size="sm" showSubtitle={false} />
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            AY 2024–25
          </span>

          <button
            onClick={() => setShowNotifModal(true)}
            aria-label="Notifications"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          </button>

          <button
            onClick={logout}
            aria-label="Sign Out"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* ── Main Scrollable Viewport (Padded bottom for floating nav) ── */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-5 pb-24">
        <Outlet />
      </main>

      {/* ── Modern Floating Bottom Navigation ── */}
      <nav
        aria-label="Teacher Mobile Navigation"
        className="fixed bottom-3 inset-x-0 z-50 max-w-md mx-auto px-3"
      >
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[24px] shadow-lg shadow-slate-900/5 px-2 py-2 flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/teacher'
                ? location.pathname === '/teacher'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-blue-600 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-700 font-medium'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Notifications Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-slate-200 shadow-xl max-w-xs w-full p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Faculty Updates</h3>
              </div>
              <button
                onClick={() => setShowNotifModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                <Sparkles size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">4 Leave Requests Pending</div>
                  <div className="text-[11px] text-slate-500">Action required for Class 10A</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNotifModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
