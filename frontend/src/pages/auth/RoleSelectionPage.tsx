import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, GraduationCap, ShieldCheck, ArrowRight, Sparkles, BookOpen, Award, CheckCircle2 } from 'lucide-react';

interface RoleCardData {
  id: 'parent' | 'teacher' | 'admin';
  title: string;
  roleName: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  badge: string;
  accentBorder: string;
  accentBg: string;
  iconBg: string;
  iconColor: string;
  buttonClass: string;
  features: string[];
}

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roles: RoleCardData[] = [
    {
      id: 'parent',
      title: 'Parent',
      roleName: 'Parent Portal',
      description: "View your child's attendance, performance, scorecards, tests, announcements and academic progress.",
      buttonText: 'Continue as Parent',
      icon: <Users className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />,
      badge: 'Student Records',
      accentBorder: 'hover:border-blue-400 group-hover:border-blue-400',
      accentBg: 'hover:bg-blue-50/30',
      iconBg: 'bg-blue-50 border-blue-100',
      iconColor: 'text-blue-600',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-xs',
      features: ['Attendance & Leaves', 'Performance Scorecards', 'Test Results & Notices'],
    },
    {
      id: 'teacher',
      title: 'Teacher',
      roleName: 'Educator Portal',
      description: 'Manage students, attendance, tests, marks, answer sheets, announcements and academic updates.',
      buttonText: 'Continue as Teacher',
      icon: <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />,
      badge: 'Academic Management',
      accentBorder: 'hover:border-emerald-400 group-hover:border-emerald-400',
      accentBg: 'hover:bg-emerald-50/30',
      iconBg: 'bg-emerald-50 border-emerald-100',
      iconColor: 'text-emerald-600',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-xs',
      features: ['Daily Attendance', 'Marks & Answer Sheets', 'Class Announcements'],
    },
    {
      id: 'admin',
      title: 'Admin',
      roleName: 'Institute Administration',
      description: 'Manage students, teachers, batches, attendance, tests, results, reports and system settings.',
      buttonText: 'Continue as Admin',
      icon: <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />,
      badge: 'Full Institute Control',
      accentBorder: 'hover:border-indigo-400 group-hover:border-indigo-400',
      accentBg: 'hover:bg-indigo-50/30',
      iconBg: 'bg-indigo-50 border-indigo-100',
      iconColor: 'text-indigo-600',
      buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-xs',
      features: ['Batches & Teachers', 'Audit Logs & Analytics', 'Institute Operations'],
    },
  ];

  const handleSelectRole = (roleId: 'parent' | 'teacher' | 'admin') => {
    navigate(`/login/${roleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header with Infinite Tutorial Logo positioned at top-left with generous breathing room */}
      <header className="w-full px-6 py-5 sm:px-8 sm:py-6 md:px-12 md:py-8 flex items-center justify-between z-20">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
          aria-label="Infinite Tutorial Home"
        >
          {/* Official Infinite Tutorial Logo Graphic Asset */}
          <div className="flex items-center">
            <img
              src="/logo-transparent.png"
              alt="Infinite Tutorial Logo"
              className="h-9 sm:h-11 md:h-12 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              onError={(e) => {
                // Fallback to emblem or svg if full transparent image is unavailable
                const target = e.currentTarget;
                if (!target.src.includes('logo.svg')) {
                  target.src = '/logo.svg';
                }
              }}
            />
          </div>
        </Link>

        {/* Subtle institute badge in top right */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 text-[11px] font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Academic Portal 2026
        </div>
      </header>

      {/* Main Hero & Role Selection Container (Centered vertically and horizontally on desktop) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-6xl w-full mx-auto">
        {/* Welcome Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Digital Tuition &amp; Academic Management
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome to <span className="text-blue-600">Infinite Tutorial</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Your complete digital platform for managing student attendance, academic performance, tests, scorecards, announcements, and tuition activities.
          </p>
        </section>

        {/* Role Selection Section with 3 Cards */}
        <section
          className="w-full mt-8 sm:mt-12"
          aria-label="Select your role to sign in"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {roles.map((role) => (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                aria-label={`Continue as ${role.title}`}
                onClick={() => handleSelectRole(role.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectRole(role.id);
                  }
                }}
                className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${role.accentBorder}`}
              >
                {/* Top Badge & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shadow-2xs ${role.iconBg} ${role.iconColor}`}
                    >
                      {role.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/50">
                      {role.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {role.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed min-h-[60px] sm:min-h-[72px]">
                    {role.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Action Button */}
                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${role.buttonClass}`}
                  >
                    <span>{role.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Informational reassurance banner */}
        <aside className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 text-center">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Empowering students with structured mentoring
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            Transparent performance tracking &amp; scorecards
          </span>
        </aside>
      </main>

      {/* Clean Professional Footer */}
      <footer className="w-full px-6 py-4 sm:px-8 text-center border-t border-slate-200/70 bg-white/70 backdrop-blur-xs text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            Secure Academic &amp; Tuition Management System
          </p>
        </div>
      </footer>
    </div>
  );
};
