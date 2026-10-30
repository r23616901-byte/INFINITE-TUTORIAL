import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { TeacherDto } from '../../../services/teacherService';
import { formatAcademicDate } from '../../../utils/printUtils';

export interface TeacherReportPrintDocumentProps {
  teacher: TeacherDto;
  timetableEntries?: Array<{
    day: string;
    timing: string;
    batchName: string;
    subject: string;
    room?: string;
  }>;
  isForPreview?: boolean;
}

export const TeacherReportPrintDocument: React.FC<TeacherReportPrintDocumentProps> = ({
  teacher,
  timetableEntries = [],
  isForPreview = false,
}) => {
  return (
    <PrintLayout
      documentTitle="FACULTY PROFILE &amp; ACADEMIC ALLOCATION DOSSIER"
      documentSubtitle="Faculty Credentials, Assigned Subject Departments &amp; Batch Timetable Schedule"
      reportCategory="FACULTY DOSSIER"
      metadata={{
        facultyName: teacher.name,
        subjectName: teacher.subjects.join(', '),
        batchName: teacher.batches.join(', '),
        academicYear: 'AY 2024–2025',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Faculty Record issued by Infinite Tutorial Academic Directorate. Authorized for faculty records and curriculum allocation audits."
    >
      {/* 1. Faculty Information Header Card */}
      <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-[#0A3622]">{teacher.name}</h3>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Faculty In-Charge &bull; Secondary Coaching Division
            </p>
          </div>
          <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
            <span className="px-2.5 py-0.5 rounded bg-[#0A3622] text-white font-mono font-bold text-xs">
              ID: {teacher.id.slice(-6).toUpperCase()}
            </span>
            <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              Status: {teacher.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Phone / Helpline:</span>
            <span className="font-mono font-bold text-slate-900">{teacher.phone}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Official Email:</span>
            <span className="font-bold text-slate-900">{teacher.email || 'faculty@infinitetutorial.com'}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Joining Date:</span>
            <span className="font-bold text-slate-900">{formatAcademicDate(teacher.joiningDate)}</span>
          </div>
        </div>
      </div>

      {/* 2. Department Allocations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-white border border-slate-300 rounded-lg">
          <span className="text-[10px] font-black uppercase text-[#0A3622] tracking-wider block mb-2">
            Assigned Subjects
          </span>
          <div className="flex flex-wrap gap-1.5">
            {teacher.subjects.map((sub) => (
              <span
                key={sub}
                className="px-2.5 py-1 rounded bg-[#F0FDF4] text-[#0A3622] border border-[#86EFAC] text-xs font-bold"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-300 rounded-lg">
          <span className="text-[10px] font-black uppercase text-[#0A3622] tracking-wider block mb-2">
            Assigned Cohort Batches
          </span>
          <div className="flex flex-wrap gap-1.5">
            {teacher.batches.map((batch) => (
              <span
                key={batch}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold"
              >
                {batch}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Weekly Timetable Matrix */}
      {timetableEntries.length > 0 ? (
        <div className="print-break-inside-avoid">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide mb-1.5">
            Weekly Instructional Schedule &amp; Timetable
          </h4>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border border-slate-300 min-w-[500px]">
              <thead>
                <tr>
                  <th className="py-2 px-3">Day of Week</th>
                  <th className="py-2 px-3">Class Timing</th>
                  <th className="py-2 px-3">Batch</th>
                  <th className="py-2 px-3">Subject</th>
                  <th className="py-2 px-3">Classroom / Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {timetableEntries.map((slot, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-bold text-slate-900">{slot.day}</td>
                    <td className="py-2 px-3 font-mono text-slate-800">{slot.timing}</td>
                    <td className="py-2 px-3 text-slate-900">{slot.batchName}</td>
                    <td className="py-2 px-3 font-bold text-[#0A3622]">{slot.subject}</td>
                    <td className="py-2 px-3 text-slate-600">{slot.room || 'Room 101'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <span className="font-bold text-slate-800 block">Class Schedule:</span>
          Teaching assignments are active across {teacher.batches.length} batches and {teacher.subjects.length} subjects for Academic Session 2024–2025.
        </div>
      )}
    </PrintLayout>
  );
};
