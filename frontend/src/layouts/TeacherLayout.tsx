import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  CalendarCheck,
  FileCheck,
  Bus,
  FileText,
  UploadCloud,
  Award,
  FileEdit,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Zap,
  Calendar,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const TeacherLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Header dropdown states
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

  const facultyPhotoUrl =
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300';

  // Navigation Items matching the exact requirements:
  // 🏠 Dashboard, 👨🎓 Students, ✅ Attendance, 📋 Attendance History, 📝 Leave Reviews,
  // 🚌 Home Reach, 📚 Tests, 📤 Upload Papers, 📊 Marks Entry, 📄 Answer Sheets, 📢 Announcements, ⚙️ Settings
  const navItems = [
    { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard, emoji: '🏠' },
    { name: 'Students', href: '/teacher/students', icon: Users, emoji: '👨🎓', badge: '82' },
    { name: 'Attendance', href: '/teacher/attendance', icon: CheckCircle2, emoji: '✅', badge: '1 Pending' },
    { name: 'Attendance History', href: '/teacher/attendance-history', icon: CalendarCheck, emoji: '📋' },
    { name: 'Leave Reviews', href: '/teacher/leave-requests', icon: FileCheck, emoji: '📝', badge: '4 New' },
    { name: 'Home Reach', href: '/teacher/home-reach', icon: Bus, emoji: '🚌' },
    { name: 'Tests', href: '/teacher/tests', icon: FileText, emoji: '📚', badge: '2 Upcoming' },
    { name: 'Upload Papers', href: '/teacher/test-papers', icon: UploadCloud, emoji: '📤' },
    { name: 'Marks Entry', href: '/teacher/marks-entry', icon: Award, emoji: '📊' },
    { name: 'Answer Sheets', href: '/teacher/answer-sheets', icon: FileEdit, emoji: '📄' },
    { name: 'Announcements', href: '/teacher/announcements', icon: Megaphone, emoji: '📢' },
    { name: 'Settings', href: '/teacher/reset-student-password', icon: Settings, emoji: '⚙️' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notificationsList = [
    {
      id: '1',
      title: '4 Leave Requests Pending Review',
      time: '10 mins ago',
      type: 'leave',
      unread: true,
    },
    {
      id: '2',
      title: 'Physics Test: Unit 4 Scheduled for Tomorrow',
      time: '1 hour ago',
      type: 'test',
      unread: true,
    },
    {
      id: '3',
      title: 'Parent-Teacher Progress Meeting',
      time: 'Yesterday',
      type: 'meeting',
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased font-sans">
      {/* ========================================================= */}
      {/* DESKTOP / TABLET COLLAPSIBLE SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-[#E5E7EB] sticky top-0 h-screen z-30 select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {/* Sidebar Brand & Collapse Toggle */}
        <div className="h-[76px] px-4 border-b border-[#E5E7EB] flex items-center justify-between">
          {!isCollapsed ? (
            <Link to="/teacher" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0">
                IT
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 text-sm tracking-tight block leading-tight">
                  Infinite Portal
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                  Educator Desk
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/teacher" className="mx-auto block" title="Infinite Educator Portal">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-xs">
                IT
              </div>
            </Link>
          )}

          {/* Expand/Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed re-expand button */}
        {isCollapsed && (
          <div className="py-2 flex justify-center border-b border-[#E5E7EB]/60">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Expand Sidebar (240px)"
              aria-label="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/teacher'
                ? location.pathname === '/teacher'
                : location.pathname.startsWith(item.href);

            return (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`flex items-center rounded-xl transition-all duration-150 ${
                    isCollapsed
                      ? 'justify-center w-12 h-12 mx-auto'
                      : 'gap-3 px-3.5 py-2.5 w-full'
                  } ${
                    isActive
                      ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:backdrop-blur-sm'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                      isActive ? 'text-[#2563EB]' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="text-[14px] truncate tracking-tight">{item.name}</span>
                  )}

                  {/* Active Indicator Bar on right when expanded */}
                  {!isCollapsed && isActive && (
                    <span className="ml-auto w-1.5 h-4 bg-[#2563EB] rounded-full" />
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

        {/* Sidebar Footer User / Logout */}
        <div className="p-3 border-t border-[#E5E7EB] bg-slate-50/50">
          <div
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between px-1'
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={facultyPhotoUrl}
                  alt="Mrs. Priya Sundaram"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user?.name || 'Mrs. Priya Sundaram'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">Faculty</p>
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
                  IT
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Infinite Portal</h3>
                  <p className="text-[10px] text-slate-400">Teacher Dashboard</p>
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
                  item.href === '/teacher'
                    ? location.pathname === '/teacher'
                    : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
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
        {/* COMPACT EDUCATOR HEADER (MAX HEIGHT: 90px) */}
        {/* Faculty Photo | Mrs. Priya Sundaram */}
        {/* Physics & Mathematics Faculty • 10A Morning • 10B Evening */}
        {/* Right: Notifications, Academic Year Selector, Quick Actions */}
        {/* ========================================================= */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] h-[76px] sm:h-[84px] max-h-[90px] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
          {/* Left Side: Mobile Menu Button + Faculty Profile Info */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Faculty Photo */}
            <div className="relative flex-shrink-0">
              <img
                src={facultyPhotoUrl}
                alt="Mrs. Priya Sundaram"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-[#E5E7EB] shadow-2xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full" />
            </div>

            {/* Teacher Name & Assigned Classes (28px Bold on desktop) */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-[24px] lg:text-[28px] font-bold text-slate-900 tracking-tight leading-tight truncate">
                {user?.name || 'Mrs. Priya Sundaram'}
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] font-medium text-slate-500 tracking-normal truncate mt-0.5">
                <span className="truncate">Physics &amp; Mathematics Faculty</span>
                <span>•</span>
                <span className="text-[#2563EB] font-semibold truncate hidden sm:inline">
                  10A Morning • 10B Evening
                </span>
                <span className="text-[#2563EB] font-semibold truncate sm:hidden">
                  10A • 10B
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Action Menu, Academic Year Selector, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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

              {/* Year Dropdown */}
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

              {/* Notifications Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <Link
                      to="/teacher/announcements"
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
                          navigate('/teacher/announcements');
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] mt-1 flex-shrink-0" />
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
                <span className="hidden sm:inline">Quick Actions</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {/* Quick Actions Dropdown Menu */}
              {isQuickActionOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Faculty Shortcuts
                  </div>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/teacher/attendance');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span>Take Attendance</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/teacher/marks-entry');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-[#2563EB]" />
                    <span>Enter Marks</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/teacher/tests');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#7C3AED]" />
                    <span>Create Test</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/teacher/daily-updates');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileEdit className="w-4 h-4 text-[#F59E0B]" />
                    <span>Daily Updates</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/teacher/leave-requests');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-[#EA580C]" />
                    <span>Review Leaves</span>
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
            { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
            { name: 'Students', href: '/teacher/students', icon: Users },
            { name: 'Attendance', href: '/teacher/attendance', icon: CheckCircle2 },
            { name: 'Marks', href: '/teacher/marks-entry', icon: Award },
            { name: 'Leaves', href: '/teacher/leave-requests', icon: FileCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/teacher'
                ? location.pathname === '/teacher'
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

export default TeacherLayout;
