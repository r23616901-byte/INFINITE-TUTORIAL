export * from './PrintLayout';
export * from './PrintHeader';
export * from './PrintFooter';
export * from './PrintButton';
export * from './PrintPreviewModal';
export * from './templates/ScorecardPrintDocument';
export * from './templates/PerformanceAnalysisPrintDocument';
export * from './templates/PortionCompletionPrintDocument';
export * from './templates/StudentProfilePrintDocument';
export * from './templates/AttendanceReportPrintDocument';
export * from './templates/TeacherReportPrintDocument';
export * from './templates/BatchReportPrintDocument';
export * from './templates/TestResultPrintDocument';
export * from './templates/ParentProgressReportPrintDocument';
export * from './templates/QuestionPaperPrintDocument';

// Centralized Document Template System exports
export {
  DocumentLayout,
  DocumentHeader,
  DocumentFooter,
  ExaminationPaperTemplate,
  AcademicReportTemplate,
  TestQuestionPaperDocument,
  PrintPreview,
  FormulaRenderer,
} from '../document-templates';
export type {
  DocumentLayoutProps,
  DocumentHeaderProps,
  DocumentFooterProps,
  ExaminationPaperTemplateProps,
  AcademicReportTemplateProps,
  TestQuestionPaperDocumentProps,
  PrintPreviewProps,
  FormulaRendererProps,
} from '../document-templates';
export * from '../../types/documentTemplates';
export * from '../../utils/documentPrintUtils';
