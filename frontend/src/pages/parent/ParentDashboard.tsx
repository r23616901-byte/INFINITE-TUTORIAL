import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
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
    { name: 'Profile', href: '/parent/profile', icon: <User className="w-5 h-5 text-[#155EEF]" />, bg: 'bg-[#EEF4FF] hover:bg-[#E0F8FF]', desc: 'Student info & enrollment' },
    { name: 'Attendance', href: '/parent/attendance', icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />, bg: 'bg-emerald-50 hover:bg-emerald-100/80', desc: 'Daily records & history' },
    { name: 'Scorecard', href: '/parent/scorecards', icon: <Award className="w-5 h-5 text-[#155EEF]" />, bg: 'bg-[#EEF4FF] hover:bg-[#E0F8FF]', desc: '4-Subject term scorecard' },
    { name: 'Daily Updates', href: '/parent/daily-updates', icon: <Bell className="w-5 h-5 text-[#F7931E]" />, bg: 'bg-[#FFF4E5] hover:bg-[#FFE8CC]', desc: 'Lessons & homework' },
    { name: 'Performance', href: '/parent/performance-graphs', icon: <TrendingUp className="w-5 h-5 text-[#00B8F8]" />, bg: 'bg-[#E0F8FF] hover:bg-[#BAE6FD]', desc: 'Line & chapter bar graphs' },
    { name: 'Leave Request', href: '/parent/leaves', icon: <FileCheck className="w-5 h-5 text-amber-700" />, bg: 'bg-amber-50 hover:bg-amber-100/80', desc: 'Submit & track leaves' },
    { name: 'Announcements', action: () => setActiveModal('ANNOUNCEMENTS'), icon: <Bell className="w-5 h-5 text-[#F7931E]" />, bg: 'bg-[#FFF4E5] hover:bg-[#FFE8CC]', desc: 'Parent meetings & notices' },
    { name: 'Timetable', action: () => setActiveModal('TIMETABLE'), icon: <Clock className="w-5 h-5 text-[#1677FF]" />, bg: 'bg-[#EEF4FF] hover:bg-[#E0F8FF]', desc: 'Weekly schedule & timing' },
    { name: 'Calendar', action: () => setActiveModal('CALENDAR'), icon: <Calendar className="w-5 h-5 text-[#0B1F4D]" />, bg: 'bg-[#F5F8FC] hover:bg-[#EEF4FF]', desc: 'Monthly test & holidays' },
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

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Attendance: 91.3% (Semantic Green) */}
        <div
          onClick={() => navigate('/parent/attendance')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Attendance</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-emerald-700 transition-colors">
              91.3%
            </span>
            <span className="text-xs text-emerald-700 font-semibold block mt-1">42 Present / 4 Absent</span>
          </div>
        </div>

        {/* Overall Score: 84.7% */}
        <div
          onClick={() => navigate('/parent/scorecards')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Overall Score</span>
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#155EEF] transition-colors">
              84.7%
            </span>
            <span className="text-xs text-[#155EEF] font-semibold block mt-1">4 Core Subjects (Grade A)</span>
          </div>
        </div>

        {/* Latest Test: 42/50 */}
        <div
          onClick={() => navigate('/parent/scorecards')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#1677FF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Latest Test</span>
            <div className="p-2 bg-[#EEF4FF] text-[#1677FF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#1677FF] transition-colors">
              42/50
            </span>
            <span className="text-xs text-[#1677FF] font-semibold block mt-1">Physics Unit 4 (84%)</span>
          </div>
        </div>

        {/* Pending Leave: 1 */}
        <div
          onClick={() => navigate('/parent/leaves')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Pending Leave</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              1
            </span>
            <span className="text-xs text-amber-800 font-semibold block mt-1">Medical (18/09 Review)</span>
          </div>
        </div>
      </div>

      {/* RECENT INFORMATION & LIVE UPDATES */}
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

      {/* QUICK ACCESS SECTIONS */}
      <Card
        title="Quick Access"
        subtitle="Jump directly into academic, attendance, and tuition modules"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {quickAccessItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                if (item.href) navigate(item.href);
                else if (item.action) item.action();
              }}
              className="p-4 rounded-2xl border border-[#DCE5F2] bg-white hover:border-[#155EEF] hover:bg-[#F5F8FC] transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-[#EEF4FF] border border-[#DCE5F2] group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#8A9BB0] group-hover:text-[#155EEF] transition-colors" />
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-3">{item.name}</h3>
              <p className="text-[11px] text-[#5B6B82] mt-0.5 leading-snug line-clamp-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* MODALS FOR QUICK ACCESS (Announcements, Timetable, Calendar) */}
      {activeModal === 'ANNOUNCEMENTS' && (
        <div className="fixed inset-0 z-50 bg-[#071633]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5F2] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF4E5] text-[#F7931E] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#0B1F4D] text-base">Tuition Announcements</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-[#FFF4E5] rounded-xl border border-[#FDE68A]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">Upcoming Notice</span>
                <h4 className="font-bold text-[#0B1F4D] text-sm mt-0.5">Parent Meeting</h4>
                <p className="text-xs text-[#5B6B82] mt-1">Saturday, 20 September at 10:00 AM in Tuitions Main Hall.</p>
              </div>
              <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#155EEF] block">Exam Schedule</span>
                <h4 className="font-bold text-[#0B1F4D] text-sm mt-0.5">Monthly Revision Tests</h4>
                <p className="text-xs text-[#5B6B82] mt-1">Commencing 25 September across Physics, Chemistry, Biology &amp; Maths.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'TIMETABLE' && (
        <div className="fixed inset-0 z-50 bg-[#071633]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5F2] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#155EEF] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#0B1F4D] text-base">Weekly Class Timetable (10A Morning)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="font-bold text-[#0B1F4D]">Monday</span>
                <span className="text-[#155EEF] font-bold">Physics (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="font-bold text-[#0B1F4D]">Tuesday</span>
                <span className="text-[#F7931E] font-bold">Chemistry (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="font-bold text-[#0B1F4D]">Wednesday</span>
                <span className="text-[#155EEF] font-bold">Mathematics (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="font-bold text-[#0B1F4D]">Thursday</span>
                <span className="text-emerald-700 font-bold">Biology (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="font-bold text-[#0B1F4D]">Friday</span>
                <span className="text-[#155EEF] font-bold">Physics Problem Solving (07:00 AM - 09:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2]">
                <span className="font-bold text-[#0B1F4D]">Saturday</span>
                <span className="text-[#00B8F8] font-bold">Weekly Test Session (07:00 AM - 09:30 AM)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'CALENDAR' && (
        <div className="fixed inset-0 z-50 bg-[#071633]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5F2] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#155EEF] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#0B1F4D] text-base">Academic Calendar (September 2026)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg text-[#8A9BB0] hover:text-[#0B1F4D]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                <strong>01 - 06 Sept:</strong> Term 1 Chapter Diagnostic Assessments
              </div>
              <div className="p-3 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2]">
                <strong>15 - 18 Sept:</strong> Mid-Term Unit Tests (Physics, Chem, Bio, Maths)
              </div>
              <div className="p-3 bg-[#FFF4E5] text-amber-950 rounded-xl border border-[#FDE68A]">
                <strong>20 Sept (Sat):</strong> Parent-Teacher Meeting (10:00 AM)
              </div>
              <div className="p-3 bg-[#F8FAFD] text-[#0B1F4D] rounded-xl border border-[#DCE5F2]">
                <strong>28 Sept:</strong> Revision Test &amp; Scorecard Distribution
              </div>
            </div>
          </div>
        </div>
      )}

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
