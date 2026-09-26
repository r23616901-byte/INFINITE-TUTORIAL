import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { AppLoadingAnimation } from '../../components/common/AppLoadingAnimation';

type RoleId = 'parent' | 'teacher' | 'admin';

interface RoleItem {
  id: RoleId;
  emoji: string;
  title: string;
  tagLine1: string;
  tagLine2: string;
}

const ROLES: RoleItem[] = [
  { id: 'parent', emoji: '👨‍🎓', title: 'Parent', tagLine1: 'STUDENT', tagLine2: 'RECORDS' },
  { id: 'teacher', emoji: '👩‍🏫', title: 'Teacher', tagLine1: 'ACADEMIC', tagLine2: 'DESK' },
  { id: 'admin', emoji: '🛡️', title: 'Admin', tagLine1: 'CONTROL', tagLine2: 'CENTER' },
];

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  // Loader appears on opening the app before the role selection screen
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div
      className="min-h-screen flex flex-col justify-between"
      style={{
        background: '#FFFFFF',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── 6 to 7 Seconds Video-like App Intro Loader ── */}
      {showIntro && (
        <AppLoadingAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* ── Top Header ── */}
      <header className="w-full flex items-center justify-between px-6 py-4 md:px-10 border-b border-slate-100">
        <Link to="/" aria-label="Infinite Tutorial" className="flex items-center">
          <BrandLogo size="md" />
        </Link>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          AY 2024–25
        </span>
      </header>

      {/* ── Main Center Section (Matches Screenshot Exactly) ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl w-full mx-auto animate-in fade-in duration-300">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Infinite <span className="text-blue-600">Tutorial</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Select Your Portal
          </p>
        </div>

        {/* 3 Portal Cards Centered Horizontally */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl px-2">
          {ROLES.map((role) => (
            <div
              key={role.id}
              onClick={() => navigate(`/login/${role.id}`)}
              className="bg-white border-2 border-slate-100 hover:border-blue-500 rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-98"
              style={{ minHeight: '230px' }}
            >
              {/* Emoji Icon */}
              <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                {role.emoji}
              </span>

              {/* Title */}
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {role.title}
              </h2>

              {/* Small Tag */}
              <div className="my-2 text-[10px] font-bold text-slate-400 tracking-wider">
                <div>{role.tagLine1}</div>
                <div>{role.tagLine2}</div>
              </div>

              {/* Enter Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/login/${role.id}`);
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs group-hover:shadow-md cursor-pointer"
              >
                <span>Enter</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-4 text-xs font-medium text-slate-400 border-t border-slate-50">
        © {new Date().getFullYear()} Infinite Tutorial
      </footer>
    </div>
  );
};
