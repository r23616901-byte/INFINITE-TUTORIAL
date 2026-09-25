import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from './common/BrandLogo';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#DCE5F2] py-3.5 px-6 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <BrandLogo size="md" />

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Academic Portal Active
          </span>
        </div>
      </div>
    </header>
  );
};
