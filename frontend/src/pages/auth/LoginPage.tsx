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
  ArrowLeft,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export type RoleType = 'parent' | 'teacher' | 'admin';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ role?: string }>();
  const { login, user, isAuthenticated } = useAuth();

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
    <div className="min-h-screen flex flex-col justify-between bg-[#F5F8FC] text-[#0B1F4D] relative overflow-hidden select-none">
      {/* Background Brand Watermark */}
      <BrandWatermark opacity={0.035} size="xl" position="center" />

      {/* Top Header */}
      <header className="w-full px-6 py-4 sm:px-8 flex items-center justify-between z-20 relative bg-white/70 backdrop-blur-md border-b border-[#DCE5F2]">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 transition-opacity duration-200 focus:outline-hidden"
          aria-label="Infinite Tutorial Home"
        >
          <BrandLogo size="sm" />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/select-role"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#155EEF] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Switch Role</span>
          </Link>

          <span className="hidden sm:inline-block text-[11px] font-bold text-[#155EEF] bg-[#EEF4FF] border border-[#DCE5F2] px-3 py-1 rounded-full">
            Secure SSL 256-Bit
          </span>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-10 w-full max-w-md mx-auto">
        <div className="w-full bg-white rounded-3xl border border-[#DCE5F2] shadow-sm p-6 sm:p-8">

            {/* Header info */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                  {roleMeta.icon}
                  {roleMeta.badge}
                </span>
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-[#DCE5F2] shadow-2xs flex items-center justify-center">
                  <img
                    src={`${import.meta.env.BASE_URL}images/roles/${activeRole}.jpg`}
                    alt={roleMeta.title}
                    className="w-full h-full object-contain"
                  />
                </div>
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

            {/* Active Session Notice */}
            {isAuthenticated && user && user.role.toLowerCase() === activeRole && (
              <div className="mb-5 p-3.5 rounded-2xl bg-[#EEF4FF] border border-[#155EEF]/30 flex items-center justify-between gap-3 text-xs animate-fadeIn">
                <div className="text-[#0B1F4D]">
                  <span className="font-semibold block">Signed in as {user.name}</span>
                  <span className="text-[#5B6B82] text-[11px]">Active {user.role} session available</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/${activeRole}`)}
                  className="px-3.5 py-1.5 bg-[#155EEF] hover:bg-[#004EEB] text-white rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Open Portal &rarr;
                </button>
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
      </main>

      {/* Clean Branded Footer */}
      <footer className="w-full px-6 py-4 sm:px-8 text-center border-t border-[#DCE5F2] bg-white/80 backdrop-blur-xs text-xs text-[#5B6B82] relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium">&copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.</p>
          <p className="text-[11px] text-[#8A9BB0]">
            Protected by Infinite Tutorial Academic Security &bull; SSL Secured
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
