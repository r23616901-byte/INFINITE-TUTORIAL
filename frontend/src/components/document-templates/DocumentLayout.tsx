import React from 'react';
import { DocumentHeader } from './DocumentHeader';
import { DocumentFooter } from './DocumentFooter';
import { DocumentMetadata } from '../../types/documentTemplates';
import './documentTemplates.css';

export interface DocumentLayoutProps {
  documentTitle: string;
  documentSubtitle?: string;
  reportCategory?: string;
  metadata?: DocumentMetadata;
  orientation?: 'portrait' | 'landscape';
  showSignatures?: boolean;
  signatureLabels?: string[];
  customFooterNote?: string;
  customDate?: string;
  isTeacherVersion?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const DocumentLayout: React.FC<DocumentLayoutProps> = ({
  documentTitle,
  documentSubtitle,
  reportCategory = 'OFFICIAL ACADEMIC DOCUMENT',
  metadata,
  orientation = 'portrait',
  showSignatures = true,
  signatureLabels,
  customFooterNote,
  customDate,
  isTeacherVersion = false,
  children,
  className = '',
}) => {
  const containerClass = `universal-print-document ${
    orientation === 'landscape' ? 'landscape-mode' : ''
  } font-sans leading-normal w-full max-w-full ${className}`;

  return (
    <article className={containerClass}>
      {/* 1. Official Letterhead */}
      <DocumentHeader
        documentTitle={documentTitle}
        documentSubtitle={documentSubtitle}
        reportCategory={reportCategory}
        metadata={metadata}
        customDate={customDate}
        isTeacherVersion={isTeacherVersion}
      />

      {/* 2. Document Content Body */}
      <main className="w-full my-3 space-y-3.5 text-slate-800">
        {children}
      </main>

      {/* 3. Official Institutional Footer */}
      <DocumentFooter
        customNote={customFooterNote}
        showSignatures={showSignatures}
        signatureLabels={signatureLabels}
      />
    </article>
  );
};
