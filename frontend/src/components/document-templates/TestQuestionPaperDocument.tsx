import React, { useState } from 'react';
import { DocumentLayout } from './DocumentLayout';
import { DocumentMetadata } from '../../types/documentTemplates';
import { TestItem } from '../../types/test';
import { resolveBackendAssetUrl, getDefaultInstructionsForSubject } from '../../utils/documentPrintUtils';
import { FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { ALL_QUESTION_PAPERS } from '../../services/curriculumQuestionPapers';
import { FormulaRenderer } from './FormulaRenderer';

export interface TestQuestionPaperDocumentProps {
  test: TestItem;
  showAnswerKey?: boolean;
  studentName?: string;
  rollNumber?: string;
  isForPreview?: boolean;
}

/**
 * Official Question Paper Document for Tests
 * Integrates official Infinite Tutorial letterhead, candidate fill-in fields,
 * examination instructions, attached PDF/image paper viewing, curriculum fallback,
 * and certified institutional footer.
 */
export const TestQuestionPaperDocument: React.FC<TestQuestionPaperDocumentProps> = ({
  test,
  showAnswerKey = false,
  studentName,
  rollNumber,
  isForPreview: _isForPreview = false,
}) => {
  const [loadError, setLoadError] = useState(false);

  const boardName = test.boardName || 'CBSE';
  const className = test.className || 'Class 10';
  const subjectName = test.subjectName || 'Physics';

  const documentTitle = `${boardName.toUpperCase()} — ${className.toUpperCase()} EXAMINATION`;
  const documentSubtitle = `${test.name} • Subject: ${subjectName}`;
  const reportCategory = showAnswerKey
    ? 'TEACHER ANSWER KEY & EVALUATION'
    : 'OFFICIAL STUDENT QUESTION PAPER';

  const metadata: DocumentMetadata = {
    className,
    boardName,
    subjectName,
    duration: test.duration || '90 mins',
    maxMarks: test.maxMarks || 50,
    testDate: test.date || new Date().toLocaleDateString('en-IN'),
    facultyName: test.createdByName,
    examNumber: test.testId || test.id,
    academicYear: 'AY 2024–2025',
  };

  // Resolve instructions: test.instructions or subject defaults
  const instructionsList: string[] = test.instructions
    ? test.instructions.split('\n').filter(Boolean)
    : getDefaultInstructionsForSubject(subjectName);

  // Resolved test paper file URL
  const resolvedFileUrl = test.testPaperUrl ? resolveBackendAssetUrl(test.testPaperUrl) : null;
  const isPdf =
    test.mimeType?.includes('pdf') ||
    (test.testPaperName && test.testPaperName.toLowerCase().endsWith('.pdf')) ||
    (resolvedFileUrl && resolvedFileUrl.toLowerCase().endsWith('.pdf'));

  // Attempt to find matching curriculum structured questions if attached file is not an image
  const matchingCurriculumPaper = ALL_QUESTION_PAPERS.find(
    (qp) =>
      qp.subject.toLowerCase() === subjectName.toLowerCase() &&
      qp.className.toLowerCase().includes(className.toLowerCase().replace('class ', ''))
  );

  return (
    <DocumentLayout
      documentTitle={documentTitle}
      documentSubtitle={documentSubtitle}
      reportCategory={reportCategory}
      metadata={metadata}
      showSignatures={true}
      signatureLabels={['Invigilator / Examiner', 'Subject Faculty', 'Principal / Center Head']}
      customFooterNote={`${boardName} Secondary Board Examination &bull; Official Question Paper of Infinite Tutorial`}
    >
      {/* 1. Exam Metrics & Candidate Fill-in Area */}
      <section className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs flex flex-wrap items-center justify-between gap-3 avoid-break">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Allotted Time</span>
            <span className="font-bold text-slate-900">{test.duration || '90 mins'}</span>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Maximum Marks</span>
            <span className="font-bold text-[#0A3622] text-sm">{test.maxMarks} Marks</span>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Paper Identifier</span>
            <span className="font-mono font-bold text-slate-800">{test.testId || 'TST-REF'}</span>
          </div>
        </div>

        {/* Candidate Fill-in Area */}
        <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
          <div className="border border-dashed border-slate-400 rounded px-2.5 py-1 bg-white">
            <span className="text-slate-500">Student Name: </span>
            <span className="font-bold text-slate-900">
              {studentName ? studentName : '___________________________'}
            </span>
          </div>
          <div className="border border-dashed border-slate-400 rounded px-2.5 py-1 bg-white">
            <span className="text-slate-500">Roll No: </span>
            <span className="font-mono font-bold text-slate-900">
              {rollNumber ? rollNumber : '______________'}
            </span>
          </div>
          <div className="border border-dashed border-slate-400 rounded px-2.5 py-1 bg-white">
            <span className="text-slate-500">Class/Sec: </span>
            <span className="font-bold text-slate-900">{className}</span>
          </div>
        </div>
      </section>

      {/* 2. General Examination Instructions */}
      <section className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 avoid-break">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 doc-section-heading">
          <span className="w-2 h-2 rounded-full bg-[#0A3622] inline-block" />
          General Examination Instructions:
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] pl-1 leading-relaxed">
          {instructionsList.map((inst, idx) => (
            <li key={idx} className="pl-1">
              {inst.replace(/^[0-9]+\.\s*/, '')}
            </li>
          ))}
        </ol>
      </section>

      {/* 3. Official Attached Question Paper Content */}
      <section className="doc-section-card border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
        {/* Section Header */}
        <div className="bg-[#F0FDF4] border-b border-[#166534]/30 px-3.5 py-2.5 flex items-center justify-between doc-section-heading">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0A3622]" />
            <h3 className="font-black text-xs text-[#0A3622] uppercase tracking-wide">
              Official Examination Questions &amp; Problem Sets
            </h3>
          </div>
          {test.testPaperName && (
            <span className="text-[10.5px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              Source File: {test.testPaperName}
            </span>
          )}
        </div>

        {/* Paper Content Display Area */}
        <div className="p-4 space-y-4">
          {resolvedFileUrl && !loadError ? (
            <div className="space-y-3">
              {/* Toolbar for File Actions */}
              <div className="no-print bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Attached Question Paper Document ({test.testPaperName || 'Official PDF Sheet'})
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={resolvedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold shadow-2xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Open Full Screen
                  </a>
                  <a
                    href={resolvedFileUrl}
                    download={test.testPaperName || 'Question-Paper.pdf'}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A3622] hover:bg-[#072417] text-white font-semibold shadow-2xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>

              {/* Embedded Document Frame */}
              {isPdf ? (
                <div className="w-full rounded-lg border border-slate-300 bg-slate-50 overflow-hidden shadow-inner">
                  <iframe
                    src={resolvedFileUrl}
                    title={test.testPaperName || 'Question Paper PDF'}
                    className="w-full min-h-[700px] border-none bg-white"
                    onError={() => setLoadError(true)}
                  />
                </div>
              ) : (
                <div className="w-full text-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <img
                    src={resolvedFileUrl}
                    alt={test.testPaperName || 'Question Paper Sheet'}
                    className="max-w-full h-auto mx-auto rounded shadow-xs"
                    onError={() => setLoadError(true)}
                  />
                </div>
              )}
            </div>
          ) : matchingCurriculumPaper ? (
            /* Structured Questions Fallback from Benchmark Curriculum */
            <div className="space-y-4">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center gap-2">
                <span className="font-bold">Notice:</span> Displaying Infinite Tutorial certified examination questions for {subjectName} ({className} {boardName}).
              </div>

              {matchingCurriculumPaper.sections.map((section, sIdx) => (
                <div key={sIdx} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-black text-xs text-slate-800">{section.sectionName}</span>
                    <span className="text-[11px] font-mono font-bold text-slate-700">[{section.totalMarks} Marks]</span>
                  </div>
                  <div className="p-3 space-y-3 divide-y divide-slate-100">
                    {section.questions.map((q) => (
                      <div key={q.questionNumber} className="pt-2 first:pt-0 space-y-1">
                        <div className="flex items-start justify-between gap-3 text-xs">
                          <div className="flex-1">
                            <span className="font-black text-[#0A3622] mr-2">Q{q.questionNumber}.</span>
                            <FormulaRenderer content={q.text} inline />
                          </div>
                          <span className="font-mono font-bold text-slate-700 text-[10px]">[{q.marks} M]</span>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pl-6 pt-1 text-xs">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-slate-50 p-1.5 rounded border border-slate-200">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        {showAnswerKey && q.answerKey && (
                          <div className="ml-6 mt-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 font-mono">
                            <span className="font-bold block text-emerald-800 text-[10px]">Evaluation Key:</span>
                            {q.answerKey}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">Test Paper Document Attachment</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {test.testPaperName
                  ? `File "${test.testPaperName}" is registered for this test.`
                  : 'No digital paper file has been uploaded for this test session yet.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </DocumentLayout>
  );
};
