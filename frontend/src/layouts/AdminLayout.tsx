import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Users,
  Layers,
  BookOpen,
  FolderKanban,
  CheckCircle2,
  FileCheck,
  FileText,
  BarChart3,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Zap,
  Calendar,
  Shield,
  Plus,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsed by default as specified
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Header Dropdowns
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('AY 2024–25');

  const notifRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) {
        setIsNotifOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(target)) {
        setIsYearOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(target)) {
        setIsQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 13 Navigation Items (Collapsed by default, icons only):
  // 🏠 Dashboard, 👨🎓 Students, 👨👩👧 Parents, 👩🏫 Teachers, 🏫 Classes, 📚 Subjects,
  // 🗂️ Batches, ✅ Attendance, 📝 Leaves, 📄 Tests, 📊 Reports, 📢 Announcements, ⚙️ Settings
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, emoji: '🏠' },
    { name: 'Students', href: '/admin/students', icon: GraduationCap, emoji: '👨🎓', badge: '84' },
    { name: 'Parents', href: '/admin/parents', icon: UserCheck, emoji: '👨👩👧', badge: '78' },
    { name: 'Teachers', href: '/admin/teachers', icon: Users, emoji: '👩🏫', badge: '8' },
    { name: 'Classes', href: '/admin/batches', icon: Layers, emoji: '🏫' },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpen, emoji: '📚' },
    { name: 'Batches', href: '/admin/batches', icon: FolderKanban, emoji: '🗂️', badge: '6' },
    { name: 'Attendance', href: '/admin/attendance', icon: CheckCircle2, emoji: '✅', badge: '91.3%' },
    { name: 'Leaves', href: '/admin/leave-requests', icon: FileCheck, emoji: '📝', badge: '4' },
    { name: 'Tests', href: '/admin/tests', icon: FileText, emoji: '📄', badge: '2' },
    { name: 'Reports', href: '/admin/analytics', icon: BarChart3, emoji: '📊' },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone, emoji: '📢' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, emoji: '⚙️' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notificationsList = [
    {
      id: '1',
      title: 'Batch 10A Attendance Submitted',
      time: '10 mins ago',
      type: 'attendance',
      color: 'bg-emerald-500',
    },
    {
      id: '2',
      title: 'New Test Paper Uploaded (Physics Unit 4)',
      time: '45 mins ago',
      type: 'test',
      color: 'bg-[#2563EB]',
    },
    {
      id: '3',
      title: '4 Pending Leave Requests Awaiting Approval',
      time: '1 hour ago',
      type: 'leave',
      color: 'bg-[#F59E0B]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased font-sans">
      {/* ========================================================= */}
      {/* SIDEBAR: Collapsed by default (72px), Expands on hover/click (240px) */}
      {/* ========================================================= */}
      <aside
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={`hidden lg:flex flex-col bg-white border-r border-[#E5E7EB] sticky top-0 h-screen z-30 select-none transition-all duration-300 ease-in-out shadow-xs ${
          isCollapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {/* Brand / Logo Section */}
        <div className="h-[72px] sm:h-[80px] max-h-[80px] px-4 border-b border-[#E5E7EB] flex items-center justify-between">
          {!isCollapsed ? (
            <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 text-sm tracking-tight block leading-tight">
                  Control Center
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                  Institution Admin
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto block" title="Institution Control Center">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-xs hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Collapse"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed expansion indicator */}
        {isCollapsed && (
          <div className="py-1.5 flex justify-center border-b border-[#E5E7EB]/60">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);

            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`flex items-center rounded-xl transition-all duration-200 ${
                    isCollapsed
                      ? 'justify-center w-12 h-12 mx-auto'
                      : 'gap-3 px-3 py-2 w-full'
                  } ${
                    isActive
                      ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:backdrop-blur-sm'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5 ${
                      isActive ? 'text-[#2563EB]' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="text-[13px] font-medium truncate tracking-tight">
                      {item.name}
                    </span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB]">
                      {item.badge}
                    </span>
                  )}

                  {!isCollapsed && isActive && !item.badge && (
                    <span className="ml-auto w-1.5 h-3.5 bg-[#2563EB] rounded-full" />
                  )}
                </Link>

                {/* Floating Tooltip when Collapsed */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50">
                    <span className="mr-1">{item.emoji}</span>
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer User & Logout */}
        <div className="p-3 border-t border-[#E5E7EB] bg-slate-50/50">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between px-1'
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user?.name || 'Dr. Ramesh Sharma'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">Administrator</p>
                </div>
              </div>
            ) : null}

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE SLIDE-OUT DRAWER */}
      {/* ========================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-68 max-w-[80vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Control Center</h3>
                  <p className="text-[10px] text-slate-400">Admin Console</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#E5E7EB] bg-slate-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN VIEWPORT WRAPPER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ========================================================= */}
        {/* COMPACT ADMIN HEADER (MAX HEIGHT: 80px) */}
        {/* 🛡️ Admin Avatar | Dr. Ramesh Sharma | Administrator */}
        {/* Right: Sticky Command Bar, Notifications, AY, Quick Actions */}
        {/* ========================================================= */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] h-[72px] sm:h-[80px] max-h-[80px] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
          {/* Left Side: Mobile Menu Button + Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* 🛡️ Admin Avatar */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#0B1F4D] to-[#2563EB] flex items-center justify-center text-white shadow-2xs flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>

            {/* Dr. Ramesh Sharma / Administrator */}
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl lg:text-[22px] font-bold text-slate-900 tracking-tight leading-tight truncate">
                {user?.name || 'Dr. Ramesh Sharma'}
              </h1>
              <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 tracking-normal truncate">
                Administrator
              </p>
            </div>
          </div>

          {/* Right Side: Command Quick Action Bar, Academic Year, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* STICKY QUICK ACTION BAR (Desktop: ➕ Add Student, ➕ Add Teacher, ➕ Add Batch, 📢 Announcement, 📄 Create Test) */}
            <div className="hidden xl:flex items-center gap-1.5 p-1 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs font-semibold">
              <button
                onClick={() => navigate('/admin/students')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 hover:bg-white hover:text-[#2563EB] hover:shadow-2xs rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Student</span>
              </button>
              <button
                onClick={() => navigate('/admin/teachers')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 hover:bg-white hover:text-[#2563EB] hover:shadow-2xs rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Teacher</span>
              </button>
              <button
                onClick={() => navigate('/admin/batches')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 hover:bg-white hover:text-[#2563EB] hover:shadow-2xs rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Batch</span>
              </button>
              <button
                onClick={() => navigate('/admin/announcements')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 hover:bg-white hover:text-[#2563EB] hover:shadow-2xs rounded-lg transition-all cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Notice</span>
              </button>
              <button
                onClick={() => navigate('/admin/tests')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 hover:bg-white hover:text-[#2563EB] hover:shadow-2xs rounded-lg transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Test</span>
              </button>
            </div>

            {/* 📅 Academic Year Selector */}
            <div className="relative" ref={yearRef}>
              <button
                type="button"
                onClick={() => {
                  setIsYearOpen(!isYearOpen);
                  setIsNotifOpen(false);
                  setIsQuickActionOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] rounded-xl text-xs sm:text-[12px] font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                title="Select Academic Year"
              >
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="hidden sm:inline">{selectedYear}</span>
                <span className="sm:hidden">24–25</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isYearOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Academic Year
                  </div>
                  {['AY 2024–25', 'AY 2025–26'].map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        setSelectedYear(year);
                        setIsYearOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedYear === year
                          ? 'bg-[#2563EB]/10 text-[#2563EB] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{year}</span>
                      {selectedYear === year && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 🔔 Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsYearOpen(false);
                  setIsQuickActionOpen(false);
                }}
                className="relative p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-[#E5E7EB] bg-white transition-colors shadow-2xs cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <Link
                      to="/admin/announcements"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-1.5">
                    {notificationsList.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/admin/announcements');
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <span className={`w-2 h-2 rounded-full ${notif.color} mt-1 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">
                            {notif.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ⚡ Quick Actions Menu */}
            <div className="relative" ref={quickActionRef}>
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionOpen(!isQuickActionOpen);
                  setIsNotifOpen(false);
                  setIsYearOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-[12px] font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {isQuickActionOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Commands
                  </div>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/admin/students');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#2563EB]" />
                    <span>Add Student</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/admin/teachers');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#10B981]" />
                    <span>Add Teacher</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/admin/batches');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#F59E0B]" />
                    <span>Add Batch</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/admin/announcements');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Megaphone className="w-4 h-4 text-[#EA580C]" />
                    <span>Broadcast Notice</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/admin/tests');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#7C3AED]" />
                    <span>Create Test</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* ========================================================= */}
        {/* MOBILE BOTTOM NAVIGATION BAR */}
        {/* ========================================================= */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-2 py-1.5 flex items-center justify-around shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {[
            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { name: 'Students', href: '/admin/students', icon: GraduationCap },
            { name: 'Teachers', href: '/admin/teachers', icon: Users },
            { name: 'Batches', href: '/admin/batches', icon: Layers },
            { name: 'Settings', href: '/admin/settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all min-h-[44px] min-w-[50px] ${
                  isActive
                    ? 'text-[#2563EB] font-bold bg-blue-50/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
