import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import {
  fetchStudentAttendanceStats,
  correctAttendanceRecord,
} from '../../services/attendanceService';
import { getBatchesApi } from '../../services/academicService';
import {
  AttendanceRecord,
  AttendanceStatus,
  BatchItem,
  StudentAttendanceStats,
} from '../../types/attendance';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Percent,
  RotateCcw,
  Edit2,
  X,
  Check,
} from 'lucide-react';

export const AttendanceHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Primary Student History view
  const [currentStudentStats, setCurrentStudentStats] = useState<StudentAttendanceStats | null>(null);

  // Correction Modal State (Admin)
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceRecord | null>(null);
  const [correctionStatus, setCorrectionStatus] = useState<AttendanceStatus>('PRESENT');
  const [correctionRemarks, setCorrectionRemarks] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctionMessage, setCorrectionMessage] = useState('');

  // Load initial data
  const loadData = async (targetStudentRoll = 'IT10025') => {
    try {
      setIsLoading(true);
      const [batchesData, studentData] = await Promise.all([
        getBatchesApi(),
        fetchStudentAttendanceStats(targetStudentRoll),
      ]);
      setBatches(batchesData);
      setCurrentStudentStats(studentData);
    } catch (err) {
      console.error('Failed to load history data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchStudent.trim()) return;
    try {
      setIsLoading(true);
      const studentData = await fetchStudentAttendanceStats(searchStudent.trim());
      setCurrentStudentStats(studentData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered attendance history records
  const filteredHistory = useMemo(() => {
    if (!currentStudentStats) return [];
    let list = currentStudentStats.history;

    if (selectedBatch) {
      list = list.filter((r) => r.batchId === selectedBatch || r.batchName === selectedBatch);
    }
    if (selectedSession) {
      list = list.filter((r) => r.session === selectedSession);
    }
    if (selectedStatus) {
      list = list.filter((r) => r.status === selectedStatus);
    }
    return list;
  }, [currentStudentStats, selectedBatch, selectedSession, selectedStatus]);

  // Open correction modal
  const openCorrectionModal = (record: AttendanceRecord) => {
    setCorrectionTarget(record);
    setCorrectionStatus(record.status === 'PRESENT' ? 'ABSENT' : 'PRESENT');
    setCorrectionRemarks('');
    setCorrectionMessage('');
  };

  // Submit correction
  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTarget) return;

    try {
      setIsCorrecting(true);
      const updated = await correctAttendanceRecord(
        correctionTarget.id,
        correctionStatus,
        correctionRemarks
      );

      setCorrectionMessage('Attendance status updated successfully!');

      // Update local state
      if (currentStudentStats) {
        setCurrentStudentStats({
          ...currentStudentStats,
          history: currentStudentStats.history.map((h) =>
            h.id === updated.id ? updated : h
          ),
          presentSessions:
            correctionStatus === 'PRESENT'
              ? currentStudentStats.presentSessions + 1
              : currentStudentStats.presentSessions - 1,
          absentSessions:
            correctionStatus === 'ABSENT'
              ? currentStudentStats.absentSessions + 1
              : currentStudentStats.absentSessions - 1,
        });
      }

      setTimeout(() => {
        setCorrectionTarget(null);
      }, 1500);
    } catch (err: any) {
      setCorrectionMessage(err.message || 'Failed to update record');
    } finally {
      setIsCorrecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <CalendarCheck className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                Attendance History & Logs
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                AUDIT LOGS & PERCENTAGE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Search by student roll/name or inspect batch-wise attendance history with percentage calculations and admin corrections.
            </p>
          </div>
        </div>

        {/* Search Student Quick Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Student (e.g. IT10025)..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="text-xs border border-[#DCE5F2] rounded-lg pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF] w-56 sm:w-64"
            />
          </div>
          <Button size="sm" variant="primary" type="submit">
            Search
          </Button>
        </form>
      </div>

      {/* Student Profile & KPI Summary */}
      {currentStudentStats && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2] flex items-center justify-center font-bold text-sm">
                  {currentStudentStats.studentName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0B1F4D]">
                    {currentStudentStats.studentName}
                  </h2>
                  <p className="text-xs text-[#5B6B82]">
                    Roll: <strong className="font-mono text-[#0B1F4D]">{currentStudentStats.studentRoll}</strong> &bull; {currentStudentStats.className} &bull; {currentStudentStats.boardName} &bull; Batch: {currentStudentStats.batchName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#5B6B82] uppercase tracking-wider block">
                  Overall Compliance
                </span>
                <span className="text-xl font-black text-emerald-600">
                  {currentStudentStats.attendancePercentage}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-xs text-emerald-700 bg-emerald-50">
                {currentStudentStats.attendancePercentage}%
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <StatCard
              title="Present Sessions"
              value={currentStudentStats.presentSessions.toString()}
              subtitle="🟢 Attended"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              iconBg="bg-emerald-50"
              badge="Present"
              badgeVariant="emerald"
            />
            <StatCard
              title="Absent Sessions"
              value={currentStudentStats.absentSessions.toString()}
              subtitle="🔴 Missed"
              icon={<XCircle className="w-5 h-5 text-red-600" />}
              iconBg="bg-red-50"
              badge="Absent"
              badgeVariant="amber"
            />
            <StatCard
              title="Total Sessions"
              value={currentStudentStats.totalSessions.toString()}
              subtitle="Mon–Sat Applicable"
              icon={<CalendarCheck className="w-5 h-5 text-[#155EEF]" />}
              iconBg="bg-[#EEF4FF]"
            />
            <StatCard
              title="Attendance Rate"
              value={`${currentStudentStats.attendancePercentage}%`}
              subtitle="Formula: Present/Total × 100"
              icon={<Percent className="w-5 h-5 text-[#00B8F8]" />}
              iconBg="bg-[#E0F8FF]"
              badge={currentStudentStats.attendancePercentage >= 85 ? 'Eligible (>85%)' : 'Low Attendance'}
              badgeVariant={currentStudentStats.attendancePercentage >= 85 ? 'emerald' : 'amber'}
            />
          </div>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </span>

        {/* Batch */}
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
        >
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Session */}
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
        >
          <option value="">All Sessions</option>
          <option value="MORNING">Morning Session</option>
          <option value="EVENING">Evening Session</option>
        </select>

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
        >
          <option value="">All Statuses</option>
          <option value="PRESENT">🟢 Present Only</option>
          <option value="ABSENT">🔴 Absent Only</option>
        </select>

        {(selectedBatch || selectedSession || selectedStatus) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedBatch('');
              setSelectedSession('');
              setSelectedStatus('');
            }}
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* History Log Table Card */}
      <Card
        title="Attendance Records Log"
        subtitle={`Showing ${filteredHistory.length} recorded session entries`}
      >
        {isLoading ? (
          <div className="space-y-3 py-4">
            <SkeletonBlock height="44px" />
            <SkeletonBlock height="44px" />
            <SkeletonBlock height="44px" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <EmptyState
            title="No attendance sessions found for the selected period"
            description="No attendance sessions or logs match your selected batch, session, or status filters."
            icon={<CalendarCheck className="w-8 h-8 text-blue-500 stroke-[1.5]" />}
            compact
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Recorded / Modified By</th>
                  <th className="py-3 px-4">Remarks</th>
                  {isAdmin && <th className="py-3 px-4 text-right">Admin Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((rec) => {
                  const isPresent = rec.status === 'PRESENT';
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        !isPresent ? 'bg-red-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {rec.dateStr}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {rec.day}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            rec.session === 'MORNING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-[#EEF4FF] text-[#0B1F4D]'
                          }`}
                        >
                          {rec.session}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {rec.batchName}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isPresent
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {isPresent ? '🟢 Present' : '🔴 Absent'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {rec.recordedByName || 'System Teacher'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                        {rec.remarks || '—'}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openCorrectionModal(rec)}
                            leftIcon={<Edit2 className="w-3.5 h-3.5 text-blue-600" />}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            Correct
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Admin Correction Modal */}
      {correctionTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Correct Attendance Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    {correctionTarget.studentName} &bull; {correctionTarget.dateStr} ({correctionTarget.session})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCorrectionTarget(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {correctionMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {correctionMessage}
              </div>
            )}

            <form onSubmit={handleCorrectionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  New Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectionStatus('PRESENT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      correctionStatus === 'PRESENT'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50'
                    }`}
                  >
                    🟢 Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setCorrectionStatus('ABSENT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      correctionStatus === 'ABSENT'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-red-50'
                    }`}
                  >
                    🔴 Absent
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Correction (Required for audit log)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Student arrived late with medical slip, mistakenly marked absent"
                  value={correctionRemarks}
                  onChange={(e) => setCorrectionRemarks(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCorrectionTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isCorrecting}
                >
                  Save Correction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
