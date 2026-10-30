import React from 'react';
import { DocumentMetadata } from '../../types/documentTemplates';
import { getDocumentTimestamp, INFINITE_TUTORIAL_TEMPLATE_SETTINGS } from '../../utils/documentPrintUtils';

export interface DocumentHeaderProps {
  documentTitle: string;
  documentSubtitle?: string;
  reportCategory?: string;
  metadata?: DocumentMetadata;
  customDate?: string;
  className?: string;
  isTeacherVersion?: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentTitle,
  documentSubtitle,
  reportCategory = 'OFFICIAL ACADEMIC DOCUMENT',
  metadata = {},
  customDate,
  className = '',
  isTeacherVersion = false,
}) => {
  const timestamp = getDocumentTimestamp();
  const dateStr = customDate || timestamp.full;

  const {
    studentName,
    studentId,
    rollNumber,
    className: studentClass,
    boardName,
    batchName,
    schoolName,
    subjectName,
    subjectCode,
    facultyName,
    academicYear = 'AY 2024–2025',
    reportingPeriod,
    testName,
    testDate,
    maxMarks,
    duration,
    generatedBy: _generatedBy = 'Infinite Academic ERP',
    examNumber,
  } = metadata;

  const classBoardStr =
    studentClass && boardName
      ? `${studentClass} (${boardName})`
      : studentClass || boardName || undefined;

  const hasMetadataGrid = Boolean(
    studentName ||
      classBoardStr ||
      batchName ||
      schoolName ||
      subjectName ||
      facultyName ||
      testName ||
      reportingPeriod ||
      examNumber
  );

  return (
    <header className={`official-doc-header w-full text-slate-900 select-none border-b-2 border-[#0A3622] pb-3 ${className}`}>
      {/* 1. Main Letterhead with Authentic Logo & Dark Academic Green Branding */}
      <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <img
            src={INFINITE_TUTORIAL_TEMPLATE_SETTINGS.logoUrl}
            alt="Infinite Tutorial"
            className="h-14 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-clean.png';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#0A3622] tracking-tight uppercase leading-none">
                {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionName}
              </h1>
              {isTeacherVersion && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white tracking-wider uppercase">
                  Teacher Key
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-slate-700 tracking-wide mt-1">
              {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionSubtitle}
            </p>
            <p className="text-[10px] text-slate-500">
              {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionAddress}
            </p>
          </div>
        </div>

        {/* Right-aligned Document Classification & Date */}
        <div className="text-right flex flex-col items-end shrink-0 whitespace-nowrap">
          <span
            className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border whitespace-nowrap ${
              isTeacherVersion
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-[#F0FDF4] text-[#0A3622] border-[#166534]'
            }`}
          >
            {reportCategory}
          </span>
          <span className="text-[10px] font-bold text-slate-700 mt-1 font-mono whitespace-nowrap">
            {academicYear}
          </span>
          <span className="text-[9px] text-slate-500 font-medium mt-0.5 whitespace-nowrap">
            Issued: {dateStr}
          </span>
        </div>
      </div>

      {/* 2. Document Title Banner */}
      <div className="pt-2.5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight uppercase leading-snug">
            {documentTitle}
          </h2>
          {documentSubtitle && (
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {documentSubtitle}
            </p>
          )}
        </div>

        {/* Quick Exam Metrics (if applicable) */}
        {(duration || maxMarks) && (
          <div className="flex items-center gap-2 shrink-0 text-xs">
            {duration && (
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-800 text-[11px]">
                Time: {duration}
              </span>
            )}
            {maxMarks && (
              <span className="px-2.5 py-0.5 bg-[#F0FDF4] border border-[#166534] rounded font-bold text-[#0A3622] text-[11px]">
                Max: {maxMarks} Marks
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Structured Metadata Grid */}
      {hasMetadataGrid && (
        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-[11px]">
          {studentName && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Candidate Name</span>
              <span className="font-bold text-slate-900">{studentName}</span>
            </div>
          )}

          {(studentId || rollNumber) && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Roll / Reg. No.</span>
              <span className="font-mono font-bold text-slate-800">{rollNumber || studentId}</span>
            </div>
          )}

          {classBoardStr && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Class &amp; Board</span>
              <span className="font-semibold text-slate-800">{classBoardStr}</span>
            </div>
          )}

          {batchName && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Cohort / Batch</span>
              <span className="font-semibold text-slate-800">{batchName}</span>
            </div>
          )}

          {subjectName && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Subject</span>
              <span className="font-bold text-slate-900">
                {subjectName} {subjectCode ? `(${subjectCode})` : ''}
              </span>
            </div>
          )}

          {facultyName && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Faculty In-Charge</span>
              <span className="font-semibold text-slate-800">{facultyName}</span>
            </div>
          )}

          {testDate && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Exam Date</span>
              <span className="font-semibold text-slate-800">{testDate}</span>
            </div>
          )}

          {examNumber && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Paper Code</span>
              <span className="font-mono font-bold text-slate-800">{examNumber}</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
