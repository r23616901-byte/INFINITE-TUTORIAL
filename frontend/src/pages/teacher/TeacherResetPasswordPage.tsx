import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  KeyRound,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface StudentInfo {
  id: string;
  name: string;
  roll: string;
  batch: string;
  parentPhone: string;
  lastLogin: string;
}

const ROSTER_STUDENTS: StudentInfo[] = [
  {
    id: 'stu-10025',
    name: 'Rahul Kumar',
    roll: 'IT10025',
    batch: 'Batch 10A Morning (CBSE 10th)',
    parentPhone: '+91 9876543210',
    lastLogin: '24 Sep 2026, 08:15 AM',
  },
  {
    id: 'stu-10012',
    name: 'Ananya Sharma',
    roll: 'IT10012',
    batch: 'Batch 10A Morning (CBSE 10th)',
    parentPhone: '+91 9811223344',
    lastLogin: '23 Sep 2026, 06:40 PM',
  },
  {
    id: 'stu-10034',
    name: 'Rohan Patel',
    roll: 'IT10034',
    batch: 'Batch 10A Morning (CBSE 10th)',
    parentPhone: '+91 9822334455',
    lastLogin: '22 Sep 2026, 07:10 PM',
  },
  {
    id: 'stu-10041',
    name: 'Sneha Reddy',
    roll: 'IT10041',
    batch: 'Batch 10A Morning (CBSE 10th)',
    parentPhone: '+91 9833445566',
    lastLogin: '21 Sep 2026, 05:30 PM',
  },
];

export const TeacherResetPasswordPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(ROSTER_STUDENTS[0]);
  const [newPassword, setNewPassword] = useState('Welcome@123');
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredStudents = ROSTER_STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pwd = 'IT@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pwd);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setNotification(
      `Password successfully reset for ${selectedStudent.name} (${selectedStudent.roll}). An SMS dispatch with credentials has been sent to ${selectedStudent.parentPhone}.`
    );
    setTimeout(() => setNotification(null), 6000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071633] via-[#0B1F4D] to-[#155EEF] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#155EEF]/30">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <KeyRound className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/30 text-[#00B8F8] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#00B8F8]/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Student Credentials & Access Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Reset Student / Parent Password
            </h1>
            <p className="text-blue-100/90 text-sm mt-1 max-w-2xl">
              Assist students or parents who have forgotten their portal credentials. Generate a temporary password or reset credentials securely.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Selector */}
        <Card className="p-5 lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Select Student
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or roll..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedStudent?.id === s.id
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">{s.name}</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                    {s.roll}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">{s.batch}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Reset Form */}
        <Card className="p-6 lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Target Account</span>
                  <h4 className="text-base font-bold text-gray-900 mt-0.5">
                    {selectedStudent.name} ({selectedStudent.roll})
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedStudent.batch} &bull; Linked Parent: {selectedStudent.parentPhone}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                  {selectedStudent.name.charAt(0)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Temporary Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-sm font-mono px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeneratePassword}
                    className="flex-shrink-0 text-xs"
                    title="Generate secure random password"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Auto-Generate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex-shrink-0 text-xs"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  The student/parent will be prompted to change this temporary password upon their next login.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p className="font-semibold">Security Confirmation</p>
                  <p>
                    Resetting credentials logs out all active sessions on other devices. An automated SMS notification with these temporary credentials will be dispatched to the parent&apos;s registered phone number.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 shadow-sm"
                >
                  <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                  Confirm & Reset Password
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              Please select a student from the roster list on the left to reset credentials.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default TeacherResetPasswordPage;
