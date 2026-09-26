import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Building2,
  CalendarCheck,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const adminName = user?.name || 'Dr. Ramesh Sharma';
  const roleTitle = 'Institution Director';
  const academicYear = 'AY 2024–25';
  const adminPhoto =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300';

  // Quick Stats KPI Chips: Attendance, Score, Leaves, Tests
  const kpiChips = [
    { label: 'Attendance', value: '91.3% Avg', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Score Avg', value: '84.2%', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Leaves', value: '4 Pending', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Tests Active', value: '3 Batches', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ];

  // Quick Actions Icon Grid (2 rows max, 6 actions, square cards, no descriptions)
  // Students, Teachers, Batches, Attendance, Leaves, Audit
  const quickActions = [
    { name: 'Students', icon: Users, path: '/admin/students', color: 'bg-blue-600 text-white' },
    { name: 'Teachers', icon: GraduationCap, path: '/admin/teachers', color: 'bg-emerald-600 text-white' },
    { name: 'Batches', icon: Building2, path: '/admin/batches', color: 'bg-indigo-600 text-white' },
    { name: 'Attendance', icon: CalendarCheck, path: '/admin/attendance-history', color: 'bg-amber-500 text-white' },
    { name: 'Leaves', icon: FileCheck, path: '/admin/review-leaves', color: 'bg-rose-500 text-white' },
    { name: 'Audit Logs', icon: ShieldAlert, path: '/admin/audit-logs', color: 'bg-slate-700 text-white' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* ── Profile Header Bar ── */}
      <div className="bg-white rounded-[20px] p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={adminPhoto}
            alt={adminName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/20"
          />
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {adminName}
            </h1>
            <p className="text-xs font-semibold text-slate-500">{roleTitle}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
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
                className="bg-white rounded-[20px] p-3.5 border border-slate-200/90 shadow-xs hover:border-amber-500 hover:shadow-md flex flex-col items-center justify-center gap-2 aspect-square transition-all active:scale-95 cursor-pointer group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${action.color}`}
                >
                  <Icon size={20} strokeWidth={2.3} />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
                  {action.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Institute Status Action Strip ── */}
      <div
        onClick={() => navigate('/admin/audit-logs')}
        className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-[20px] p-3.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-amber-400 transition-all active:scale-98"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Shield size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              System Operations Normal • 6 Batches Active
            </div>
            <div className="text-[10px] font-semibold text-amber-700">Tap to view institution logs</div>
          </div>
        </div>
        <ChevronRight size={16} className="text-amber-600 shrink-0" />
      </div>
    </div>
  );
};
