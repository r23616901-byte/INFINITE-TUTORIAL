import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Award } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { BrandWatermark } from '../../components/common/BrandWatermark';
import {
  ParentRoleIcon,
  TeacherRoleIcon,
  AdminRoleIcon,
} from '../../components/common/RoleIcons';

interface RoleOption {
  id: 'parent' | 'teacher' | 'admin';
  title: string;
  roleName: string;
  subtitleLines: [string, string];
  icon: React.ReactNode;
}

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  // Admin is selected with the blue border by default as shown in the reference design,
  // and hovering/focusing any card highlights it dynamically.
  const [activeRole, setActiveRole] = useState<'parent' | 'teacher' | 'admin'>('admin');

  const roles: RoleOption[] = [
    {
      id: 'parent',
      title: 'Parent',
      roleName: 'Parent Portal',
      subtitleLines: ['STUDENT', 'RECORDS'],
      icon: <ParentRoleIcon size={76} />,
    },
    {
      id: 'teacher',
      title: 'Teacher',
      roleName: 'Faculty Portal',
      subtitleLines: ['ACADEMIC', 'DESK'],
      icon: <TeacherRoleIcon size={76} />,
    },
    {
      id: 'admin',
      title: 'Admin',
      roleName: 'Administration Portal',
      subtitleLines: ['CONTROL', 'CENTER'],
      icon: <AdminRoleIcon size={76} />,
    },
  ];

  const handleSelectRole = (roleId: 'parent' | 'teacher' | 'admin') => {
    navigate(`/login/${roleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F5F8FC] text-[#0B1F4D] relative overflow-hidden select-none">
      {/* Background Brand Watermark */}
      <BrandWatermark opacity={0.035} size="xl" position="center" />

      {/* Top Header */}
      <header className="w-full px-6 py-5 sm:px-8 sm:py-6 md:px-12 md:py-7 flex items-center justify-between z-20 relative bg-white/70 backdrop-blur-md border-b border-[#DCE5F2]">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 transition-opacity duration-200 focus:outline-hidden"
          aria-label="Infinite Tutorial Home"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Institute badge in top right */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-xs font-bold text-[#155EEF]">
          <span className="w-2 h-2 rounded-full bg-[#00B8F8] animate-pulse" />
          Academic Year 2024–25
        </div>
      </header>

      {/* Main Hero & Role Selection Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl w-full mx-auto relative z-10">
        {/* Welcome Hero Section */}
        <section className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00B8F8]" />
            Digital Tuition &amp; Academic Management System
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1F4D] tracking-tight leading-tight">
            Welcome to <span className="text-[#155EEF]">Infinite Tutorial</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5B6B82] leading-relaxed max-w-xl mx-auto font-normal">
            Select your portal to sign in and access your academic workspace.
          </p>
        </section>

        {/* Role Cards Section (Matching Reference Design) */}
        <section className="w-full mt-10 sm:mt-12" aria-label="Select your role to sign in">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
            {roles.map((role) => {
              const isSelected = activeRole === role.id;
              return (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enter as ${role.title}`}
                  onClick={() => handleSelectRole(role.id)}
                  onMouseEnter={() => setActiveRole(role.id)}
                  onFocus={() => setActiveRole(role.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectRole(role.id);
                    }
                  }}
                  className={`group relative w-full sm:w-[260px] md:w-[270px] min-h-[340px] p-8 rounded-[32px] bg-white transition-all duration-300 ease-out cursor-pointer flex flex-col items-center justify-between text-center select-none ${
                    isSelected
                      ? 'border-2 border-[#155EEF] shadow-[0_12px_36px_rgba(21,94,239,0.16)] -translate-y-1.5'
                      : 'border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:border-[#155EEF]/60 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Top 3D Icon */}
                  <div className="pt-2 pb-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {role.icon}
                  </div>

                  {/* Title & 2-Line Subtitle */}
                  <div className="flex-1 flex flex-col items-center justify-center my-3">
                    <h3
                      className={`text-2xl font-black tracking-tight transition-colors duration-200 ${
                        isSelected ? 'text-[#155EEF]' : 'text-[#0B1F4D] group-hover:text-[#155EEF]'
                      }`}
                    >
                      {role.title}
                    </h3>

                    <div className="mt-2 text-[11px] font-bold text-[#8A9BB0] tracking-[0.18em] uppercase leading-tight">
                      <div>{role.subtitleLines[0]}</div>
                      <div>{role.subtitleLines[1]}</div>
                    </div>
                  </div>

                  {/* Action Pill Button */}
                  <div className="mt-3 w-full flex justify-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRole(role.id);
                      }}
                      className="px-7 py-2.5 rounded-full bg-[#155EEF] hover:bg-[#004EEB] active:scale-95 text-white font-bold text-sm inline-flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-200"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Informational reassurance banner */}
        <aside className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5B6B82] text-center">
          <span className="inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#155EEF]" />
            Empowering students with structured mentoring
          </span>
          <span className="hidden sm:inline text-[#DCE5F2]">•</span>
          <span className="inline-flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F7931E]" />
            Transparent performance tracking &amp; verified scorecards
          </span>
        </aside>
      </main>

      {/* Clean Branded Footer */}
      <footer className="w-full px-6 py-4 sm:px-8 text-center border-t border-[#DCE5F2] bg-white/80 backdrop-blur-xs text-xs text-[#5B6B82] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">&copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.</p>
          <p className="text-[11px] text-[#8A9BB0]">
            Secure Academic &amp; Tuition Management System
          </p>
        </div>
      </footer>
    </div>
  );
};
