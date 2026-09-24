import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  CalendarCheck,
  FileCheck,
  FileText,
  UploadCloud,
  Award,
  BarChart3,
  Clock,
  BookOpen,
  Bell,
  KeyRound,
  FileEdit,
} from 'lucide-react';
import { DashboardShell, NavSection } from './DashboardShell';

export const TeacherLayout: React.FC = () => {
  const teacherNavSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/teacher',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Classroom & Attendance',
      items: [
        {
          name: 'Assigned Students',
          href: '/teacher/students',
          icon: <Users className="w-4 h-4" />,
          badge: '42',
        },
        {
          name: 'Take Attendance',
          href: '/teacher/attendance',
          icon: <CheckCircle2 className="w-4 h-4" />,
          badge: 'Pending',
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        {
          name: 'Attendance History',
          href: '/teacher/attendance-history',
          icon: <CalendarCheck className="w-4 h-4" />,
        },
        {
          name: 'Review Leaves',
          href: '/teacher/leave-requests',
          icon: <FileCheck className="w-4 h-4" />,
          badge: '1 New',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        },
        {
          name: 'Home-Reach / Departures',
          href: '/teacher/home-reach',
          icon: <Clock className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Tests, Uploads & Marks',
      items: [
        {
          name: 'Create / View Tests',
          href: '/teacher/tests',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          name: 'Upload Test Papers',
          href: '/teacher/test-papers',
          icon: <UploadCloud className="w-4 h-4" />,
        },
        {
          name: 'Enter / Edit Marks',
          href: '/teacher/marks-entry',
          icon: <Award className="w-4 h-4" />,
        },
        {
          name: 'Student Answer Sheets',
          href: '/teacher/answer-sheets',
          icon: <UploadCloud className="w-4 h-4" />,
        },
        {
          name: 'Performance & Scorecards',
          href: '/teacher/performance',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Academic Content & Daily Updates',
      items: [
        {
          name: 'Daily Class Updates',
          href: '/teacher/daily-updates',
          icon: <FileEdit className="w-4 h-4" />,
        },
        {
          name: 'Syllabus / Portion Progress',
          href: '/teacher/syllabus-progress',
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: 'Timetable & Classes',
          href: '/teacher/timetable',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          name: 'Class Announcements',
          href: '/teacher/announcements',
          icon: <Bell className="w-4 h-4" />,
        },
        {
          name: 'Reset Student Password',
          href: '/teacher/reset-student-password',
          icon: <KeyRound className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <DashboardShell
      roleTitle="Faculty Teacher"
      roleBadge="TEACHER PORTAL"
      roleTheme="emerald"
      navSections={teacherNavSections}
    />
  );
};
