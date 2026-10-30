import React from 'react';
import { INFINITE_TUTORIAL_TEMPLATE_SETTINGS } from '../../utils/documentPrintUtils';

export interface DocumentFooterProps {
  customNote?: string;
  showSignatures?: boolean;
  signatureLabels?: string[];
  className?: string;
}

export const DocumentFooter: React.FC<DocumentFooterProps> = ({
  customNote,
  showSignatures = true,
  signatureLabels = ['Faculty / Evaluator', 'Academic In-Charge', 'Principal / Center Head'],
  className = '',
}) => {
  return (
    <footer className={`official-doc-footer w-full pt-3 mt-4 border-t border-slate-300 text-slate-600 select-none ${className}`}>
      {/* 1. Official Signatures Block (when enabled) */}
      {showSignatures && (
        <div className="signature-block my-3 pt-2 grid grid-cols-3 gap-2 sm:gap-6 text-center text-xs">
          {signatureLabels.map((label, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-0">
              <div className="w-full max-w-[110px] sm:max-w-[160px] border-b border-dashed border-slate-400 mb-1.5 h-6 sm:h-7" />
              <span className="font-semibold text-slate-800 text-[9px] sm:text-[10.5px] uppercase tracking-wider truncate max-w-full block">
                {label}
              </span>
              <span className="text-[8px] sm:text-[9px] text-slate-600 font-medium block">Signature &amp; Date</span>
            </div>
          ))}
        </div>
      )}

      {/* 2. Institutional Disclaimer & Copyright */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-slate-500 pt-2 border-t border-dashed border-slate-200">
        <div>
          <span className="font-bold text-slate-700">
            {INFINITE_TUTORIAL_TEMPLATE_SETTINGS.institutionName}
          </span>{' '}
          &bull; ISO 216 Standard Educational Document &bull; {customNote || INFINITE_TUTORIAL_TEMPLATE_SETTINGS.confidentialityNote}
        </div>
        <div className="font-mono text-[9px] text-slate-600">
          Certified Academic Record
        </div>
      </div>
    </footer>
  );
};
