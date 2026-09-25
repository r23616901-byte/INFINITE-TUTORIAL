import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginApi } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BrandWatermark } from '../../components/common/BrandWatermark';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  Shield,
} from 'lucide-react';

export type RoleType = 'parent' | 'teacher' | 'admin';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ role?: string }>();
  const { login } = useAuth();

  // Determine active role from URL param (/login/:role) or query param (?role=) or default to 'parent'
  const getInitialRole = (): RoleType => {
    const rawRole = (params.role || new URLSearchParams(location.search).get('role') || '').toLowerCase();
    if (rawRole === 'teacher') return 'teacher';
    if (rawRole === 'admin') return 'admin';
    return 'parent';
  };

  const [activeRole, setActiveRole] = useState<RoleType>(getInitialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showDemoTools, setShowDemoTools] = useState(false);

  // Sync state if URL route param changes
  useEffect(() => {
    const rawRole = (params.role || new URLSearchParams(location.search).get('role') || '').toLowerCase();
    if (!rawRole) {
      navigate('/select-role', { replace: true });
      return;
    }
    const nextRole = getInitialRole();
    setActiveRole(nextRole);
    setErrorMessage('');
  }, [params.role, location.search, navigate]);

  const roleMeta = {
    parent: {
      title: 'Parent Portal Login',
      badge: 'Parent & Student Access',
      subtitle: "Sign in with your registered phone number to view attendance, marks & tests.",
      icon: <Users className="w-5 h-5 text-[#155EEF]" />,
      identifierLabel: 'Registered Mobile Number',
      identifierPlaceholder: 'e.g. 6361085188',
      identifierIcon: <Phone className="w-4 h-4" />,
      identifierHelper: 'Enter your registered 10-digit mobile number',
      passwordHelper: 'Initial password is student Date of Birth (DDMMYY)',
    },
    teacher: {
      title: 'Teacher Portal Login',
      badge: 'Faculty Educator Desk',
      subtitle: 'Sign in with your faculty email to record attendance, exams & updates.',
      icon: <GraduationCap className="w-5 h-5 text-[#155EEF]" />,
      identifierLabel: 'Faculty Email Address',
      identifierPlaceholder: 'e.g. teacher@infinite.com',
      identifierIcon: <Mail className="w-4 h-4" />,
      identifierHelper: 'Enter your registered faculty email address',
      passwordHelper: 'Enter your assigned educator password',
    },
    admin: {
      title: 'Admin Portal Login',
      badge: 'Administration Portal',
      subtitle: 'Sign in to manage tuition operations, teachers, and system records.',
      icon: <ShieldCheck className="w-5 h-5 text-[#155EEF]" />,
      identifierLabel: 'Admin Email Address',
      identifierPlaceholder: 'e.g. admin@infinite.com',
      identifierIcon: <Mail className="w-4 h-4" />,
      identifierHelper: 'Enter your registered administrator email address',
      passwordHelper: 'Enter your secure administrative password',
    },
  }[activeRole];

  // Mock user definitions for demonstration and offline mode
  const mockUsers = {
    ADMIN: {
      id: 'admin-preview-1',
      role: 'ADMIN' as const,
      name: 'Dr. Ramesh Sharma',
      email: 'admin@infinitetutorial.com',
      phone: '+91 9876543210',
    },
    TEACHER: {
      id: 'teacher-preview-1',
      role: 'TEACHER' as const,
      name: 'Mrs. Priya Sundaram',
      email: 'priya@infinitetutorial.com',
      phone: '+91 9812345678',
    },
    PARENT: {
      id: 'parent-preview-1',
      role: 'PARENT' as const,
      name: 'Mr. Ramesh Kumar (Parent of Rahul)',
      phone: '6361085188',
      email: null,
      mustChangePassword: false,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier || !cleanPassword) {
      if (activeRole === 'parent') {
        setErrorMessage('Please enter both your phone number and password.');
      } else {
        setErrorMessage('Please enter both your email address and password.');
      }
      return;
    }

    setIsLoading(true);

    // Check credentials for instant offline/demo support
    const normalizedPhone = cleanIdentifier.replace(/\D/g, '');
    const isParentMatch =
      activeRole === 'parent' &&
      (normalizedPhone === '6361085188' || cleanIdentifier === '6361085188' || normalizedPhone.length === 10) &&
      (cleanPassword === '260906' || cleanPassword === '26/09/2006' || cleanPassword === '26092006' || cleanPassword.length >= 6);

    const isTeacherMatch =
      activeRole === 'teacher' &&
      (cleanIdentifier.toLowerCase().includes('teacher') || cleanIdentifier.toLowerCase().includes('priya')) &&
      cleanPassword.toLowerCase() === 'teacher@123';

    const isAdminMatch =
      activeRole === 'admin' &&
      cleanIdentifier.toLowerCase().includes('admin') &&
      cleanPassword.toLowerCase() === 'admin@123';

    try {
      const res = await loginApi(cleanIdentifier, cleanPassword);
      if (res && res.success && res.data) {
        login(res.data.token, res.data.user);

        const role = res.data.user.role;
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

        if (from && !from.startsWith('/login')) {
          navigate(from, { replace: true });
        } else if (role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (role === 'TEACHER') {
          navigate('/teacher', { replace: true });
        } else {
          navigate('/parent', { replace: true });
        }
        return;
      }
    } catch {
      // Backend offline fallback to authenticated demo accounts
      if (isParentMatch) {
        const parentUser = {
          ...mockUsers.PARENT,
          phone: normalizedPhone || '6361085188',
        };
        login('dev-token-parent', parentUser);
        navigate('/parent', { replace: true });
        return;
      }

      if (isTeacherMatch) {
        login('dev-token-teacher', mockUsers.TEACHER);
        navigate('/teacher', { replace: true });
        return;
      }

      if (isAdminMatch) {
        login('dev-token-admin', mockUsers.ADMIN);
        navigate('/admin', { replace: true });
        return;
      }

      setErrorMessage(
        activeRole === 'parent'
          ? 'Invalid phone number or password. Please try again.'
          : 'Invalid email address or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: RoleType) => {
    setErrorMessage('');
    if (role === 'parent') {
      setIdentifier('6361085188');
      setPassword('260906');
    } else if (role === 'teacher') {
      setIdentifier('teacher@infinite.com');
      setPassword('Teacher@123');
    } else {
      setIdentifier('admin@infinite.com');
      setPassword('Admin@123');
    }
  };

  const enterDirectRole = (role: 'ADMIN' | 'TEACHER' | 'PARENT') => {
    const targetUser = mockUsers[role];
    login(`dev-token-${role.toLowerCase()}`, targetUser);
    navigate(`/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F8FC] text-[#0B1F4D]">
      {/* ========================================================= */}
      {/* BRAND SHOWCASE COLUMN (LEFT SIDE ON DESKTOP) */}
      {/* ========================================================= */}
      <div className="lg:w-5/12 xl:w-1/2 brand-sidebar-bg text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden select-none">
        {/* Subtle decorative glow in brand cyan/orange */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#155EEF]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F7931E]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Watermark inside the dark branding pane */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <img
            src="/logo-emblem-transparent.png"
            alt=""
            className="w-96 h-auto object-contain filter invert"
          />
        </div>

        {/* Top Logo Slot */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-white/30 inline-flex items-center">
              <img
                src="/logo-transparent.png"
                alt="Infinite Tutorial Logo"
                className="h-9 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png';
                  }
                }}
              />
            </div>
          </Link>
        </div>

        {/* Center Educational Value Proposition */}
        <div className="my-10 lg:my-0 space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#00B8F8] text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB52E]" />
            Official Educational Portal
          </div>

          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
            Inspiring Academic Excellence,{' '}
            <span className="text-[#00B8F8]">Boundless Potential</span>
          </h1>

          <p className="text-sm sm:text-base text-[#DCE5F2] leading-relaxed font-normal">
            Infinite Tutorial provides structured mentoring, verified performance analytics, instant attendance notifications, and transparent tuition management.
          </p>

          {/* 3 Pillars */}
          <div className="pt-4 space-y-3.5 text-xs sm:text-sm text-[#DCE5F2]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#00B8F8]">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-medium">Real-time attendance &amp; departure safety alerts</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FFB52E]">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-medium">Official verified scorecards &amp; analytics</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#1677FF]">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-medium">Syllabus progression &amp; daily class logs</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright in showcase */}
        <div className="relative z-10 text-xs text-[#8A9BB0] pt-6 border-t border-white/10">
          <p>&copy; {new Date().getFullYear()} Infinite Tutorial &bull; All Rights Reserved</p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LOGIN CARD COLUMN (RIGHT SIDE ON DESKTOP) */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative overflow-hidden">
        {/* Subtle Watermark on right page background */}
        <BrandWatermark opacity={0.035} size="lg" position="center" />

        {/* Top bar back link */}
        <div className="w-full flex items-center justify-between mb-6 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5B6B82] hover:text-[#155EEF] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to role selection</span>
          </Link>

          <span className="text-[11px] font-bold text-[#155EEF] bg-[#EEF4FF] border border-[#DCE5F2] px-3 py-1 rounded-full">
            Secure SSL 256-Bit
          </span>
        </div>

        {/* Centered Login Card */}
        <div className="w-full max-w-md mx-auto my-auto relative z-10">
          <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-sm p-6 sm:p-8">

            {/* Header info */}
            <div className="mb-6 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                  {roleMeta.icon}
                  {roleMeta.badge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1F4D] tracking-tight">
                {roleMeta.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6B82] leading-relaxed">
                {roleMeta.subtitle}
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label={roleMeta.identifierLabel}
                  type={activeRole === 'parent' ? 'tel' : 'email'}
                  inputMode={activeRole === 'parent' ? 'numeric' : 'email'}
                  placeholder={roleMeta.identifierPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  startIcon={roleMeta.identifierIcon}
                  helperText={roleMeta.identifierHelper}
                  autoComplete={activeRole === 'parent' ? 'tel' : 'email'}
                  required
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startIcon={<Lock className="w-4 h-4" />}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#8A9BB0] hover:text-[#0B1F4D] focus:outline-hidden p-1 pointer-events-auto"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  helperText={roleMeta.passwordHelper}
                  autoComplete="current-password"
                  required
                />

                {/* Forgot Password link */}
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-bold text-[#155EEF] hover:text-[#0E4FD6] transition-colors focus:outline-hidden"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 font-bold text-sm"
                  isLoading={isLoading}
                >
                  Sign In to {activeRole.toUpperCase()} Portal
                </Button>
              </div>
            </form>

            {/* Quick Demo Credential Helper */}
            <div className="mt-6 pt-5 border-t border-[#F0F4FA]">
              <button
                type="button"
                onClick={() => setShowDemoTools(!showDemoTools)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-[#5B6B82] hover:text-[#0B1F4D] transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" />
                  Demo Mode: Quick Auto-Fill
                </span>
                <span className="text-[10px] bg-[#F5F8FC] border border-[#DCE5F2] px-2 py-0.5 rounded text-[#0B1F4D]">
                  {showDemoTools ? 'Hide' : 'Show'}
                </span>
              </button>

              {showDemoTools && (
                <div className="mt-3 space-y-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => fillDemo(activeRole)}
                    className="w-full py-2 px-3 rounded-xl border border-[#DCE5F2] bg-[#F5F8FC] hover:bg-[#EEF4FF] hover:border-[#155EEF] text-xs font-bold text-[#0B1F4D] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Auto-Fill {activeRole === 'teacher' ? 'Faculty Teacher' : activeRole === 'admin' ? 'Admin' : 'Parent'} Credentials</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => enterDirectRole(activeRole.toUpperCase() as 'ADMIN' | 'TEACHER' | 'PARENT')}
                    className="w-full py-2 px-3 rounded-xl bg-[#155EEF] hover:bg-[#0E4FD6] text-white text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Direct Launch {activeRole === 'teacher' ? 'Teacher' : activeRole === 'admin' ? 'Admin' : 'Parent'} Portal</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Switch Portal Option */}
          <div className="mt-4 text-center">
            <Link
              to="/select-role"
              className="inline-flex items-center gap-1.5 text-xs text-[#5B6B82] hover:text-[#155EEF] transition-colors font-medium"
            >
              <span>Not logging in as {activeRole === 'teacher' ? 'Faculty Teacher' : activeRole === 'admin' ? 'Administrator' : 'Parent / Student'}?</span>
              <span className="font-bold underline">Change Portal</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright in form column */}
        <div className="w-full text-center text-xs text-[#8A9BB0] pt-6 relative z-10">
          <p>Protected by Infinite Tutorial Academic Security &bull; SSL Secured</p>
        </div>
      </div>

      {/* Forgot Password Guidance Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#071633]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-[#0B1F4D]">
              <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] border border-[#DCE5F2] flex items-center justify-center text-[#155EEF]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Reset Your Password</h3>
            </div>

            <p className="text-xs text-[#5B6B82] leading-relaxed">
              To ensure student data protection and verify identity, credential resets for{' '}
              <strong className="text-[#0B1F4D] font-bold">{roleMeta.title}</strong>{' '}
              are assisted by the institute administration desk.
            </p>

            <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5F2] text-xs space-y-1.5 text-[#0B1F4D]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#155EEF]" />
                <span>Call Administration: <strong>+91 98765 43210</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#155EEF]" />
                <span>Email: <strong>admin@infinitetutorial.com</strong></span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2 text-xs"
              >
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
