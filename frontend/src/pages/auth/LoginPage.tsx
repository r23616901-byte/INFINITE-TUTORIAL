import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginApi } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  Phone,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export type RoleType = 'parent' | 'teacher' | 'admin';

// ── Portal theme config ──────────────────────────────────────────────────────
const ROLE_CONFIG: Record<
  RoleType,
  {
    emoji: string;
    badge: string;
    title: string;
    color: string;
    colorLight: string;
    colorBorder: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    identifierType: 'tel' | 'email';
    identifierMode: 'numeric' | 'email';
    identifierHelper: string;
    passwordHelper: string;
  }
> = {
  parent: {
    emoji: '👨‍🎓',
    badge: 'Student Records',
    title: 'Parent Portal Login',
    color: '#10B981',
    colorLight: '#ECFDF5',
    colorBorder: '#A7F3D0',
    identifierLabel: 'Registered Mobile Number',
    identifierPlaceholder: 'e.g. 6361085188',
    identifierType: 'tel',
    identifierMode: 'numeric',
    identifierHelper: 'Enter your registered 10-digit mobile number',
    passwordHelper: 'Initial password is student Date of Birth (DDMMYY)',
  },
  teacher: {
    emoji: '👩‍🏫',
    badge: 'Academic Desk',
    title: 'Teacher Portal Login',
    color: '#2563EB',
    colorLight: '#EFF6FF',
    colorBorder: '#BFDBFE',
    identifierLabel: 'Faculty Email Address',
    identifierPlaceholder: 'e.g. teacher@infinite.com',
    identifierType: 'email',
    identifierMode: 'email',
    identifierHelper: 'Enter your registered faculty email address',
    passwordHelper: 'Enter your assigned educator password',
  },
  admin: {
    emoji: '🛡️',
    badge: 'Control Center',
    title: 'Admin Portal Login',
    color: '#F59E0B',
    colorLight: '#FFFBEB',
    colorBorder: '#FDE68A',
    identifierLabel: 'Admin Email Address',
    identifierPlaceholder: 'e.g. admin@infinite.com',
    identifierType: 'email',
    identifierMode: 'email',
    identifierHelper: 'Enter your registered administrator email address',
    passwordHelper: 'Enter your secure administrative password',
  },
};

// ── Feature highlights for left panel ────────────────────────────────────────
const FEATURES = [
  { emoji: '📊', label: 'Academic Analytics' },
  { emoji: '📚', label: 'Smart Learning Management' },
  { emoji: '🔔', label: 'Real-time Notifications' },
];

// ── Mock users for demo / offline fallback ───────────────────────────────────
const MOCK_USERS = {
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

// ── Component ─────────────────────────────────────────────────────────────────
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ role?: string }>();
  const { login } = useAuth();

  const getInitialRole = (): RoleType => {
    const raw = (
      params.role ||
      new URLSearchParams(location.search).get('role') ||
      ''
    ).toLowerCase();
    if (raw === 'teacher') return 'teacher';
    if (raw === 'admin') return 'admin';
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

  // Sync role when URL param changes
  useEffect(() => {
    const raw = (
      params.role ||
      new URLSearchParams(location.search).get('role') ||
      ''
    ).toLowerCase();
    if (!raw) {
      navigate('/select-role', { replace: true });
      return;
    }
    setActiveRole(getInitialRole());
    setErrorMessage('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.role, location.search]);

  const cfg = ROLE_CONFIG[activeRole];

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = identifier.trim();
    const cleanPw = password.trim();

    if (!cleanId || !cleanPw) {
      setErrorMessage(
        activeRole === 'parent'
          ? 'Please enter both your phone number and password.'
          : 'Please enter both your email address and password.'
      );
      return;
    }

    setIsLoading(true);

    const normalizedPhone = cleanId.replace(/\D/g, '');
    const isParentMatch =
      activeRole === 'parent' &&
      (normalizedPhone === '6361085188' ||
        cleanId === '6361085188' ||
        normalizedPhone.length === 10) &&
      (cleanPw === '260906' ||
        cleanPw === '26/09/2006' ||
        cleanPw === '26092006' ||
        cleanPw.length >= 6);

    const isTeacherMatch =
      activeRole === 'teacher' &&
      (cleanId.toLowerCase().includes('teacher') ||
        cleanId.toLowerCase().includes('priya')) &&
      cleanPw.toLowerCase() === 'teacher@123';

    const isAdminMatch =
      activeRole === 'admin' &&
      cleanId.toLowerCase().includes('admin') &&
      cleanPw.toLowerCase() === 'admin@123';

    try {
      const res = await loginApi(cleanId, cleanPw);
      if (res && res.success && res.data) {
        login(res.data.token, res.data.user);
        const role = res.data.user.role;
        const from = (location.state as { from?: { pathname?: string } })?.from
          ?.pathname;
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
      if (isParentMatch) {
        login('dev-token-parent', {
          ...MOCK_USERS.PARENT,
          phone: normalizedPhone || '6361085188',
        });
        navigate('/parent', { replace: true });
        return;
      }
      if (isTeacherMatch) {
        login('dev-token-teacher', MOCK_USERS.TEACHER);
        navigate('/teacher', { replace: true });
        return;
      }
      if (isAdminMatch) {
        login('dev-token-admin', MOCK_USERS.ADMIN);
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
    login(`dev-token-${role.toLowerCase()}`, MOCK_USERS[role]);
    navigate(`/${role.toLowerCase()}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: '#F8FAFC',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LEFT PANEL — Brand Showcase                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: '50%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #0F172A 0%, #1E3A8A 60%, #1E40AF 100%)',
          color: '#fff',
        }}
      >
        {/* Floating blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(37,99,235,0.25)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.18)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '45%',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(245,158,11,0.12)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link to="/" style={{ display: 'inline-block' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <img
                src="/logo-transparent.png"
                alt="Infinite Tutorial"
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => {
                  const t = e.currentTarget;
                  if (!t.src.includes('logo.png')) t.src = '/logo.png';
                }}
              />
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Glow pulse ring */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(37,99,235,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '28px',
              boxShadow: '0 0 0 16px rgba(37,99,235,0.1)',
              animation: 'logoPulse 3s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: '32px', lineHeight: 1 }}>🎓</span>
          </div>

          <h1
            style={{
              fontSize: '36px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '8px',
            }}
          >
            Infinite Tutorial
          </h1>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '36px',
              letterSpacing: '0.02em',
            }}
          >
            Learn. Track. Grow.
          </p>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FEATURES.map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{f.emoji}</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.88)',
                  }}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          © {new Date().getFullYear()} Infinite Tutorial · All Rights Reserved
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* RIGHT PANEL — Login Card                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          overflowY: 'auto',
          background: '#F8FAFC',
          position: 'relative',
        }}
      >
        {/* Mobile-only logo */}
        <div
          className="flex lg:hidden"
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Link to="/">
            <img
              src="/logo-transparent.png"
              alt="Infinite Tutorial"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes('logo.png')) t.src = '/logo.png';
              }}
            />
          </Link>
        </div>

        {/* ── Login card ── */}
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow:
              '0 4px 6px rgba(15,23,42,0.04), 0 20px 48px rgba(15,23,42,0.10)',
            padding: '36px 32px',
            border: '1px solid #E5E7EB',
          }}
        >
          {/* Portal badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>{cfg.emoji}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: cfg.color,
                background: cfg.colorLight,
                border: `1px solid ${cfg.colorBorder}`,
                borderRadius: '999px',
                padding: '3px 12px',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              {cfg.badge}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            {cfg.title}
          </h2>

          {/* Error */}
          {errorMessage && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#B91C1C',
                fontWeight: 500,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px', color: '#EF4444' }} />
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label={cfg.identifierLabel}
              type={cfg.identifierType}
              inputMode={cfg.identifierMode}
              placeholder={cfg.identifierPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              startIcon={
                activeRole === 'parent'
                  ? <Phone className="w-4 h-4" />
                  : <Mail className="w-4 h-4" />
              }
              helperText={cfg.identifierHelper}
              autoComplete={activeRole === 'parent' ? 'tel' : 'email'}
              required
            />

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
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                helperText={cfg.passwordHelper}
                autoComplete="current-password"
                required
              />

              {/* Forgot password */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: cfg.color,
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login button */}
            <div style={{ marginTop: '4px' }}>
              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold text-sm"
                isLoading={isLoading}
                style={{ background: cfg.color, borderColor: cfg.color }}
              >
                Sign In to {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Portal
              </Button>
            </div>
          </form>

          {/* Demo tools */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <button
              type="button"
              onClick={() => setShowDemoTools(!showDemoTools)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748B',
                padding: 0,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} style={{ color: '#F59E0B' }} />
                Demo Mode: Quick Auto-Fill
              </span>
              <span
                style={{
                  fontSize: '10px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  color: '#0F172A',
                }}
              >
                {showDemoTools ? 'Hide' : 'Show'}
              </span>
            </button>

            {showDemoTools && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => fillDemo(activeRole)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0F172A',
                    width: '100%',
                  }}
                >
                  Auto-Fill{' '}
                  {activeRole === 'teacher'
                    ? 'Faculty Teacher'
                    : activeRole === 'admin'
                    ? 'Admin'
                    : 'Parent'}{' '}
                  Credentials
                </button>
                <button
                  type="button"
                  onClick={() =>
                    enterDirectRole(
                      activeRole.toUpperCase() as 'ADMIN' | 'TEACHER' | 'PARENT'
                    )
                  }
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: cfg.color,
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#ffffff',
                    width: '100%',
                  }}
                >
                  Direct Launch{' '}
                  {activeRole === 'teacher'
                    ? 'Teacher'
                    : activeRole === 'admin'
                    ? 'Admin'
                    : 'Parent'}{' '}
                  Portal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change portal + back link */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Link
            to="/select-role"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#64748B',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <span>
              Not logging in as{' '}
              {activeRole === 'teacher'
                ? 'Faculty Teacher'
                : activeRole === 'admin'
                ? 'Administrator'
                : 'Parent / Student'}
              ?
            </span>
            <span style={{ fontWeight: 700, textDecoration: 'underline', color: cfg.color }}>
              Change Portal
            </span>
          </Link>

          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: '#94A3B8',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={11} />
            Back to role selection
          </Link>
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: '16px',
            fontSize: '11px',
            color: '#CBD5E1',
            textAlign: 'center',
          }}
        >
          © {new Date().getFullYear()} Infinite Tutorial · SSL Secured
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FORGOT PASSWORD MODAL                                           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 60px rgba(15,23,42,0.18)',
              maxWidth: '360px',
              width: '100%',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: cfg.colorLight,
                  border: `1px solid ${cfg.colorBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cfg.color,
                  flexShrink: 0,
                }}
              >
                <HelpCircle size={20} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Reset Your Password
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
              Credential resets for{' '}
              <strong style={{ color: '#0F172A' }}>{cfg.title}</strong> are
              managed by the institute administration desk.
            </p>

            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0F172A' }}>
                <Phone size={13} style={{ color: cfg.color, flexShrink: 0 }} />
                <span>
                  Call Admin: <strong>+91 98765 43210</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0F172A' }}>
                <Mail size={13} style={{ color: cfg.color, flexShrink: 0 }} />
                <span>
                  Email: <strong>admin@infinitetutorial.com</strong>
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 text-sm"
            >
              Understood
            </Button>
          </div>
        </div>
      )}

      {/* ── Keyframe for logo glow pulse ── */}
      <style>{`
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 0 0 16px rgba(37,99,235,0.10); }
          50%       { box-shadow: 0 0 0 24px rgba(37,99,235,0.05); }
        }
      `}</style>
    </div>
  );
};
