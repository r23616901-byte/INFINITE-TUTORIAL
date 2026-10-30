import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { StudentAttendanceStats, AttendanceRecord } from '../../../types/attendance';

export interface AttendanceReportPrintDocumentProps {
  stats: StudentAttendanceStats;
  reportingPeriod?: string;
  isForPreview?: boolean;
}

export const AttendanceReportPrintDocument: React.FC<AttendanceReportPrintDocumentProps> = ({
  stats,
  reportingPeriod = 'Academic Term 2024–2025',
  isForPreview = false,
}) => {
  const attendancePct =
    stats.attendancePercentage !== undefined
      ? stats.attendancePercentage
      : (stats as any).percentage || 0;
  const totalClasses =
    stats.totalSessions !== undefined
      ? stats.totalSessions
      : (stats as any).totalClasses || stats.history.length;
  const presentCount =
    stats.presentSessions !== undefined
      ? stats.presentSessions
      : (stats as any).attended || stats.history.filter((h) => h.status === 'PRESENT').length;
  const absentCount =
    stats.absentSessions !== undefined
      ? stats.absentSessions
      : (stats as any).missed || stats.history.filter((h) => h.status === 'ABSENT').length;

  return (
    <PrintLayout
      documentTitle="OFFICIAL ATTENDANCE REGISTER &amp; TIMELINE AUDIT"
      documentSubtitle="Verified Class Attendance Sessions, Participation Ledger &amp; Leave Records"
      reportCategory="ATTENDANCE REPORT"
      metadata={{
        studentName: stats.studentName,
        studentId: stats.studentRoll,
        className: stats.className,
        batchName: stats.batchName,
        reportingPeriod,
        academicYear: 'AY 2024–2025',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Attendance Record compiled from Infinite Tutorial biometric & classroom attendance registers. Authorized for secondary academic records."
    >
      {/* 1. Attendance Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Attendance Rate</span>
          <span className="text-lg sm:text-xl font-black text-[#0A3622] mt-0.5 block">{attendancePct}%</span>
          <span className="text-[8.5px] font-semibold text-emerald-800">
            {attendancePct >= 75 ? 'Meets Board Criteria' : 'Requires Attention'}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Total Classes</span>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">{totalClasses}</span>
          <span className="text-[8.5px] text-slate-600">Conducted Sessions</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Classes Attended</span>
          <span className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5 block">{presentCount}</span>
          <span className="text-[8.5px] font-semibold text-emerald-700">Present Sessions</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Sessions Absent</span>
          <span className="text-lg sm:text-xl font-black text-rose-800 mt-0.5 block">{absentCount}</span>
          <span className="text-[8.5px] text-slate-600">Unattended / Leave</span>
        </div>
      </div>

      {/* 2. Chronological Attendance History Table */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
            Detailed Session-by-Session Attendance Ledger
          </h4>
          <span className="text-[9.5px] font-bold text-slate-600">
            Total Logged Entries: {stats.history.length}
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border border-slate-300">
          <thead>
            <tr>
              <th className="py-2 px-2 text-center w-10">S.No</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-2.5">Day</th>
              <th className="py-2 px-2.5">Session</th>
              <th className="py-2 px-3">Batch</th>
              <th className="py-2 px-3 text-center">Status</th>
              <th className="py-2 px-3">Teacher / Recorded By</th>
              <th className="py-2 px-3">Notes &amp; Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {stats.history.map((record: AttendanceRecord, idx: number) => {
              const isPresent = record.status === 'PRESENT';
              return (
                <tr key={record.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-2 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-1.5 px-3 font-mono font-bold text-slate-900">{record.dateStr}</td>
                  <td className="py-1.5 px-2.5 text-slate-700">{record.day}</td>
                  <td className="py-1.5 px-2.5">
                    <span className="font-semibold text-slate-800 text-[10px]">
                      {record.session}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-800 font-medium">{record.batchName}</td>
                  <td className="py-1.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        isPresent
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300'
                      }`}
                    >
                      {isPresent ? '🟢 PRESENT' : '🔴 ABSENT'}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 text-slate-700 text-[10.5px]">
                    {record.recordedByName || 'Prof. Rajesh Sharma'}
                  </td>
                  <td className="py-1.5 px-3 text-slate-600 italic text-[10.5px]">
                    {record.remarks || 'Regular class attendance'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
            <tr>
              <td colSpan={5} className="py-2 px-3 text-right uppercase font-black text-[#0A3622]">
                Attendance Summary Totals:
              </td>
              <td className="py-2 px-3 text-center font-black text-[#0A3622]">
                {attendancePct}%
              </td>
              <td colSpan={2} className="py-2 px-3 text-slate-700 text-[10px]">
                {presentCount} Present &bull; {absentCount} Absent / {totalClasses} Sessions
              </td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>
    </PrintLayout>
  );
};
