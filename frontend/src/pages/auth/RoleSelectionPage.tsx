import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';

type RoleId = 'parent' | 'teacher' | 'admin';

interface RoleCard {
  id: RoleId;
  emoji: string;
  title: string;
  tag: string;
}

const ROLES: RoleCard[] = [
  {
    id: 'parent',
    emoji: '👨‍🎓',
    title: 'Parent / Student',
    tag: 'Student Records',
  },
  {
    id: 'teacher',
    emoji: '👩‍🏫',
    title: 'Faculty Teacher',
    tag: 'Academic Desk',
  },
  {
    id: 'admin',
    emoji: '🛡️',
    title: 'Institute Admin',
    tag: 'Control Center',
  },
];

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<RoleId | null>(null);

  const handleSelect = (id: RoleId) => navigate(`/login/${id}`);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* ── Header ── */}
      <header
        className="w-full flex items-center justify-between px-6 py-4 sm:px-10"
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #E5E7EB',
          height: '64px',
        }}
      >
        <Link to="/" aria-label="Infinite Tutorial">
          <BrandLogo size="md" />
        </Link>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#2563EB',
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#2563EB' }}
          />
          Academic Year 2024–25
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        {/* Hero text */}
        <div className="text-center mb-10 sm:mb-12">
          <h1
            className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
            style={{ color: '#0F172A' }}
          >
            Welcome to{' '}
            <span style={{ color: '#2563EB' }}>Infinite Tutorial</span>
          </h1>
          <p className="text-sm sm:text-base font-medium" style={{ color: '#64748B' }}>
            Select Your Portal
          </p>
        </div>

        {/* Role cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ maxWidth: '860px', width: '100%' }}
        >
          {ROLES.map((role) => {
            const isHovered = hovered === role.id;

            return (
              <button
                key={role.id}
                onClick={() => handleSelect(role.id)}
                onMouseEnter={() => setHovered(role.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(role.id)}
                onBlur={() => setHovered(null)}
                aria-label={`Enter ${role.title} portal`}
                style={{
                  width: '100%',
                  maxWidth: '260px',
                  height: '220px',
                  margin: '0 auto',
                  borderRadius: '24px',
                  background: '#ffffff',
                  border: isHovered ? '2px solid #2563EB' : '2px solid #E5E7EB',
                  boxShadow: isHovered
                    ? '0 12px 40px rgba(37,99,235,0.18), 0 2px 8px rgba(37,99,235,0.08)'
                    : '0 2px 12px rgba(15,23,42,0.06)',
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                  transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '24px 20px',
                  outline: 'none',
                }}
              >
                {/* Emoji icon */}
                <span
                  style={{
                    fontSize: '56px',
                    lineHeight: 1,
                    display: 'block',
                    transform: isHovered ? 'scale(1.12) translateY(-2px)' : 'scale(1)',
                    transition: 'transform 0.22s cubic-bezier(.4,0,.2,1)',
                    userSelect: 'none',
                  }}
                >
                  {role.emoji}
                </span>

                {/* Role title */}
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: isHovered ? '#2563EB' : '#0F172A',
                    transition: 'color 0.18s ease',
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                  }}
                >
                  {role.title}
                </span>

                {/* Tag */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isHovered ? '#2563EB' : '#64748B',
                    background: isHovered ? '#EFF6FF' : '#F1F5F9',
                    border: isHovered ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    letterSpacing: '0.02em',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {role.tag}
                </span>

                {/* Enter button */}
                <div
                  style={{
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#ffffff',
                    background: isHovered
                      ? '#1D4ED8'
                      : '#2563EB',
                    borderRadius: '10px',
                    padding: '7px 18px',
                    transition: 'all 0.18s ease',
                    boxShadow: isHovered
                      ? '0 4px 16px rgba(37,99,235,0.35)'
                      : '0 2px 6px rgba(37,99,235,0.2)',
                  }}
                >
                  Enter Portal
                  <ArrowRight
                    size={13}
                    style={{
                      transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                      transition: 'transform 0.18s ease',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full text-center py-4 text-xs"
        style={{
          borderTop: '1px solid #E5E7EB',
          background: '#ffffff',
          color: '#94A3B8',
        }}
      >
        © {new Date().getFullYear()} Infinite Tutorial. All rights reserved.
      </footer>
    </div>
  );
};
