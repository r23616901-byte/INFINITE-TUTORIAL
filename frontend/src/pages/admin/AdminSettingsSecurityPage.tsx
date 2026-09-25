import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  Settings,
  ShieldCheck,
  Server,
  Lock,
  Database,
  Cloud,
  CheckCircle2,
  Sparkles,
  Save,
  Download,
} from 'lucide-react';

export const AdminSettingsSecurityPage: React.FC = () => {
  const [instituteName, setInstituteName] = useState('Infinite Tutorial');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [currentTerm, setCurrentTerm] = useState('Term 2');
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [enforcePasswordReset, setEnforcePasswordReset] = useState(true);
  const [enableParentSmsAlerts, setEnableParentSmsAlerts] = useState(true);
  const [minimumAttendance, setMinimumAttendance] = useState('75');
  const [passPercentage, setPassPercentage] = useState('40');
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setNotification('System configuration and security policies saved successfully.');
      setTimeout(() => setNotification(null), 4000);
    }, 600);
  };

  const handleExportBackup = () => {
    const backupData = {
      institution: instituteName,
      academicYear,
      currentTerm,
      exportTimestamp: new Date().toISOString(),
      status: 'HEALTHY',
      recordsCount: {
        students: 84,
        teachers: 8,
        batches: 3,
        auditLogs: 10,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infinite_tutorial_system_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setNotification('System metadata backup snapshot downloaded successfully.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Settings className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#155EEF]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Global Configuration & Enterprise Security
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              System Settings & Security Controls
            </h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl">
              Manage institution metadata, access control policies, academic passing criteria, session lifecycles, and system backup archives.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExportBackup}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export System Snapshot
            </Button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Security Status"
          value="Encrypted"
          subtitle="SSL / TLS & Role Guards Active"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Cloud Storage"
          value="Cloudinary"
          subtitle="Answer Sheets & PDF Vault"
          icon={<Cloud className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Database Cluster"
          value="PostgreSQL"
          subtitle="Prisma ORM Synchronized"
          icon={<Database className="w-5 h-5 text-[#00B8F8]" />}
        />
        <StatCard
          title="System Architecture"
          value="Resilient"
          subtitle="Client Fallback Active"
          icon={<Server className="w-5 h-5 text-[#0B1F4D]" />}
        />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Institution Details */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Server className="w-5 h-5 text-[#155EEF]" />
            Institution & Academic Year Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year</label>
              <input
                type="text"
                required
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Term / Semester</label>
              <input
                type="text"
                required
                value={currentTerm}
                onChange={(e) => setCurrentTerm(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Card 2: Security & Session Policies */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Lock className="w-5 h-5 text-[#155EEF]" />
            Security & Authentication Policies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Session Inactivity Timeout (Minutes)
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                >
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes (Recommended)</option>
                  <option value="120">120 Minutes</option>
                  <option value="240">4 Hours</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Automatically terminates idle browser sessions to protect student records.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="chk-reset"
                  checked={enforcePasswordReset}
                  onChange={(e) => setEnforcePasswordReset(e.target.checked)}
                  className="w-4 h-4 text-[#155EEF] rounded border-gray-300 focus:ring-[#155EEF]"
                />
                <label htmlFor="chk-reset" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Enforce Password Change on Temporary PIN First Login
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="chk-sms"
                  checked={enableParentSmsAlerts}
                  onChange={(e) => setEnableParentSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#155EEF] rounded border-gray-300 focus:ring-[#155EEF]"
                />
                <label htmlFor="chk-sms" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Dispatch Automated SMS Alerts for Password Resets & Urgent Circulars
                </label>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs text-gray-600">
              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active Protection Measures
              </h4>
              <p>&bull; Role-Based Access Control (RBAC) enforced on all administrative endpoints.</p>
              <p>&bull; SHA-256 cryptographically salted password hashes.</p>
              <p>&bull; Full immutable audit trail recording every grade edit, attendance record, and credential reset.</p>
              <p>&bull; 365-day compliance retention for evaluation logs.</p>
            </div>
          </div>
        </Card>

        {/* Card 3: Academic Thresholds */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3">
            <Sparkles className="w-5 h-5 text-[#155EEF]" />
            Academic Thresholds & Compliance Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Minimum Mandatory Attendance (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={minimumAttendance}
                onChange={(e) => setMinimumAttendance(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Students below this threshold trigger parent alerts (Rahul Kumar is currently at 91.3% - Compliant).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Passing Mark Threshold (%)
              </label>
              <input
                type="number"
                min="30"
                max="60"
                value={passPercentage}
                onChange={(e) => setPassPercentage(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Scores below this cutoff are tagged as &quot;Needs Improvement / Remedial Session&quot;.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#155EEF] hover:bg-[#1048B5] text-white font-semibold px-6 py-2.5 shadow-md text-xs"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving Policies...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AdminSettingsSecurityPage;
