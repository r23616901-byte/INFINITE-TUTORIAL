import React from 'react';

export interface PrintFooterProps {
  customNote?: string;
  showSignatures?: boolean;
  className?: string;
  facultySignatureLabel?: string;
  coordinatorSignatureLabel?: string;
  directorSignatureLabel?: string;
}

export const PrintFooter: React.FC<PrintFooterProps> = ({
  customNote,
  showSignatures = true,
  className = '',
  facultySignatureLabel = 'Faculty In-Charge',
  coordinatorSignatureLabel = 'Academic Coordinator',
  directorSignatureLabel = 'Director / Principal',
}) => {
  return (
    <div className={`w-full mt-4 pt-3 border-t-2 border-slate-300 text-slate-800 select-none print-break-inside-avoid ${className}`}>
      {/* 1. Official Three-Signature Block */}
      {showSignatures && (
        <div className="grid grid-cols-3 gap-6 pt-3 pb-2 text-center text-[9px]">
          <div className="border-t border-slate-400 pt-1">
            <p className="font-bold text-slate-900 uppercase">{facultySignatureLabel}</p>
            <p className="text-[8px] text-slate-500">Signature &amp; Date</p>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <p className="font-bold text-slate-900 uppercase">{coordinatorSignatureLabel}</p>
            <p className="text-[8px] text-slate-500">Verified &amp; Authenticated</p>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <p className="font-bold text-slate-900 uppercase">{directorSignatureLabel}</p>
            <p className="text-[8px] text-slate-500">Institutional Seal &amp; Affiliation</p>
          </div>
        </div>
      )}

      {/* 2. Institutional Legal & Confidentiality Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[8.5px] text-slate-500 pt-2 border-t border-slate-200 mt-1 gap-1">
        <p className="text-left font-medium">
          {customNote ||
            'Confidential academic record. For authorized use only. Any unauthorized alteration renders this report invalid.'}
        </p>
        <p className="font-mono text-right flex-shrink-0">
          Infinite Tutorial ERP &bull; Official Directorate Record
        </p>
      </div>
    </div>
  );
};
