import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, GraduationCap, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { BrandWatermark } from '../../components/common/BrandWatermark';

interface RoleOption {
  id: 'parent' | 'teacher' | 'admin';
  title: string;
  subtitleBadge: string;
  image: string;
  icon: React.ReactNode;
}

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<'parent' | 'teacher' | 'admin'>('parent');

  const roles: RoleOption[] = [
    {
      id: 'parent',
      title: 'Parent',
      subtitleBadge: 'STUDENT & PARENT ACCESS',
      image: `${import.meta.env.BASE_URL}images/roles/parent.jpg`,
      icon: <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#155EEF]" />,
    },
    {
      id: 'teacher',
      title: 'Teacher',
      subtitleBadge: 'FACULTY EDUCATOR DESK',
      image: `${import.meta.env.BASE_URL}images/roles/teacher.jpg`,
      icon: <GraduationCap className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#155EEF]" />,
    },
    {
      id: 'admin',
      title: 'Admin',
      subtitleBadge: 'TUITION ADMINISTRATION',
      image: `${import.meta.env.BASE_URL}images/roles/admin.jpg`,
      icon: <ShieldCheck className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#155EEF]" />,
    },
  ];

  const handleSelectRole = (roleId: 'parent' | 'teacher' | 'admin') => {
    navigate(`/login/${roleId}`);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-between bg-[#F5F8FC] text-[#0B1F4D] relative overflow-hidden select-none">
      {/* Background Brand Watermark */}
      <BrandWatermark opacity={0.035} size="xl" position="center" />

      {/* Top Header */}
      <header className="w-full px-4 py-3 sm:px-8 sm:py-4 flex items-center justify-between z-20 relative bg-white/80 backdrop-blur-md border-b border-[#DCE5F2]">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 sm:gap-3 transition-opacity duration-200 focus:outline-hidden"
          aria-label="Infinite Tutorial Home"
        >
          <BrandLogo size="sm" />
        </Link>

        {/* Right side header tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Academic Session badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[11px] sm:text-xs font-bold text-[#155EEF]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00B8F8] animate-pulse" />
            <span className="hidden xs:inline">Academic </span>
            <span>Session 2024–25</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Role Selection Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 max-w-6xl w-full mx-auto relative z-10">
        {/* Welcome Section */}
        <section className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2.5">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00B8F8] flex-shrink-0" />
            <span>Digital Tuition &amp; Academic Management</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0B1F4D] tracking-tight leading-tight">
            Welcome to <span className="text-[#155EEF]">Infinite Tutorial</span>
          </h1>

          <p className="text-xs sm:text-base text-[#5B6B82] leading-relaxed max-w-xl mx-auto font-normal px-2">
            Choose your dedicated portal and click Enter to sign in to your workspace.
          </p>
        </section>

        {/* 3 Icon Cards Section */}
        <section className="w-full mt-4 sm:mt-8 md:mt-10" aria-label="Select your portal to sign in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8 max-w-4xl mx-auto w-full">
            {roles.map((role) => {
              const isSelected = activeRole === role.id;
              return (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enter ${role.title} Portal`}
                  onClick={() => handleSelectRole(role.id)}
                  onMouseEnter={() => setActiveRole(role.id)}
                  onFocus={() => setActiveRole(role.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectRole(role.id);
                    }
                  }}
                  className={`group relative p-3 sm:p-4 md:p-7 rounded-2xl md:rounded-3xl bg-white transition-all duration-300 ease-out cursor-pointer flex flex-row md:flex-col items-center justify-between text-left md:text-center select-none active:scale-[0.99] md:active:scale-100 ${
                    isSelected
                      ? 'border-2 border-[#155EEF] shadow-[0_8px_24px_rgba(21,94,239,0.14)] md:shadow-[0_12px_36px_rgba(21,94,239,0.16)] -translate-y-0.5 md:-translate-y-1.5 ring-2 md:ring-4 ring-blue-50'
                      : 'border border-[#DCE5F2] shadow-[0_2px_10px_rgba(11,31,77,0.04)] md:shadow-[0_4px_20px_rgba(11,31,77,0.06)] hover:border-[#155EEF]/70 hover:shadow-lg hover:-translate-y-0.5 md:hover:-translate-y-1'
                  }`}
                >
                  {/* Left (Mobile) / Top (Desktop) content grouping */}
                  <div className="flex md:flex-col items-center gap-3 sm:gap-3.5 md:gap-0 flex-1 min-w-0 md:w-full">
                    {/* Top Badge (visible above avatar on desktop) */}
                    <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[11px] font-bold text-[#155EEF] tracking-wide mb-3">
                      {role.icon}
                      <span>{role.subtitleBadge}</span>
                    </div>

                    {/* 3D Illustration / Icon Graphic */}
                    <div className="flex-shrink-0 md:py-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-28 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-[#F8FAFC] border border-slate-100 p-1">
                        <img
                          src={role.image}
                          alt={role.title}
                          className="w-full h-full object-contain drop-shadow-xs"
                          loading="eager"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>

                    {/* Mobile Title & Badge info */}
                    <div className="flex-1 md:flex-initial min-w-0 md:my-2 md:sm:my-3">
                      {/* Mobile Badge */}
                      <div className="md:hidden inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[10px] font-bold text-[#155EEF] mb-1 max-w-full">
                        <span className="flex-shrink-0">{role.icon}</span>
                        <span className="truncate">{role.subtitleBadge}</span>
                      </div>

                      <h2
                        className={`text-base sm:text-xl md:text-2xl font-black tracking-tight transition-colors duration-200 truncate ${
                          isSelected ? 'text-[#155EEF]' : 'text-[#0B1F4D] group-hover:text-[#155EEF]'
                        }`}
                      >
                        {role.title}
                      </h2>
                    </div>
                  </div>

                  {/* Prominent Enter Button */}
                  <div className="flex-shrink-0 ml-2 sm:ml-3 md:ml-0 md:mt-4 md:w-full flex justify-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRole(role.id);
                      }}
                      className="py-2 px-3.5 sm:py-2.5 sm:px-5 md:w-full rounded-full bg-[#155EEF] hover:bg-[#004EEB] active:scale-95 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Clean Branded Footer */}
      <footer className="w-full px-4 py-3 sm:px-8 sm:py-4 text-center border-t border-[#DCE5F2] bg-white/80 backdrop-blur-xs text-xs text-[#5B6B82] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <p className="font-medium text-[11px] sm:text-xs">&copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.</p>
          <p className="text-[10px] sm:text-[11px] text-[#8A9BB0]">
            Secure Academic &amp; Tuition Management System
          </p>
        </div>
      </footer>
    </div>
  );
};
