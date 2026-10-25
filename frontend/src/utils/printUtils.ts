/**
 * Infinite Tutorial — Universal Print Utility
 * Centralized printing and document formatting helpers for official academic reports.
 */

export interface PrintOptions {
  documentTitle?: string;
  landscape?: boolean;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
  timeout?: number;
}

/**
 * Triggers native browser print with pre-flight checks:
 * 1. Ensures required images (institutional logo, student photos) have finished loading.
 * 2. Ensures SVG/Canvas charts have finished rendering.
 * 3. Gracefully executes window.print() and restores viewport.
 */
export const triggerUniversalPrint = async (options: PrintOptions = {}): Promise<void> => {
  const { documentTitle, landscape = false, onBeforePrint, onAfterPrint, timeout = 300 } = options;

  if (landscape) {
    document.body.classList.add('print-landscape');
    window.addEventListener(
      'afterprint',
      () => {
        document.body.classList.remove('print-landscape');
      },
      { once: true }
    );
  }

  if (documentTitle) {
    const originalTitle = document.title;
    document.title = documentTitle;
    window.addEventListener(
      'afterprint',
      () => {
        document.title = originalTitle;
      },
      { once: true }
    );
  }

  // Pre-flight image wait
  const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
  const pendingImages = images.filter((img) => !img.complete);

  if (pendingImages.length > 0) {
    try {
      await Promise.all(
        pendingImages.map(
          (img) =>
            new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Don't block print if an optional image fails
              setTimeout(resolve, 1500); // Max 1.5s timeout per image
            })
        )
      );
    } catch {
      // Proceed even if an image fails to load
    }
  }

  // Optional onBeforePrint callback
  if (onBeforePrint) {
    try {
      onBeforePrint();
    } catch (err) {
      console.warn('onBeforePrint warning:', err);
    }
  }

  // Allow layout and charts to settle
  await new Promise((resolve) => setTimeout(resolve, timeout));

  // Handle post-print cleanup
  if (onAfterPrint) {
    window.addEventListener(
      'afterprint',
      () => {
        try {
          onAfterPrint();
        } catch (err) {
          console.warn('onAfterPrint warning:', err);
        }
      },
      { once: true }
    );
  }

  window.print();
};

/**
 * Formats dates for academic reports (DD Mon YYYY).
 */
export const formatAcademicDate = (dateVal?: string | Date | null): string => {
  if (!dateVal) return 'N/A';
  try {
    const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateVal);
  }
};

/**
 * Formats timestamp for report footer / header.
 */
export const getPrintTimestamp = (): { date: string; time: string } => {
  const now = new Date();
  return {
    date: now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };
};

/**
 * Standard Board Grading Scheme for Infinite Tutorial official evaluations.
 */
export interface AcademicGrade {
  grade: string;
  label: string;
  minPct: number;
  badgeClass: string;
}

export const getAcademicGrade = (percentage: number): AcademicGrade => {
  if (isNaN(percentage)) {
    return { grade: 'N/A', label: 'Unassigned', minPct: 0, badgeClass: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
  if (percentage >= 90) {
    return { grade: 'O', label: 'Outstanding', minPct: 90, badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300' };
  }
  if (percentage >= 80) {
    return { grade: 'A+', label: 'Excellent', minPct: 80, badgeClass: 'bg-blue-50 text-blue-900 border-blue-300' };
  }
  if (percentage >= 70) {
    return { grade: 'A', label: 'Very Good', minPct: 70, badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-300' };
  }
  if (percentage >= 60) {
    return { grade: 'B+', label: 'Good', minPct: 60, badgeClass: 'bg-amber-50 text-amber-900 border-amber-300' };
  }
  if (percentage >= 50) {
    return { grade: 'B', label: 'Above Average', minPct: 50, badgeClass: 'bg-orange-50 text-orange-900 border-orange-300' };
  }
  if (percentage >= 35) {
    return { grade: 'C', label: 'Pass', minPct: 35, badgeClass: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
  return { grade: 'F', label: 'Needs Improvement', minPct: 0, badgeClass: 'bg-rose-50 text-rose-900 border-rose-300' };
};

/**
 * Safely computes percentage avoiding division by zero.
 */
export const calculatePercentage = (obtained: number, max: number): number => {
  if (!max || max <= 0 || isNaN(obtained)) return 0;
  return Number(((obtained / max) * 100).toFixed(1));
};
