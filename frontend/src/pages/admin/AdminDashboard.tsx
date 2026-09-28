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
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  FileSpreadsheet,
  Settings,
  BookMarked,
  FileClock,
  ShieldCheck,
  PenLine,
  Files,
  Megaphone,
  KeyRound,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminModuleItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
  iconStyle: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<DashboardViewState>('default');

  const isLoading = viewState === 'loading';
  const isEmpty = viewState === 'empty';

  // 24 Admin Navigation Modules mapping directly to existing application routes
  const adminModules: AdminModuleItem[] = [
    // STUDENTS & FACULTY
    {
      id: 'students-directory',
      title: 'Students Directory',
      description: 'Manage student records & profiles',
      route: '/admin/students',
      icon: GraduationCap,
      iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'parents-management',
      title: 'Parents Management',
      description: 'Parent accounts & contacts',
      route: '/admin/parents',
      icon: Users,
      iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
    },
    {
      id: 'teachers-staff',
      title: 'Teachers & Staff',
      description: 'Faculty profiles & subject allocations',
      route: '/admin/teachers',
      icon: UserCheck,
      iconStyle: 'text-[#1677FF] bg-[#EEF4FF] border-[#DCE5F2]',
    },

    // ACADEMIC STRUCTURE
    {
      id: 'batches-classes',
      title: 'Batches & Classes',
      description: 'Grade levels & batch schedules',
      route: '/admin/batches',
      icon: Layers,
      iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'boards-subjects',
      title: 'Boards & Subjects',
      description: 'CBSE & State Board curriculums',
      route: '/admin/subjects',
      icon: BookOpen,
      iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'timetable-sessions',
      title: 'Timetable & Sessions',
      description: 'Class weekly schedules & timings',
      route: '/admin/timetable',
      icon: Clock,
      iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
    },
    {
      id: 'portion-completion',
      title: 'Portion Completion',
      description: 'Syllabus tracker & milestones',
      route: '/admin/portion-completion',
      icon: BookMarked,
      iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },

    // ATTENDANCE & STUDENT OPERATIONS
    {
      id: 'take-attendance',
      title: 'Take Attendance',
      description: 'Live batch attendance rolls',
      route: '/admin/attendance',
      icon: ClipboardCheck,
      iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'attendance-history',
      title: 'Attendance History',
      description: 'Historical registers & reports',
      route: '/admin/attendance-history',
      icon: CalendarCheck,
      iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'leave-reports',
      title: 'Leave Reports',
      description: 'Review student leave applications',
      route: '/admin/leave-requests',
      icon: FileClock,
      iconStyle: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      id: 'homework-safety-desk',
      title: 'Homework / Safety Desk',
      description: 'Arrival & departure home-reach logs',
      route: '/admin/home-reach',
      icon: ShieldCheck,
      iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'daily-updates',
      title: 'Daily Updates',
      description: 'Daily syllabus & session updates',
      route: '/admin/daily-updates',
      icon: Bell,
      iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
    },

    // TESTS & MARKS
    {
      id: 'tests-question-papers',
      title: 'Tests & Question Papers',
      description: 'Exam scheduling & question papers',
      route: '/admin/tests',
      icon: FileQuestion,
      iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'enter-edit-marks',
      title: 'Enter / Edit Marks',
      description: 'Student scores & grade entries',
      route: '/admin/marks',
      icon: PenLine,
      iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
    },
    {
      id: 'student-scorecard',
      title: 'Student Scorecard',
      description: 'Official academic report cards',
      route: '/admin/scorecards',
      icon: Award,
      iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
    },
    {
      id: 'answer-sheet-repository',
      title: 'Answer Sheet Repository',
      description: 'Uploaded paper answer scans',
      route: '/admin/answer-sheets',
      icon: Files,
      iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
    },

    // COMMUNICATION
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Broadcast notices to parents & staff',
      route: '/admin/announcements',
      icon: Megaphone,
      iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
    },
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'Academic calendar & event schedules',
      route: '/admin/announcements',
      icon: CalendarDays,
      iconStyle: 'text-[#5B6B82] bg-[#F5F8FC] border-[#DCE5F2]',
    },

    // ANALYTICS & REPORTING
    {
      id: 'performance-analytics',
      title: 'Performance Analytics',
      description: 'Graphical trends & subject insights',
      route: '/admin/analytics',
      icon: BarChart3,
      iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Consolidated institutional reports',
      route: '/admin/analytics',
      icon: FileSpreadsheet,
      iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
    },

    // FILES & SECURITY
    {
      id: 'uploaded-files',
      title: 'Uploaded Files',
      description: 'Study resources & institutional files',
      route: '/admin/files',
      icon: FolderOpen,
      iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'audit-logs',
      title: 'Audit Logs',
      description: 'Immutable security & activity logs',
      route: '/admin/audit-logs',
      icon: History,
      iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'password-management',
      title: 'Password Management',
      description: 'Reset credentials & secure logins',
      route: '/admin/passwords',
      icon: KeyRound,
      iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
    },
    {
      id: 'system-security',
      title: 'System & Security',
      description: 'Access policies & system config',
      route: '/admin/settings',
      icon: Settings,
      iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* State Switcher */}
      <StateToggleBar viewState={viewState} onViewStateChange={setViewState} />

      {/* Top Profile / Header Section */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Shield className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                {user?.name || 'Dr. Ramesh Sharma'}
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
      {/* 8 DASHBOARD SUMMARY CARDS (PRESERVED) */}
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

        {/* Card 5: Today's Attendance */}
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

        {/* Card 6: Pending Leaves / Action Items */}
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

        {/* Card 8: Recent Tests */}
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
      {/* ADMIN COMMAND CENTER / NAVIGATION HUB */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 sm:p-6 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0F4FA]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-[#0B1F4D] tracking-tight">
                Admin Command Center
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                {adminModules.length} Modules
              </span>
            </div>
            <p className="text-xs text-[#5B6B82] mt-0.5">
              Quick access to all administrative modules
            </p>
          </div>
          <span className="text-[11px] font-medium text-[#8A9BB0] hidden sm:inline-block">
            Click any module card to navigate
          </span>
        </div>

        {/* Responsive Grid: Desktop (4 cols), Tablet (3 cols), Mobile (2 cols), Extra Small (1 col) */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {adminModules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.route)}
                aria-label={`Open ${item.title}`}
                className="group relative text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#DCE5F2] hover:border-[#155EEF] hover:bg-[#F8FAFD] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#155EEF] focus:ring-offset-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${item.iconStyle}`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[#8A9BB0] group-hover:text-[#155EEF] group-hover:bg-[#EEF4FF] transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-[#0B1F4D] text-xs sm:text-sm group-hover:text-[#155EEF] transition-colors line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#5B6B82] mt-0.5 line-clamp-1 leading-normal">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* RECENT SECURITY & ACADEMIC AUDIT FEED */}
      {/* ========================================================= */}
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
    </div>
  );
};

export default AdminDashboard;
