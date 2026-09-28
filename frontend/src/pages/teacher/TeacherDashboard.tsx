import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { QuickAccessHub, QuickAccessCategory } from '../../components/common/QuickAccessHub';
import {
  BookOpen,
  FileText,
  Clock,
  FileCheck,
  CalendarCheck,
  Bell,
  GraduationCap,
  UserCheck,
  Layers,
  ClipboardCheck,
  FileClock,
  FileQuestion,
  PenLine,
  Award,
  Files,
  BarChart3,
  CalendarDays,
  KeyRound,
  ShieldCheck,
  BookMarked,
  FileEdit,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const metrics = {
    totalStudents: 82,
    todaysClasses: 3,
    attendancePending: 1,
    pendingLeaves: 4,
    upcomingTests: 2,
  };

  // Teacher Command Center categorized navigation modules
  const teacherCategories: QuickAccessCategory[] = [
    {
      title: 'Students',
      items: [
        {
          id: 'teacher-students',
          title: 'Students',
          description: 'Class rosters & assigned pupils',
          route: '/teacher/students',
          icon: GraduationCap,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
          badge: '82',
        },
        {
          id: 'teacher-student-profiles',
          title: 'Student Profiles',
          description: 'Enrollment data & performance records',
          route: '/teacher/students',
          icon: UserCheck,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
        {
          id: 'teacher-batches',
          title: 'Batches',
          description: '10A Morning & 10B Evening batches',
          route: '/teacher/timetable',
          icon: Layers,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
      ],
    },
    {
      title: 'Attendance & Leave',
      items: [
        {
          id: 'teacher-take-attendance',
          title: 'Take Attendance',
          description: 'Mark live morning & evening rolls',
          route: '/teacher/attendance',
          icon: ClipboardCheck,
          iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badge: 'Pending',
        },
        {
          id: 'teacher-attendance-history',
          title: 'Attendance History',
          description: 'Past session logs & compliance',
          route: '/teacher/attendance-history',
          icon: CalendarCheck,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'teacher-leave-reports',
          title: 'Leave Reports',
          description: 'Review parent leave applications',
          route: '/teacher/leave-requests',
          icon: FileClock,
          iconStyle: 'text-amber-800 bg-amber-50 border-amber-200',
          badge: '4 Review',
        },
        {
          id: 'teacher-home-reach',
          title: 'Home-Reach / Departures',
          description: 'Student dismissal & safe transit logs',
          route: '/teacher/home-reach',
          icon: ShieldCheck,
          iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
      ],
    },
    {
      title: 'Tests & Marks',
      items: [
        {
          id: 'teacher-tests',
          title: 'Tests',
          description: 'Scheduled exams & syllabus dates',
          route: '/teacher/tests',
          icon: FileQuestion,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'teacher-create-test',
          title: 'Create Test',
          description: 'Draft unit & chapter evaluations',
          route: '/teacher/tests',
          icon: FileText,
          iconStyle: 'text-[#1677FF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'teacher-question-papers',
          title: 'Question Papers',
          description: 'Upload & archive question papers',
          route: '/teacher/test-papers',
          icon: FileText,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
        {
          id: 'teacher-enter-marks',
          title: 'Enter / Edit Marks',
          description: 'Batch grading & score entry',
          route: '/teacher/marks-entry',
          icon: PenLine,
          iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
        },
        {
          id: 'teacher-scorecards',
          title: 'Student Scorecards',
          description: 'Official academic report generation',
          route: '/teacher/scorecards',
          icon: Award,
          iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
        },
      ],
    },
    {
      title: 'Answer Sheets & Performance',
      items: [
        {
          id: 'teacher-answer-sheets',
          title: 'Answer Sheet Repository',
          description: 'Upload & verify paper answer scans',
          route: '/teacher/answer-sheets',
          icon: Files,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'teacher-performance',
          title: 'Performance Analytics',
          description: 'Batch trends & chapter distribution',
          route: '/teacher/performance',
          icon: BarChart3,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
      ],
    },
    {
      title: 'Academic',
      items: [
        {
          id: 'teacher-daily-updates',
          title: 'Daily Updates',
          description: 'Log topics taught & daily homework',
          route: '/teacher/daily-updates',
          icon: FileEdit,
          iconStyle: 'text-[#0284C7] bg-[#E0F8FF] border-[#BAE6FD]',
        },
        {
          id: 'teacher-portion-completion',
          title: 'Portion Completion',
          description: 'Track syllabus chapters & milestones',
          route: '/teacher/syllabus-progress',
          icon: BookMarked,
          iconStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        },
        {
          id: 'teacher-timetable',
          title: 'Timetable & Sessions',
          description: 'Weekly schedule & classroom timings',
          route: '/teacher/timetable',
          icon: Clock,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
      ],
    },
    {
      title: 'Communication & Security',
      items: [
        {
          id: 'teacher-announcements',
          title: 'Announcements',
          description: 'Post circulars & notice alerts',
          route: '/teacher/announcements',
          icon: Bell,
          iconStyle: 'text-[#D97706] bg-[#FFF4E5] border-[#FDE68A]',
        },
        {
          id: 'teacher-calendar',
          title: 'Calendar',
          description: 'View academic events & exam dates',
          route: '/teacher/announcements',
          icon: CalendarDays,
          iconStyle: 'text-[#5B6B82] bg-[#F5F8FC] border-[#DCE5F2]',
        },
        {
          id: 'teacher-notifications',
          title: 'Notifications',
          description: 'System notices & faculty broadcasts',
          route: '/teacher/announcements',
          icon: Bell,
          iconStyle: 'text-[#155EEF] bg-[#EEF4FF] border-[#DCE5F2]',
        },
        {
          id: 'teacher-reset-password',
          title: 'Reset Student Password',
          description: 'Manage pupil credentials safely',
          route: '/teacher/reset-student-password',
          icon: KeyRound,
          iconStyle: 'text-[#0B1F4D] bg-[#EEF4FF] border-[#DCE5F2]',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Welcome Header */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-[#00B8F8]" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#155EEF] block mb-1">
                Faculty Educator Desk
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                {user?.name || 'Prof. Rajesh Sharma (Physics)'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold text-[#5B6B82] mt-1.5">
                <span className="bg-[#EEF4FF] text-[#155EEF] px-2.5 py-0.5 rounded-lg border border-[#DCE5F2]">
                  Physics &amp; Mathematics Faculty
                </span>
                <span>•</span>
                <span className="text-[#0B1F4D] font-bold">10A Morning &amp; 10B Evening</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto flex-wrap gap-y-2">
            <Button
              size="sm"
              variant="accent"
              onClick={() => navigate('/teacher/daily-updates')}
              leftIcon={<Bell className="w-3.5 h-3.5" />}
            >
              Daily Updates
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/teacher/attendance')}
              leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}
            >
              Take Attendance
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate('/teacher/tests')}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Create Test
            </Button>
          </div>
        </div>
      </div>

      {/* 5 METRIC CARDS (PRESERVED) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Students */}
        <div
          onClick={() => navigate('/teacher/students')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Total Students</span>
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#155EEF] transition-colors">
              {metrics.totalStudents}
            </span>
            <span className="text-xs text-[#5B6B82] font-semibold block mt-1">Assigned Enrolled</span>
          </div>
        </div>

        {/* Today's Classes */}
        <div
          onClick={() => navigate('/teacher/timetable')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Today's Classes</span>
            <div className="p-2 bg-[#EEF4FF] text-[#1677FF] rounded-xl border border-[#DCE5F2] group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#1677FF] transition-colors">
              {metrics.todaysClasses}
            </span>
            <span className="text-xs text-[#1677FF] font-semibold block mt-1">Sessions Scheduled</span>
          </div>
        </div>

        {/* Today's Attendance Pending */}
        <div
          onClick={() => navigate('/teacher/attendance')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Attendance</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {metrics.attendancePending}
            </span>
            <span className="text-xs text-amber-800 font-semibold block mt-1">10A Morning Pending</span>
          </div>
        </div>

        {/* Pending Leave Requests */}
        <div
          onClick={() => navigate('/teacher/leave-requests')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Pending Leaves</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              {metrics.pendingLeaves}
            </span>
            <span className="text-xs text-amber-800 font-semibold block mt-1">Awaiting Review</span>
          </div>
        </div>

        {/* Upcoming Tests */}
        <div
          onClick={() => navigate('/teacher/tests')}
          className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-2xs hover:shadow-md hover:border-[#155EEF] transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">Upcoming Tests</span>
            <div className="p-2 bg-[#E0F8FF] text-[#008BBF] rounded-xl border border-[#BAE6FD] group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D] group-hover:text-[#008BBF] transition-colors">
              {metrics.upcomingTests}
            </span>
            <span className="text-xs text-[#5B6B82] font-semibold block mt-1">This Week Scheduled</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TEACHER COMMAND CENTER (CATEGORIZED QUICK ACCESS HUB) */}
      {/* ========================================================= */}
      <QuickAccessHub
        sectionTitle="Teacher Command Center"
        sectionSubtitle="Quick access to teaching and student management tools"
        categories={teacherCategories}
      />

      {/* RECENT RESULTS & ANNOUNCEMENTS (PRESERVED) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <Card
          title="Recent Results & Evaluations"
          subtitle="Latest scores entered for assigned batches"
          headerAction={
            <button
              onClick={() => navigate('/teacher/marks-entry')}
              className="text-xs font-bold text-[#155EEF] hover:underline"
            >
              Enter Marks &rarr;
            </button>
          }
        >
          <div className="space-y-3">
            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0B1F4D]">Rahul Kumar</span>
                  <span className="text-xs font-mono bg-[#EEF4FF] text-[#155EEF] font-bold px-2 py-0.5 rounded-md border border-[#DCE5F2]">
                    IT10025
                  </span>
                </div>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">Physics — Chapter 3 Light Reflection Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-700">42/50</span>
                <span className="text-xs text-[#5B6B82] block font-semibold">84% Grade A</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0B1F4D]">Sneha Verma</span>
                  <span className="text-xs font-mono bg-[#EEF4FF] text-[#155EEF] font-bold px-2 py-0.5 rounded-md border border-[#DCE5F2]">
                    IT10026
                  </span>
                </div>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">Physics — Chapter 3 Light Reflection Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-700">46/50</span>
                <span className="text-xs text-[#5B6B82] block font-semibold">92% Grade A+</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE5F2] flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0B1F4D]">Aditya Rao</span>
                  <span className="text-xs font-mono bg-[#EEF4FF] text-[#155EEF] font-bold px-2 py-0.5 rounded-md border border-[#DCE5F2]">
                    IT10027
                  </span>
                </div>
                <p className="text-xs text-[#5B6B82] mt-1 font-medium">Mathematics — Linear Equations Test</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#155EEF]">38/50</span>
                <span className="text-xs text-[#5B6B82] block font-semibold">76% Grade B+</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Announcements */}
        <Card
          title="Announcements & Notices"
          subtitle="Official circulars from Institute Administration"
          headerAction={
            <span className="text-[11px] bg-[#EEF4FF] text-[#155EEF] font-bold px-2.5 py-0.5 rounded-full border border-[#DCE5F2]">
              Faculty Board
            </span>
          }
        >
          <div className="space-y-3">
            <div className="p-4 bg-[#FFF4E5] rounded-xl border border-[#FDE68A]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-white/70 px-2 py-0.5 rounded">
                  Mandatory Notice
                </span>
                <span className="text-[11px] text-[#5B6B82] font-semibold">20 Sept 2026</span>
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-1.5">Parent-Teacher Progress Meeting</h3>
              <p className="text-xs text-[#5B6B82] mt-1 leading-relaxed">
                Scheduled for Saturday, 20 September at 10:00 AM in the Tuitions Main Hall. Ensure term scorecards are finalized.
              </p>
            </div>

            <div className="p-4 bg-[#EEF4FF] rounded-xl border border-[#DCE5F2]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#155EEF] bg-white/70 px-2 py-0.5 rounded">
                  Academic Update
                </span>
                <span className="text-[11px] text-[#5B6B82] font-semibold">18 Sept 2026</span>
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-1.5">Monthly Revision Test Submission</h3>
              <p className="text-xs text-[#5B6B82] mt-1 leading-relaxed">
                Faculty members must upload original question papers for upcoming revision tests before Friday evening.
              </p>
            </div>

            <div className="p-4 bg-[#E0F8FF] rounded-xl border border-[#BAE6FD]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#008BBF] bg-white/70 px-2 py-0.5 rounded">
                  Safety Protocol
                </span>
                <span className="text-[11px] text-[#5B6B82] font-semibold">Daily</span>
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-sm mt-1.5">Home-Reach Transit Confirmation</h3>
              <p className="text-xs text-[#5B6B82] mt-1 leading-relaxed">
                Please verify departure times at the conclusion of evening tuition sessions to trigger safety tracking updates.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
