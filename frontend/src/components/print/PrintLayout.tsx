import React from 'react';
import { PrintHeader, PrintMetadata } from './PrintHeader';
import { PrintFooter } from './PrintFooter';

export interface PrintLayoutProps {
  documentTitle: string;
  documentSubtitle?: string;
  reportCategory?: string;
  metadata?: PrintMetadata;
  orientation?: 'portrait' | 'landscape';
  showSignatures?: boolean;
  customFooterNote?: string;
  customDate?: string;
  children: React.ReactNode;
  className?: string;
  isForPreview?: boolean;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  documentTitle,
  documentSubtitle,
  reportCategory = 'OFFICIAL ACADEMIC RECORD',
  metadata,
  orientation = 'portrait',
  showSignatures = true,
  customFooterNote,
  customDate,
  children,
  className = '',
  isForPreview = false,
}) => {
  const containerClass = isForPreview
    ? `print-preview-sheet ${orientation} font-sans leading-normal ${className}`
    : `universal-print-document ${orientation === 'landscape' ? 'landscape-mode' : ''} font-sans leading-normal ${className}`;

  return (
    <div className={containerClass}>
      {/* 1. Official Header */}
      <PrintHeader
        documentTitle={documentTitle}
        documentSubtitle={documentSubtitle}
        reportCategory={reportCategory}
        metadata={metadata}
        customDate={customDate}
      />

      {/* 2. Main Report Document Body */}
      <div className="w-full my-3.5 space-y-3.5 text-slate-800">
        {children}
      </div>

      {/* 3. Official Institutional Footer */}
      <PrintFooter
        customNote={customFooterNote}
        showSignatures={showSignatures}
      />
    </div>
  );
};
