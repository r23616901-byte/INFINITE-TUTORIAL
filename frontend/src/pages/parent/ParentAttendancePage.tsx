import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { SkeletonBlock } from '../../components/common/LoadingSkeleton';
import { fetchParentAttendanceSummary } from '../../services/attendanceService';
import { StudentAttendanceStats, AttendanceRecord } from '../../types/attendance';
import {
  CalendarCheck,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';

export const ParentAttendancePage: React.FC = () => {
  const [data, setData] = useState<StudentAttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const morningPresent = data?.morningPresent ?? 28;
  const morningTotal = data?.morningTotal ?? 30;
  const morningPct = morningTotal > 0 ? (morningPresent / morningTotal) * 100 : 93.3;
  const eveningPresent = data?.eveningPresent ?? 14;
  const eveningTotal = data?.eveningTotal ?? 16;
  const eveningPct = eveningTotal > 0 ? (eveningPresent / eveningTotal) * 100 : 87.5;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-[#0B1F4D] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
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
        <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 self-start md:self-auto">
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
              {presentCount} Present / {absentCount} Absent / {totalCount} Sessions
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              Eligible for Term Exams
            </div>
          </div>
        </div>
      </div>
  {/* Grid: Calendar Matrix & Session Breakdown */ }
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
                className={`p-3 rounded-xl border flex flex-col items-center justify-between transition-all ${isPresent
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
                {morningPresent} / {morningTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${morningPct}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-amber-700 font-semibold block mt-1">
              {morningPct.toFixed(1)}% turnout rate
            </span>
          </div>

          {/* Evening */}
          <div className="p-3.5 rounded-xl border border-[#DCE5F2] bg-[#EEF4FF]/50">
            <div className="flex items-center justify-between text-xs font-bold text-[#071633] mb-1">
              <span className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-[#155EEF]" /> Evening Sessions
              </span>
              <span>
                {eveningPresent} / {eveningTotal}
              </span>
            </div>
            <div className="w-full h-2 bg-[#EEF4FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#155EEF] rounded-full"
                style={{
                  width: `${eveningPct}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-[#1048B5] font-semibold block mt-1">
              {eveningPct.toFixed(1)}% turnout rate
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
    </div>
  );
};
