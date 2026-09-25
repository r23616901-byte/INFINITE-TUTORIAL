import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { StateToggleBar, DashboardViewState } from '../../components/common/StateToggleBar';
import {
  Shield,
  GraduationCap,
  Users,
  UserCheck,
  Layers,
  Clock,
  CalendarCheck,
  FileQuestion,
  Award,
  ArrowUpRight,
  TrendingUp,
  FolderOpen,
  History,
  BookOpen,
  FileCheck,
  BarChart3,
  Bell,
  Calendar,
  Home,
  FileSpreadsheet,
  Settings,
  X,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<DashboardViewState>('default');

  // Modal for quick announcements or info items
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const isLoading = viewState === 'loading';
  const isEmpty = viewState === 'empty';

  // Navigation Items with unified brand color palette
  const navSections = [
    {
      title: 'Academic Core & Users',
      items: [
        { label: 'Students', path: '/admin/students', icon: GraduationCap, color: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Directory, enrollment, student lifecycle' },
        { label: 'Teachers', path: '/admin/teachers', icon: Users, color: 'text-[#1677FF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Faculty profiles, subjects, batches, reset passwords' },
        { label: 'Parents', path: '/admin/students', icon: UserCheck, color: 'text-[#00B8F8] bg-[#E0F8FF] border-[#BAE6FD]', desc: 'Parent accounts, phone links & communications' },
        { label: 'Classes', path: '/admin/batches', icon: Layers, color: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Grade 9 & 10 curriculum levels' },
        { label: 'Boards', path: '/admin/batches', icon: Award, color: 'text-[#F7931E] bg-[#FFF4E5] border-[#FDE68A]', desc: 'CBSE and Karnataka State Board management' },
        { label: 'Subjects', path: '/admin/subjects', icon: BookOpen, color: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Physics, Chemistry, Biology, Mathematics' },
        { label: 'Batches', path: '/admin/batches', icon: Layers, color: 'text-[#1677FF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Morning & evening batch schedules' },
      ],
    },
    {
      title: 'Daily Operations & Attendance',
      items: [
        { label: 'Attendance', path: '/admin/attendance', icon: Clock, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Live morning & evening batch attendance rolls' },
        { label: 'Leave Requests', path: '/admin/leave-requests', icon: CalendarCheck, color: 'text-amber-800 bg-amber-50 border-amber-200', desc: 'Review & approve submitted parent leave requests' },
        { label: 'Home Reach', path: '/admin/home-reach', icon: Home, color: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Tuition departure & safe home arrival logs' },
        { label: 'Daily Updates', path: '/admin/daily-updates', icon: Bell, color: 'text-[#00B8F8] bg-[#E0F8FF] border-[#BAE6FD]', desc: 'Syllabus delivered across daily sessions' },
        { label: 'Portion Completion', action: () => setInfoModal({ title: 'Portion Completion Tracker', content: 'Term 1 Syllabi: Physics 85% completed, Mathematics 88% completed, Chemistry 80% completed, Biology 90% completed.' }), icon: BookmarkCheck, color: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Term syllabus and chapter milestone tracker' },
      ],
    },
    {
      title: 'Assessments & Performance',
      items: [
        { label: 'Tests', path: '/admin/tests', icon: FileQuestion, color: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Test creation, question papers, syllabus schedules' },
        { label: 'Marks', path: '/admin/marks', icon: FileCheck, color: 'text-[#1677FF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Marks recording, answer sheets, audit trail' },
        { label: 'Scorecards', path: '/admin/scorecards', icon: Award, color: 'text-[#F7931E] bg-[#FFF4E5] border-[#FDE68A]', desc: 'Official subject-wise student report cards' },
        { label: 'Performance', path: '/admin/performance', icon: BarChart3, color: 'text-[#00B8F8] bg-[#E0F8FF] border-[#BAE6FD]', desc: 'Graphical analytics, line charts & chapter bar charts' },
      ],
    },
    {
      title: 'Administration & Governance',
      items: [
        { label: 'Announcements', action: () => setInfoModal({ title: 'System Noticeboard', content: 'Notice: Parent-Teacher Meeting scheduled for Saturday, 20 September. Term 1 Revision Tests commence next Monday.' }), icon: Bell, color: 'text-[#F7931E] bg-[#FFF4E5] border-[#FDE68A]', desc: 'Broadcast notices to parents and teachers' },
        { label: 'Timetable', path: '/admin/batches', icon: Clock, color: 'text-[#00B8F8] bg-[#E0F8FF] border-[#BAE6FD]', desc: 'Class weekly schedules and teacher allocations' },
        { label: 'Calendar', action: () => setInfoModal({ title: 'Academic Calendar', content: 'Academic Year 2024-25: Term 1 Exams (Oct 10-18), Diwali Break (Nov 1-4), Pre-Board 1 (Dec 15-24).' }), icon: Calendar, color: 'text-[#5B6B82] bg-[#F5F8FC] border-[#DCE5F2]', desc: 'Academic calendar, exam schedules & holidays' },
        { label: 'Reports', action: () => setInfoModal({ title: 'Institutional Reports', content: 'Available reports: 1. Monthly Attendance Register, 2. Student Mark Summary, 3. Batch Performance Analytics, 4. Faculty Activity Report.' }), icon: FileSpreadsheet, color: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Attendance, fee summaries & academic reports' },
        { label: 'Settings', action: () => setInfoModal({ title: 'System Settings', content: 'Infinite Tutorial v2.4: Safe Home-Reach updates active, automated SMS notifications enabled, strict role-based access enforced.' }), icon: Settings, color: 'text-[#5B6B82] bg-[#F5F8FC] border-[#DCE5F2]', desc: 'System configuration, notifications & roles' },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: History, color: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]', desc: 'Immutable security log for all mark edits & actions' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* State Switcher */}
      <StateToggleBar viewState={viewState} onViewStateChange={setViewState} />

      {/* Top Welcome Header */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Shield className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                {user?.name || 'Administrator'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                INSTITUTE CONTROLLER
              </span>
            </div>
            <p className="text-xs text-[#5B6B82] mt-1">
              Infinite Tutorial Administrative Console &bull; Email: {user?.email || 'admin@infinitetutorial.com'} &bull; Phone: {user?.phone || '+91 9876543210'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate('/admin/teachers')}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            Manage Teachers
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/admin/students')}
            leftIcon={<GraduationCap className="w-3.5 h-3.5" />}
          >
            Manage Students
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 8 DASHBOARD SUMMARY CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Students */}
        <StatCard
          title="Total Students"
          value={isEmpty ? '0' : '84'}
          subtitle="9th & 10th grades"
          icon={<GraduationCap className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Enrolled"
          badgeVariant="blue"
          trend={{ text: '+12% this term', type: 'positive', icon: <TrendingUp className="w-3 h-3" /> }}
          isLoading={isLoading}
        />

        {/* Card 2: Total Teachers */}
        <StatCard
          title="Total Teachers"
          value={isEmpty ? '0' : '8'}
          subtitle="Active faculty staff"
          icon={<Users className="w-5 h-5 text-[#1677FF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Verified"
          badgeVariant="blue"
          isLoading={isLoading}
        />

        {/* Card 3: Total Parents */}
        <StatCard
          title="Total Parents"
          value={isEmpty ? '0' : '78'}
          subtitle="Linked parent accounts"
          icon={<UserCheck className="w-5 h-5 text-[#00B8F8]" />}
          iconBg="bg-[#E0F8FF] border border-[#BAE6FD]"
          badge="Active Portals"
          badgeVariant="cyan"
          isLoading={isLoading}
        />

        {/* Card 4: Total Batches */}
        <StatCard
          title="Total Batches"
          value={isEmpty ? '0' : '6'}
          subtitle="CBSE & State Board"
          icon={<Layers className="w-5 h-5 text-[#0B1F4D]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Active Batches"
          badgeVariant="navy"
          isLoading={isLoading}
        />

        {/* Card 5: Today's Attendance (Semantic Green Status) */}
        <StatCard
          title="Today's Attendance"
          value={isEmpty ? '0.0%' : '91.3%'}
          subtitle={isEmpty ? 'No records' : '79 / 84 students present'}
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 border border-emerald-200"
          badge="Live Status"
          badgeVariant="emerald"
          isLoading={isLoading}
        />

        {/* Card 6: Pending Leaves (Semantic Amber Status) */}
        <StatCard
          title="Pending Leaves"
          value={isEmpty ? '0' : '4'}
          subtitle="Awaiting admin review"
          icon={<CalendarCheck className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50 border border-amber-200"
          badge="Action Needed"
          badgeVariant="amber"
          isLoading={isLoading}
        />

        {/* Card 7: Upcoming Tests */}
        <StatCard
          title="Upcoming Tests"
          value={isEmpty ? '0' : '2'}
          subtitle="Scheduled this week"
          icon={<FileQuestion className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="This Week"
          badgeVariant="blue"
          isLoading={isLoading}
        />

        {/* Card 8: Recent Tests (Accent Gold) */}
        <StatCard
          title="Recent Tests"
          value={isEmpty ? '0' : '4'}
          subtitle="Evaluated recently"
          icon={<Award className="w-5 h-5 text-[#F7931E]" />}
          iconBg="bg-[#FFF4E5] border border-[#FDE68A]"
          badge="Published"
          badgeVariant="amber"
          isLoading={isLoading}
        />
      </div>

      {/* ========================================================= */}
      {/* ADMIN NAVIGATION HUB */}
      {/* ========================================================= */}
      <Card
        title="Admin Command & Navigation Hub"
        subtitle="Complete system control navigation across all academic and institutional modules"
      >
        <div className="space-y-6">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6B82] border-b border-[#F0F4FA] pb-1.5">
                {sec.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {sec.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={iIdx}
                      onClick={() => {
                        if (item.path) navigate(item.path);
                        else if (item.action) item.action();
                      }}
                      className="p-3.5 rounded-2xl border border-[#DCE5F2] bg-white hover:bg-[#F5F8FC] hover:border-[#155EEF] transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#8A9BB0] group-hover:text-[#155EEF] transition-colors" />
                      </div>
                      <div className="mt-2.5">
                        <h4 className="font-bold text-[#0B1F4D] text-xs">{item.label}</h4>
                        <p className="text-[11px] text-[#5B6B82] mt-0.5 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Audit Activities Feed */}
      <Card
        title="Recent Security & Academic Audit Feed"
        subtitle="Real-time log of faculty actions, attendance submissions, and test records"
      >
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonBlock height="h-10" />
            <SkeletonBlock height="h-10" />
            <SkeletonBlock height="h-10" />
          </div>
        ) : isEmpty ? (
          <EmptyState
            title="No Audit Activities Yet"
            description="System operations and faculty submissions will appear here."
            icon={<FolderOpen className="w-6 h-6 text-[#155EEF]" />}
          />
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFD] border-b border-[#DCE5F2] text-[#0B1F4D] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3">Event / Operation</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Entity</th>
                  <th className="px-6 py-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4FA]">
                <tr className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#0B1F4D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Attendance Batch Submitted
                  </td>
                  <td className="px-6 py-3 text-[#5B6B82]">Mrs. Priya (Science)</td>
                  <td className="px-6 py-3 text-[#5B6B82]">10th A Morning</td>
                  <td className="px-6 py-3 text-right text-[#8A9BB0]">10 mins ago</td>
                </tr>
                <tr className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#0B1F4D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#155EEF]" />
                    Test Paper Uploaded
                  </td>
                  <td className="px-6 py-3 text-[#5B6B82]">Mr. Anand (Maths)</td>
                  <td className="px-6 py-3 text-[#5B6B82]">Algebra Unit 3</td>
                  <td className="px-6 py-3 text-right text-[#8A9BB0]">45 mins ago</td>
                </tr>
                <tr className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#0B1F4D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00B8F8]" />
                    Teacher Password Reset
                  </td>
                  <td className="px-6 py-3 text-[#5B6B82]">Admin</td>
                  <td className="px-6 py-3 text-[#5B6B82]">Prof. Rajesh Sharma</td>
                  <td className="px-6 py-3 text-right text-[#8A9BB0]">1 hour ago</td>
                </tr>
                <tr className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#0B1F4D] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F7931E]" />
                    Student Enrollment Verified
                  </td>
                  <td className="px-6 py-3 text-[#5B6B82]">Admin</td>
                  <td className="px-6 py-3 text-[#5B6B82]">Rahul Kumar (IT10025)</td>
                  <td className="px-6 py-3 text-right text-[#8A9BB0]">2 hours ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-[#071633]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F4FA] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EEF4FF] text-[#155EEF] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#0B1F4D] text-base">{infoModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="p-1.5 text-[#8A9BB0] hover:text-[#0B1F4D] rounded-lg hover:bg-[#F5F8FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#5B6B82] leading-relaxed">{infoModal.content}</p>
            <div className="flex justify-end pt-2 border-t border-[#F0F4FA]">
              <Button size="sm" variant="primary" onClick={() => setInfoModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
