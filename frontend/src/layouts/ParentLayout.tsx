import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  FileCheck,
  Award,
  FileText,
  FileSpreadsheet,
  BarChart2,
  Bell,
  Clock,
  Calendar,
  Home,
  KeyRound,
  BookOpen,
} from 'lucide-react';
import { DashboardShell, NavSection } from './DashboardShell';

export const ParentLayout: React.FC = () => {
  const parentNavSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/parent',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Student Tracking',
      items: [
        {
          name: 'Student Profile',
          href: '/parent/profile',
          icon: <UserCheck className="w-4 h-4" />,
        },
        {
          name: 'Attendance & History',
          href: '/parent/attendance',
          icon: <CalendarCheck className="w-4 h-4" />,
          badge: '91.3%',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          name: 'Leave Requests',
          href: '/parent/leaves',
          icon: <FileCheck className="w-4 h-4" />,
        },
        {
          name: 'Tuition & Home-Reach',
          href: '/parent/tuition-reach',
          icon: <Home className="w-4 h-4" />,
          badge: 'Home Safe',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
        },
      ],
    },
    {
      title: 'Academic Performance',
      items: [
        {
          name: 'Marks & Scorecards',
          href: '/parent/scorecards',
          icon: <Award className="w-4 h-4" />,
        },
        {
          name: 'Test Papers & Answer Sheets',
          href: '/parent/test-papers',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          name: 'Performance Graphs',
          href: '/parent/performance-graphs',
          icon: <BarChart2 className="w-4 h-4" />,
        },
        {
          name: 'Portion Completion',
          href: '/parent/portion-completion',
          icon: <BookOpen className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Schedule & Updates',
      items: [
        {
          name: 'Daily Class Updates',
          href: '/parent/daily-updates',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        },
        {
          name: 'Timetable',
          href: '/parent/timetable',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          name: 'Academic Calendar',
          href: '/parent/calendar',
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          name: 'Announcements',
          href: '/parent/announcements',
          icon: <Bell className="w-4 h-4" />,
          badge: '2 New',
          badgeColor: 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]',
        },
        {
          name: 'Change Password',
          href: '/parent/change-password',
          icon: <KeyRound className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <DashboardShell
      roleTitle="Parent / Student"
      roleBadge="PARENT PORTAL"
      roleTheme="blue"
      navSections={parentNavSections}
    />
  );
};
