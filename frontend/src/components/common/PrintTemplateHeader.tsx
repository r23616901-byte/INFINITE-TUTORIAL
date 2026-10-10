import React from 'react';

export interface PrintTemplateHeaderProps {
  documentTitle: string;
  documentSubtitle?: string;
  reportCategory?: string;
  academicYear?: string;
  batchName?: string;
  subject?: string;
  facultyName?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  dateGenerated?: string;
}

export const PrintTemplateHeader: React.FC<PrintTemplateHeaderProps> = ({
  documentTitle,
  documentSubtitle,
  reportCategory = 'OFFICIAL INSTITUTIONAL RECORD',
  academicYear = 'AY 2024–25 (Term 2)',
  batchName,
  subject,
  facultyName,
  studentName,
  studentId,
  className: studentClass,
  dateGenerated,
}) => {
  const currentDate = dateGenerated || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="hidden print:block w-full mb-6 text-black select-none border-b-2 border-[#0B1F4D] pb-4">
      {/* 1. Main Institutional Header / Letterhead */}
      <div className="flex items-center justify-between gap-6 pb-4 border-b border-slate-300">
        <div className="flex items-center gap-4">
          <img
            src="/logo-transparent.png"
            alt="Infinite Tutorial"
            className="h-14 sm:h-16 w-auto object-contain flex-shrink-0"
            onError={(e) => {
              // fallback if transparent png fails
              (e.target as HTMLImageElement).src = '/logo-clean.png';
            }}
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight uppercase leading-none">
              Infinite Tutorial
            </h1>
            <p className="text-xs font-bold text-[#155EEF] tracking-wide mt-1 uppercase">
              Centre for Academic Excellence &amp; Secondary Board Coaching
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Infinite Tutorial Campus &bull; Email: admin@infinitetutorial.com &bull; Helpline: +91 9800000001
            </p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end flex-shrink-0">
          <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-[10px] font-extrabold uppercase tracking-wider text-[#0B1F4D]">
            {reportCategory}
          </span>
          <p className="text-[10px] font-bold text-slate-700 mt-1">
            Academic Session: {academicYear}
          </p>
          <p className="text-[9px] text-slate-500 mt-0.5">
            Printed: {currentDate} at {currentTime}
          </p>
        </div>
      </div>

      {/* 2. Document Title Banner */}
      <div className="my-3 py-2 px-3 bg-[#F5F8FC] border-l-4 border-[#155EEF] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-[#0B1F4D] uppercase tracking-wide">
            {documentTitle}
          </h2>
          {documentSubtitle && (
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              {documentSubtitle}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
            &bull; Verified Record
          </span>
        </div>
      </div>

      {/* 3. Systematic Metadata Grid */}
      <div className="grid grid-cols-4 gap-2 bg-slate-50 border border-slate-200 rounded p-2 text-[10px]">
        {studentName && (
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[9px]">Student:</span>
            <span className="font-bold text-black">{studentName} {studentId ? `(${studentId})` : ''}</span>
          </div>
        )}
        {studentClass && (
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[9px]">Class &amp; Grade:</span>
            <span className="font-bold text-black">{studentClass}</span>
          </div>
        )}
        {batchName && (
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[9px]">Batch / Cohort:</span>
            <span className="font-bold text-black">{batchName}</span>
          </div>
        )}
        {subject && (
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[9px]">Subject(s):</span>
            <span className="font-bold text-black">{subject}</span>
          </div>
        )}
        {facultyName && (
          <div>
            <span className="font-bold text-slate-500 uppercase block text-[9px]">Faculty In-Charge:</span>
            <span className="font-bold text-black">{facultyName}</span>
          </div>
        )}
        <div>
          <span className="font-bold text-slate-500 uppercase block text-[9px]">Generated By:</span>
          <span className="font-bold text-black">Infinite ERP Controller</span>
        </div>
        <div>
          <span className="font-bold text-slate-500 uppercase block text-[9px]">Document Status:</span>
          <span className="font-bold text-emerald-700">Official &bull; Validated</span>
        </div>
      </div>
    </div>
  );
};
