import React from 'react';
import { getPrintTimestamp } from '../../utils/printUtils';

export interface PrintMetadata {
  studentName?: string;
  studentId?: string;
  className?: string;
  boardName?: string;
  schoolName?: string;
  batchName?: string;
  subjectName?: string;
  facultyName?: string;
  parentName?: string;
  parentPhone?: string;
  academicYear?: string;
  reportingPeriod?: string;
  testName?: string;
  testDate?: string;
  maxMarks?: number;
  duration?: string;
  generatedBy?: string;
}

export interface PrintHeaderProps {
  documentTitle: string;
  documentSubtitle?: string;
  reportCategory?: string;
  metadata?: PrintMetadata;
  customDate?: string;
  className?: string;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({
  documentTitle,
  documentSubtitle,
  reportCategory = 'OFFICIAL ACADEMIC RECORD',
  metadata = {},
  customDate,
  className = '',
}) => {
  const timestamp = getPrintTimestamp();
  const printDateStr = customDate || `${timestamp.date} at ${timestamp.time}`;

  // Extract metadata fields
  const {
    studentName,
    studentId,
    className: studentClass,
    boardName,
    schoolName,
    batchName,
    subjectName,
    facultyName,
    parentName,
    parentPhone,
    academicYear = 'AY 2024–2025',
    reportingPeriod,
    testName,
    testDate,
    maxMarks,
    duration,
    generatedBy = 'Infinite Academic ERP',
  } = metadata;

  // Build class & board combo string if available
  const classBoardStr =
    studentClass && boardName
      ? `${studentClass} (${boardName})`
      : studentClass || boardName || undefined;

  // Check if we have any person / subject metadata to render the grid
  const hasMetadataItems = Boolean(
    studentName ||
      classBoardStr ||
      batchName ||
      schoolName ||
      subjectName ||
      facultyName ||
      parentName ||
      testName ||
      reportingPeriod
  );

  return (
    <div className={`w-full text-slate-900 select-none border-b-2 border-[#0A3622] pb-3 ${className}`}>
      {/* 1. Main Institutional Header / Letterhead with Dark Academic Green Branding */}
      <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <img
            src="/logo-transparent.png"
            alt="Infinite Tutorial"
            className="h-13 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo-clean.png';
            }}
          />
          <div>
            <h1 className="text-xl font-black text-[#0A3622] tracking-tight uppercase leading-none">
              INFINITE TUTORIAL
            </h1>
            <p className="text-[10.5px] font-bold text-[#14532D] tracking-wide mt-0.5 uppercase">
              Centre for Academic Excellence &amp; Secondary Board Coaching
            </p>
            <p className="text-[9px] text-slate-600 mt-0.5">
              Infinite Tutorial Campus &bull; Email: admin@infinitetutorial.com &bull; Helpline: +91 9800000001
            </p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end flex-shrink-0">
          <span className="inline-block px-2.5 py-0.5 bg-[#F0FDF4] border border-[#86EFAC] rounded text-[9.5px] font-extrabold uppercase tracking-wider text-[#0A3622]">
            {reportCategory}
          </span>
          <p className="text-[9.5px] font-bold text-slate-700 mt-0.5">
            Academic Session: {academicYear}
          </p>
          <p className="text-[8.5px] text-slate-500 font-mono">
            Printed: {printDateStr}
          </p>
        </div>
      </div>

      {/* 2. Document Title Banner in Dark Academic Green */}
      <div className="my-2 py-1.5 px-3 bg-[#F0FDF4] border-l-4 border-[#0A3622] flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
            {documentTitle}
          </h2>
          {documentSubtitle && (
            <p className="text-[10px] text-slate-600 font-medium mt-0.5">
              {documentSubtitle}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-[#0A3622] border border-[#86EFAC] shadow-2xs">
            &bull; Verified Academic Record
          </span>
        </div>
      </div>

      {/* 3. Systematic Metadata Grid (Only renders present fields) */}
      {hasMetadataItems && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/80 border border-slate-200 rounded p-2 text-[9px] leading-tight">
          {studentName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Student:</span>
              <span className="font-bold text-slate-900">
                {studentName} {studentId ? `(${studentId})` : ''}
              </span>
            </div>
          )}

          {classBoardStr && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Class &amp; Board:</span>
              <span className="font-bold text-slate-900">{classBoardStr}</span>
            </div>
          )}

          {batchName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Batch / Timing:</span>
              <span className="font-bold text-slate-900">{batchName}</span>
            </div>
          )}

          {schoolName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">School:</span>
              <span className="font-bold text-slate-900 truncate block" title={schoolName}>
                {schoolName}
              </span>
            </div>
          )}

          {subjectName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Subject(s):</span>
              <span className="font-bold text-slate-900">{subjectName}</span>
            </div>
          )}

          {facultyName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Faculty In-Charge:</span>
              <span className="font-bold text-slate-900">{facultyName}</span>
            </div>
          )}

          {parentName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Parent / Guardian:</span>
              <span className="font-bold text-slate-900">
                {parentName} {parentPhone ? `(${parentPhone})` : ''}
              </span>
            </div>
          )}

          {testName && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Test / Assessment:</span>
              <span className="font-bold text-slate-900">
                {testName} {maxMarks ? `(Max: ${maxMarks}m)` : ''}
              </span>
            </div>
          )}

          {testDate && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Examination Date:</span>
              <span className="font-bold text-slate-900">{testDate}</span>
            </div>
          )}

          {reportingPeriod && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Reporting Period:</span>
              <span className="font-bold text-slate-900">{reportingPeriod}</span>
            </div>
          )}

          {duration && (
            <div>
              <span className="font-bold text-slate-500 uppercase block text-[8px]">Duration:</span>
              <span className="font-bold text-slate-900">{duration}</span>
            </div>
          )}

          <div>
            <span className="font-bold text-slate-500 uppercase block text-[8px]">System Origin:</span>
            <span className="font-bold text-slate-700">{generatedBy}</span>
          </div>
        </div>
      )}
    </div>
  );
};
