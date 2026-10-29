/**
 * Infinite Tutorial — Document Print Utilities
 * Centralized printing helpers, image preloading, subject instruction generators, and text formatters.
 */

import { TemplateSettings, AnswerSpaceType, ExaminationPaperData } from '../types/documentTemplates';

export const INFINITE_TUTORIAL_TEMPLATE_SETTINGS: TemplateSettings = {
  institutionName: 'INFINITE TUTORIAL',
  institutionSubtitle: 'Excellence in Secondary & Higher Secondary Board Education',
  institutionAddress: 'Bangalore, Karnataka • Contact: info@infinitetutorial.in • Web: infinitetutorial.in',
  logoUrl: '/logo-transparent.png',
  primaryColor: '#0A3622', // Dark Academic Green
  accentColor: '#166534',
  defaultPaperSize: 'A4',
  defaultOrientation: 'portrait',
  showWatermark: false,
  confidentialityNote: 'Official Certified Document of Infinite Tutorial. Unauthorized duplication or redistribution is strictly prohibited.',
};

/**
 * Returns formatted date and time for document generation.
 */
export const getDocumentTimestamp = (customDate?: string | Date) => {
  const d = customDate ? new Date(customDate) : new Date();
  const date = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return { date, time, full: `${date} at ${time}` };
};

/**
 * Ensures required images are loaded into memory before window.print() is called.
 */
export const preloadDocumentAssets = async (): Promise<void> => {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('.universal-print-document img'));
  const promises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      setTimeout(resolve, 1000); // 1s safety timeout
    });
  });

  // Small delay to ensure WebFonts and SVG charts render
  await Promise.all(promises);
  await new Promise((resolve) => setTimeout(resolve, 200));
};

export interface TriggerPrintOptions {
  documentTitle?: string;
  landscape?: boolean;
  timeout?: number;
}

/**
 * Triggers native browser print with proper document title, asset preloading, and restoration.
 */
export const triggerDocumentPrint = async (options: TriggerPrintOptions = {}): Promise<void> => {
  const {
    documentTitle = 'Infinite Tutorial — Academic Document',
    landscape = false,
    timeout = 250,
  } = options;

  const previousTitle = document.title;
  document.title = documentTitle;

  // Add landscape marker class if required
  if (landscape) {
    document.body.classList.add('print-landscape');
  } else {
    document.body.classList.remove('print-landscape');
  }

  try {
    await preloadDocumentAssets();
    await new Promise((resolve) => setTimeout(resolve, timeout));
    window.print();
  } finally {
    setTimeout(() => {
      document.title = previousTitle;
      document.body.classList.remove('print-landscape');
    }, 1000);
  }
};

/**
 * Generates official general instructions tailored by subject.
 */
export const getDefaultInstructionsForSubject = (subjectName: string): string[] => {
  const sub = subjectName.toLowerCase();

  const standardInstructions = [
    'All questions are compulsory. Internal choices are provided in Section C and D.',
    'Verify that the question paper contains all pages and sections before starting.',
    'Write your responses in clear, legible handwriting with question numbers clearly indicated.',
  ];

  if (sub.includes('physics')) {
    return [
      ...standardInstructions,
      'Section A comprises 1-mark objective questions; Section B carries 2 marks; Section C carries 3 marks; Section D carries 6 marks.',
      'Show all formula derivations, substitution steps, and SI units in all numerical calculations.',
      'Draw neat, labeled diagrams for ray diagrams and electric circuits wherever indicated.',
      'Use of programmable calculators is strictly prohibited.',
    ];
  }

  if (sub.includes('chemistry')) {
    return [
      ...standardInstructions,
      'Section A comprises 1-mark objective questions; Section B carries 2 marks; Section C carries 3 marks; Section D carries 6 marks.',
      'Write balanced chemical equations along with physical states (s, l, g, aq) wherever applicable.',
      'Clearly explain observations and color changes in chemical reaction questions.',
      'Draw electronic configurations and dot structures neatly where required.',
    ];
  }

  if (sub.includes('biology')) {
    return [
      ...standardInstructions,
      'Section A comprises 1-mark objective questions; Section B carries 2 marks; Section C carries 3 marks; Section D carries 6 marks.',
      'Draw neat and properly labeled biological diagrams wherever appropriate.',
      'Use scientific botanical and zoological terminology wherever required.',
      'Answer descriptive questions with bullet points and clear anatomical classifications.',
    ];
  }

  if (sub.includes('math')) {
    return [
      ...standardInstructions,
      'Section A comprises 1-mark objective questions; Section B carries 2 marks; Section C carries 3 marks; Section D carries 6 marks.',
      'All rough work must be done on the designated calculation space. Do not write on the question sheet margins.',
      'Show every intermediate algebraic step, theorem statement, and construction mark clearly.',
      'Use π = 22/7 or 3.14 unless otherwise specified in the problem.',
    ];
  }

  return [
    ...standardInstructions,
    'Read all questions carefully before answering.',
    'Marks are indicated on the right-hand margin against each question.',
  ];
};

/**
 * Sanitizes a question paper by removing all answer keys and evaluation criteria for student distribution.
 */
export const sanitizePaperForStudent = (paper: ExaminationPaperData): ExaminationPaperData => {
  return {
    ...paper,
    sections: paper.sections.map((sec) => ({
      ...sec,
      questions: sec.questions.map((q) => {
        const { answerKey, ...sanitized } = q;
        if (sanitized.subQuestions) {
          sanitized.subQuestions = sanitized.subQuestions.map((sq) => {
            const { answerKey: _sqAk, ...sqSanitized } = sq;
            return sqSanitized;
          });
        }
        return sanitized;
      }),
    })),
  };
};

/**
 * Generates blank answer space line count based on question marks and preference.
 */
export const getAnswerLinesForMarks = (marks: number, preference?: AnswerSpaceType): number => {
  if (preference === 'none') return 0;
  if (marks === 1) return 2;
  if (marks === 2) return 4;
  if (marks === 3) return 6;
  if (marks <= 4) return 8;
  return 12; // 5-6 marks
};

/**
 * Resolves local or relative file upload paths to their absolute backend URL.
 * Prevents SPA router / Vite from falling back to index.html and redirecting to the login screen.
 */
export const resolveBackendAssetUrl = (rawUrl?: string | null): string => {
  if (!rawUrl) return '';
  if (
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.startsWith('data:')
  ) {
    return rawUrl;
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  let backendOrigin = '';

  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      backendOrigin = parsed.origin;
    } catch {
      backendOrigin = '';
    }
  } else if (import.meta.env.PROD) {
    backendOrigin = 'https://infinite-tutorial-1.onrender.com';
  } else {
    backendOrigin = 'http://localhost:5000';
  }

  const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  return `${backendOrigin}${cleanPath}`;
};
