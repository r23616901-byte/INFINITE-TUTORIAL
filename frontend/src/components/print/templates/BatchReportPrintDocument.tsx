import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { BatchItem } from '../../../types/attendance';
import { StudentDto } from '../../../services/studentService';

export interface BatchReportPrintDocumentProps {
  batch: BatchItem;
  students?: StudentDto[];
  className?: string;
  boardName?: string;
  isForPreview?: boolean;
}

export const BatchReportPrintDocument: React.FC<BatchReportPrintDocumentProps> = ({
  batch,
  students = [],
  className: studentClass,
  boardName,
  isForPreview = false,
}) => {
  return (
    <PrintLayout
      documentTitle="OFFICIAL BATCH ROSTER &amp; ENROLLMENT REGISTER"
      documentSubtitle="Cohort Academic Roster, Operational Schedule &amp; Enrolled Student Registry"
      reportCategory="BATCH REGISTER"
      metadata={{
        batchName: batch.name,
        className: studentClass || batch.className || 'Class 10',
        boardName: boardName || batch.boardName || 'CBSE',
        duration: batch.timing,
        academicYear: batch.academicYear || 'AY 2024–2025',
      }}
      orientation="portrait"
      isForPreview={isForPreview}
      customFooterNote="Official Batch Register issued by Infinite Tutorial Directorate of Admissions. For faculty roll call and official attendance verification."
    >
      {/* 1. Batch Specification Card */}
      <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0A3622]">{batch.name}</h3>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              {studentClass || batch.className} &bull; {boardName || batch.boardName} &bull; {batch.timing}
            </p>
          </div>
          <div className="text-right">
            <span className="px-2.5 py-0.5 rounded bg-[#0A3622] text-white text-xs font-bold font-mono">
              {batch.session} SESSION
            </span>
            <p className="text-[10px] text-slate-600 font-bold mt-1">
              Active Enrolled: {students.length || batch.studentCount || 0} Students
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Timings:</span>
            <span className="font-mono font-bold text-slate-900">{batch.timing}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Operating Days:</span>
            <span className="font-bold text-slate-900">{batch.days || 'Monday–Saturday'}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Faculty In-Charge:</span>
            <span className="font-bold text-slate-900">{batch.assignedTeacherName || 'Faculty Team'}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Cohort Status:</span>
            <span className="font-bold text-emerald-800">{batch.status}</span>
          </div>
        </div>
      </div>

      {/* 2. Enrolled Students Directory */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
            Enrolled Student Directory &amp; Roll Register
          </h4>
          <span className="text-[9.5px] font-bold text-slate-600">
            Total Students: {students.length}
          </span>
        </div>

        <table className="w-full text-left text-xs border border-slate-300">
          <thead>
            <tr>
              <th className="py-2 px-2 text-center w-10">S.No</th>
              <th className="py-2 px-3">Student Name</th>
              <th className="py-2 px-2.5 text-center">Student ID</th>
              <th className="py-2 px-3">School Name</th>
              <th className="py-2 px-3">Parent / Guardian</th>
              <th className="py-2 px-3">Contact Phone</th>
              <th className="py-2 px-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.length > 0 ? (
              students.map((student, idx) => (
                <tr key={student.id || idx} className="hover:bg-slate-50/50">
                  <td className="py-1.5 px-2 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-1.5 px-3 font-bold text-slate-900">{student.name}</td>
                  <td className="py-1.5 px-2.5 text-center font-mono text-xs font-semibold text-[#0A3622]">
                    {student.studentId}
                  </td>
                  <td className="py-1.5 px-3 text-slate-700 truncate max-w-[150px]" title={student.school}>
                    {student.school}
                  </td>
                  <td className="py-1.5 px-3 text-slate-800">{student.parentName}</td>
                  <td className="py-1.5 px-3 font-mono text-slate-700">{student.parentPhone}</td>
                  <td className="py-1.5 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 text-center text-slate-500 italic">
                  No student records currently allocated to this batch.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
            <tr>
              <td colSpan={6} className="py-2 px-3 uppercase text-right text-[#0A3622]">
                Total Registered Cohort Count:
              </td>
              <td className="py-2 px-2 text-center font-black text-[#0A3622]">
                {students.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </PrintLayout>
  );
};
