import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { useLoading } from '../../context/LoadingContext';
import {
  AuditLogEntry,
  fetchAuditLogs,
  downloadAuditLogsCsv,
} from '../../services/auditService';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  Download,
  RotateCcw,
  Eye,
  X,
  User,
  Award,
  Layers,
  KeyRound,
  FileCheck,
  ArrowRight,
  Monitor,
  AlertCircle,
  FileText,
  Calendar,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { startLoading, stopLoading } = useLoading();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  // Selected Log for Diff Modal
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [modalTab, setModalTab] = useState<'visual' | 'raw'>('visual');

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      startLoading('Loading system audit logs...');
      const res = await fetchAuditLogs({
        search: search.trim() || undefined,
        entity: selectedEntity !== 'ALL' ? selectedEntity : undefined,
        action: selectedAction !== 'ALL' ? selectedAction : undefined,
        userRole: selectedRole !== 'ALL' ? selectedRole : undefined,
        limit: 100,
      });
      setLogs(res.logs);
      setTotal(res.total);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load audit trail');
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedEntity, selectedAction, selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  const handleExportCsv = async () => {
    try {
      startLoading('Exporting audit trail to CSV...');
      await downloadAuditLogsCsv({
        search: search.trim() || undefined,
        entity: selectedEntity !== 'ALL' ? selectedEntity : undefined,
        action: selectedAction !== 'ALL' ? selectedAction : undefined,
        userRole: selectedRole !== 'ALL' ? selectedRole : undefined,
      });
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      stopLoading();
    }
  };

  // Metric Computations
  const totalEvents = total;
  const marksEvents = logs.filter((l) => l.action.startsWith('MARKS_')).length;
  const profileBatchEvents = logs.filter(
    (l) => l.action.includes('PROFILE') || l.action.includes('BATCH')
  ).length;
  const securityEvents = logs.filter((l) => l.action.includes('PASSWORD')).length;
  const fileEvents = logs.filter((l) => l.action.includes('UPLOAD') || l.action.includes('FILE')).length;

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'STUDENT_PROFILE_EDIT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MARKS_ENTRY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MARKS_EDIT':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      case 'BATCH_CHANGE':
        return 'bg-[#EEF4FF] text-[#1048B5] border-[#DCE5F2]';
      case 'PASSWORD_RESET':
      case 'PASSWORD_CHANGE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ANSWER_SHEET_UPLOAD':
      case 'TEST_PAPER_UPLOAD':
      case 'FILE_UPLOAD':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'LEAVE_APPROVAL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'LEAVE_REJECT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'ATTENDANCE_CORRECTION':
        return 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-[#EEF4FF] text-[#0B1F4D] border-[#DCE5F2] font-bold';
      case 'TEACHER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PARENT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'Student':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'Mark':
        return <Award className="w-4 h-4 text-amber-600" />;
      case 'Batch':
        return <Layers className="w-4 h-4 text-[#155EEF]" />;
      case 'User':
        return <KeyRound className="w-4 h-4 text-rose-600" />;
      case 'AnswerSheet':
      case 'TestPaper':
      case 'File':
        return <FileText className="w-4 h-4 text-cyan-600" />;
      case 'LeaveRequest':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'Attendance':
        return <FileCheck className="w-4 h-4 text-[#00B8F8]" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#155EEF]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                System Audit Logs
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Tamper-proof compliance registry tracking who, did what, to which record, when, and old vs new values
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
            disabled={isLoading}
            className="flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCsv}
            className="flex items-center gap-2 shadow-sm bg-[#155EEF] hover:bg-[#1048B5]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={<ShieldCheck className="w-5 h-5 text-[#155EEF]" />}
          subtitle="Recorded in audit trail"
        />
        <StatCard
          title="Marks Revisions"
          value={marksEvents}
          icon={<Award className="w-5 h-5 text-amber-600" />}
          subtitle="Entries & recheck edits"
        />
        <StatCard
          title="Profile & Batches"
          value={profileBatchEvents}
          icon={<User className="w-5 h-5 text-blue-600" />}
          subtitle="Profile & class transfers"
        />
        <StatCard
          title="Security & Resets"
          value={securityEvents}
          icon={<KeyRound className="w-5 h-5 text-rose-600" />}
          subtitle="Password resets"
        />
        <StatCard
          title="File Operations"
          value={fileEvents}
          icon={<FileText className="w-5 h-5 text-cyan-600" />}
          subtitle="Answer sheets & test papers"
        />
      </div>

      {/* Multi-Criteria Filters Toolbar */}
      <Card className="p-4 shadow-sm border border-gray-200">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by User, Entity, Reason, IP, or Action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 font-medium">Entity:</span>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="bg-transparent text-gray-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Entities</option>
                <option value="Student">Students</option>
                <option value="Mark">Marks</option>
                <option value="Batch">Batches</option>
                <option value="User">Users / Accounts</option>
                <option value="AnswerSheet">Answer Sheets</option>
                <option value="LeaveRequest">Leave Requests</option>
                <option value="Attendance">Attendance</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-gray-500 font-medium">Action:</span>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="bg-transparent text-gray-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Actions</option>
                <option value="STUDENT_PROFILE_EDIT">Student Profile Edits</option>
                <option value="MARKS_ENTRY">Marks Entries</option>
                <option value="MARKS_EDIT">Marks Changes</option>
                <option value="BATCH_CHANGE">Batch Changes</option>
                <option value="PASSWORD_RESET">Password Resets</option>
                <option value="ANSWER_SHEET_UPLOAD">Answer Sheet Uploads</option>
                <option value="LEAVE_APPROVAL">Leave Approvals</option>
                <option value="ATTENDANCE_CORRECTION">Attendance Corrections</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-gray-500 font-medium">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent text-gray-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>

            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
          </div>
        </form>
      </Card>

      {/* Main Content State Matrix */}
      {isLoading ? (
        <Card className="p-6">
          <div className="space-y-4">
            <SkeletonBlock height="h-8" className="w-1/3" />
            <SkeletonBlock height="h-12" className="w-full" />
            <SkeletonBlock height="h-12" className="w-full" />
            <SkeletonBlock height="h-12" className="w-full" />
            <SkeletonBlock height="h-12" className="w-full" />
          </div>
        </Card>
      ) : error ? (
        <ErrorState
          title="Unable to load Audit Logs"
          message={error}
          onRetry={loadLogs}
        />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8 text-slate-400" />}
          title="No Audit Records Found"
          description="No operations match your current search and filter criteria."
          actionText="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedEntity('ALL');
            setSelectedAction('ALL');
            setSelectedRole('ALL');
          }}
        />
      ) : (
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">When / Network</th>
                  <th className="py-3.5 px-4">User (Who)</th>
                  <th className="py-3.5 px-4">Action (Did What)</th>
                  <th className="py-3.5 px-4">Entity (Target Record)</th>
                  <th className="py-3.5 px-4">Change Summary</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {logs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedTime = dateObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });
                  const formattedDate = dateObj.toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-[#EEF4FF]/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Timestamp & Network */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900 text-xs">
                          {formattedDate} {formattedTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                          <Monitor className="w-3 h-3 text-gray-400" />
                          <span className="font-mono text-gray-600">{log.ipAddress}</span>
                          <span>•</span>
                          <span className="truncate max-w-[120px] text-gray-500" title={log.device}>
                            {log.device || 'Browser'}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 flex items-center gap-1.5">
                          <span className="truncate max-w-[160px]">{log.userName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`inline-block px-1.5 py-0.2 border text-[10px] font-semibold rounded ${getRoleBadge(
                              log.userRole
                            )}`}
                          >
                            {log.userRole}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">
                            {log.userId}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-block px-2 py-0.5 border text-xs rounded-full ${getActionBadgeColor(
                              log.action
                            )}`}
                          >
                            {log.actionLabel}
                          </span>
                          {log.reason && (
                            <span className="text-xs text-gray-600 italic line-clamp-1 max-w-xs">
                              Reason: {log.reason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {getEntityIcon(log.entity)}
                          <span className="font-medium text-gray-800 text-xs">
                            {log.entity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 font-medium truncate max-w-[200px] mt-0.5">
                          {log.entityName || log.entityId}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          ID: {log.entityId}
                        </div>
                      </td>

                      {/* Change Summary Indicator */}
                      <td className="py-3.5 px-4">
                        {log.oldValue && log.newValue ? (
                          <div className="flex items-center gap-1 text-xs">
                            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[11px] truncate max-w-[90px]">
                              {typeof log.oldValue === 'object'
                                ? log.oldValue.marksObtained !== undefined
                                  ? `${log.oldValue.marksObtained} Marks`
                                  : log.oldValue.batchName || log.oldValue.status || 'Previous'
                                : String(log.oldValue)}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-semibold truncate max-w-[90px]">
                              {typeof log.newValue === 'object'
                                ? log.newValue.marksObtained !== undefined
                                  ? `${log.newValue.marksObtained} Marks`
                                  : log.newValue.batchName || log.newValue.status || 'Updated'
                                : String(log.newValue)}
                            </span>
                          </div>
                        ) : log.newValue ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                            New Record Created
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No diff recorded</span>
                        )}
                      </td>

                      {/* Inspect Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-[#155EEF] hover:text-[#1048B5] hover:bg-[#EEF4FF]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Inspect Diff
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-gray-50/80 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {logs.length} of {total} audit records</span>
            <span className="text-[11px] font-mono">Immutable cryptographic append-only log</span>
          </div>
        </Card>
      )}

      {/* Inspect Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#1048B5]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedLog.actionLabel}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-0.5">
                    <span>Audit ID: {selectedLog.id}</span>
                    <span>•</span>
                    <span>{new Date(selectedLog.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Subheader Details */}
            <div className="p-5 bg-[#EEF4FF]/40 border-b border-[#DCE5F2] text-xs grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="text-gray-500 block">Operator (Who):</span>
                <span className="font-semibold text-gray-900">{selectedLog.userName}</span>
                <span className="text-gray-400 block text-[11px]">({selectedLog.userRole} • {selectedLog.userId})</span>
              </div>
              <div>
                <span className="text-gray-500 block">Target Entity:</span>
                <span className="font-semibold text-gray-900">{selectedLog.entity}</span>
                <span className="text-gray-400 block text-[11px]">ID: {selectedLog.entityId}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Network & Device:</span>
                <span className="font-mono font-medium text-gray-900">{selectedLog.ipAddress}</span>
                <span className="text-gray-400 block text-[11px] truncate">{selectedLog.device}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Audit Reason:</span>
                <span className="font-medium text-amber-900 bg-amber-100/60 px-1.5 py-0.5 rounded text-[11px] inline-block">
                  {selectedLog.reason || 'Standard operational update'}
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center border-b border-gray-200 px-5 bg-gray-50/50">
              <button
                onClick={() => setModalTab('visual')}
                className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  modalTab === 'visual'
                    ? 'border-[#155EEF] text-[#155EEF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Side-by-Side Value Diff
              </button>
              <button
                onClick={() => setModalTab('raw')}
                className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  modalTab === 'raw'
                    ? 'border-[#155EEF] text-[#155EEF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Full JSON Audit Payload
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {modalTab === 'visual' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Old Value Card */}
                    <div className="border border-rose-200 rounded-xl overflow-hidden bg-rose-50/30">
                      <div className="bg-rose-100/70 border-b border-rose-200 px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-rose-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Old Value (Before)
                        </span>
                        <span className="font-mono text-[10px] text-rose-700">PRE-MODIFICATION</span>
                      </div>
                      <div className="p-4 text-xs font-mono space-y-1 text-rose-950">
                        {selectedLog.oldValue ? (
                          Object.entries(selectedLog.oldValue).map(([key, value]) => (
                            <div key={key} className="flex flex-col py-1 border-b border-rose-100 last:border-0">
                              <span className="text-[11px] text-rose-600 font-sans font-medium uppercase tracking-wider">
                                {key}
                              </span>
                              <span className="font-mono font-semibold break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 italic py-4 text-center">
                            (No previous state - Initial creation)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* New Value Card */}
                    <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/30">
                      <div className="bg-emerald-100/70 border-b border-emerald-200 px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          New Value (After)
                        </span>
                        <span className="font-mono text-[10px] text-emerald-700">COMMITTED STATE</span>
                      </div>
                      <div className="p-4 text-xs font-mono space-y-1 text-emerald-950">
                        {selectedLog.newValue ? (
                          Object.entries(selectedLog.newValue).map(([key, value]) => (
                            <div key={key} className="flex flex-col py-1 border-b border-emerald-100 last:border-0">
                              <span className="text-[11px] text-emerald-600 font-sans font-medium uppercase tracking-wider">
                                {key}
                              </span>
                              <span className="font-mono font-semibold break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 italic py-4 text-center">
                            (Record removed)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Context Note */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Compliance Note:</span> This modification was confirmed by{' '}
                      <strong>{selectedLog.userName}</strong> on {new Date(selectedLog.timestamp).toUTCString()}.
                      Records cannot be altered or purged without super-admin credentials.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
              <Button variant="secondary" size="sm" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
