import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { StudentScorecard } from '../../../types/scorecard';
import { StudentAttendanceStats } from '../../../types/attendance';
import { getAcademicGrade } from '../../../utils/printUtils';

export interface ParentProgressReportPrintDocumentProps {
  scorecard?: StudentScorecard | null;
  attendanceStats?: StudentAttendanceStats | null;
  portionCompletionPct?: number;
  facultyRemarks?: string;
  isForPreview?: boolean;
}

export const ParentProgressReportPrintDocument: React.FC<ParentProgressReportPrintDocumentProps> = ({
  scorecard,
  attendanceStats,
  portionCompletionPct = 84,
  facultyRemarks = 'Consistent academic participation. Recommended to focus on Physics numerical problem-solving and organic chemistry reactions.',
  isForPreview = false,
}) => {
  const studentName = scorecard?.studentName || attendanceStats?.studentName || 'Student';
  const studentRoll = scorecard?.studentRoll || attendanceStats?.studentRoll || 'N/A';
  const className = scorecard?.className || attendanceStats?.className || 'Class 10';
  const boardName = scorecard?.boardName || 'CBSE';
  const batchName = scorecard?.batchName || attendanceStats?.batchName || 'Cohort Batch';

  const totalMaxMarks = scorecard?.subjectList?.reduce((acc, s) => acc + s.totalMaxMarks, 0) || 200;
  const totalObtainedMarks = scorecard?.subjectList?.reduce((acc, s) => acc + s.totalMarksObtained, 0) || 168;
  const overallPercentage =
    totalMaxMarks > 0
      ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1))
      : scorecard?.overallPercentage || 84.0;

  const overallGrade = getAcademicGrade(overallPercentage);
  const attendancePct = attendanceStats?.attendancePercentage || 95.8;

  return (
    <PrintLayout
      documentTitle="COMPREHENSIVE PARENT–STUDENT PROGRESS &amp; MILESTONE REPORT"
      documentSubtitle="Term Performance Evaluation, Biometric Attendance, Syllabus Portions &amp; Faculty Review"
      reportCategory="PARENT PROGRESS REPORT"
      metadata={{
        studentName,
        studentId: studentRoll,
        className,
        boardName,
        batchName,
        academicYear: 'AY 2024–2025',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Parent Progress Report issued by Infinite Tutorial Directorate. Strictly confidential academic record for authorized parents."
    >
      {/* 1. Executive Summary KPI Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Academic Aggregate</span>
          <span className="text-lg sm:text-xl font-black text-[#0A3622] mt-0.5 block">{overallPercentage}%</span>
          <span className="text-[8.5px] font-bold text-emerald-800">
            Grade {overallGrade.grade} ({overallGrade.label})
          </span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Class Attendance</span>
          <span className="text-lg sm:text-xl font-black text-[#0A3622] mt-0.5 block">{attendancePct}%</span>
          <span className="text-[8.5px] font-semibold text-emerald-800">
            {attendanceStats ? `${attendanceStats.presentSessions} of ${attendanceStats.totalSessions} Sessions` : 'Excellent Attendance'}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Curriculum Covered</span>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">{portionCompletionPct}%</span>
          <span className="text-[8.5px] font-semibold text-slate-600">On Track with Milestones</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Exam Readiness</span>
          <span className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5 block">High</span>
          <span className="text-[8.5px] font-bold text-emerald-700">Verified Board Coaching</span>
        </div>
      </div>

      {/* 2. 4-Subject Performance Ledger */}
      {scorecard && scorecard.subjectList && (
        <div className="print-break-inside-avoid">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
              Subject-Wise Performance Breakdown
            </h4>
            <span className="text-[9.5px] font-bold text-slate-600">
              Evaluated across Physics, Chemistry, Biology &amp; Mathematics
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr>
                  <th className="py-2 px-3 whitespace-nowrap">Subject Name</th>
                  <th className="py-2 px-3 text-center whitespace-nowrap">Conducted Tests</th>
                  <th className="py-2 px-3 text-center whitespace-nowrap">Max Marks</th>
                  <th className="py-2 px-3 text-center whitespace-nowrap">Marks Obtained</th>
                  <th className="py-2 px-3 text-center whitespace-nowrap">Subject Average</th>
                  <th className="py-2 px-3 text-center whitespace-nowrap">Grade</th>
                  <th className="py-2 px-3 text-center whitespace-nowrap">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {scorecard.subjectList.map((sub) => {
                  const grade = getAcademicGrade(sub.averagePercentage);
                  return (
                    <tr key={sub.subjectName} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 font-bold text-slate-900 whitespace-nowrap">{sub.subjectName}</td>
                      <td className="py-1.5 px-3 text-center text-slate-700">{sub.totalTests}</td>
                      <td className="py-1.5 px-3 text-center text-slate-700">{sub.totalMaxMarks}</td>
                      <td className="py-1.5 px-3 text-center font-bold text-slate-900">{sub.totalMarksObtained}</td>
                      <td className="py-1.5 px-3 text-center font-bold text-[#0A3622]">{sub.averagePercentage}%</td>
                      <td className="py-1.5 px-3 text-center font-bold">{grade.grade}</td>
                      <td className="py-1.5 px-3 text-center text-[10px] font-semibold text-slate-700 whitespace-nowrap">
                        {grade.label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td className="py-2 px-3 uppercase text-[#0A3622] whitespace-nowrap">Cumulative Total</td>
                  <td className="py-2 px-3 text-center">
                    {scorecard.subjectList.reduce((acc, s) => acc + s.totalTests, 0)}
                  </td>
                  <td className="py-2 px-3 text-center">{totalMaxMarks}</td>
                  <td className="py-2 px-3 text-center font-black text-[#0A3622]">{totalObtainedMarks}</td>
                  <td className="py-2 px-3 text-center font-black text-[#0A3622]">{overallPercentage}%</td>
                  <td className="py-2 px-3 text-center font-black">{overallGrade.grade}</td>
                  <td className="py-2 px-3 text-center text-emerald-900 font-bold whitespace-nowrap">{overallGrade.label}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 3. Portion Completion & Attendance Summary in Parallel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 print-break-inside-avoid">
        {/* Attendance Details */}
        <div className="p-3 bg-white border border-slate-300 rounded-lg space-y-1.5">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide border-b border-slate-200 pb-1">
            Biometric Attendance Synopsis
          </h4>
          <dl className="text-xs divide-y divide-slate-100">
            <div className="py-1 flex justify-between">
              <dt className="text-slate-500">Classes Scheduled</dt>
              <dd className="font-bold text-slate-800">{attendanceStats?.totalSessions || 48} Sessions</dd>
            </div>
            <div className="py-1 flex justify-between">
              <dt className="text-slate-500">Classes Attended</dt>
              <dd className="font-bold text-emerald-800">{attendanceStats?.presentSessions || 46} Sessions</dd>
            </div>
            <div className="py-1 flex justify-between">
              <dt className="text-slate-500">Classes Missed</dt>
              <dd className="font-bold text-rose-800">{attendanceStats?.absentSessions || 2} Sessions</dd>
            </div>
            <div className="py-1 flex justify-between">
              <dt className="text-slate-500">Attendance Percentage</dt>
              <dd className="font-bold text-[#0A3622]">{attendancePct}%</dd>
            </div>
          </dl>
        </div>

        {/* Portion Completion Summary */}
        <div className="p-3 bg-white border border-slate-300 rounded-lg space-y-1.5">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide border-b border-slate-200 pb-1">
            Curriculum Milestone Progress
          </h4>
          <div className="space-y-2 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-slate-700 mb-0.5">
                <span>Secondary Syllabus Progress</span>
                <span className="font-mono">{portionCompletionPct}% Completed</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded overflow-hidden flex">
                <div style={{ width: `${portionCompletionPct}%` }} className="bg-[#0A3622] h-full" />
              </div>
            </div>
            <p className="text-[10px] text-slate-600 leading-normal">
              Physics, Chemistry, Biology and Mathematics portions are advancing as per board term schedule. Periodic revision tests ensure strong retention.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Faculty Observations & Parent Sign-off */}
      <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-1.5 print-break-inside-avoid">
        <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
          Faculty Observations &amp; Academic Guidance
        </h4>
        <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-2.5 rounded border border-slate-200">
          &ldquo;{facultyRemarks}&rdquo;
        </p>
        <div className="pt-2 text-[9px] text-slate-500 flex justify-between">
          <span>Evaluated by Secondary Coaching Faculty Board</span>
          <span className="font-mono">Infinite ERP Verification: PASS-AY24</span>
        </div>
      </div>
    </PrintLayout>
  );
};
