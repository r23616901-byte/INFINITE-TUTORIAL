import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  KeyRound,
  Search,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  User,
  Users,
  Lock,
  Unlock,
  Sparkles,
  Phone,
  X,
} from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  identifier: string; // Roll or Employee ID
  role: 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN';
  phone: string;
  batchOrDepartment: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  lastLogin: string;
  passwordLastChanged: string;
}

const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr-stu-10025',
    name: 'Rahul Kumar',
    identifier: 'IT10025',
    role: 'STUDENT',
    phone: '6361085188',
    batchOrDepartment: 'Batch 10A Morning (CBSE 10th)',
    status: 'ACTIVE',
    lastLogin: '24 Sep 2026, 08:15 AM',
    passwordLastChanged: '17 Sep 2026',
  },
  {
    id: 'usr-par-10025',
    name: 'Mr. Ramesh Kumar (Parent of Rahul)',
    identifier: 'PAR-10025',
    role: 'PARENT',
    phone: '6361085188',
    batchOrDepartment: 'Linked Student: Rahul Kumar',
    status: 'ACTIVE',
    lastLogin: '24 Sep 2026, 09:30 AM',
    passwordLastChanged: '10 Aug 2026',
  },
  {
    id: 'usr-stu-10012',
    name: 'Ananya Sharma',
    identifier: 'IT10012',
    role: 'STUDENT',
    phone: '+91 9811223344',
    batchOrDepartment: 'Batch 10A Morning (CBSE 10th)',
    status: 'ACTIVE',
    lastLogin: '23 Sep 2026, 06:40 PM',
    passwordLastChanged: '05 Sep 2026',
  },
  {
    id: 'usr-stu-10034',
    name: 'Rohan Patel',
    identifier: 'IT10034',
    role: 'STUDENT',
    phone: '+91 9822334455',
    batchOrDepartment: 'Batch 10A Morning (CBSE 10th)',
    status: 'ACTIVE',
    lastLogin: '22 Sep 2026, 07:10 PM',
    passwordLastChanged: '14 Sep 2026',
  },
  {
    id: 'usr-tea-01',
    name: 'Mrs. Priya Sundaram',
    identifier: 'TCH-PHY-01',
    role: 'TEACHER',
    phone: '+91 9812345678',
    batchOrDepartment: 'Senior Faculty, Physics & Mathematics',
    status: 'ACTIVE',
    lastLogin: '24 Sep 2026, 08:00 AM',
    passwordLastChanged: '01 Sep 2026',
  },
  {
    id: 'usr-tea-02',
    name: 'Dr. Anita Joshi',
    identifier: 'TCH-CHM-02',
    role: 'TEACHER',
    phone: '+91 9812345679',
    batchOrDepartment: 'Faculty, Chemistry',
    status: 'ACTIVE',
    lastLogin: '23 Sep 2026, 04:15 PM',
    passwordLastChanged: '15 Aug 2026',
  },
  {
    id: 'usr-tea-03',
    name: 'Dr. Vikram Rao',
    identifier: 'TCH-BIO-03',
    role: 'TEACHER',
    phone: '+91 9812345680',
    batchOrDepartment: 'Faculty, Biology',
    status: 'ACTIVE',
    lastLogin: '23 Sep 2026, 03:30 PM',
    passwordLastChanged: '12 Aug 2026',
  },
  {
    id: 'usr-adm-01',
    name: 'Dr. Ramesh Sharma',
    identifier: 'ADM-001',
    role: 'ADMIN',
    phone: '+91 9876543210',
    batchOrDepartment: 'Director & Chief Administrator',
    status: 'ACTIVE',
    lastLogin: '24 Sep 2026, 10:00 PM',
    passwordLastChanged: '01 Jul 2026',
  },
];

export const AdminPasswordManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [newPassword, setNewPassword] = useState('Infinite@2026');
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.identifier.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return true;
  });

  const handleOpenReset = (u: ManagedUser) => {
    setSelectedUser(u);
    handleGenerate();
  };

  const handleGenerate = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@!';
    let pwd = 'IT@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(pwd);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, passwordLastChanged: '24 Sep 2026 (Just now)' }
          : u
      )
    );

    setNotification(
      `Password successfully reset for ${selectedUser.name} (${selectedUser.identifier}). Temporary password dispatched via SMS to ${selectedUser.phone}.`
    );
    setSelectedUser(null);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleToggleLock = (u: ManagedUser) => {
    const newStatus = u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setUsers(users.map((item) => (item.id === u.id ? { ...item, status: newStatus } : item)));
    setNotification(
      `Account for ${u.name} is now ${newStatus === 'ACTIVE' ? 'Unlocked and Active' : 'Locked'}.`
    );
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <KeyRound className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#155EEF]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Administrative Security & Credentials Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Password & Account Management
            </h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl">
              Centralized credential management across Students, Parents, Teachers, and Administrators. Reset credentials, generate temporary PINs, and terminate compromised sessions.
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total User Accounts"
          value={users.length}
          subtitle="Enrolled Across Roles"
          icon={<Users className="w-5 h-5 text-[#155EEF]" />}
        />
        <StatCard
          title="Active Accounts"
          value={users.filter((u) => u.status === 'ACTIVE').length}
          subtitle="Cleared for Portal Login"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Faculty Accounts"
          value={users.filter((u) => u.role === 'TEACHER').length}
          subtitle="Assigned Teaching Staff"
          icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Students & Parents"
          value={users.filter((u) => u.role === 'STUDENT' || u.role === 'PARENT').length}
          subtitle="Class 10 & 9 Cohorts"
          icon={<User className="w-5 h-5 text-[#00B8F8]" />}
        />
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user by name, roll, or phone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="PARENT">Parents</option>
              <option value="TEACHER">Teachers</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((u) => (
          <Card
            key={u.id}
            className="p-5 border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 ${
                  u.role === 'ADMIN'
                    ? 'bg-[#0B1F4D] text-white'
                    : u.role === 'TEACHER'
                    ? 'bg-blue-100 text-[#155EEF]'
                    : u.role === 'PARENT'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#EEF4FF] text-[#155EEF]'
                }`}
              >
                {u.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      u.role === 'ADMIN'
                        ? 'bg-[#EEF4FF] text-[#0B1F4D] border border-[#DCE5F2]'
                        : u.role === 'TEACHER'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : u.role === 'PARENT'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]'
                    }`}
                  >
                    {u.role}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                    {u.identifier}
                  </span>
                  <span className="text-xs text-gray-400">&bull;</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {u.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {u.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900">{u.name}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {u.phone}
                  </span>
                  <span>&bull;</span>
                  <span>{u.batchOrDepartment}</span>
                  <span>&bull;</span>
                  <span>Last Login: {u.lastLogin}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => handleToggleLock(u)}
                className={`p-2 rounded-lg border text-xs font-semibold transition-all ${
                  u.status === 'ACTIVE'
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-100'
                    : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
                title={u.status === 'ACTIVE' ? 'Lock Account' : 'Unlock Account'}
              >
                {u.status === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenReset(u)}
                className="text-xs font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5 mr-1 text-[#155EEF]" />
                Reset Password
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Reset Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Reset User Credentials</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-semibold">Target Account</span>
                <h4 className="text-base font-bold text-gray-900 mt-0.5">
                  {selectedUser.name} ({selectedUser.identifier})
                </h4>
                <p className="text-xs text-gray-500">{selectedUser.phone} &bull; {selectedUser.role}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Temporary Password
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-sm font-mono px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#155EEF] focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerate}
                    className="flex-shrink-0 text-xs"
                    title="Generate new password"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Generate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex-shrink-0 text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  User will be prompted to choose a new password upon logging in.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  Confirming this reset will immediately terminate all active user sessions and dispatch an automated SMS with the temporary PIN to {selectedUser.phone}.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#155EEF] hover:bg-[#1048B5] text-white">
                  <KeyRound className="w-3.5 h-3.5 mr-1" />
                  Confirm & Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPasswordManagementPage;
