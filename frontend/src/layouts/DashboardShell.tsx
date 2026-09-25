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
import { BrandWatermark } from '../components/common/BrandWatermark';

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
  roleTheme?: 'indigo' | 'emerald' | 'blue';
  navSections: NavSection[];
  customMobileNavItems?: NavItem[];
  children?: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  roleTitle,
  roleBadge,
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

  // Canonical Mobile Navigation: Home, Attendance, Scorecard, Notifs, Profile, plus More
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
        href: role === 'ADMIN' ? '/admin/scorecards' : role === 'TEACHER' ? '/teacher/scorecards' : '/parent/scorecards',
        icon: <Award className="w-5 h-5" />,
      },
      {
        name: 'Notifs',
        href: role === 'ADMIN' ? '/admin/announcements' : role === 'TEACHER' ? '/teacher/announcements' : '/parent/announcements',
        icon: <Bell className="w-5 h-5" />,
      },
      {
        name: 'Profile',
        href: role === 'ADMIN' ? '/admin/students' : role === 'TEACHER' ? '/teacher/students' : '/parent/profile',
        icon: <User className="w-5 h-5" />,
      },
    ];
  }, [customMobileNavItems, user?.role]);

  // Unified Brand Nav Renderer for Dark Navy Sidebar
  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="space-y-6">
      {navSections.map((section, idx) => (
        <div key={idx} className="space-y-1">
          {section.title && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#8A9BB0] mb-2">
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
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'brand-nav-active'
                    : 'text-[#DCE5F2] hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`transition-colors flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-[#8A9BB0] group-hover:text-[#00B8F8]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.badgeColor ||
                      'bg-[#155EEF]/20 text-[#00B8F8] border-[#00B8F8]/40'
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
    <div className="min-h-screen bg-[#F5F8FC] flex text-[#0B1F4D]">
      {/* ========================================================= */}
      {/* DESKTOP FIXED DEEP NAVY SIDEBAR */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 brand-sidebar-bg border-r border-[#142C68] sticky top-0 h-screen z-30 flex-shrink-0 shadow-lg select-none">
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="block">
            <BrandLogo size="md" variant="white" />
          </Link>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
            <span className="text-[#8A9BB0] font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00B8F8]" />
              Portal Access:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#155EEF]/30 text-[#00B8F8] border border-[#00B8F8]/40 tracking-wider">
              {roleBadge}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-brand-dark">
          {renderNavLinks()}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-4 border-t border-white/10 bg-[#071633]/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs bg-gradient-to-tr from-[#155EEF] to-[#00B8F8] text-white shadow-xs flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user?.name || 'Academic User'}
                </p>
                <p className="text-[11px] text-[#8A9BB0] truncate leading-tight mt-0.5">
                  {user?.phone || user?.email || roleTitle}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-[#8A9BB0] hover:text-white hover:bg-red-500/20 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE / TABLET SLIDE-OUT DEEP NAVY DRAWER */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-[#071633]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] brand-sidebar-bg text-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <BrandLogo size="sm" variant="white" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#8A9BB0] hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#8A9BB0] font-medium">Signed in as</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#155EEF]/30 text-[#00B8F8] border border-[#00B8F8]/40">
                {roleBadge}
              </span>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-brand-dark">
              {renderNavLinks(() => setMobileMenuOpen(false))}
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#071633]/90">
              <div className="flex items-center justify-between">
                <div className="truncate mr-2">
                  <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-[#8A9BB0] truncate">{user?.phone || user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-300 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-semibold transition-colors flex-shrink-0"
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
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header / Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#DCE5F2] shadow-2xs">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-xl text-[#0B1F4D] hover:bg-[#EEF4FF] transition-colors"
                aria-label="Open Navigation"
              >
                <Menu className="w-5 h-5 text-[#0B1F4D]" />
              </button>
              <BrandLogo size="sm" showSubtitle={false} />
            </div>

            {/* Desktop Academic Context & Search */}
            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-[#8A9BB0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search students, batches, subjects, tests..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F8FC] border border-[#DCE5F2] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] transition-all text-[#0B1F4D] placeholder-[#8A9BB0]"
                />
              </div>

              <div className="hidden xl:flex items-center gap-2 text-xs text-[#5B6B82]">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2] rounded-lg font-bold text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#155EEF]" />
                  AY 2024–25 (Term 2)
                </span>
              </div>
            </div>

            {/* Topbar Right Actions */}
            <div className="flex items-center gap-3">
              {/* Academic Session indicator on mobile/tablet */}
              <span className="hidden sm:inline-flex lg:hidden text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                AY 2024–25
              </span>

              {/* Notification Button */}
              <button
                title="Academic Notifications"
                className="relative p-2 text-[#5B6B82] hover:text-[#0B1F4D] hover:bg-[#EEF4FF] rounded-xl transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#155EEF] ring-2 ring-white" />
              </button>

              {/* User Pill Dropdown Shortcut */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-[#DCE5F2]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs bg-gradient-to-tr from-[#155EEF] to-[#00B8F8] text-white shadow-2xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#0B1F4D] leading-tight">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-[#5B6B82] font-semibold leading-tight mt-0.5">
                    {roleTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body with SUBTLE BRAND WATERMARK ALWAYS PRESENT */}
        <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Subtle Infinite Tutorial Logo Watermark across every dashboard page */}
          <BrandWatermark opacity={0.045} size="lg" position="center" />

          <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6 max-w-7xl w-full mx-auto">
            {children || <Outlet />}
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar (Touch-friendly 44px+ hit targets & Safe-Area Padding) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE5F2] px-1 py-1 flex items-center justify-around shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {defaultMobileNav.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-bold transition-all min-w-[50px] min-h-[44px] ${
                  isActive
                    ? 'text-[#155EEF] font-extrabold bg-[#EEF4FF]'
                    : 'text-[#5B6B82] hover:text-[#0B1F4D] active:scale-95'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center mb-0.5 ${isActive ? 'text-[#155EEF]' : 'text-[#8A9BB0]'}`}>
                  {item.icon}
                </div>
                <span className="truncate max-w-[54px] text-center leading-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* More Action Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-bold text-[#5B6B82] hover:text-[#0B1F4D] active:scale-95 min-w-[50px] min-h-[44px]"
            aria-label="Open More Academic Options"
          >
            <div className="w-5 h-5 flex items-center justify-center mb-0.5">
              <Menu className="w-5 h-5 text-[#8A9BB0]" />
            </div>
            <span className="truncate max-w-[54px] text-center leading-tight">More</span>
          </button>
        </div>

        {/* Shared Academic Footer */}
        <footer className="bg-white border-t border-[#DCE5F2] px-4 sm:px-6 lg:px-8 py-3.5 mb-16 lg:mb-0 text-xs text-[#5B6B82] flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#155EEF]" />
            <span className="font-bold text-[#0B1F4D]">Infinite Tutorial</span>
            <span>&bull; Academic &amp; Tuition Management System</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#8A9BB0]">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Online
            </span>
            <span>&copy; {new Date().getFullYear()} Infinite Tutorial</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
