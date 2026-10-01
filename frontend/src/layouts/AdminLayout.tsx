import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Layers,
  BookOpen,
  Clock,
  FileCheck,
  FileText,
  Award,
  UploadCloud,
  Bell,
  CheckSquare,
  BarChart3,
  KeyRound,
  Settings,
  FolderArchive,
  History,
  ShieldCheck,
} from 'lucide-react';
import { DashboardShell, NavSection } from './DashboardShell';

export const AdminLayout: React.FC = () => {
  const adminNavSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Students & Faculty',
      items: [
        {
          name: 'Students Directory',
          href: '/admin/students',
          icon: <GraduationCap className="w-4 h-4" />,
          badge: '84',
        },
        {
          name: 'Parents Management',
          href: '/admin/parents',
          icon: <UserCheck className="w-4 h-4" />,
        },
        {
          name: 'Teachers & Staff',
          href: '/admin/teachers',
          icon: <Users className="w-4 h-4" />,
          badge: '8',
        },
      ],
    },
    {
      title: 'Academic Structure',
      items: [
        {
          name: 'Batches & Classes',
          href: '/admin/batches',
          icon: <Layers className="w-4 h-4" />,
        },
        {
          name: 'Boards & Subjects',
          href: '/admin/subjects',
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          name: 'Timetable & Sessions',
          href: '/admin/timetable',
          icon: <Clock className="w-4 h-4" />,
        },
        {
          name: 'Portion Completion',
          href: '/admin/portion-completion',
          icon: <CheckSquare className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Examinations & Marks',
      items: [
        {
          name: 'Take Attendance',
          href: '/admin/attendance',
          icon: <FileCheck className="w-4 h-4" />,
        },
        {
          name: 'Attendance History',
          href: '/admin/attendance-history',
          icon: <History className="w-4 h-4" />,
        },
        {
          name: 'Leave Requests',
          href: '/admin/leave-requests',
          icon: <UserCheck className="w-4 h-4" />,
          badge: 'Review',
        },
        {
          name: 'Home-Reach Safety Desk',
          href: '/admin/home-reach',
          icon: <ShieldCheck className="w-4 h-4" />,
          badge: 'Safety',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          name: 'Tests & Question Papers',
          href: '/admin/tests',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          name: 'Enter / Edit Marks',
          href: '/admin/marks',
          icon: <Award className="w-4 h-4" />,
        },
        {
          name: 'Student Scorecards',
          href: '/admin/scorecards',
          icon: <Award className="w-4 h-4" />,
        },
        {
          name: 'Answer Sheets Repository',
          href: '/admin/answer-sheets',
          icon: <UploadCloud className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'Communication & System',
      items: [
        {
          name: 'Announcements & Calendar',
          href: '/admin/announcements',
          icon: <Bell className="w-4 h-4" />,
        },
        {
          name: 'Performance Analytics',
          href: '/admin/analytics',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          name: 'Uploaded Files',
          href: '/admin/files',
          icon: <FolderArchive className="w-4 h-4" />,
        },
        {
          name: 'Audit Logs',
          href: '/admin/audit-logs',
          icon: <History className="w-4 h-4" />,
        },
        {
          name: 'Password Management',
          href: '/admin/passwords',
          icon: <KeyRound className="w-4 h-4" />,
        },
        {
          name: 'System & Security',
          href: '/admin/settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <DashboardShell
      roleTitle="Administrator"
      roleBadge="ADMIN PORTAL"
      roleTheme="indigo"
      navSections={adminNavSections}
    />
  );
};
