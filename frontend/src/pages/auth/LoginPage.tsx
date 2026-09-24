import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginApi } from '../../services/api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { BrandLogo } from '../../components/common/BrandLogo';
import { Phone, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Mode: 'parent' (Phone) or 'staff' (Teacher / Admin Gmail)
  const [loginMode, setLoginMode] = useState<'parent' | 'staff'>('parent');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both login identifier and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginApi(identifier.trim(), password);
      if (res.success && res.data) {
        login(res.data.token, res.data.user);

        // Redirect according to role
        const role = res.data.user.role;
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;

        if (from && from !== '/login') {
          navigate(from, { replace: true });
        } else if (role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else if (role === 'TEACHER') {
          navigate('/teacher', { replace: true });
        } else {
          navigate('/parent', { replace: true });
        }
      } else {
        setErrorMessage(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(errorObj.response?.data?.message || 'Invalid credentials or server unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct UI Shell Launcher for testing and evaluation
  const enterDirectRole = (role: 'ADMIN' | 'TEACHER' | 'PARENT') => {
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

    const targetUser = mockUsers[role];
    login(`dev-token-${role.toLowerCase()}`, targetUser);
    navigate(`/${role.toLowerCase()}`);
  };

  // Demo credential quick-fill helpers
  const fillDemo = (mode: 'parent' | 'teacher' | 'admin') => {
    setErrorMessage('');
    if (mode === 'parent') {
      setLoginMode('parent');
      setIdentifier('6361085188');
      setPassword('260906'); // Student DOB password format DDMMYY (Sep 26, 2006)
    } else if (mode === 'teacher') {
      setLoginMode('staff');
      setIdentifier('teacher@infinite.com');
      setPassword('Teacher@123');
    } else {
      setLoginMode('staff');
      setIdentifier('admin@infinite.com');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6">
      {/* Brand Header */}
      <div className="text-center mb-8 flex flex-col items-center justify-center space-y-2">
        <BrandLogo size="lg" />
        <p className="text-xs text-slate-500 font-medium">
          Tuition Management &amp; Academic Record System
        </p>
      </div>

      <Card>
        {/* Role Selector Tabs */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginMode('parent');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'parent'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            Parent (Phone)
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('staff');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              loginMode === 'staff'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Teacher & Admin (Gmail)
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginMode === 'parent' ? (
            <Input
              label="Parent Mobile Number"
              placeholder="e.g. 6361085188"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              startIcon={<Phone className="w-4 h-4" />}
              helperText="Use your registered 10-digit phone number"
              required
            />
          ) : (
            <Input
              label="Staff Gmail / Email ID"
              type="email"
              placeholder="e.g. teacher@infinite.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              startIcon={<Mail className="w-4 h-4" />}
              helperText="Use your registered institutional Gmail or email address"
              required
            />
          )}

          <Input
            label={loginMode === 'parent' ? 'Password or Student DOB (DDMMYY)' : 'Password'}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={<Lock className="w-4 h-4" />}
            helperText={
              loginMode === 'parent'
                ? 'Initial password is DOB (e.g. 26/09/2006 = 260906)'
                : 'Enter your secure staff password'
            }
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Sign In to Infinite Tutorial
          </Button>
        </form>

        {/* Quick Demo Fill & Direct Shell Preview Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick-Fill Role Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('parent')}
                className="py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => fillDemo('teacher')}
                className="py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
            <p className="text-[11px] font-bold text-blue-900 mb-1.5">
              Launch UI Shell Direct Preview (No Backend Required):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => enterDirectRole('ADMIN')}
                className="py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                Admin Shell
              </button>
              <button
                type="button"
                onClick={() => enterDirectRole('TEACHER')}
                className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                Teacher Shell
              </button>
              <button
                type="button"
                onClick={() => enterDirectRole('PARENT')}
                className="py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                Parent Shell
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
