import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Shield,
  GraduationCap,
  Calendar,
  Home,
  CalendarCheck,
  Award,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from '../components/common/BrandLogo';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  isExternal?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface DashboardShellProps {
  roleTitle: string;
  roleBadge: string;
  roleTheme: 'indigo' | 'emerald' | 'blue';
  navSections: NavSection[];
  customMobileNavItems?: NavItem[];
  children?: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  roleTitle,
  roleBadge,
  roleTheme,
  navSections,
  customMobileNavItems,
  children,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Step 67: Canonical Simplified Mobile Navigation
  // Home, Attendance, Scorecard, Notifications, Profile, plus ☰ More
  const defaultMobileNav: NavItem[] = React.useMemo(() => {
    if (customMobileNavItems && customMobileNavItems.length > 0) {
      return customMobileNavItems;
    }

    const role = user?.role || 'PARENT';
    const basePath = role === 'ADMIN' ? '/admin' : role === 'TEACHER' ? '/teacher' : '/parent';

    return [
      {
        name: 'Home',
        href: basePath,
        icon: <Home className="w-5 h-5" />,
      },
      {
        name: 'Attendance',
        href: `${basePath}/attendance`,
        icon: <CalendarCheck className="w-5 h-5" />,
      },
      {
        name: 'Scorecard',
        href: role === 'ADMIN' ? '/admin/batches' : role === 'TEACHER' ? '/teacher/scorecards' : '/parent/scorecards',
        icon: <Award className="w-5 h-5" />,
      },
      {
        name: 'Notifs',
        href: role === 'ADMIN' ? '/admin/audit-logs' : role === 'TEACHER' ? '/teacher/daily-updates' : '/parent/announcements',
        icon: <Bell className="w-5 h-5" />,
      },
      {
        name: 'Profile',
        href: role === 'ADMIN' ? '/admin/teachers' : role === 'TEACHER' ? '/teacher/students' : '/parent/profile',
        icon: <User className="w-5 h-5" />,
      },
    ];
  }, [customMobileNavItems, user?.role]);

  const themeClasses = {
    indigo: {
      activeBg: 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs',
      activeIcon: 'text-indigo-600',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      avatar: 'bg-indigo-600 text-white',
      accentBorder: 'border-l-4 border-indigo-600',
    },
    emerald: {
      activeBg: 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs',
      activeIcon: 'text-emerald-600',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      avatar: 'bg-emerald-600 text-white',
      accentBorder: 'border-l-4 border-emerald-600',
    },
    blue: {
      activeBg: 'bg-blue-50 text-blue-700 font-semibold shadow-xs',
      activeIcon: 'text-blue-600',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      avatar: 'bg-blue-600 text-white',
      accentBorder: 'border-l-4 border-blue-600',
    },
  }[roleTheme];

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="space-y-6">
      {navSections.map((section, idx) => (
        <div key={idx} className="space-y-1">
          {section.title && (
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onItemClick}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? `${themeClasses.activeBg} ${themeClasses.accentBorder}`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`transition-colors flex-shrink-0 ${
                      isActive ? themeClasses.activeIcon : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ========================================================= */}
      {/* DESKTOP FIXED SIDEBAR */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-white border-r border-slate-200 sticky top-0 h-screen z-30 flex-shrink-0 shadow-xs">
        {/* Sidebar Brand Header with Uploaded Logo Slot */}
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="block">
            <BrandLogo size="md" />
          </Link>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Portal Access:
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${themeClasses.badge}`}>
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200">
          {renderNavLinks()}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${themeClasses.avatar}`}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {user?.name || 'Academic User'}
                </p>
                <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                  {user?.phone || user?.email || roleTitle}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE / TABLET SLIDE-OUT DRAWER */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <BrandLogo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Signed in as</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${themeClasses.badge}`}>
                {roleBadge}
              </span>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              {renderNavLinks(() => setMobileMenuOpen(false))}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.phone || user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN VIEWPORT WRAPPER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-xs">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
              <BrandLogo size="sm" showSubtitle={false} />
            </div>

            {/* Desktop Academic Context & Search Placeholder */}
            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search students, batches, subjects, tests..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  AY 2024–25 (Term 2)
                </span>
              </div>
            </div>

            {/* Topbar Right Actions */}
            <div className="flex items-center gap-3">
              {/* Academic Session indicator on mobile/tablet */}
              <span className="hidden sm:inline-flex lg:hidden text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                AY 2024–25
              </span>

              {/* Notification Placeholder */}
              <button
                title="Academic Notifications"
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {/* User Pill Dropdown Shortcut */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${themeClasses.avatar}`}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight">
                    {roleTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body (with pb-20 on mobile to clear bottom nav) */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>

        {/* Step 67: Mobile Bottom Navigation Bar (Touch-friendly 44px+ hit targets & Safe-Area Padding) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {defaultMobileNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-bold transition-all min-w-[50px] min-h-[44px] ${
                  isActive
                    ? `${themeClasses.activeBg} font-extrabold shadow-2xs`
                    : 'text-slate-500 hover:text-slate-900 active:scale-95'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center mb-0.5 ${isActive ? themeClasses.activeIcon : ''}`}>
                  {item.icon}
                </div>
                <span className="truncate max-w-[54px] text-center leading-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* ☰ More Action Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-900 active:scale-95 min-w-[50px] min-h-[44px]"
            aria-label="Open More Academic Options"
          >
            <div className="w-5 h-5 flex items-center justify-center mb-0.5">
              <Menu className="w-5 h-5 text-slate-500" />
            </div>
            <span className="truncate max-w-[54px] text-center leading-tight">More</span>
          </button>
        </div>

        {/* Shared Academic Footer */}
        <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 mb-16 lg:mb-0 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Infinite Tutorial</span>
            <span>&bull; Academic & Tuition Management System</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System Online
            </span>
            <span>&copy; {new Date().getFullYear()} Infinite Tutorial</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
