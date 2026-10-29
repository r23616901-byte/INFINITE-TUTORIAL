import React from 'react';
import { ExaminationPaperTemplate } from '../../document-templates/ExaminationPaperTemplate';
import { QuestionPaper } from '../../../services/curriculumService';
import { AnswerSpaceType } from '../../document-templates';

export interface QuestionPaperPrintDocumentProps {
  paper: QuestionPaper;
  showAnswerKey?: boolean;
  studentName?: string;
  rollNumber?: string;
  isForPreview?: boolean;
  answerSpacePreference?: AnswerSpaceType;
  customInstructions?: string[];
}

/**
 * Universal Question Paper Print Document
 * Reuses the official Infinite Tutorial ExaminationPaperTemplate with full
 * math & chemical formula support, candidate fill-in fields, and teacher answer key separation.
 */
export const QuestionPaperPrintDocument: React.FC<QuestionPaperPrintDocumentProps> = ({
  paper,
  showAnswerKey = false,
  studentName,
  rollNumber,
  isForPreview = false,
  answerSpacePreference = 'none',
  customInstructions,
}) => {
  return (
    <ExaminationPaperTemplate
      paper={paper}
      showAnswerKey={showAnswerKey}
      studentName={studentName}
      rollNumber={rollNumber}
      isForPreview={isForPreview}
      answerSpacePreference={answerSpacePreference}
      customInstructions={customInstructions}
    />
  );
};
