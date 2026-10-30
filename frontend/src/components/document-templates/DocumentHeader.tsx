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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pb-2.5 border-b border-slate-200 print:flex-row print:items-center print:justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <img
            src={INFINITE_TUTORIAL_TEMPLATE_SETTINGS.logoUrl}
            alt="Infinite Tutorial"
            className="h-11 sm:h-14 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-clean.png';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-black text-[#0A3622] tracking-tight uppercase leading-tight">
                {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionName}
              </h1>
              {isTeacherVersion && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-700 text-white tracking-wider uppercase shrink-0">
                  Teacher Key
                </span>
              )}
            </div>
            <p className="text-[10.5px] sm:text-[11px] font-semibold text-slate-700 tracking-wide mt-0.5 sm:mt-1">
              {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionSubtitle}
            </p>
            <p className="text-[9.5px] sm:text-[10px] text-slate-500">
              {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionAddress}
            </p>
          </div>
        </div>

        {/* Document Classification & Date */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 sm:gap-0.5 shrink-0 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 print:flex-col print:items-end print:w-auto print:border-t-0 print:pt-0">
          <span
            className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider rounded border whitespace-nowrap ${
              isTeacherVersion
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-[#F0FDF4] text-[#0A3622] border-[#166534]'
            }`}
          >
            {reportCategory}
          </span>
          <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-700 font-mono whitespace-nowrap">
            {academicYear}
          </span>
          <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap">
            Issued: {dateStr}
          </span>
        </div>
      </div>

      {/* 2. Document Title Banner */}
      <div className="pt-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 print:flex-row print:items-start print:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase leading-snug">
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
          <div className="flex items-center gap-2 shrink-0 text-xs flex-wrap">
            {duration && (
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-800 text-[10.5px] sm:text-[11px] whitespace-nowrap">
                Time: {duration}
              </span>
            )}
            {maxMarks && (
              <span className="px-2.5 py-0.5 bg-[#F0FDF4] border border-[#166534] rounded font-bold text-[#0A3622] text-[10.5px] sm:text-[11px] whitespace-nowrap">
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
