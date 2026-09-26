import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CalendarCheck,
  BarChart3,
  FileText,
  BookOpen,
  Bell,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentName = user?.name || 'Rahul Kumar';
  const gradeInfo = 'Class 10A • CBSE';
  const academicYear = 'AY 2024–25';
  const studentPhoto =
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';

  // Quick Stats KPI Chips: Attendance, Score, Leaves, Tests
  const kpiChips = [
    { label: 'Attendance', value: '91.3%', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Score', value: '84.7%', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Leaves', value: '1 Pending', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Tests', value: '2 Upcoming', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  ];

  // Quick Actions Icon Grid (2 rows max, 6 actions, square icon cards, no descriptions)
  // 👤 Profile, 📅 Attendance, 📊 Results, 📝 Leave, 📚 Tests, 📢 Updates
  const quickActions = [
    { name: 'Profile', icon: User, path: '/parent/profile', color: 'bg-blue-500 text-white', emoji: '👤' },
    { name: 'Attendance', icon: CalendarCheck, path: '/parent/attendance', color: 'bg-emerald-500 text-white', emoji: '📅' },
    { name: 'Results', icon: BarChart3, path: '/parent/marks', color: 'bg-indigo-500 text-white', emoji: '📊' },
    { name: 'Leave', icon: FileText, path: '/parent/leaves', color: 'bg-amber-500 text-white', emoji: '📝' },
    { name: 'Tests', icon: BookOpen, path: '/parent/tests', color: 'bg-violet-500 text-white', emoji: '📚' },
    { name: 'Updates', icon: Bell, path: '/parent/daily-updates', color: 'bg-rose-500 text-white', emoji: '📢' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* ── Profile Header Bar ── */}
      <div className="bg-white rounded-[20px] p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={studentPhoto}
            alt={studentName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {studentName}
            </h1>
            <p className="text-xs font-semibold text-slate-500">{gradeInfo}</p>
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

      {/* ── Recent Notice Strip (Single Touch Action) ── */}
      <div
        onClick={() => navigate('/parent/daily-updates')}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-[20px] p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-blue-300 transition-all active:scale-98"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              Mathematics Portion Complete (Ch. 6)
            </div>
            <div className="text-[10px] font-semibold text-blue-600">Tap to view updates</div>
          </div>
        </div>
        <ChevronRight size={16} className="text-blue-500 shrink-0" />
      </div>
    </div>
  );
};
