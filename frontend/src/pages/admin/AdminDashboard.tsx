import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  UserCheck,
  Layers,
  CheckCircle2,
  CalendarCheck,
  FileText,
  BarChart3,
  BookOpen,
  FolderKanban,
  FileCheck,
  Home,
  Bell,
  BookmarkCheck,
  Award,
  TrendingUp,
  Megaphone,
  Clock,
  Calendar,
  FileSpreadsheet,
  Settings,
  History,
  Plus,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Modal for Quick Announcement / Quick Action preview
  const [quickNoticeModal, setQuickNoticeModal] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    setNoticeSuccess(true);
    setTimeout(() => {
      setQuickNoticeModal(false);
      setNoticeSuccess(false);
      setNoticeText('');
    }, 1200);
  };

  // =========================================================
  // ROW 1 — KPI OVERVIEW (8 Compact KPI Cards)
  // Students: 84 | Teachers: 8 | Parents: 78 | Batches: 6
  // Attendance: 91.3% | Pending Leaves: 4 | Upcoming Tests: 2 | Reports: 4
  // =========================================================
  const kpiOverview = [
    {
      id: 'students',
      label: 'Students',
      value: '84',
      icon: GraduationCap,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50',
      action: () => navigate('/admin/students'),
    },
    {
      id: 'teachers',
      label: 'Teachers',
      value: '8',
      icon: Users,
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50',
      action: () => navigate('/admin/teachers'),
    },
    {
      id: 'parents',
      label: 'Parents',
      value: '78',
      icon: UserCheck,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50',
      action: () => navigate('/admin/parents'),
    },
    {
      id: 'batches',
      label: 'Batches',
      value: '6',
      icon: Layers,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50',
      action: () => navigate('/admin/batches'),
    },
    {
      id: 'attendance',
      label: 'Attendance',
      value: '91.3%',
      icon: CheckCircle2,
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50',
      action: () => navigate('/admin/attendance'),
    },
    {
      id: 'leaves',
      label: 'Pending Leaves',
      value: '4',
      icon: CalendarCheck,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50',
      action: () => navigate('/admin/leave-requests'),
    },
    {
      id: 'tests',
      label: 'Upcoming Tests',
      value: '2',
      icon: FileText,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50',
      action: () => navigate('/admin/tests'),
    },
    {
      id: 'reports',
      label: 'Reports',
      value: '4',
      icon: BarChart3,
      color: 'text-[#EA580C]',
      bgColor: 'bg-orange-50',
      action: () => navigate('/admin/analytics'),
    },
  ];

  // =========================================================
  // MAIN DASHBOARD — ACTION MODULE GRID (21 Square Cards)
  // Desktop: 6 Columns | Tablet: 4 Columns | Mobile: 2 Columns
  // 160px x 160px card, Large Icon (40px), Small Label, Optional Badge
  // No descriptions. No subtitles. No paragraphs.
  // =========================================================
  const actionModules = [
    // Academic Modules
    {
      id: 'students',
      label: 'Students',
      icon: GraduationCap,
      badge: '84',
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/admin/students'),
    },
    {
      id: 'parents',
      label: 'Parents',
      icon: UserCheck,
      badge: '78',
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/admin/parents'),
    },
    {
      id: 'teachers',
      label: 'Teachers',
      icon: Users,
      badge: '8',
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/admin/teachers'),
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: Layers,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50/80 group-hover:bg-purple-100',
      action: () => navigate('/admin/batches'),
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookOpen,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/admin/subjects'),
    },
    {
      id: 'batches',
      label: 'Batches',
      icon: FolderKanban,
      badge: '6',
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/admin/batches'),
    },

    // Operations
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CheckCircle2,
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/admin/attendance'),
    },
    {
      id: 'leaves',
      label: 'Leave Requests',
      icon: CalendarCheck,
      badge: '4',
      badgeColor: 'bg-amber-100 text-amber-800',
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50/80 group-hover:bg-amber-100',
      action: () => navigate('/admin/leave-requests'),
    },
    {
      id: 'home-reach',
      label: 'Home Reach',
      icon: Home,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/admin/home-reach'),
    },
    {
      id: 'daily-updates',
      label: 'Daily Updates',
      icon: Bell,
      color: 'text-[#EA580C]',
      bgColor: 'bg-orange-50/80 group-hover:bg-orange-100',
      action: () => navigate('/admin/daily-updates'),
    },
    {
      id: 'portion-completion',
      label: 'Portion Completion',
      icon: BookmarkCheck,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50/80 group-hover:bg-purple-100',
      action: () => navigate('/admin/portion-completion'),
    },

    // Examination
    {
      id: 'tests',
      label: 'Tests',
      icon: FileText,
      badge: '2',
      badgeColor: 'bg-blue-100 text-blue-800',
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/admin/tests'),
    },
    {
      id: 'marks',
      label: 'Marks',
      icon: FileCheck,
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/admin/marks'),
    },
    {
      id: 'scorecards',
      label: 'Scorecards',
      icon: Award,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50/80 group-hover:bg-amber-100',
      action: () => navigate('/admin/scorecards'),
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/admin/performance'),
    },

    // Administration
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      color: 'text-[#EA580C]',
      bgColor: 'bg-orange-50/80 group-hover:bg-orange-100',
      action: () => navigate('/admin/announcements'),
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: Clock,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/admin/timetable'),
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50/80 group-hover:bg-purple-100',
      action: () => navigate('/admin/announcements'),
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileSpreadsheet,
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/admin/analytics'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100 group-hover:bg-slate-200',
      action: () => navigate('/admin/settings'),
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: History,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100 group-hover:bg-slate-200',
      action: () => navigate('/admin/audit-logs'),
    },
  ];

  // =========================================================
  // ADMIN FEED — Compact Activity Timeline (Max 5)
  // Only: Icon, Action, Time
  // 🟢 Attendance Submitted | 🔵 Test Uploaded | 🟡 Student Added
  // 🟣 Teacher Updated | 🔴 Leave Request Pending
  // =========================================================
  const adminFeed = [
    {
      id: '1',
      action: 'Attendance Submitted',
      time: '10 mins ago',
      dotColor: 'bg-[#10B981]',
      iconBg: 'bg-emerald-50',
      icon: CheckCircle2,
      iconColor: 'text-[#10B981]',
      onClick: () => navigate('/admin/attendance'),
    },
    {
      id: '2',
      action: 'Test Uploaded',
      time: '45 mins ago',
      dotColor: 'bg-[#2563EB]',
      iconBg: 'bg-blue-50',
      icon: FileText,
      iconColor: 'text-[#2563EB]',
      onClick: () => navigate('/admin/tests'),
    },
    {
      id: '3',
      action: 'Student Added',
      time: '1 hour ago',
      dotColor: 'bg-[#F59E0B]',
      iconBg: 'bg-amber-50',
      icon: GraduationCap,
      iconColor: 'text-[#F59E0B]',
      onClick: () => navigate('/admin/students'),
    },
    {
      id: '4',
      action: 'Teacher Updated',
      time: '2 hours ago',
      dotColor: 'bg-[#7C3AED]',
      iconBg: 'bg-purple-50',
      icon: Users,
      iconColor: 'text-[#7C3AED]',
      onClick: () => navigate('/admin/teachers'),
    },
    {
      id: '5',
      action: 'Leave Request Pending',
      time: '3 hours ago',
      dotColor: 'bg-[#EF4444]',
      iconBg: 'bg-red-50',
      icon: CalendarCheck,
      iconColor: 'text-[#EF4444]',
      onClick: () => navigate('/admin/leave-requests'),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ========================================================= */}
      {/* QUICK ACTION COMMAND BAR (Sticky Header Bar) */}
      {/* ➕ Add Student, ➕ Add Teacher, ➕ Add Batch, 📢 Announcement, 📄 Create Test */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 sm:p-2.5 bg-white rounded-[20px] border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Control Shortcuts
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => navigate('/admin/students')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#2563EB] text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#2563EB] group-hover:text-white" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => navigate('/admin/teachers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#10B981] text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#10B981] group-hover:text-white" />
            <span>Add Teacher</span>
          </button>
          <button
            onClick={() => navigate('/admin/batches')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#F59E0B] text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#F59E0B] group-hover:text-white" />
            <span>Add Batch</span>
          </button>
          <button
            onClick={() => setQuickNoticeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#EA580C] text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#EA580C] group-hover:text-white" />
            <span>Announcement</span>
          </button>
          <button
            onClick={() => navigate('/admin/tests')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#7C3AED] text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-[#7C3AED] group-hover:text-white" />
            <span>Create Test</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ROW 1 — KPI OVERVIEW (8 Equal Cards) */}
      {/* Style: Compact, Equal size, Large value, Small label, No descriptions */}
      {/* ========================================================= */}
      <section aria-label="KPI Overview">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {kpiOverview.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={kpi.action}
                className="bg-white rounded-[20px] border border-[#E5E7EB] p-3.5 sm:p-4 shadow-xs hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer group select-none flex flex-col justify-between"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 ${kpi.bgColor} ${kpi.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <div className="text-[24px] sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#2563EB] transition-colors">
                    {kpi.value}
                  </div>
                  <div className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1 truncate">
                    {kpi.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAIN DASHBOARD — ACTION MODULE GRID */}
      {/* Desktop: 6 Columns | Tablet: 4 Columns | Mobile: 2 Columns */}
      {/* 160px x 160px square action cards */}
      {/* Large Icon (40px), Small label, Optional badge */}
      {/* No descriptions. No subtitles. No paragraphs. */}
      {/* ========================================================= */}
      <section aria-label="Institution Control Modules">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 justify-items-stretch">
          {actionModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="w-full aspect-square bg-white rounded-[20px] border border-[#E5E7EB] p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:scale-[1.03] transition-all duration-300 cursor-pointer group select-none relative"
              >
                {/* Optional notification badge */}
                {item.badge && (
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${
                      item.badgeColor || 'bg-slate-100 text-slate-700 group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Large Icon container (40px) */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 ${item.bgColor}`}
                >
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>

                {/* Small Label */}
                <span className="text-[14px] font-medium text-slate-700 tracking-tight mt-3 truncate max-w-full group-hover:text-slate-900 transition-colors">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* ADMIN FEED — Compact Activity Timeline (Max 5 entries) */}
      {/* Only: Icon, Action, Time */}
      {/* 🟢 Attendance Submitted | 🔵 Test Uploaded | 🟡 Student Added */}
      {/* 🟣 Teacher Updated | 🔴 Leave Request Pending */}
      {/* ========================================================= */}
      <section aria-label="Admin Activity Feed">
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Control Timeline
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              Recent Events
            </span>
          </div>

          <div className="space-y-2">
            {adminFeed.map((feed) => {
              const Icon = feed.icon;
              return (
                <div
                  key={feed.id}
                  onClick={feed.onClick}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${feed.dotColor} flex-shrink-0`} />
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${feed.iconBg} ${feed.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-[#2563EB] transition-colors truncate">
                      {feed.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-[12px] font-medium text-slate-400">
                      {feed.time}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK ANNOUNCEMENT BROADCAST MODAL */}
      {quickNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] max-w-md w-full p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Quick Notice Broadcast</h3>
              </div>
              <button
                onClick={() => setQuickNoticeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {noticeSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
                Notice broadcasted successfully to all batches!
              </div>
            )}

            <form onSubmit={handleSendNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Announcement Message
                </label>
                <textarea
                  rows={3}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="Enter quick circular or announcement for faculty and parents..."
                  className="w-full text-xs p-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setQuickNoticeModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
