import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

type RoleId = 'parent' | 'teacher' | 'admin';

interface RoleItem {
  id: RoleId;
  emoji: string;
  title: string;
  tag: string;
}

const ROLES: RoleItem[] = [
  { id: 'parent', emoji: '👨‍🎓', title: 'Parent', tag: 'Student Records' },
  { id: 'teacher', emoji: '👩‍🏫', title: 'Teacher', tag: 'Academic Desk' },
  { id: 'admin', emoji: '🛡️', title: 'Admin', tag: 'Control Center' },
];

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      style={{
        background: '#F8FAFC',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Compact Mobile Header ── */}
      <header
        className="w-full flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200"
      >
        <Link to="/" aria-label="Infinite Tutorial">
          <BrandLogo size="sm" />
        </Link>
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
          AY 2024–25
        </span>
      </header>

      {/* ── Main Mobile-First Center ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Infinite <span className="text-blue-600">Tutorial</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Select Your Portal
          </p>
        </div>

        {/* 3 Beautiful Minimal Cards */}
        <div className="w-full flex flex-col sm:flex-row gap-3.5 justify-center items-stretch">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(`/login/${role.id}`)}
              className="flex-1 bg-white border-2 border-slate-200 hover:border-blue-600 rounded-[20px] p-5 flex flex-col items-center justify-center gap-2.5 shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer group text-center"
              style={{ minHeight: '160px' }}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {role.emoji}
              </span>
              <div>
                <span className="block text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {role.title}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {role.tag}
                </span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs">
                <span>Enter</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* ── Minimal Footer ── */}
      <footer className="text-center py-3 text-[11px] font-medium text-slate-400">
        © {new Date().getFullYear()} Infinite Tutorial
      </footer>
    </div>
  );
};
