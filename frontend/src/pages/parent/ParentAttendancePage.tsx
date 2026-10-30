import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { fetchParentAttendanceSummary } from '../../services/attendanceService';
import { StudentAttendanceStats, AttendanceRecord } from '../../types/attendance';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sun,
  Moon,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { PrintButton, PrintPreviewModal, AttendanceReportPrintDocument } from '../../components/print';

export const ParentAttendancePage: React.FC = () => {
  const [data, setData] = useState<StudentAttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Filters for History table
  const [sessionFilter, setSessionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Calendar month state
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState('2026-09');

  useEffect(() => {
    const loadParentData = async () => {
      try {
        setIsLoading(true);
        const stats = await fetchParentAttendanceSummary();
        setData(stats);
      } catch (err) {
        console.error('Failed to load parent attendance summary', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadParentData();
  }, []);

  // Filter history records
  const filteredRecords = useMemo(() => {
    if (!data) return [];
    let list = data.history;

    if (sessionFilter !== 'ALL') {
      list = list.filter((r) => r.session === sessionFilter);
    }
    if (statusFilter !== 'ALL') {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          r.dateStr.includes(q) ||
          r.day.toLowerCase().includes(q) ||
          r.session.toLowerCase().includes(q) ||
          (r.remarks && r.remarks.toLowerCase().includes(q))
      );
    }
    return list;
  }, [data, sessionFilter, statusFilter, searchTerm]);

  // Calendar generator for operational days (Monday to Saturday)
  const calendarDays = useMemo(() => {
    if (!data) return [];
    const [year, month] = selectedCalendarMonth.split('-').map(Number);
    const dateMap = new Map<string, AttendanceRecord>();
    data.history.forEach((rec) => {
      dateMap.set(rec.dateStr, rec);
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dObj = new Date(year, month - 1, day);
      const dayOfWeek = dObj.getDay(); // 0 is Sunday

      // Only Monday - Saturday
      if (dayOfWeek !== 0) {
        const record = dateMap.get(dayStr);
        days.push({
          dateStr: dayStr,
          dayNumber: day,
          dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
          record,
          status: record ? record.status : ('NO_CLASS' as const),
        });
      }
    }
    return days;
  }, [data, selectedCalendarMonth]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock height="120px" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <SkeletonBlock height="100px" />
          <SkeletonBlock height="100px" />
          <SkeletonBlock height="100px" />
          <SkeletonBlock height="100px" />
        </div>
        <SkeletonBlock height="300px" />
      </div>
    );
  }

  const presentCount = data?.presentSessions ?? 42;
  const absentCount = data?.absentSessions ?? 4;
  const percentage = data?.attendancePercentage ?? 91.3;
  const totalCount = data?.totalSessions ?? 46;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-[#0B1F4D] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <CalendarCheck className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                {data?.studentName || 'Rahul Kumar'} — Attendance Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High Compliance (&gt;85%)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Roll No: <strong>{data?.studentRoll || 'IT10025'}</strong> &bull; Class: <strong>{data?.className || 'Class 10'}</strong> &bull; Board: <strong>{data?.boardName || 'CBSE'}</strong> &bull; Batch: <strong>{data?.batchName || '10th A Morning'}</strong>
            </p>
          </div>
        </div>

        {/* Visual Circular Progress Indicator */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 w-full md:w-auto">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-900">
              {percentage}%
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900">Overall Attendance</div>
            <div className="text-[11px] text-slate-500">
              {presentCount} Present / {totalCount} Sessions
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Eligible for Term Exams
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Present Sessions"
          value={presentCount.toString()}
          subtitle="🟢 Attended classes"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="42 Present"
          badgeVariant="emerald"
        />

        <StatCard
          title="Absent Sessions"
          value={absentCount.toString()}
          subtitle="🔴 Excused / Missed"
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          badge="4 Absent"
          badgeVariant="amber"
        />

        <StatCard
          title="Attendance Rate"
          value={`${percentage}%`}
          subtitle="Requirement: >85%"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          badge="91.3%"
          badgeVariant="emerald"
        />

        <StatCard
          title="Total Scheduled"
          value={totalCount.toString()}
          subtitle="Mon–Sat Schedule"
          icon={<CalendarCheck className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          badge="Term 1"
          badgeVariant="blue"
        />
      </div>

      {/* Grid: Calendar Matrix & Session Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Present/Absent Calendar View (2 Cols) */}
        <div className="lg:col-span-2">
          <Card
            title="Present / Absent Calendar"
            subtitle="Monday through Saturday schedule with daily attendance status"
            headerAction={
              <div className="flex items-center gap-2">
                <select
                  value={selectedCalendarMonth}
                  onChange={(e) => setSelectedCalendarMonth(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-1 bg-slate-50 focus:bg-white"
                >
                  <option value="2026-09">September 2026</option>
                  <option value="2026-08">August 2026</option>
                  <option value="2026-07">July 2026</option>
                </select>
              </div>
            }
          >
            {/* Days grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
              {calendarDays.map((cd) => {
                const isPresent = cd.status === 'PRESENT';
                const isAbsent = cd.status === 'ABSENT';

                return (
                  <div
                    key={cd.dateStr}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-between transition-all ${
                      isPresent
                        ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                        : isAbsent
                        ? 'border-red-200 bg-red-50/60 text-red-900'
                        : 'border-slate-200 bg-slate-50/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full text-[10px] font-bold">
                      <span>{cd.dayName}</span>
                      <span className="opacity-75">{cd.dayNumber}</span>
                    </div>

                    <div className="my-2">
                      {isPresent && (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          P
                        </div>
                      )}
                      {isAbsent && (
                        <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          A
                        </div>
                      )}
                      {!isPresent && !isAbsent && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs">
                          —
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-extrabold uppercase">
                      {isPresent ? 'Present' : isAbsent ? 'Absent' : 'Off'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 mt-2 border-t border-slate-100 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> 🟢 Present (Session Attended)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-red-500" /> 🔴 Absent (Missed Session)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-slate-300" /> Class Off / Holiday
              </span>
            </div>
          </Card>
        </div>

        {/* Sessions & Monthly Breakdown (1 Col) */}
        <div className="space-y-6">
          {/* Morning vs Evening Session breakdown */}
          <Card
            title="Session Comparison"
            subtitle="Turnout by Morning vs Evening batch"
          >
            <div className="space-y-4 pt-1">
              {/* Morning */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-600" /> Morning Sessions
                  </span>
                  <span>
                    {data?.morningPresent ?? 28} / {data?.morningTotal ?? 30}
                  </span>
                </div>
                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${
                        data?.morningTotal
                          ? (data.morningPresent / data.morningTotal) * 100
                          : 93.3
                      }%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                  {data?.morningTotal
                    ? ((data.morningPresent / data.morningTotal) * 100).toFixed(1)
                    : '93.3'}
                  % turnout rate
                </span>
              </div>

              {/* Evening */}
              <div className="p-3.5 rounded-xl border border-[#DCE5F2] bg-[#EEF4FF]/50">
                <div className="flex items-center justify-between text-xs font-bold text-[#071633] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-[#155EEF]" /> Evening Sessions
                  </span>
                  <span>
                    {data?.eveningPresent ?? 14} / {data?.eveningTotal ?? 16}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#EEF4FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#155EEF] rounded-full"
                    style={{
                      width: `${
                        data?.eveningTotal
                          ? (data.eveningPresent / data.eveningTotal) * 100
                          : 87.5
                      }%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#1048B5] font-semibold block mt-1">
                  {data?.eveningTotal
                    ? ((data.eveningPresent / data.eveningTotal) * 100).toFixed(1)
                    : '87.5'}
                  % turnout rate
                </span>
              </div>
            </div>
          </Card>

          {/* Monthly Breakdown */}
          <Card
            title="Monthly Trend"
            subtitle="Performance across academic terms"
          >
            <div className="space-y-3 pt-1">
              {data?.monthlyBreakdown?.map((m) => (
                <div
                  key={m.month}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                >
                  <span className="font-bold text-slate-800">{m.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">
                      {m.present}P / {m.absent}A
                    </span>
                    <span className="font-bold text-emerald-600">{m.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Complete Historical Attendance Log Table */}
      <Card
        title="Student Attendance History Log"
        subtitle="Complete chronological timeline of attended and missed class sessions"
        headerAction={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search date, remark..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#155EEF]"
              />
            </div>

            {/* Dropdowns & Print in a responsive flex row */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="flex-1 sm:flex-none text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
                aria-label="Filter by session"
              >
                <option value="ALL">All Sessions</option>
                <option value="MORNING">Morning</option>
                <option value="EVENING">Evening</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                <option value="PRESENT">🟢 Present</option>
                <option value="ABSENT">🔴 Absent</option>
              </select>

              <PrintButton
                onClick={() => setIsPrintModalOpen(true)}
                variant="academic"
                size="sm"
                label="Print Register"
                className="flex-shrink-0"
              />
            </div>
          </div>
        }
      >
        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No attendance sessions found for the selected period"
            description="No class sessions match your selected session or status criteria."
            icon={<CalendarCheck className="w-8 h-8 text-blue-500 stroke-[1.5]" />}
            compact
          />
        ) : (
          <div className="space-y-4">
            {/* Record count summary bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
              <span className="font-semibold text-slate-700">
                Total Sessions: <span className="text-[#0B1F4D] font-bold">{filteredRecords.length}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {filteredRecords.filter((r) => r.status === 'PRESENT').length} Present &bull;{' '}
                {filteredRecords.filter((r) => r.status === 'ABSENT').length} Absent
              </span>
            </div>

            {/* ========================================================= */}
            {/* 1. MOBILE RESPONSIVE CARD LIST (Visible on phones <md) */}
            {/* Allows effortless vertical sliding down with 100% clarity */}
            {/* ========================================================= */}
            <div className="md:hidden space-y-3">
              {filteredRecords.map((r) => {
                const isPresent = r.status === 'PRESENT';
                return (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-3.5 transition-all ${
                      isPresent
                        ? 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-300'
                        : 'bg-red-50/30 border-red-200 shadow-2xs'
                    }`}
                  >
                    {/* Top Row: Date, Day, Status Pill */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-2xs ${
                            isPresent
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {isPresent ? 'P' : 'A'}
                        </div>
                        <div>
                          <div className="font-mono font-bold text-xs text-slate-900">
                            {r.dateStr}
                          </div>
                          <div className="text-[11px] font-medium text-slate-500">
                            {r.day}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                          isPresent
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {isPresent ? '🟢 Present' : '🔴 Absent'}
                      </span>
                    </div>

                    {/* Middle Row: Session badge & Batch */}
                    <div className="grid grid-cols-2 gap-2 py-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Session</span>
                        <div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                              r.session === 'MORNING'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-[#EEF4FF] text-[#1048B5] border border-[#C7D9F8]'
                            }`}
                          >
                            {r.session}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Batch</span>
                        <p className="font-semibold text-slate-800 text-xs truncate">
                          {r.batchName}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Teacher & Remarks */}
                    <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-[11px] text-slate-400">Teacher:</span>
                        <span className="font-medium text-slate-800 text-[11px]">
                          {r.recordedByName || 'Prof. Rajesh Sharma'}
                        </span>
                      </div>
                      {r.remarks && (
                        <div className="flex items-start justify-between text-[11px] pt-0.5">
                          <span className="text-slate-400">Notes:</span>
                          <span className="italic text-slate-600 text-right max-w-[75%]">
                            {r.remarks}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* 2. DESKTOP TABULAR VIEW (Visible on tablets & desktop >=md) */}
            {/* ========================================================= */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Session</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Teacher / Recorded By</th>
                    <th className="py-3 px-4">Notes / Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRecords.map((r) => {
                    const isPresent = r.status === 'PRESENT';
                    return (
                      <tr
                        key={r.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          !isPresent ? 'bg-red-50/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {r.dateStr}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">{r.day}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                              r.session === 'MORNING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-[#EEF4FF] text-[#1048B5]'
                            }`}
                          >
                            {r.session}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">{r.batchName}</td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
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
                        <td className="py-3 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                          {r.recordedByName || 'Prof. Rajesh Sharma'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                          {r.remarks || 'Regular class attendance'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Universal Print Preview Modal */}
      {data && (
        <PrintPreviewModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          documentTitle={`Student_Attendance_Register_${data.studentRoll}`}
        >
          <AttendanceReportPrintDocument
            stats={data}
            reportingPeriod="Current Academic Term 2024–2025"
            isForPreview={true}
          />
        </PrintPreviewModal>
      )}
    </div>
  );
};
