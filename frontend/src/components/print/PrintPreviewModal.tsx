import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  X,
  ZoomIn,
  ZoomOut,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { triggerUniversalPrint } from '../../utils/printUtils';

export interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  documentTitle?: string;
  defaultOrientation?: 'portrait' | 'landscape';
  children: React.ReactNode;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  title = 'Official Document Print Preview',
  documentTitle,
  defaultOrientation = 'portrait',
  children,
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

  // Handle ESC key to close
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
      await triggerUniversalPrint({
        documentTitle: documentTitle || `Infinite Tutorial - ${title}`,
        landscape: orientation === 'landscape',
        timeout: 250,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return createPortal(
    <div className="print-preview-modal-root fixed inset-0 w-screen h-screen left-0 top-0 z-[999999] flex flex-col bg-slate-900/90 backdrop-blur-xs print:p-0 print:m-0 print:bg-white print:static print:overflow-visible">
      {/* 1. Modal Top Toolbar (Hidden when actually printing) */}
      <header className="no-print bg-[#0B1F4D] text-white px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-slate-700 shadow-md flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[#0A3622] border border-[#14532D] text-[#86EFAC] flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white truncate" title={title}>
                {title}
              </h2>
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 whitespace-nowrap shrink-0">
                <ShieldCheck className="w-3 h-3" /> ISO 216 A4 Certified ({orientation === 'landscape' ? '297 × 210 mm' : '210 × 297 mm'})
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
              Infinite Tutorial Academic Standard A4 Sheet Document &bull; Ready for Printer / PDF Export
            </p>
          </div>
        </div>

        {/* Action & Control Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Orientation Toggle */}
          <div className="hidden sm:flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                orientation === 'portrait'
                  ? 'bg-[#0A3622] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Portrait
            </button>
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                orientation === 'landscape'
                  ? 'bg-[#0A3622] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Landscape
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
              className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-300 w-10 text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 140))}
              className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white font-medium cursor-pointer"
              title="Reset Zoom"
            >
              100%
            </button>
          </div>

          {/* Native Print Action Button */}
          <button
            type="button"
            onClick={handleNativePrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-[#0A3622] hover:bg-[#072417] text-white rounded-lg text-xs font-bold border border-[#14532D] shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPrinting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isPrinting ? 'Preparing A4 Sheet...' : 'Print / Save PDF (A4)'}</span>
            <span className="sm:hidden">{isPrinting ? 'Preparing...' : 'Print PDF'}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Interactive Document Canvas Viewport */}
      <div className="flex-1 overflow-auto bg-slate-900/90 p-2 sm:p-6 md:p-8 flex flex-col items-center print:p-0 print:m-0 print:bg-white print:overflow-visible">
        <div
          style={{
            transform: isPrinting ? 'none' : `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className={`w-full ${
            orientation === 'landscape' ? 'max-w-[297mm]' : 'max-w-[210mm]'
          } print:!transform-none print:w-full mx-auto`}
        >
          {/* The Actual Printed Document Container */}
          <div className={`print-preview-sheet ${orientation} print:p-0 print:m-0 print:shadow-none print:w-full mx-auto`}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
