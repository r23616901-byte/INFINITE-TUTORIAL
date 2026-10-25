import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { StudentDto } from '../../../services/studentService';
import { formatAcademicDate } from '../../../utils/printUtils';

export interface StudentProfilePrintDocumentProps {
  student: StudentDto;
  isForPreview?: boolean;
}

export const StudentProfilePrintDocument: React.FC<StudentProfilePrintDocumentProps> = ({
  student,
  isForPreview = false,
}) => {
  return (
    <PrintLayout
      documentTitle="OFFICIAL STUDENT ENROLLMENT & ACADEMIC PROFILE"
      documentSubtitle="Institutional Registry Dossier, Secondary Board Affiliation & Contact Record"
      reportCategory="STUDENT PROFILE RECORD"
      metadata={{
        studentName: student.name,
        studentId: student.studentId,
        className: student.className,
        boardName: student.boardName,
        batchName: student.batchName,
        schoolName: student.school,
        academicYear: student.academicYear || 'AY 2024–2025',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Student Profile Record issued by Infinite Tutorial Directorate of Admissions. Any unauthorized modification renders this document void."
    >
      {/* 1. Profile Top Card */}
      <div className="flex items-start gap-5 p-4 bg-slate-50 border border-slate-300 rounded-lg">
        {/* Student Photograph */}
        <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-slate-300 bg-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <span className="text-3xl font-black text-slate-400 block">{student.name.charAt(0)}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mt-1">
                [Photograph]
              </span>
            </div>
          )}
        </div>

        {/* Identity Highlights */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#0A3622]">{student.name}</h3>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{student.school}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="px-2.5 py-1 rounded bg-[#0A3622] text-white font-mono font-bold text-xs">
                {student.studentId}
              </span>
              <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 mt-1">
                Status: {student.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Class &amp; Board:</span>
              <span className="font-bold text-slate-900">{student.className} ({student.boardName})</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Enrolled Batch:</span>
              <span className="font-bold text-slate-900">{student.batchName}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Academic Session:</span>
              <span className="font-bold text-slate-900">{student.academicYear || '2024–2025'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Information Blocks */}
      <div className="grid grid-cols-2 gap-4">
        {/* Academic Details Section */}
        <div className="p-3.5 bg-white border border-slate-300 rounded-lg space-y-2">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide border-b border-slate-200 pb-1.5">
            Academic Information
          </h4>
          <dl className="text-xs divide-y divide-slate-100">
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Official Student ID</dt>
              <dd className="font-mono font-bold text-slate-900">{student.studentId}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Class / Grade</dt>
              <dd className="font-bold text-slate-900">{student.className}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Examination Board</dt>
              <dd className="font-bold text-slate-900">{student.boardName}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Assigned Cohort Batch</dt>
              <dd className="font-semibold text-slate-900">{student.batchName}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Admission Date</dt>
              <dd className="font-semibold text-slate-900">{formatAcademicDate(student.admissionDate)}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Enrollment Standing</dt>
              <dd className="font-bold text-emerald-800">{student.status}</dd>
            </div>
          </dl>
        </div>

        {/* Personal & Parent Contact Section */}
        <div className="p-3.5 bg-white border border-slate-300 rounded-lg space-y-2">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide border-b border-slate-200 pb-1.5">
            Personal &amp; Guardian Record
          </h4>
          <dl className="text-xs divide-y divide-slate-100">
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Full Name</dt>
              <dd className="font-bold text-slate-900">{student.name}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Date of Birth (DOB)</dt>
              <dd className="font-semibold text-slate-900">{formatAcademicDate(student.dateOfBirth)}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Registered School</dt>
              <dd className="font-semibold text-slate-900 truncate max-w-[180px]" title={student.school}>
                {student.school}
              </dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Parent / Guardian</dt>
              <dd className="font-bold text-slate-900">{student.parentName || 'Recorded on File'}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Primary Contact Phone</dt>
              <dd className="font-mono font-bold text-slate-900">{student.parentPhone || 'Recorded on File'}</dd>
            </div>
            <div className="py-1.5 flex justify-between">
              <dt className="text-slate-500">Student Phone</dt>
              <dd className="font-mono text-slate-700">{student.studentPhone || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* 3. Institutional Certification Notice */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
        <p className="font-bold text-[#0A3622] mb-0.5">Academic Registry Verification:</p>
        <p className="text-[10px] text-slate-600 leading-relaxed">
          This document certifies that the above student is legitimately registered in Infinite Tutorial’s secondary coaching program. All particulars are recorded in accordance with institutional ERP admissions database guidelines.
        </p>
      </div>
    </PrintLayout>
  );
};
