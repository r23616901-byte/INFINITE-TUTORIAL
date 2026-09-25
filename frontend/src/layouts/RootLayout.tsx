import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BrandWatermark } from '../components/common/BrandWatermark';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] text-[#0B1F4D] relative">
      <BrandWatermark opacity={0.04} size="lg" position="center" />
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-[#DCE5F2] py-4 text-center text-xs text-[#5B6B82] relative z-10">
        &copy; {new Date().getFullYear()} Infinite Tutorial. All rights reserved.
      </footer>
    </div>
  );
};
