import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  CalendarCheck,
  Award,
  FileText,
  FileCheck,
  TrendingUp,
  Bell,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  X,
} from 'lucide-react';
import api from '../../services/api';

export const ParentDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Modals for Quick Access items
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

  const studentPhotoUrl =
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';

  const quickAccessItems = [
    { name: 'Profile', href: '/parent/profile', icon: <User className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50 hover:bg-blue-100/80', desc: 'Student info & enrollment' },
    { name: 'Attendance', href: '/parent/attendance', icon: <CalendarCheck className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 hover:bg-emerald-100/80', desc: 'Daily records & history' },
    { name: 'Scorecard', href: '/parent/scorecards', icon: <Award className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 hover:bg-indigo-100/80', desc: '4-Subject term scorecard' },
    { name: 'Daily Updates', href: '/parent/daily-updates', icon: <Bell className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 hover:bg-amber-100/80', desc: 'Lessons & homework' },
    { name: 'Performance', href: '/parent/performance-graphs', icon: <TrendingUp className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50 hover:bg-purple-100/80', desc: 'Line & chapter bar graphs' },
    { name: 'Leave Request', href: '/parent/leaves', icon: <FileCheck className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 hover:bg-amber-100/80', desc: 'Submit & track leaves' },
    { name: 'Announcements', action: () => setActiveModal('ANNOUNCEMENTS'), icon: <Bell className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50 hover:bg-rose-100/80', desc: 'Parent meetings & notices' },
    { name: 'Timetable', action: () => setActiveModal('TIMETABLE'), icon: <Clock className="w-5 h-5 text-cyan-600" />, bg: 'bg-cyan-50 hover:bg-cyan-100/80', desc: 'Weekly schedule & timing' },
    { name: 'Calendar', action: () => setActiveModal('CALENDAR'), icon: <Calendar className="w-5 h-5 text-teal-600" />, bg: 'bg-teal-50 hover:bg-teal-100/80', desc: 'Monthly test & holidays' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Must Change Password Alert */}
      {user?.mustChangePassword && !showPasswordModal && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Action Required:</strong> You logged in with your initial password. Please set a custom permanent password.
            </span>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      )}

      {/* 1. TOP SECTION (Exact Prompt Step 24 Requirement) */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            {/* Student Photo */}
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 border-2 border-indigo-200 overflow-hidden shadow-sm flex-shrink-0">
              <img
                src={studentPhotoUrl}
                alt="Rahul Kumar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                Good Morning, Parent
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Rahul Kumar
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold text-gray-600 mt-1.5">
                <span className="bg-gray-100 px-2.5 py-0.5 rounded-md text-gray-700">Class 10 | CBSE</span>
                <span>•</span>
                <span className="text-indigo-700 font-bold">Batch 10A Morning</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-xs font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              Password
            </button>
            <button
              onClick={() => navigate('/parent/leaves')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 mr-1.5" />
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD CARDS (Exact Prompt Step 24 Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance: 91.3% */}
        <div
          onClick={() => navigate('/parent/attendance')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Attendance</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
              91.3%
            </span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">42 Present / 4 Absent</span>
          </div>
        </div>

        {/* Overall Score: 84.7% */}
        <div
          onClick={() => navigate('/parent/scorecards')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Overall Score</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
              84.7%
            </span>
            <span className="text-xs text-blue-600 font-semibold block mt-1">4 Core Subjects (Grade A)</span>
          </div>
        </div>

        {/* Latest Test: 42/50 */}
        <div
          onClick={() => navigate('/parent/scorecards')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Latest Test</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">
              42/50
            </span>
            <span className="text-xs text-purple-600 font-semibold block mt-1">Physics (84%)</span>
          </div>
        </div>

        {/* Pending Leave: 1 */}
        <div
          onClick={() => navigate('/parent/leaves')}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Leave</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 group-hover:text-amber-600 transition-colors">
              1
            </span>
            <span className="text-xs text-amber-600 font-semibold block mt-1">Medical (18/09 Review)</span>
          </div>
        </div>
      </div>

      {/* 3. STEP 25: RECENT INFORMATION (Exact Prompt Step 25 Requirement) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Information & Live Updates</h2>
            <p className="text-xs text-gray-500">Real-time tuition updates, test evaluations, announcements, and leaves.</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            Live Feed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Latest Test */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-white rounded-2xl p-4 border border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Latest Test</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">84%</span>
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-gray-900 block">Physics</span>
              <span className="text-xs text-gray-600 block mt-0.5">Chapter 4 Test</span>
              <div className="flex items-baseline space-x-1.5 mt-2">
                <span className="text-2xl font-black text-indigo-900">42/50</span>
                <span className="text-xs text-emerald-600 font-bold">(84%)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Announcement */}
          <div className="bg-gradient-to-br from-rose-50/60 to-white rounded-2xl p-4 border border-rose-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Recent Announcement</span>
              <Bell className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-gray-900 block">Parent Meeting</span>
              <span className="text-xs text-gray-600 block mt-0.5">Saturday, 20 September</span>
              <div className="mt-2 pt-2 border-t border-rose-100/80 text-[11px] text-rose-700 font-medium">
                Mandatory Term 1 Progress Review with Principal
              </div>
            </div>
          </div>

          {/* Card 3: Attendance */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Attendance</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">91.3%</span>
            </div>
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-xs text-gray-700 font-semibold">
                <span>Present: 42</span>
                <span className="text-rose-600">Absent: 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '91.3%' }} />
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block mt-2">91.3% (Compliant)</span>
            </div>
          </div>

          {/* Card 4: Latest Leave */}
          <div className="bg-gradient-to-br from-amber-50/60 to-white rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Latest Leave</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Approved</span>
            </div>
            <div className="mt-2.5">
              <span className="text-sm font-bold text-gray-900 block">18 September</span>
              <span className="text-xs text-gray-600 block mt-0.5">Medical Reason</span>
              <div className="flex items-center space-x-1.5 mt-2 pt-2 border-t border-amber-100/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800">Status: Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STEP 24: QUICK ACCESS SECTIONS (Exact 8 items) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm">
        <div className="mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Quick Access</h2>
          <p className="text-xs text-gray-500">Jump directly into academic, attendance, and tuition modules.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickAccessItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                if (item.href) navigate(item.href);
                else if (item.action) item.action();
              }}
              className={`p-4 rounded-2xl border border-gray-100 transition-all cursor-pointer group shadow-xs ${item.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white shadow-xs group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mt-3">{item.name}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS FOR QUICK ACCESS (Announcements, Timetable, Calendar) */}
      {activeModal === 'ANNOUNCEMENTS' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-gray-900 text-base">Tuition Announcements</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Upcoming Notice</span>
                <h4 className="font-bold text-gray-900 text-sm mt-0.5">Parent Meeting</h4>
                <p className="text-xs text-gray-600 mt-1">Saturday, 20 September at 10:00 AM in Tuitions Main Hall.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Exam Schedule</span>
                <h4 className="font-bold text-gray-900 text-sm mt-0.5">Monthly Revision Tests</h4>
                <p className="text-xs text-gray-600 mt-1">Commencing 25 September across Physics, Chemistry, Biology & Maths.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'TIMETABLE' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-base">Weekly Class Timetable (Batch 10A Morning)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900">Monday</span>
                <span className="text-indigo-600 font-semibold">Physics (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900">Tuesday</span>
                <span className="text-amber-600 font-semibold">Chemistry (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900">Wednesday</span>
                <span className="text-purple-600 font-semibold">Mathematics (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900">Thursday</span>
                <span className="text-emerald-600 font-semibold">Biology (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900">Friday</span>
                <span className="text-indigo-600 font-semibold">Physics & Problem Solving (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900">Saturday</span>
                <span className="text-purple-600 font-semibold">Weekly Test Session (07:00 AM - 09:30 AM)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'CALENDAR' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-gray-900 text-base">Academic Calendar (September 2026)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                <strong>01 - 06 Sept:</strong> Term 1 Chapter Diagnostic Assessments
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200">
                <strong>15 - 18 Sept:</strong> Mid-Term Unit Tests (Physics, Chem, Bio, Maths)
              </div>
              <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
                <strong>20 Sept (Sat):</strong> Parent-Teacher Meeting (10:00 AM)
              </div>
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                <strong>28 Sept:</strong> Revision Test & Scorecard Distribution
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Dialog Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Update Password</h3>
                <p className="text-xs text-gray-500">Set a custom permanent password for your parent account.</p>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-600">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="e.g. 051511"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {!user?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
