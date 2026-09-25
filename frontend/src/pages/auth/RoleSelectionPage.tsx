import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { BrandWatermark } from '../../components/common/BrandWatermark';

interface RoleCardData {
  id: 'parent' | 'teacher' | 'admin';
  title: string;
  roleName: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  badge: string;
  features: string[];
}

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roles: RoleCardData[] = [
    {
      id: 'parent',
      title: 'Parent / Student',
      roleName: 'Parent Portal',
      description:
        "View attendance records, performance analytics, scorecards, question papers, and official tuition notices.",
      buttonText: 'Enter Parent Portal',
      icon: <Users className="w-7 h-7" />,
      badge: 'Student Records',
      features: ['Attendance & Leaves', 'Performance Scorecards', 'Test Results & Notices'],
    },
    {
      id: 'teacher',
      title: 'Faculty Teacher',
      roleName: 'Educator Portal',
      description:
        'Manage classes, mark daily attendance, create tests, enter examination scores, and upload syllabus updates.',
      buttonText: 'Enter Teacher Portal',
      icon: <GraduationCap className="w-7 h-7" />,
      badge: 'Academic Desk',
      features: ['Daily Attendance', 'Marks & Answer Sheets', 'Class Announcements'],
    },
    {
      id: 'admin',
      title: 'Institute Admin',
      roleName: 'Institute Administration',
      description:
        'Manage students, teachers, batches, timetables, portion progress, audit logs, and complete center operations.',
      buttonText: 'Enter Admin Portal',
      icon: <ShieldCheck className="w-7 h-7" />,
      badge: 'Full Institute Control',
      features: ['Batches & Teachers', 'Audit Logs & Analytics', 'Institute Operations'],
    },
  ];

  const handleSelectRole = (roleId: 'parent' | 'teacher' | 'admin') => {
    navigate(`/login/${roleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F5F8FC] text-[#0B1F4D] relative overflow-hidden select-none">
      {/* Background Brand Watermark */}
      <BrandWatermark opacity={0.04} size="xl" position="center" />

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
        <section className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] text-xs font-bold tracking-wide uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00B8F8]" />
            Digital Tuition &amp; Academic Management System
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0B1F4D] tracking-tight leading-tight">
            Welcome to <span className="text-[#155EEF]">Infinite Tutorial</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5B6B82] leading-relaxed max-w-2xl mx-auto font-normal">
            Your unified academic workspace for tracking student attendance, test performance, syllabus completion, verified scorecards, and tuition safety.
          </p>
        </section>

        {/* Role Selection Section with 3 Unified Cards */}
        <section className="w-full mt-10 sm:mt-12" aria-label="Select your role to sign in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-[#DCE5F2] shadow-xs hover:shadow-xl transition-all duration-300 ease-out cursor-pointer hover:-translate-y-1.5 hover:border-[#155EEF] focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-[#155EEF] group-hover:text-white shadow-2xs">
                      {role.icon}
                    </div>
                    <span className="text-[11px] font-bold text-[#5B6B82] bg-[#F5F8FC] px-2.5 py-1 rounded-lg border border-[#DCE5F2]">
                      {role.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B1F4D] group-hover:text-[#155EEF] transition-colors">
                    {role.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-[#5B6B82] leading-relaxed min-h-[60px]">
                    {role.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-5 pt-4 border-t border-[#F0F4FA] space-y-2.5">
                    {role.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-[#5B6B82]">
                        <CheckCircle2 className="w-4 h-4 text-[#00B8F8] flex-shrink-0" />
                        <span className="font-medium text-[#0B1F4D]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Action Button */}
                <div className="mt-6 pt-2">
                  <div className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 btn-brand-primary">
                    <span>{role.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
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
            Transparent performance tracking &amp; official scorecards
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
