import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  FileText,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { triggerDocumentPrint } from '../../utils/documentPrintUtils';

export interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  documentTitle?: string;
  defaultOrientation?: 'portrait' | 'landscape';
  children: React.ReactNode;
  extraControls?: React.ReactNode;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  isOpen,
  onClose,
  title = 'Official Academic Document Preview',
  documentTitle,
  defaultOrientation = 'portrait',
  children,
  extraControls,
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(defaultOrientation);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    setOrientation(defaultOrientation);
  }, [defaultOrientation]);

  // Manage print-preview-active class on body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('print-preview-active');
    } else {
      document.body.classList.remove('print-preview-active');
    }
    return () => {
      document.body.classList.remove('print-preview-active');
    };
  }, [isOpen]);

  // Handle ESC key to close and Ctrl+P to print
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handleNativePrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, orientation]);

  if (!isOpen) return null;

  const handleNativePrint = async () => {
    setIsPrinting(true);
    try {
      await triggerDocumentPrint({
        documentTitle: documentTitle || `Infinite Tutorial - ${title}`,
        landscape: orientation === 'landscape',
        timeout: 250,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return createPortal(
    <div className="print-preview-modal-root fixed inset-0 z-[999999] flex flex-col bg-slate-900/85 backdrop-blur-xs print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      {/* 1. Modal Top Toolbar (Hidden when printing) */}
      <header className="print-preview-modal-toolbar bg-[#0A3622] text-white px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 border-b border-emerald-900 shadow-lg flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-900 border border-emerald-600 text-emerald-200 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white truncate" title={title}>{title}</h2>
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 whitespace-nowrap shrink-0">
                <ShieldCheck className="w-3 h-3" /> ISO 216 A4 Standard ({orientation === 'landscape' ? '297 × 210 mm' : '210 × 297 mm'})
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-100 truncate">
              Infinite Tutorial Academic Standard A4 Template &bull; Ready for Printer / PDF Export
            </p>
          </div>
        </div>

        {/* Center / Extra Controls if provided */}
        {extraControls && (
          <div className="hidden md:flex items-center gap-2">{extraControls}</div>
        )}

        {/* Action Buttons: Zoom, Orientation, Print, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Orientation Toggle */}
          <button
            type="button"
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700 transition-colors cursor-pointer"
            title="Toggle between Portrait and Landscape orientation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline capitalize">{orientation}</span>
          </button>

          {/* Zoom In / Out */}
          <div className="hidden md:flex items-center rounded-lg bg-emerald-900 border border-emerald-700 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
              className="px-2 py-1.5 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-emerald-200">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(140, z + 15))}
              className="px-2 py-1.5 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Print / Save as PDF Button */}
          <button
            type="button"
            onClick={handleNativePrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white hover:bg-emerald-50 text-[#0A3622] shadow-md transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0A3622]" />
            <span className="hidden sm:inline">{isPrinting ? 'Preparing...' : 'Print / Save PDF'}</span>
            <span className="sm:hidden">{isPrinting ? 'Preparing...' : 'Print PDF'}</span>
          </button>

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Paper Canvas Stage */}
      <div className="flex-1 overflow-auto p-2 sm:p-6 md:p-8 flex flex-col items-center print:p-0 print:overflow-visible">
        <div
          className={`bg-white text-slate-900 rounded-sm shadow-2xl transition-all duration-200 print:shadow-none print:rounded-none print:w-full print:m-0 w-full ${
            orientation === 'landscape'
              ? 'max-w-[297mm] min-h-[210mm] p-4 sm:p-[10mm]'
              : 'max-w-[210mm] min-h-[297mm] p-4 sm:p-[10mm]'
          }`}
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
