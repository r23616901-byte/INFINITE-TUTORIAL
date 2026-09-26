import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Award,
  FileCheck,
  BookOpen,
  Users,
  Megaphone,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const teacherName = user?.name || 'Mrs. Priya Sundaram';
  const roleTitle = 'Faculty • Physics & Math';
  const academicYear = 'AY 2024–25';
  const teacherPhoto =
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300';

  // Quick Stats KPI Chips: Attendance, Score, Leaves, Tests
  const kpiChips = [
    { label: 'Attendance', value: '1 Pending', color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { label: 'Score Avg', value: '82.4%', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Leaves', value: '4 Reviews', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Tests', value: '2 Scheduled', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  ];

  // Quick Actions Icon Grid (2 rows max, 6 actions, square cards, no descriptions)
  // Attendance, Marks, Leaves, Tests, Students, Notices
  const quickActions = [
    { name: 'Attendance', icon: CalendarCheck, path: '/teacher/attendance', color: 'bg-blue-600 text-white' },
    { name: 'Marks', icon: Award, path: '/teacher/marks', color: 'bg-emerald-600 text-white' },
    { name: 'Review Leaves', icon: FileCheck, path: '/teacher/leaves', color: 'bg-amber-500 text-white' },
    { name: 'Tests', icon: BookOpen, path: '/teacher/tests', color: 'bg-indigo-600 text-white' },
    { name: 'Students', icon: Users, path: '/teacher/students', color: 'bg-teal-600 text-white' },
    { name: 'Notice', icon: Megaphone, path: '/teacher/announcements', color: 'bg-rose-500 text-white' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* ── Profile Header Bar ── */}
      <div className="bg-white rounded-[20px] p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={teacherPhoto}
            alt={teacherName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {teacherName}
            </h1>
            <p className="text-xs font-semibold text-slate-500">{roleTitle}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          {academicYear}
        </span>
      </div>

      {/* ── Quick Stats KPI Chips ── */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {kpiChips.map((chip) => (
            <div
              key={chip.label}
              className={`rounded-[18px] p-3 border shadow-xs flex items-center justify-between ${chip.color}`}
            >
              <span className="text-xs font-bold opacity-80">{chip.label}</span>
              <span className="text-sm font-black tracking-tight">{chip.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions Grid (2 rows max, 6 square cards) ── */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={() => navigate(action.path)}
                className="bg-white rounded-[20px] p-3.5 border border-slate-200/90 shadow-xs hover:border-blue-500 hover:shadow-md flex flex-col items-center justify-center gap-2 aspect-square transition-all active:scale-95 cursor-pointer group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${action.color}`}
                >
                  <Icon size={20} strokeWidth={2.3} />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  {action.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Today's Schedule Action Strip ── */}
      <div
        onClick={() => navigate('/teacher/attendance')}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[20px] p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-blue-300 transition-all active:scale-98"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Clock size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              Class 10A • Physics Morning Session
            </div>
            <div className="text-[10px] font-semibold text-blue-600">Attendance Pending • Tap to Take</div>
          </div>
        </div>
        <ChevronRight size={16} className="text-blue-500 shrink-0" />
      </div>
    </div>
  );
};
