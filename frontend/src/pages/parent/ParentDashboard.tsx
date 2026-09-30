import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { QuickAccessHub, QuickAccessCategory } from '../../components/common/QuickAccessHub';
import {
  CalendarCheck,
  Award,
  FileCheck,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  UserCheck,
  Home,
  ClipboardCheck,
  FileSpreadsheet,
  FileQuestion,
  Files,
  BookMarked,
  BarChart3,
  CalendarDays,
  Megaphone,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import api from '../../services/api';

export const ParentDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

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

  const studentPhotoUrl =
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';

  // Parent Quick Access categorized navigation modules
  const parentCategories: QuickAccessCategory[] = [
    {
      title: 'Student',
      items: [
        {
          id: 'parent-student-profile',
          title: 'Student Profile',
          description: 'Enrollment details & student bio',
          route: '/parent/profile',
          icon: UserCheck,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'parent-scorecard',
          title: 'Scorecard',
          description: '4-Subject term report cards',
          route: '/parent/scorecards',
          icon: Award,
          iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
          badge: '84.7%',
        },
        {
          id: 'parent-tests',
          title: 'Tests',
          description: 'Exam schedules & test papers',
          route: '/parent/test-papers',
          icon: FileQuestion,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
        {
          id: 'parent-answer-sheets',
          title: 'Answer Sheets',
          description: 'Scanned paper answer sheets',
          route: '/parent/answer-sheets',
          icon: Files,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
      ],
    },
    {
      title: 'Attendance & Leave',
      items: [
        {
          id: 'parent-attendance',
          title: 'Attendance',
          description: 'Live morning & evening roll status',
          route: '/parent/attendance',
          icon: ClipboardCheck,
          iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badge: '91.3%',
        },
        {
          id: 'parent-attendance-history',
          title: 'Attendance History',
          description: 'Monthly attendance registers & metrics',
          route: '/parent/attendance',
          icon: CalendarCheck,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'parent-leave-requests',
          title: 'Leave Requests',
          description: 'Submit & monitor leave status',
          route: '/parent/leaves',
          icon: FileCheck,
          iconStyle: 'text-amber-800 bg-amber-50 border-amber-200',
        },
        {
          id: 'parent-home-reach',
          title: 'Home Reach',
          description: 'Safe arrival & departure alerts',
          route: '/parent/tuition-reach',
          icon: Home,
          iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badge: 'Safe',
        },
      ],
    },
    {
      title: 'Academics',
      items: [
        {
          id: 'parent-daily-updates',
          title: 'Daily Updates',
          description: 'Topics taught & homework assigned',
          route: '/parent/daily-updates',
          icon: FileSpreadsheet,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
        {
          id: 'parent-portion-completion',
          title: 'Portion Completion',
          description: 'Term syllabus progress & chapters',
          route: '/parent/portion-completion',
          icon: BookMarked,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'parent-performance',
          title: 'Performance',
          description: 'Line charts & chapter comparisons',
          route: '/parent/performance-graphs',
          icon: BarChart3,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
        {
          id: 'parent-timetable',
          title: 'Timetable',
          description: 'Weekly schedule & class timing',
          route: '/parent/timetable',
          icon: Clock,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
      ],
    },
    {
      title: 'Communication & Security',
      items: [
        {
          id: 'parent-announcements',
          title: 'Announcements',
          description: 'Institute circulars & notices',
          route: '/parent/announcements',
          icon: Megaphone,
          iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
          badge: '2 New',
        },
        {
          id: 'parent-calendar',
          title: 'Calendar',
          description: 'Exam dates, holidays & PTM dates',
          route: '/parent/calendar',
          icon: CalendarDays,
          iconStyle: 'text-[#5B6B82] bg-[#F5F8FC] border-[#DCE5F2]',
        },
        {
          id: 'parent-notifications',
          title: 'Notifications',
          description: 'System reminders & faculty alerts',
          route: '/parent/announcements',
          icon: Bell,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'parent-change-password',
          title: 'Change Password',
          description: 'Manage account security credentials',
          action: () => setShowPasswordModal(true),
          icon: KeyRound,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Must Change Password Alert */}
      {user?.mustChangePassword && !showPasswordModal && (
        <div className="bg-[#FFF4E5] border border-[#FDE68A] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
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

      {/* TOP STUDENT WELCOME HERO BANNER */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {/* Student Photo */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#EEF4FF] border-2 border-[#DCE5F2] overflow-hidden shadow-xs flex-shrink-0">
              <img
                src={studentPhotoUrl}
                alt="Rahul Kumar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#155EEF] block mb-1">
                Parent &amp; Student Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F4D] tracking-tight">
                Rahul Kumar
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-[#5B6B82] mt-1.5">
                <span className="bg-[#F5F8FC] px-2.5 py-0.5 rounded-lg text-[#0B1F4D] border border-[#DCE5F2]">
                  Class 10 | CBSE Board
                </span>
                <span>•</span>
                <span className="text-[#155EEF] font-bold">Batch 10A Morning</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowPasswordModal(true)}
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            >
              Password
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/parent/leaves')}
              leftIcon={<FileCheck className="w-3.5 h-3.5" />}
            >
              Apply Leave
            </Button>
          </div>
        </div>
      </div>

      {/* CATEGORY NAVIGATION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Student Tracking */}
        <button
          onClick={() => navigate('/parent/profile')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group flex items-center gap-4 text-left"
        >
          <div className="p-3 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-[#0B1F4D] block">Student Tracking</span>
            <span className="text-xs text-[#5B6B82] font-medium">Profile & Attendance</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5B6B82] shrink-0" />
        </button>

        {/* Academic Performance */}
        <button
          onClick={() => navigate('/parent/scorecards')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group flex items-center gap-4 text-left"
        >
          <div className="p-3 bg-[#FFF4E5] text-[#D97706] rounded-xl border border-[#FDE68A] group-hover:scale-105 transition-transform shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-[#0B1F4D] block">Academic Performance</span>
            <span className="text-xs text-[#5B6B82] font-medium">Scores & Scorecards</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5B6B82] shrink-0" />
        </button>

        {/* Schedule & Updates */}
        <button
          onClick={() => navigate('/parent/daily-updates')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group flex items-center gap-4 text-left"
        >
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 group-hover:scale-105 transition-transform shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-[#0B1F4D] block">Schedule & Updates</span>
            <span className="text-xs text-[#5B6B82] font-medium">Timetable & Notices</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5B6B82] shrink-0" />
        </button>
      </div>


      {/* RECENT INFORMATION & LIVE UPDATES (PRESERVED) */}
      <Card
        title="Recent Information & Live Updates"
        subtitle="Real-time tuition updates, test evaluations, announcements, and leaves"
        headerAction={
          <span className="text-xs font-bold text-[#155EEF] bg-[#EEF4FF] px-2.5 py-1 rounded-full border border-[#DCE5F2]">
            Live Academic Feed
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Latest Test */}
          <div className="bg-[#F8FAFD] rounded-xl p-4 border border-[#DCE5F2]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#155EEF]">Latest Test</span>
              <span className="text-xs bg-[#EEF4FF] text-[#155EEF] px-2 py-0.5 rounded font-bold border border-[#DCE5F2]">84%</span>
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-[#0B1F4D] block">Physics</span>
              <span className="text-xs text-[#5B6B82] block mt-0.5">Chapter 4 Test</span>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-2xl font-black text-[#0B1F4D]">42/50</span>
                <span className="text-xs text-emerald-700 font-bold">(84% Grade A)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Announcement */}
          <div className="bg-[#FFF4E5] rounded-xl p-4 border border-[#FDE68A]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">Announcement</span>
              <Bell className="w-3.5 h-3.5 text-[#F7931E]" />
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-[#0B1F4D] block">Parent Meeting</span>
              <span className="text-xs text-[#5B6B82] block mt-0.5">Saturday, 20 September</span>
              <div className="mt-2 pt-2 border-t border-[#FDE68A] text-[11px] text-amber-900 font-medium">
                Mandatory Term 1 Progress Review with Principal
              </div>
            </div>
          </div>

          {/* Card 3: Attendance */}
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">Attendance</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">91.3%</span>
            </div>
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-xs text-[#0B1F4D] font-bold">
                <span>Present: 42</span>
                <span className="text-red-700">Absent: 4</span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '91.3%' }} />
              </div>
              <span className="text-[11px] text-emerald-800 font-bold block mt-2">91.3% Compliant Attendance</span>
            </div>
          </div>

          {/* Card 4: Latest Leave */}
          <div className="bg-[#F8FAFD] rounded-xl p-4 border border-[#DCE5F2]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B6B82]">Latest Leave</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">Approved</span>
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-[#0B1F4D] block">18 September</span>
              <span className="text-xs text-[#5B6B82] block mt-0.5">Medical Reason</span>
              <div className="flex items-center space-x-1.5 mt-2 pt-2 border-t border-[#DCE5F2]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-[#0B1F4D]">Verified by Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ========================================================= */}
      {/* PARENT QUICK ACCESS (CATEGORIZED QUICK ACCESS HUB) */}
      {/* ========================================================= */}
      <QuickAccessHub
        sectionTitle="Parent Quick Access"
        sectionSubtitle="Quick access to your child's academic information"
        categories={parentCategories}
      />

      {/* Password Change Dialog Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-[#071633]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5F2] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#155EEF] flex items-center justify-center border border-[#DCE5F2]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B1F4D] text-base">Update Password</h3>
                <p className="text-xs text-[#5B6B82]">Set a custom permanent password for your parent account.</p>
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
