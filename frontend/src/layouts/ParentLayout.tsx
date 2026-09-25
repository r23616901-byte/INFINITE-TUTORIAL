import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  FileText,
  Award,
  BookOpen,
  TrendingUp,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bell,
  Zap,
  Calendar,
  Clock,
  LogOut,
  X,
  Menu,
  CheckCircle2,
  FileCheck,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ParentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible sidebar state (persisted or default expanded on desktop)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Header Dropdown States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('AY 2024–25');

  // Modals for Quick Action triggers
  const [activeModal, setActiveModal] = useState<'ANNOUNCEMENTS' | 'TIMETABLE' | 'CALENDAR' | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
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

  const studentPhotoUrl =
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300';

  // Navigation Items exactly as specified:
  // 🏠 Dashboard, 👤 Student, 📅 Attendance, 📝 Leave, 📊 Academics, 📚 Homework, 📈 Progress, 📢 Announcements, ⚙️ Settings
  const navItems = [
    {
      name: 'Dashboard',
      href: '/parent',
      icon: LayoutDashboard,
      emoji: '🏠',
    },
    {
      name: 'Student',
      href: '/parent/profile',
      icon: User,
      emoji: '👤',
    },
    {
      name: 'Attendance',
      href: '/parent/attendance',
      icon: CalendarCheck,
      emoji: '📅',
    },
    {
      name: 'Leave',
      href: '/parent/leaves',
      icon: FileText,
      emoji: '📝',
    },
    {
      name: 'Academics',
      href: '/parent/scorecards',
      icon: Award,
      emoji: '📊',
    },
    {
      name: 'Homework',
      href: '/parent/daily-updates',
      icon: BookOpen,
      emoji: '📚',
    },
    {
      name: 'Progress',
      href: '/parent/performance-graphs',
      icon: TrendingUp,
      emoji: '📈',
    },
    {
      name: 'Announcements',
      href: '/parent/announcements',
      icon: Megaphone,
      emoji: '📢',
    },
    {
      name: 'Settings',
      href: '/parent/change-password',
      icon: Settings,
      emoji: '⚙️',
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notificationsList = [
    {
      id: '1',
      title: 'Parent Meeting Scheduled',
      time: 'Tomorrow, 10:00 AM',
      type: 'meeting',
      unread: true,
    },
    {
      id: '2',
      title: 'Physics Test: 42/50 Evaluated',
      time: 'Yesterday',
      type: 'test',
      unread: true,
    },
    {
      id: '3',
      title: 'Term 1 Revision Notice',
      time: '3 days ago',
      type: 'notice',
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
            <Link to="/parent" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0">
                IT
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 text-sm tracking-tight block leading-tight">
                  Infinite Portal
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                  Parent Dashboard
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/parent" className="mx-auto block" title="Infinite Portal">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-xs">
                IT
              </div>
            </Link>
          )}

          {/* Expand/Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
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
              className="p-1.5 text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
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
              item.href === '/parent'
                ? location.pathname === '/parent'
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
                  src={studentPhotoUrl}
                  alt="Rahul Kumar"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {user?.name || 'Rahul Kumar'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">Class 10A</p>
                </div>
              </div>
            ) : null}

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
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
                  <p className="text-[10px] text-slate-400">Parent Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/parent'
                    ? location.pathname === '/parent'
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
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
        {/* COMPACT HEADER (MAX HEIGHT: 90px) */}
        {/* [Student Photo] Rahul Kumar Class 10A • CBSE Board */}
        {/* Right: Notifications, Academic Year Selector, Quick Action */}
        {/* ========================================================= */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] h-[76px] sm:h-[84px] max-h-[90px] px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
          {/* Left Side: Mobile Menu Button + Student Profile Header */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* [Student Photo] */}
            <div className="relative flex-shrink-0">
              <img
                src={studentPhotoUrl}
                alt="Rahul Kumar"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-[#E5E7EB] shadow-2xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full" />
            </div>

            {/* Student Name & Class (28px / Bold on desktop) */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-[24px] lg:text-[28px] font-bold text-slate-900 tracking-tight leading-tight truncate">
                Rahul Kumar
              </h1>
              <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 tracking-normal truncate mt-0.5">
                Class 10A • CBSE Board
              </p>
            </div>
          </div>

          {/* Right Side: Quick Action Button, Academic Year Selector, Notifications */}
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
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center justify-between ${
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
                      to="/parent/announcements"
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
                          navigate('/parent/announcements');
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

            {/* ⚡ Quick Action Button */}
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
                <span className="hidden sm:inline">Quick Action</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {/* Quick Actions Dropdown Menu */}
              {isQuickActionOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Shortcuts
                  </div>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/parent/leaves');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <FileCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Apply for Leave</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      setActiveModal('TIMETABLE');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <span>View Timetable</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      setActiveModal('CALENDAR');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#F59E0B]" />
                    <span>Academic Calendar</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickActionOpen(false);
                      navigate('/parent/change-password');
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    <span>Change Password</span>
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
            { name: 'Dashboard', href: '/parent', icon: LayoutDashboard },
            { name: 'Attendance', href: '/parent/attendance', icon: CalendarCheck },
            { name: 'Academics', href: '/parent/scorecards', icon: Award },
            { name: 'Leave', href: '/parent/leaves', icon: FileText },
            { name: 'Notices', href: '/parent/announcements', icon: Megaphone },
          ].map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/parent'
                ? location.pathname === '/parent'
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

      {/* TIMETABLE MODAL (TRIGGERED FROM QUICK ACTIONS) */}
      {activeModal === 'TIMETABLE' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Weekly Class Timetable</h3>
                  <p className="text-xs text-slate-400">Class 10A (Morning Batch)</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { day: 'Monday', subject: 'Physics', time: '07:00 AM - 09:30 AM', color: 'text-blue-600' },
                { day: 'Tuesday', subject: 'Chemistry', time: '07:00 AM - 09:30 AM', color: 'text-amber-600' },
                { day: 'Wednesday', subject: 'Mathematics', time: '07:00 AM - 09:30 AM', color: 'text-blue-600' },
                { day: 'Thursday', subject: 'Biology', time: '07:00 AM - 09:30 AM', color: 'text-emerald-600' },
                { day: 'Friday', subject: 'Physics Problem Solving', time: '07:00 AM - 09:30 AM', color: 'text-blue-600' },
                { day: 'Saturday', subject: 'Weekly Assessment', time: '07:00 AM - 09:30 AM', color: 'text-purple-600' },
              ].map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="font-semibold text-slate-900">{item.day}</span>
                  <span className={`font-semibold ${item.color}`}>
                    {item.subject}{' '}
                    <span className="text-slate-400 font-normal">({item.time})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR MODAL (TRIGGERED FROM QUICK ACTIONS) */}
      {activeModal === 'CALENDAR' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Academic Calendar</h3>
                  <p className="text-xs text-slate-400">September 2026 Key Events</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100">
                <strong>01 - 06 Sept:</strong> Term 1 Chapter Diagnostic Assessments
              </div>
              <div className="p-3 bg-blue-50 text-blue-950 rounded-xl border border-blue-100">
                <strong>15 - 18 Sept:</strong> Mid-Term Unit Tests
              </div>
              <div className="p-3 bg-amber-50 text-amber-950 rounded-xl border border-amber-100">
                <strong>20 Sept (Sat):</strong> Parent-Teacher Meeting (10:00 AM)
              </div>
              <div className="p-3 bg-slate-50 text-slate-800 rounded-xl border border-slate-200">
                <strong>28 Sept:</strong> Monthly Revision Test &amp; Scorecard Release
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentLayout;
