import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  CalendarCheck,
  Award,
  FileCheck,
  User,
  TrendingUp,
  Calendar,
  FileText,
  BookOpen,
  Megaphone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  X,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';

export const ParentDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Modals for Quick Action items
  const [activeModal, setActiveModal] = useState<'ANNOUNCEMENTS' | 'TIMETABLE' | 'CALENDAR' | null>(null);

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(user?.mustChangePassword || false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        setPasswordSuccess('Password successfully updated! You can now use your new password.');
        updateUser({ mustChangePassword: false });
        setTimeout(() => {
          setShowPasswordModal(false);
        }, 1500);
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ROW 2 — QUICK ACTION GRID (8 Square Icon Cards)
  // 👤 Profile, 📊 Scorecard, 📈 Performance, 📅 Calendar, 📝 Leave, 📚 Homework, 📢 Notices, ⏰ Timetable
  const quickActions = [
    {
      id: 'profile',
      name: 'Profile',
      icon: User,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/parent/profile'),
    },
    {
      id: 'scorecard',
      name: 'Scorecard',
      icon: Award,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => navigate('/parent/scorecards'),
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: TrendingUp,
      color: 'text-[#0284C7]',
      bgColor: 'bg-sky-50/80 group-hover:bg-sky-100',
      action: () => navigate('/parent/performance-graphs'),
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: Calendar,
      color: 'text-[#7C3AED]',
      bgColor: 'bg-purple-50/80 group-hover:bg-purple-100',
      action: () => setActiveModal('CALENDAR'),
    },
    {
      id: 'leave',
      name: 'Leave',
      icon: FileText,
      color: 'text-[#D97706]',
      bgColor: 'bg-amber-50/80 group-hover:bg-amber-100',
      action: () => navigate('/parent/leaves'),
    },
    {
      id: 'homework',
      name: 'Homework',
      icon: BookOpen,
      color: 'text-[#059669]',
      bgColor: 'bg-emerald-50/80 group-hover:bg-emerald-100',
      action: () => navigate('/parent/daily-updates'),
    },
    {
      id: 'notices',
      name: 'Notices',
      icon: Megaphone,
      color: 'text-[#EA580C]',
      bgColor: 'bg-orange-50/80 group-hover:bg-orange-100',
      action: () => setActiveModal('ANNOUNCEMENTS'),
    },
    {
      id: 'timetable',
      name: 'Timetable',
      icon: Clock,
      color: 'text-[#2563EB]',
      bgColor: 'bg-blue-50/80 group-hover:bg-blue-100',
      action: () => setActiveModal('TIMETABLE'),
    },
  ];

  // ROW 3 — ACTIVITY FEED (Maximum 5 entries)
  // 📢 Parent Meeting Scheduled, 📊 Physics Test: 42/50, 📝 Leave Approved, 📅 Holiday Tomorrow, 📚 New Homework Uploaded
  const activityFeed = [
    {
      id: '1',
      title: 'Parent Meeting Scheduled',
      timestamp: 'Tomorrow, 10:00 AM',
      icon: Megaphone,
      iconColor: 'text-[#EA580C]',
      iconBg: 'bg-orange-50',
      action: () => setActiveModal('ANNOUNCEMENTS'),
    },
    {
      id: '2',
      title: 'Physics Test: 42/50',
      timestamp: 'Yesterday',
      icon: Award,
      iconColor: 'text-[#2563EB]',
      iconBg: 'bg-blue-50',
      action: () => navigate('/parent/scorecards'),
    },
    {
      id: '3',
      title: 'Leave Approved',
      timestamp: '18 Sep, 2:30 PM',
      icon: CheckCircle2,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-emerald-50',
      action: () => navigate('/parent/leaves'),
    },
    {
      id: '4',
      title: 'Holiday Tomorrow',
      timestamp: '2 days ago',
      icon: Calendar,
      iconColor: 'text-[#7C3AED]',
      iconBg: 'bg-purple-50',
      action: () => setActiveModal('CALENDAR'),
    },
    {
      id: '5',
      title: 'New Homework Uploaded',
      timestamp: '3 days ago',
      icon: BookOpen,
      iconColor: 'text-[#059669]',
      iconBg: 'bg-emerald-50',
      action: () => navigate('/parent/daily-updates'),
    },
  ];

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* Must Change Password Alert */}
      {user?.mustChangePassword && !showPasswordModal && (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
            <span>
              <strong>Action Required:</strong> You logged in with your initial password. Please set a custom permanent password.
            </span>
          </div>
          <Button
            size="sm"
            variant="accent"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
        </div>
      )}

      {/* ========================================================= */}
      {/* ROW 1 — KEY METRICS (3 Compact KPI Cards) */}
      {/* Attendance: 91.3% | Overall Score: 84.7% | Pending Leave: 1 */}
      {/* Style: Equal width, Rounded 16px, Soft shadow, Icon on top, */}
      {/* Large metric (36px / Bold), Small label (14px / Medium), Hover animation */}
      {/* NO descriptions! */}
      {/* ========================================================= */}
      <section aria-label="Key Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Attendance */}
          <div
            onClick={() => navigate('/parent/attendance')}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center transition-transform group-hover:scale-110">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-[36px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#10B981] transition-colors">
                91.3%
              </div>
              <div className="text-[14px] font-medium text-slate-500 mt-2">
                Attendance
              </div>
            </div>
          </div>

          {/* Card 2: Overall Score */}
          <div
            onClick={() => navigate('/parent/scorecards')}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center transition-transform group-hover:scale-110">
              <Award className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-[36px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#2563EB] transition-colors">
                84.7%
              </div>
              <div className="text-[14px] font-medium text-slate-500 mt-2">
                Overall Score
              </div>
            </div>
          </div>

          {/* Card 3: Pending Leave */}
          <div
            onClick={() => navigate('/parent/leaves')}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center transition-transform group-hover:scale-110">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-[36px] font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#F59E0B] transition-colors">
                1
              </div>
              <div className="text-[14px] font-medium text-slate-500 mt-2">
                Pending Leave
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ROW 2 — QUICK ACTION GRID (8 Square Cards, 160x160 Desktop) */}
      {/* 👤 Profile, 📊 Scorecard, 📈 Performance, 📅 Calendar, */}
      {/* 📝 Leave, 📚 Homework, 📢 Notices, ⏰ Timetable */}
      {/* Style: 32px icons, small label only, hover scale, hover shadow */}
      {/* ========================================================= */}
      <section aria-label="Quick Actions">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 sm:gap-4 justify-items-stretch">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="w-full lg:w-[160px] lg:h-[160px] aspect-square bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group select-none"
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
      {/* ROW 3 — ACTIVITY FEED (Timeline / Feed Appearance, Max 5) */}
      {/* 📢 Parent Meeting Scheduled, 📊 Physics Test: 42/50, */}
      {/* 📝 Leave Approved, 📅 Holiday Tomorrow, 📚 New Homework Uploaded */}
      {/* ========================================================= */}
      <section aria-label="Activity Feed">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Activity Feed
            </h2>
            <span className="text-[12px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full">
              Latest Updates
            </span>
          </div>

          <div className="space-y-3">
            {activityFeed.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  onClick={activity.action}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
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

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODALS (Announcements, Timetable, Calendar, Password) */}
      {/* ========================================================= */}

      {/* ANNOUNCEMENTS MODAL */}
      {activeModal === 'ANNOUNCEMENTS' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Notices &amp; Announcements</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                  Mandatory Event
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Parent-Teacher Meeting</h4>
                <p className="text-slate-600 mt-1">Saturday, 20 September at 10:00 AM in the Tuitions Main Hall.</p>
              </div>
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                  Exam Schedule
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Monthly Revision Tests</h4>
                <p className="text-slate-600 mt-1">Commencing 25 September across Physics, Chemistry, Biology &amp; Mathematics.</p>
              </div>
            </div>
            <div className="pt-2 text-right">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setActiveModal(null);
                  navigate('/parent/announcements');
                }}
              >
                View All Notices
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TIMETABLE MODAL */}
      {activeModal === 'TIMETABLE' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Weekly Class Timetable (10A Morning)</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { day: 'Monday', subject: 'Physics', time: '07:00 AM - 09:30 AM', color: 'text-[#2563EB]' },
                { day: 'Tuesday', subject: 'Chemistry', time: '07:00 AM - 09:30 AM', color: 'text-[#F59E0B]' },
                { day: 'Wednesday', subject: 'Mathematics', time: '07:00 AM - 09:30 AM', color: 'text-[#2563EB]' },
                { day: 'Thursday', subject: 'Biology', time: '07:00 AM - 09:30 AM', color: 'text-[#10B981]' },
                { day: 'Friday', subject: 'Physics Problem Solving', time: '07:00 AM - 09:30 AM', color: 'text-[#2563EB]' },
                { day: 'Saturday', subject: 'Weekly Assessment Session', time: '07:00 AM - 09:30 AM', color: 'text-[#7C3AED]' },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="font-semibold text-slate-900">{item.day}</span>
                  <span className={`font-semibold ${item.color}`}>
                    {item.subject}{' '}
                    <span className="text-slate-400 font-normal">({item.time})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR MODAL */}
      {activeModal === 'CALENDAR' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Academic Calendar (September 2026)</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100">
                <strong>01 - 06 Sept:</strong> Term 1 Chapter Diagnostic Assessments
              </div>
              <div className="p-3 bg-blue-50 text-blue-950 rounded-xl border border-blue-100">
                <strong>15 - 18 Sept:</strong> Mid-Term Unit Tests (Physics, Chem, Bio, Maths)
              </div>
              <div className="p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-100">
                <strong>20 Sept (Sat):</strong> Parent-Teacher Meeting (10:00 AM)
              </div>
              <div className="p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200">
                <strong>28 Sept:</strong> Revision Test &amp; Scorecard Distribution
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD CHANGE MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-md w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Update Password</h3>
                <p className="text-xs text-slate-500">Set a custom permanent password for your parent account.</p>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3.5 text-left">
              <div>
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="e.g. 260906"
                  required
                />
              </div>

              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>

              <div>
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {!user?.mustChangePassword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                >
                  Save New Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
