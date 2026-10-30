import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { QuickAccessHub, QuickAccessCategory } from '../../components/common/QuickAccessHub';
import { fetchStudents } from '../../services/studentService';
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
  TrendingUp,
  FolderOpen,
  History,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  CalendarDays,
  FileSpreadsheet,
  BookMarked,
  FileClock,
  ShieldCheck,
  PenLine,
  Files,
  Megaphone,
  KeyRound,
  Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState<number>(6);

  useEffect(() => {
    fetchStudents()
      .then((res) => {
        if (res?.students?.length) {
          setStudentCount(res.students.length);
        }
      })
      .catch(() => {});
  }, []);

  // Admin Command Center categorized modules with compact/detailed view matching Teacher & Parent portals
  const adminCategories: QuickAccessCategory[] = [
    {
      title: 'Students & Faculty',
      items: [
        {
          id: 'students-directory',
          title: 'Students Directory',
          description: 'Manage student records & profiles',
          route: '/admin/students',
          icon: GraduationCap,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
          badge: String(studentCount),
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
          badge: '8',
        },
      ],
    },
    {
      title: 'Academic Structure',
      items: [
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
      ],
    },
    {
      title: 'Attendance & Student Operations',
      items: [
        {
          id: 'take-attendance',
          title: 'Take Attendance',
          description: 'Live batch attendance rolls',
          route: '/admin/attendance',
          icon: ClipboardCheck,
          iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badge: 'Pending',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
          badge: '4 Review',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
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
      ],
    },
    {
      title: 'Tests, Question Papers & Marks',
      items: [
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
      ],
    },
    {
      title: 'Communication & Announcements',
      items: [
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
      ],
    },
    {
      title: 'Analytics & Reporting',
      items: [
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
      ],
    },
    {
      title: 'Files & System Security',
      items: [
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
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Profile / Header Section */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Shield className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                Academic Administration Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                MASTER ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-[#5B6B82] mt-1 font-medium">
              System Administrator: {user?.name || 'Administrator'} • Central Academy Control
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
          value={String(studentCount)}
          subtitle="9th & 10th grades"
          icon={<GraduationCap className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Enrolled"
          badgeVariant="blue"
          trend={{ text: `${studentCount} Profiles Active`, type: 'positive', icon: <TrendingUp className="w-3 h-3" /> }}
        />

        {/* Card 2: Total Teachers */}
        <StatCard
          title="Total Teachers"
          value="8"
          subtitle="Active faculty staff"
          icon={<Users className="w-5 h-5 text-[#1677FF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Verified"
          badgeVariant="blue"
        />

        {/* Card 3: Total Parents */}
        <StatCard
          title="Total Parents"
          value="78"
          subtitle="Linked parent accounts"
          icon={<UserCheck className="w-5 h-5 text-[#00B8F8]" />}
          iconBg="bg-[#E0F8FF] border border-[#BAE6FD]"
          badge="Active Portals"
          badgeVariant="cyan"
        />

        {/* Card 4: Total Batches */}
        <StatCard
          title="Total Batches"
          value="6"
          subtitle="CBSE & State Board"
          icon={<Layers className="w-5 h-5 text-[#0B1F4D]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="Active Batches"
          badgeVariant="navy"
        />

        {/* Card 5: Today's Attendance */}
        <StatCard
          title="Today's Attendance"
          value="91.3%"
          subtitle={`${Math.max(1, studentCount - 1)} / ${studentCount} students present`}
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 border border-emerald-200"
          badge="Live Status"
          badgeVariant="emerald"
        />

        {/* Card 6: Pending Leaves / Action Items */}
        <StatCard
          title="Pending Leaves"
          value="4"
          subtitle="Awaiting admin review"
          icon={<CalendarCheck className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50 border border-amber-200"
          badge="Action Needed"
          badgeVariant="amber"
        />

        {/* Card 7: Upcoming Tests */}
        <StatCard
          title="Upcoming Tests"
          value="2"
          subtitle="Scheduled this week"
          icon={<FileQuestion className="w-5 h-5 text-[#155EEF]" />}
          iconBg="bg-[#EEF4FF] border border-[#DCE5F2]"
          badge="This Week"
          badgeVariant="blue"
        />

        {/* Card 8: Recent Tests */}
        <StatCard
          title="Recent Tests"
          value="4"
          subtitle="Evaluated recently"
          icon={<Award className="w-5 h-5 text-[#F7931E]" />}
          iconBg="bg-[#FFF4E5] border border-[#FDE68A]"
          badge="Published"
          badgeVariant="amber"
        />
      </div>

      {/* ========================================================= */}
      {/* ADMIN COMMAND CENTER (CATEGORIZED QUICK ACCESS HUB) */}
      {/* ========================================================= */}
      <QuickAccessHub
        sectionTitle="Admin Command Center"
        sectionSubtitle="Quick access to all administrative and institutional management tools"
        categories={adminCategories}
        defaultCompact={true}
      />
    </div>
  );
};

export default AdminDashboard;
