import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import {
  fetchBatchAttendance,
  saveBatchAttendance,
  fetchStudentAttendanceStats,
} from '../../services/attendanceService';
import {
  getClassesApi,
  getBoardsApi,
  getBatchesApi,
} from '../../services/academicService';
import {
  AttendanceSession,
  AttendanceStatus,
  BatchAttendanceStudentItem,
  ClassItem,
  BoardItem,
  BatchItem,
  StudentAttendanceStats,
} from '../../types/attendance';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Sun,
  Moon,
  Save,
  CheckCheck,
  RotateCcw,
  AlertCircle,
  History,
  X,
  UserCheck,
  Percent,
} from 'lucide-react';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TakeAttendancePage: React.FC = () => {
  // Primary Filter Controls
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Current date in YYYY-MM-DD
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSession, setSelectedSession] = useState<AttendanceSession>('MORNING');
  const [selectedClass, setSelectedClass] = useState<string>('cls-10');
  const [selectedBoard, setSelectedBoard] = useState<string>('brd-cbse');
  const [selectedBatch, setSelectedBatch] = useState<string>('batch-10a-morning');

  // Academic Dropdown Lookups
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);

  // Attendance Students State
  const [students, setStudents] = useState<BatchAttendanceStudentItem[]>([]);
  const [isMarked, setIsMarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Quick Student History Modal
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<StudentAttendanceStats | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Calculate day of week from selectedDate
  const currentDayName = useMemo(() => {
    if (!selectedDate) return '';
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return DAYS_OF_WEEK[dateObj.getDay()];
  }, [selectedDate]);

  const isSunday = currentDayName === 'Sunday';

  // Load classes, boards, batches on mount
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [clsList, brdList, btcList] = await Promise.all([
          getClassesApi(),
          getBoardsApi(),
          getBatchesApi(),
        ]);
        setClasses(clsList);
        setBoards(brdList);
        setBatches(btcList);

        if (clsList.length > 0 && !selectedClass) setSelectedClass(clsList[0].id);
        if (brdList.length > 0 && !selectedBoard) setSelectedBoard(brdList[0].id);
        if (btcList.length > 0 && !selectedBatch) setSelectedBatch(btcList[0].id);
      } catch (err) {
        console.error('Failed to load academic lookups', err);
      }
    };
    loadLookups();
  }, []);

  // Filter batches matching selected class, board, and session
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchClass = !selectedClass || b.classId === selectedClass;
      const matchBoard = !selectedBoard || b.boardId === selectedBoard;
      return matchClass && matchBoard;
    });
  }, [batches, selectedClass, selectedBoard]);

  // Keep selectedBatch aligned when filter changes
  useEffect(() => {
    if (filteredBatches.length > 0) {
      const exists = filteredBatches.some((b) => b.id === selectedBatch);
      if (!exists) {
        setSelectedBatch(filteredBatches[0].id);
      }
    }
  }, [filteredBatches, selectedBatch]);

  // Load students and marked attendance when batch, date, or session changes
  const loadBatchStudents = async () => {
    if (!selectedBatch || !selectedDate || isSunday) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setSaveSuccess('');
      const data = await fetchBatchAttendance(selectedBatch, selectedDate, selectedSession);
      setStudents(data.students);
      setIsMarked(data.isMarked);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load attendance');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBatchStudents();
  }, [selectedBatch, selectedDate, selectedSession, isSunday]);

  // Bulk actions
  const markAll = (status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        status,
      }))
    );
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, status: s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
          : s
      )
    );
  };

  const updateStudentRemarks = (studentId: string, remarks: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, remarks } : s
      )
    );
  };

  // Submit attendance
  const handleSaveAttendance = async () => {
    if (isSunday) {
      setErrorMessage('Attendance cannot be taken on Sunday. Infinite Tutorial operates Monday to Saturday.');
      return;
    }
    if (!selectedBatch || students.length === 0) {
      setErrorMessage('No students loaded to mark attendance.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSaveSuccess('');

      const payload = {
        date: selectedDate,
        session: selectedSession,
        batchId: selectedBatch,
        records: students.map((s) => ({
          studentId: s.studentId,
          status: s.status,
          remarks: s.remarks || undefined,
        })),
      };

      const res = await saveBatchAttendance(payload);
      setSaveSuccess(res.message || 'Attendance saved successfully! Duplicates prevented.');
      setIsMarked(true);

      // Auto clear banner after 4 seconds
      setTimeout(() => {
        setSaveSuccess('');
      }, 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  // View individual student history
  const handleViewHistory = async (studentId: string) => {
    try {
      setIsLoadingHistory(true);
      setIsHistoryModalOpen(true);
      const data = await fetchStudentAttendanceStats(studentId);
      setSelectedStudentHistory(data);
    } catch (err: any) {
      console.error('Failed to load student history', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Derived counts
  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const absentCount = students.filter((s) => s.status === 'ABSENT').length;
  const attendanceRate = students.length > 0 ? ((presentCount / students.length) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#DCE5F2] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                Batch Attendance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                DAILY ATTENDANCE MODULE
              </span>
            </div>
            <p className="text-xs text-[#5B6B82] mt-1">
              Select date, session, and batch to mark Present (🟢 Green) or Absent (🔴 Red). Duplicate entries are automatically prevented.
            </p>
          </div>
        </div>

        {/* Save Attendance Main CTA */}
        <div className="flex items-center gap-2">
          <Button
            size="md"
            variant="primary"
            onClick={handleSaveAttendance}
            isLoading={isSaving}
            disabled={isSunday || students.length === 0}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-bold px-5"
          >
            {isMarked ? 'Update Attendance' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      {isSunday && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Sunday Selected:</strong> Infinite Tutorial classes run from <strong>Monday to Saturday</strong> only. Please select an operational day.
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between gap-3 text-emerald-900 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
          <button onClick={() => setSaveSuccess('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-center justify-between gap-3 text-red-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-700 hover:text-red-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Panel: 5 Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Filter & Selection Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              1. Date (Mon–Sat)
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full text-xs font-medium border rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  isSunday ? 'border-red-400 bg-red-50' : 'border-slate-300'
                }`}
              />
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                Day: <span className={isSunday ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>{currentDayName}</span>
              </span>
            </div>
          </div>

          {/* 2. Session Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              2. Session
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedSession('MORNING')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSession === 'MORNING'
                    ? 'bg-[#F7931E] text-white shadow-xs'
                    : 'text-[#5B6B82] hover:text-[#0B1F4D]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Morning
              </button>
              <button
                type="button"
                onClick={() => setSelectedSession('EVENING')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedSession === 'EVENING'
                    ? 'bg-[#0B1F4D] text-white shadow-xs'
                    : 'text-[#5B6B82] hover:text-[#0B1F4D]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Evening
              </button>
            </div>
          </div>

          {/* 3. Class Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              3. Class / Grade
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Board Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              4. Academic Board
            </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              {boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Batch Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              5. Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              {filteredBatches.length > 0 ? (
                filteredBatches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.timing})
                  </option>
                ))
              ) : (
                <option value="">No batches match filters</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={students.length.toString()}
          subtitle="Enrolled in batch"
          icon={<UserCheck className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          isLoading={isLoading}
        />
        <StatCard
          title="Present (Green)"
          value={presentCount.toString()}
          subtitle="Attending session"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badgeVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Absent (Red)"
          value={absentCount.toString()}
          subtitle="Not present"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          badgeVariant="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Session Turnout"
          value={`${attendanceRate}%`}
          subtitle={isMarked ? '✓ Already Recorded' : '⏳ Pending Save'}
          icon={<Percent className="w-5 h-5 text-[#00B8F8]" />}
          iconBg="bg-[#E0F8FF]"
          badge={isMarked ? 'Saved' : 'Draft'}
          badgeVariant={isMarked ? 'emerald' : 'slate'}
          isLoading={isLoading}
        />
      </div>

      {/* Main Student Attendance List Card */}
      <Card
        title="Students in Batch"
        subtitle={`Mark attendance for ${currentDayName} (${selectedSession}) session`}
        headerAction={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAll('PRESENT')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              className="text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              Mark All Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAll('ABSENT')}
              leftIcon={<XCircle className="w-3.5 h-3.5 text-red-600" />}
              className="text-red-700 hover:bg-red-50 border-red-200"
            >
              Mark All Absent
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={loadBatchStudents}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            >
              Reset
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <div className="space-y-3 py-4">
            <SkeletonBlock height="48px" />
            <SkeletonBlock height="48px" />
            <SkeletonBlock height="48px" />
            <SkeletonBlock height="48px" />
          </div>
        ) : isSunday ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Sunday is a non-working day. Please choose Monday through Saturday to take attendance.
          </div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No students found enrolled in this batch. Please select another batch or add students in the Directory.
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll / ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4 text-center">Current Status</th>
                    <th className="py-3 px-4 text-center">Action (🟢 Green / 🔴 Red)</th>
                    <th className="py-3 px-4">Remarks / Reason</th>
                    <th className="py-3 px-4 text-right">History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((st) => {
                    const isPresent = st.status === 'PRESENT';
                    return (
                      <tr
                        key={st.studentId}
                        className={`transition-colors ${
                          isPresent ? 'hover:bg-emerald-50/40' : 'bg-red-50/30 hover:bg-red-50/60'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {st.studentId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {st.name}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                              isPresent
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isPresent ? 'bg-emerald-600' : 'bg-red-600'
                              }`}
                            />
                            {isPresent ? '🟢 Present' : '🔴 Absent'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                if (!isPresent) toggleStudentStatus(st.studentId);
                              }}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                                isPresent
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-emerald-700'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isPresent) toggleStudentStatus(st.studentId);
                              }}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                                !isPresent
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-red-700'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            placeholder={isPresent ? 'Optional note...' : 'e.g. Sick, unwell, uninformed'}
                            value={st.remarks || ''}
                            onChange={(e) => updateStudentRemarks(st.studentId, e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded px-2.5 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewHistory(st.studentId)}
                            leftIcon={<History className="w-3.5 h-3.5" />}
                          >
                            Log
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile-Friendly Card View */}
            <div className="md:hidden space-y-3">
              {students.map((st) => {
                const isPresent = st.status === 'PRESENT';
                return (
                  <div
                    key={st.studentId}
                    className={`p-4 rounded-xl border transition-all ${
                      isPresent
                        ? 'border-emerald-200 bg-white'
                        : 'border-red-200 bg-red-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500">
                          {st.studentId}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isPresent
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {isPresent ? '🟢 Present' : '🔴 Absent'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPresent) toggleStudentStatus(st.studentId);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isPresent
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isPresent) toggleStudentStatus(st.studentId);
                        }}
                        className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          !isPresent
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-red-50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Absent
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Remarks / Note..."
                        value={st.remarks || ''}
                        onChange={(e) => updateStudentRemarks(st.studentId, e.target.value)}
                        className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewHistory(st.studentId)}
                        leftIcon={<History className="w-3 h-3" />}
                      >
                        History
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Floating or Bottom Save Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-600">
          Ready to commit attendance for <strong>{students.length} students</strong> ({currentDayName}, {selectedSession}).
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="md"
            variant="primary"
            onClick={handleSaveAttendance}
            isLoading={isSaving}
            disabled={isSunday || students.length === 0}
            leftIcon={<Save className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full sm:w-auto"
          >
            {isMarked ? 'Update Attendance' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Student Attendance History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2] flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedStudentHistory?.studentName || 'Student'} — Attendance History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll: <strong>{selectedStudentHistory?.studentRoll}</strong> &bull; {selectedStudentHistory?.className} &bull; {selectedStudentHistory?.boardName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {isLoadingHistory ? (
                <div className="space-y-3 py-6">
                  <SkeletonBlock height="40px" />
                  <SkeletonBlock height="40px" />
                  <SkeletonBlock height="40px" />
                </div>
              ) : selectedStudentHistory ? (
                <>
                  {/* Calculation KPI Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 uppercase">Present</span>
                      <span className="text-lg font-black text-emerald-600">
                        {selectedStudentHistory.presentSessions}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 uppercase">Absent</span>
                      <span className="text-lg font-black text-red-600">
                        {selectedStudentHistory.absentSessions}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 uppercase">Percentage</span>
                      <span className="text-lg font-black text-blue-700">
                        {selectedStudentHistory.attendancePercentage}%
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center font-mono">
                    Attendance Percentage = Present Sessions ({selectedStudentHistory.presentSessions}) / Total Applicable ({selectedStudentHistory.totalSessions}) &times; 100
                  </p>

                  {/* History Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Day</th>
                          <th className="py-2.5 px-3">Session</th>
                          <th className="py-2.5 px-3">Batch</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 max-h-60">
                        {selectedStudentHistory.history.slice(0, 15).map((h) => (
                          <tr key={h.id}>
                            <td className="py-2 px-3 font-medium text-slate-800">{h.dateStr}</td>
                            <td className="py-2 px-3">{h.day}</td>
                            <td className="py-2 px-3">{h.session}</td>
                            <td className="py-2 px-3">{h.batchName}</td>
                            <td className="py-2 px-3 text-center">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  h.status === 'PRESENT'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {h.status === 'PRESENT' ? '🟢 Present' : '🔴 Absent'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setIsHistoryModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
