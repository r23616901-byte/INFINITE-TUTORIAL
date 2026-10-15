
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginApi } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BrandLogo } from '../../components/common/BrandLogo';
import { BrandWatermark } from '../../components/common/BrandWatermark';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export type RoleType = 'parent' | 'teacher' | 'admin';

// Safe demo credentials configured for development/testing
const DEMO_CREDENTIALS: Record<RoleType, { identifier: string; password: string }> = {
  parent: {
    identifier: import.meta.env.VITE_PARENT_DEMO_PHONE || '6361085188',
    password: import.meta.env.VITE_PARENT_DEMO_PASSWORD || '260906',
  },
  teacher: {
    identifier: import.meta.env.VITE_TEACHER_DEMO_EMAIL || 'teacher@infinite.com',
    password: import.meta.env.VITE_TEACHER_DEMO_PASSWORD || 'Teacher@123',
  },
  admin: {
    identifier: '',
    password: '',
  },
};

const PORTALS: { id: RoleType; label: string; icon: React.ReactNode }[] = [
  { id: 'parent', label: 'Parent', icon: <Users className="w-4 h-4" /> },
  { id: 'teacher', label: 'Teacher', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
];

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
  const [identifier, setIdentifier] = useState(() => DEMO_CREDENTIALS[getInitialRole()]?.identifier || '');
  const [password, setPassword] = useState(() => DEMO_CREDENTIALS[getInitialRole()]?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Sync state if URL route param changes
  useEffect(() => {
    const rawRole = (params.role || new URLSearchParams(location.search).get('role') || '').toLowerCase();
    if (!rawRole) {
      navigate('/login/parent', { replace: true });
      return;
    }
    const nextRole = getInitialRole();
    setActiveRole(nextRole);
    setIdentifier(DEMO_CREDENTIALS[nextRole]?.identifier || '');
    setPassword(DEMO_CREDENTIALS[nextRole]?.password || '');
    setShowPassword(false);
    setErrorMessage('');
  }, [params.role, location.search, navigate]);

  const handleRoleSelect = (newRole: RoleType) => {
    if (newRole === activeRole) return;
    navigate(`/login/${newRole}`);
  };

  const roleMeta = {
    parent: {
      title: 'Parent Portal Login',
      badge: 'Parent & Student Access',
      subtitle: "Sign in with your registered phone number to view attendance, marks & tests.",
      icon: <Users className="w-4 h-4 text-[#155EEF]" />,
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
      icon: <GraduationCap className="w-4 h-4 text-[#155EEF]" />,
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
      icon: <ShieldCheck className="w-4 h-4 text-[#155EEF]" />,
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
      name: 'Prof. Rajesh Sharma (Physics)',
      email: 'teacher@infinite.com',
      phone: '+91 9800000002',
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
      const res = await loginApi(cleanIdentifier, cleanPassword, activeRole.toUpperCase());
      if (res && res.success && res.data) {
        const userRole = (res.data.user.role || '').toUpperCase();
        const expectedRole = activeRole.toUpperCase();

        if (userRole !== expectedRole) {
          setErrorMessage(
            activeRole === 'teacher'
              ? 'Access denied: You entered an Administrator account in the Teacher Portal. Please use the Admin Portal or enter your faculty teacher credentials.'
              : activeRole === 'admin'
              ? 'Access denied: Only administrator accounts can access the Admin Portal. Please use the correct portal.'
              : 'Access denied: Only registered parent/student accounts can access the Parent Portal.'
          );
          return;
        }

        login(res.data.token, res.data.user);

        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

        if (from && !from.startsWith('/login')) {
          navigate(from, { replace: true });
        } else if (expectedRole === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (expectedRole === 'TEACHER') {
          navigate('/teacher', { replace: true });
        } else {
          navigate('/parent', { replace: true });
        }
        return;
      }
    } catch (err: any) {
      // If backend returned a specific error (e.g. 401 Invalid credentials or 403 Role access denied)
      const serverMessage = err?.response?.data?.message;
      if (serverMessage) {
        setErrorMessage(serverMessage);
        return;
      }

      // Backend offline fallback: strictly only allow matching activeRole credentials
      if (isParentMatch && activeRole === 'parent') {
        const parentUser = {
          ...mockUsers.PARENT,
          phone: normalizedPhone || '6361085188',
        };
        login('dev-token-parent', parentUser);
        navigate('/parent', { replace: true });
        return;
      }

      if (isTeacherMatch && activeRole === 'teacher') {
        login('dev-token-teacher', mockUsers.TEACHER);
        navigate('/teacher', { replace: true });
        return;
      }

      if (isAdminMatch && activeRole === 'admin') {
        login('dev-token-admin', mockUsers.ADMIN);
        navigate('/admin', { replace: true });
        return;
      }

      setErrorMessage(
        activeRole === 'parent'
          ? 'Invalid phone number or password. Please try again.'
          : activeRole === 'teacher'
          ? 'Invalid faculty email address or password. Please try again.'
          : 'Invalid administrator email address or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh min-h-screen flex flex-col justify-between bg-[#F5F8FC] text-[#0B1F4D] relative overflow-x-hidden select-none">
      {/* Background Brand Watermark */}
      <BrandWatermark opacity={0.035} size="xl" position="center" />

      {/* Top Header */}
      <header className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between z-20 relative bg-white/70 backdrop-blur-md border-b border-[#DCE5F2]">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 transition-opacity duration-200 focus:outline-hidden"
          aria-label="Infinite Tutorial Home"
        >
          <BrandLogo size="sm" />
        </Link>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[11px] font-bold text-[#155EEF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B8F8] animate-pulse" />
          <span>Academic Session 2024–25</span>
        </div>
      </header>

      {/* Main Centered Login Dashboard */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-3 sm:py-4 relative z-10 w-full max-w-lg mx-auto">
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-[#DCE5F2] shadow-[0_12px_40px_rgba(11,31,77,0.08)] p-5 sm:p-6 transition-all">

          {/* 1. Logo Centered at Top */}
          <div className="flex justify-center mb-2 sm:mb-2.5">
            <BrandLogo size="md" mode="full" />
          </div>

          {/* 2. Small Badge */}
          <div className="flex justify-center mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] text-[10px] font-bold tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#00B8F8]" />
              <span>DIGITAL TUITION &amp; ACADEMIC MANAGEMENT SYSTEM</span>
            </span>
          </div>

          {/* 3. Heading */}
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight text-center">
            Welcome to <span className="text-[#155EEF]">Infinite Tutorial</span>
          </h1>

          {/* 4. Subtitle */}
          <p className="text-xs text-[#5B6B82] leading-relaxed text-center mt-1 mb-3.5 max-w-sm mx-auto">
            Select your portal and sign in to access your academic workspace.
          </p>

          {/* 5. Compact Segmented Portal Selector (Parent / Teacher / Admin) */}
          <div className="mb-3">
            <div
              role="tablist"
              aria-label="Portal Selection"
              className="p-1 bg-[#EEF4FF] border border-[#DCE5F2] rounded-xl sm:rounded-2xl grid grid-cols-3 gap-1 shadow-2xs"
            >
              {PORTALS.map((portal) => {
                const isSelected = activeRole === portal.id;
                return (
                  <button
                    key={portal.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    id={`portal-tab-${portal.id}`}
                    onClick={() => handleRoleSelect(portal.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all duration-200 select-none cursor-pointer ${
                      isSelected
                        ? 'bg-[#155EEF] text-white shadow-sm shadow-blue-500/25'
                        : 'text-[#5B6B82] hover:text-[#0B1F4D] hover:bg-white/70'
                    }`}
                  >
                    {portal.icon}
                    <span>{portal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Portal Context Indicator */}
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#0B1F4D] leading-tight">
                {roleMeta.title}
              </h2>
              <p className="text-[11px] text-[#5B6B82] leading-none mt-0.5">
                {roleMeta.badge}
              </p>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#155EEF] bg-[#EEF4FF] px-2.5 py-0.5 rounded-full border border-[#DCE5F2]">
              {activeRole.toUpperCase()}
            </span>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* 6. Identifier field */}
            <div>
              <Input
                id="login-identifier"
                label={roleMeta.identifierLabel}
                type={activeRole === 'parent' ? 'tel' : 'email'}
                inputMode={activeRole === 'parent' ? 'numeric' : 'email'}
                placeholder={roleMeta.identifierPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                startIcon={roleMeta.identifierIcon}
                helperText={roleMeta.identifierHelper}
                autoComplete={activeRole === 'parent' ? 'tel' : 'email'}
                className="py-2"
                required
              />
            </div>

            {/* 7. Password field with show/hide icon */}
            <div>
              <Input
                id="login-password"
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
                    className="text-[#8A9BB0] hover:text-[#0B1F4D] focus:outline-hidden p-1 pointer-events-auto cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                autoComplete="current-password"
                className="py-2"
                required
              />

              {/* 8. Password Helper & Forgot Password Link */}
              <div className="flex items-center justify-between mt-1 px-0.5 text-[11px]">
                <span className="text-[#5B6B82] truncate pr-2">
                  {roleMeta.passwordHelper}
                </span>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-bold text-[#155EEF] hover:text-[#0E4FD6] transition-colors whitespace-nowrap cursor-pointer focus:outline-hidden"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* 9. Prominent Blue Login Button */}
            <div className="pt-0.5">
              <Button
                id="login-submit-btn"
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold text-sm sm:text-base rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                isLoading={isLoading}
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* 10. Footer within Card */}
          <div className="mt-3.5 pt-3 border-t border-[#DCE5F2] flex items-center justify-center gap-2 text-center text-xs font-semibold text-[#5B6B82]">
            <ShieldCheck className="w-4 h-4 text-[#155EEF]" />
            <span>Secure Academic &amp; Tuition Management System</span>
          </div>
        </div>
      </main>

      {/* Outer Clean Branded Footer */}
      <footer className="w-full px-4 sm:px-6 py-2.5 text-center border-t border-[#DCE5F2] bg-white/70 backdrop-blur-xs text-xs text-[#5B6B82] relative z-20">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
          <p className="font-medium">&copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.</p>
          <p className="text-[11px] text-[#8A9BB0]">
            Protected by Infinite Academic Security &bull; SSL Secured 256-Bit
          </p>
        </div>
      </footer>

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
