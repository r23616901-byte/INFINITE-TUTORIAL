import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ShieldCheck, Database, Cloud, Layers, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Welcome Card */}
      <Card
        title="Infinite Tutorial Platform"
        subtitle="Foundational Architecture & Component System"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Tuition management and academic record tracking architecture initialized with React Router, 
            Tailwind CSS, React Hook Form, Recharts, and Lucide React.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Layers className="w-3.5 h-3.5" />
              Frontend: React + Vite + TS
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
              <Database className="w-3.5 h-3.5" />
              Backend: Express + Prisma (PostgreSQL)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Cloud className="w-3.5 h-3.5" />
              Storage: Cloudinary
            </span>
          </div>
        </div>
      </Card>

      {/* Component Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Reusable UI Components"
          subtitle="Form Inputs & Action Buttons"
        >
          <div className="space-y-4">
            <Input
              label="Student / Parent Phone"
              placeholder="e.g. 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helperText="Enter 10-digit registered mobile number"
            />
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="primary" size="sm">
                Primary Button
              </Button>
              <Button variant="outline" size="sm">
                Outline Button
              </Button>
              <Button variant="secondary" size="sm">
                Secondary
              </Button>
            </div>
          </div>
        </Card>

        <Card
          title="Role Structure"
          subtitle="Strict Role-Based Access Control"
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-800 font-semibold block text-xs">Admin</strong>
                <span className="text-xs text-slate-500">Full system control, protected profile updates, batch allocation.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-800 font-semibold block text-xs">Teacher</strong>
                <span className="text-xs text-slate-500">Take attendance, enter/edit marks with audit trail, upload papers.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-slate-800 font-semibold block text-xs">Parent / Student</strong>
                <span className="text-xs text-slate-500">Read-only view of marks, scorecards, attendance, and leave requests.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center py-4">
        <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Clean architecture foundation ready for subsequent module implementations.
        </p>
      </div>
    </div>
  );
};
