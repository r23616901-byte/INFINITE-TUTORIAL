import React from 'react';

export interface PrintTemplateFooterProps {
  customNote?: string;
  showSignatures?: boolean;
}

export const PrintTemplateFooter: React.FC<PrintTemplateFooterProps> = ({
  customNote,
  showSignatures = true,
}) => {
  return (
    <div className="hidden print:block w-full mt-3 pt-2 border-t-2 border-slate-300 text-black select-none break-inside-avoid">
      {/* Signatures Row */}
      {showSignatures && (
        <div className="grid grid-cols-3 gap-6 pt-3 pb-1 text-center">
          <div className="border-t border-slate-400 pt-0.5">
            <p className="text-[9.5px] font-bold text-slate-800 uppercase">Faculty In-Charge</p>
            <p className="text-[8.5px] text-slate-500">Signature &amp; Date</p>
          </div>
          <div className="border-t border-slate-400 pt-0.5">
            <p className="text-[9.5px] font-bold text-slate-800 uppercase">Academic Coordinator</p>
            <p className="text-[8.5px] text-slate-500">Verified &amp; Authenticated</p>
          </div>
          <div className="border-t border-slate-400 pt-0.5">
            <p className="text-[9.5px] font-bold text-slate-800 uppercase">Director / Principal</p>
            <p className="text-[8.5px] text-slate-500">Institutional Seal</p>
          </div>
        </div>
      )}

      {/* Institutional Legal & Disclaimer */}
      <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2 border-t border-slate-200 mt-2">
        <p>
          {customNote || 'Official Infinite Tutorial Academic Record. Any unauthorized alteration renders this report invalid.'}
        </p>
        <p className="font-mono">
          Infinite Tutorial ERP System &bull; Confidential
        </p>
      </div>
    </div>
  );
};
