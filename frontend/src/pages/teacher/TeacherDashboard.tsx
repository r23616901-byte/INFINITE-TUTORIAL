import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CalendarCheck,
  FileCheck,
  FileText,
  CheckCircle2,
  UploadCloud,
  Award,
  FileEdit,
  Megaphone,
  Bus,
  ChevronRight,
  Zap,
  X,
  BookOpen,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mobile floating quick action modal
  const [mobileFabOpen, setMobileFabOpen] = useState(false);

  // ROW 1 — KPI SUMMARY (5 Compact Equal Cards)
  // 👨🎓 Students: 82 | 📚 Classes Today: 3 | ✅ Attendance Pending: 1 | 📝 Leave Reviews: 4 | 📄 Upcoming Tests: 2
  // Style: Equal card sizes, Icon on top, Large value (34px Bold), Small label (14px Medium), No descriptions, Soft hover
  const kpiMetrics = [
    {
      id: 'students',
      label: 'Students',
      value: '82',
      icon: Users,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50',
      action: () => navigate('/teacher/students'),
    },
    {
      id: 'classes',
      label: 'Classes Today',
      value: '3',
      icon: Clock,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50',
      action: () => navigate('/teacher/timetable'),
    },
    {
      id: 'attendance',
      label: 'Attendance Pending',
      value: '1',
      icon: CheckCircle2,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50',
      action: () => navigate('/teacher/attendance'),
    },
    {
      id: 'leaves',
      label: 'Leave Reviews',
      value: '4',
      icon: FileCheck,
      color: 'text-[#EA580C]',
      bgColor: 'bg-orange-50',
      action: () => navigate('/teacher/leave-requests'),
    },
    {
      id: 'tests',
      label: 'Upcoming Tests',
      value: '2',
      icon: FileText,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50',
      action: () => navigate('/teacher/tests'),
    },
  ];

  // ROW 2 — QUICK ACTION CENTER (10 Square Cards)
  // Grid: Desktop 5 columns, Tablet 3 columns, Mobile 2 columns
  // 32px icons, small title only, no helper text, hover elevation & scale(1.02)
  const quickActions = [
    {
      id: 'students',
      name: 'Students',
      icon: Users,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/teacher/students'),
    },
    {
      id: 'attendance',
      name: 'Take Attendance',
      icon: CheckCircle2,
      color: 'text-[#10B981]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/teacher/attendance'),
    },
    {
      id: 'history',
      name: 'Attendance History',
      icon: CalendarCheck,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/teacher/attendance-history'),
    },
    {
      id: 'leaves',
      name: 'Review Leaves',
      icon: FileCheck,
      color: 'text-[#F59E0B]',
      bgColor: 'bg-amber-50/80 group-hover:bg-amber-100',
      action: () => navigate('/teacher/leave-requests'),
    },
    {
      id: 'create-test',
      name: 'Create Test',
      icon: FileText,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50/80 group-hover:bg-purple-100',
      action: () => navigate('/teacher/tests'),
    },
    {
      id: 'upload-paper',
      name: 'Upload Paper',
      icon: UploadCloud,
      color: 'text-[#059669]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/teacher/test-papers'),
    },
    {
      id: 'enter-marks',
      name: 'Enter Marks',
      icon: Award,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/teacher/marks-entry'),
    },
    {
      id: 'answer-sheets',
      name: 'Answer Sheets',
      icon: FileEdit,
      color: 'text-[#D97706]',
      bgColor: 'bg-amber-50/80 group-hover:bg-amber-100',
      action: () => navigate('/teacher/answer-sheets'),
    },
    {
      id: 'announcements',
      name: 'Announcements',
      icon: Megaphone,
      color: 'text-[#EA580C]',
      bgColor: 'bg-orange-50/80 group-hover:bg-orange-100',
      action: () => navigate('/teacher/announcements'),
    },
    {
      id: 'home-reach',
      name: 'Home Reach',
      icon: Bus,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/teacher/home-reach'),
    },
  ];

  // ROW 3 — LIVE TEACHER FEED (Max 5 Recent Activities)
  // Display: Icon, Event title, Timestamp, Action button
  const liveTeacherFeed = [
    {
      id: '1',
      title: 'Parent Meeting Scheduled',
      timestamp: 'Tomorrow, 10:00 AM',
      icon: Megaphone,
      iconColor: 'text-[#EA580C]',
      iconBg: 'bg-orange-50',
      actionLabel: 'View Notice',
      action: () => navigate('/teacher/announcements'),
    },
    {
      id: '2',
      title: 'Physics Test Created',
      timestamp: 'Today, 08:30 AM',
      icon: BookOpen,
      iconColor: 'text-[#7C3AED]',
      iconBg: 'bg-purple-50',
      actionLabel: 'View Test',
      action: () => navigate('/teacher/tests'),
    },
    {
      id: '3',
      title: '4 Leave Requests Pending',
      timestamp: '18 Sep, 2:30 PM',
      icon: FileCheck,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-amber-50',
      actionLabel: 'Review',
      action: () => navigate('/teacher/leave-requests'),
    },
    {
      id: '4',
      title: 'Marks Submitted',
      timestamp: 'Yesterday',
      icon: Award,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
      actionLabel: 'View Sheet',
      action: () => navigate('/teacher/marks-entry'),
    },
    {
      id: '5',
      title: 'New Student Assigned',
      timestamp: '3 days ago',
      icon: Users,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-emerald-50',
      actionLabel: 'View Profile',
      action: () => navigate('/teacher/students'),
    },
  ];

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* ========================================================= */}
      {/* ROW 1 — KPI SUMMARY (5 Equal Cards) */}
      {/* Students: 82 | Classes Today: 3 | Attendance Pending: 1 */}
      {/* Leave Reviews: 4 | Upcoming Tests: 2 */}
      {/* Metrics: 34px Bold, Labels: 14px Medium, No Descriptions */}
      {/* ========================================================= */}
      <section aria-label="KPI Summary">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {kpiMetrics.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                onClick={kpi.action}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group select-none"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${kpi.bgColor} ${kpi.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-3.5">
                  <div className="text-[28px] sm:text-[34px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#2563EB] transition-colors">
                    {kpi.value}
                  </div>
                  <div className="text-[13px] sm:text-[14px] font-medium text-slate-500 mt-1.5 truncate">
                    {kpi.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 2 — QUICK ACTION CENTER (10 Square Cards) */}
      {/* Desktop: 5 cols | Tablet: 3 cols | Mobile: 2 cols */}
      {/* 32px icons, small title only, no helper text */}
      {/* ========================================================= */}
      <section aria-label="Quick Action Center">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Quick Actions
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">
            1-Click Faculty Shortcuts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 justify-items-stretch">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="w-full aspect-square bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group select-none"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${item.bgColor}`}
                >
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <span className="text-[14px] font-medium text-slate-700 tracking-tight mt-3 truncate max-w-full">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 3 — LIVE TEACHER FEED (Timeline / Feed, Max 5) */}
      {/* Display: Icon, Event Title, Timestamp, Action Button */}
      {/* ========================================================= */}
      <section aria-label="Live Teacher Feed">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Live Teacher Feed
            </h2>
            <span className="text-[12px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full">
              Real-Time Feed
            </span>
          </div>

          <div className="space-y-3">
            {liveTeacherFeed.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${activity.iconBg}`}
                    >
                      <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-[#2563EB] transition-colors truncate">
                        {activity.title}
                      </p>
                      <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={activity.action}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-[#2563EB] text-slate-700 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-2xs hover:shadow-xs flex-shrink-0 ml-2 cursor-pointer"
                  >
                    <span>{activity.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MOBILE FLOATING QUICK ACTION BUTTON (FAB) */}
      {/* ========================================================= */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setMobileFabOpen(true)}
          className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open Quick Actions"
          aria-label="Open Quick Actions"
        >
          <Zap className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* MOBILE FAB DRAWER / POPUP */}
      {mobileFabOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-sm w-full p-5 space-y-3 shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Quick Actions</h3>
              </div>
              <button
                onClick={() => setMobileFabOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {quickActions.slice(0, 6).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileFabOpen(false);
                      item.action();
                    }}
                    className="flex flex-col items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer text-center"
                  >
                    <Icon className={`w-6 h-6 mb-1.5 ${item.color}`} />
                    <span className="font-medium text-slate-700 leading-tight">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
