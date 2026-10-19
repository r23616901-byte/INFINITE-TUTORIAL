import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LogOut, Users, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { BrandLogo } from '../../components/common/BrandLogo';
import { BrandWatermark } from '../../components/common/BrandWatermark';

interface RoleOption {
  id: 'parent' | 'teacher' | 'admin';
  title: string;
  roleName: string;
  subtitleBadge: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeRole, setActiveRole] = useState<'parent' | 'teacher' | 'admin'>('parent');

  const roles: RoleOption[] = [
    {
      id: 'parent',
      title: 'Parent',
      roleName: 'Parent Portal',
      subtitleBadge: 'STUDENT & PARENT ACCESS',
      description: 'View daily attendance, test marks, evaluated answer sheets & home reach arrival.',
      image: `${import.meta.env.BASE_URL}images/roles/parent.jpg`,
      icon: <Users className="w-5 h-5 text-[#155EEF]" />,
    },
    {
      id: 'teacher',
      title: 'Teacher',
      roleName: 'Teacher Portal',
      subtitleBadge: 'FACULTY EDUCATOR DESK',
      description: 'Record student attendance, enter test marks, manage syllabus & portion progress.',
      image: `${import.meta.env.BASE_URL}images/roles/teacher.jpg`,
      icon: <GraduationCap className="w-5 h-5 text-[#155EEF]" />,
    },
    {
      id: 'admin',
      title: 'Admin',
      roleName: 'Admin Portal',
      subtitleBadge: 'TUITION ADMINISTRATION',
      description: 'Complete tuition control, student admissions, faculty roster & system security.',
      image: `${import.meta.env.BASE_URL}images/roles/admin.jpg`,
      icon: <ShieldCheck className="w-5 h-5 text-[#155EEF]" />,
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
      <header className="w-full px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between z-20 relative bg-white/70 backdrop-blur-md border-b border-[#DCE5F2]">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 transition-opacity duration-200 focus:outline-hidden"
          aria-label="Infinite Tutorial Home"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Right side header tools */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold text-[#5B6B82]">
                Signed in: <strong className="text-[#0B1F4D]">{user.name}</strong> ({user.role})
              </span>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}

          {/* Academic Session badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-xs font-bold text-[#155EEF]">
            <span className="w-2 h-2 rounded-full bg-[#00B8F8] animate-pulse" />
            <span>Academic Session 2024–25</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Role Selection Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-6xl w-full mx-auto relative z-10">
        {/* Welcome Section */}
        <section className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00B8F8]" />
            <span>Digital Tuition &amp; Academic Management System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1F4D] tracking-tight leading-tight">
            Welcome to <span className="text-[#155EEF]">Infinite Tutorial</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5B6B82] leading-relaxed max-w-xl mx-auto font-normal">
            Choose your dedicated portal and click Enter to sign in to your workspace.
          </p>
        </section>

        {/* 3 Icon Cards Section */}
        <section className="w-full mt-8 sm:mt-10" aria-label="Select your portal to sign in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
            {roles.map((role) => {
              const isSelected = activeRole === role.id;
              return (
                <div
                  key={role.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enter ${role.roleName}`}
                  onClick={() => handleSelectRole(role.id)}
                  onMouseEnter={() => setActiveRole(role.id)}
                  onFocus={() => setActiveRole(role.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectRole(role.id);
                    }
                  }}
                  className={`group relative p-6 sm:p-7 rounded-3xl bg-white transition-all duration-300 ease-out cursor-pointer flex flex-col items-center justify-between text-center select-none ${
                    isSelected
                      ? 'border-2 border-[#155EEF] shadow-[0_12px_36px_rgba(21,94,239,0.16)] -translate-y-1.5 ring-4 ring-blue-50'
                      : 'border border-[#DCE5F2] shadow-[0_4px_20px_rgba(11,31,77,0.06)] hover:border-[#155EEF]/70 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Top Badge with Icon */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[11px] font-bold text-[#155EEF] tracking-wide mb-3">
                    {role.icon}
                    <span>{role.subtitleBadge}</span>
                  </div>

                  {/* 3D Illustration / Icon Graphic */}
                  <div className="py-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center bg-[#F8FAFC]">
                      <img
                        src={role.image}
                        alt={role.title}
                        className="w-full h-full object-contain drop-shadow-sm"
                        loading="eager"
                        onError={(e) => {
                          // Fallback to stylized icon if image unavailable
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 flex flex-col items-center justify-center my-3">
                    <h2
                      className={`text-2xl font-black tracking-tight transition-colors duration-200 ${
                        isSelected ? 'text-[#155EEF]' : 'text-[#0B1F4D] group-hover:text-[#155EEF]'
                      }`}
                    >
                      {role.title}
                    </h2>

                    <p className="mt-1 text-xs font-bold text-[#155EEF]/80 uppercase tracking-wider">
                      {role.roleName}
                    </p>

                    <p className="mt-2 text-xs text-[#5B6B82] leading-relaxed max-w-[220px]">
                      {role.description}
                    </p>
                  </div>

                  {/* Prominent Enter Button Below Card */}
                  <div className="mt-4 w-full flex justify-center">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRole(role.id);
                      }}
                      className="w-full py-2.5 px-6 rounded-full bg-[#155EEF] hover:bg-[#004EEB] active:scale-95 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all duration-200 cursor-pointer"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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
