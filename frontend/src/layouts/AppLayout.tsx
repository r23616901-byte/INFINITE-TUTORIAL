import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from '../components/common/BrandLogo';
import { BrandWatermark } from '../components/common/BrandWatermark';

export const AppLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] text-[#0B1F4D] relative">
      {/* Subtle Brand Watermark */}
      <BrandWatermark opacity={0.045} size="lg" position="center" />

      {/* Header / Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#DCE5F2] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <BrandLogo size="md" />
          </Link>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                  <Shield className="w-3.5 h-3.5 text-[#155EEF]" />
                  {user.role}
                </span>
                <span className="text-xs font-bold text-[#0B1F4D] hidden md:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-[#5B6B82] hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold btn-brand-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#DCE5F2] py-4 text-center text-xs text-[#5B6B82] relative z-10">
        &copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.
      </footer>
    </div>
  );
};
