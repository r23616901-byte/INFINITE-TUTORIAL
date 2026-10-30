import React, { useState, useEffect } from 'react';
import { DocumentLayout } from './DocumentLayout';
import { DocumentMetadata } from '../../types/documentTemplates';
import { TestItem } from '../../types/test';
import { resolveBackendAssetUrl, getDefaultInstructionsForSubject } from '../../utils/documentPrintUtils';
import { FileText, Download, ExternalLink, AlertCircle, Award, CheckCircle2 } from 'lucide-react';
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
 * examination instructions, attached PDF/image paper viewing, certified curriculum question paper,
 * and certified institutional footer.
 */
export const TestQuestionPaperDocument: React.FC<TestQuestionPaperDocumentProps> = ({
  test,
  showAnswerKey = false,
  studentName: _studentName,
  rollNumber: _rollNumber,
  isForPreview: _isForPreview = false,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [_checkingUrl, setCheckingUrl] = useState(false);

  const boardName = test.boardName || 'CBSE';
  const className = test.className || 'Class 10';
  const subjectName = test.subjectName || 'Physics';

  // Attempt to find matching curriculum structured questions
  const matchingCurriculumPaper = ALL_QUESTION_PAPERS.find(
    (qp) =>
      qp.subject.toLowerCase() === subjectName.toLowerCase() &&
      qp.className.toLowerCase().includes(className.toLowerCase().replace('class ', ''))
  );

  // Default view mode: questions view (Universal Template) if curriculum questions exist, else attached doc
  const [viewMode, setViewMode] = useState<'questions' | 'document'>(
    matchingCurriculumPaper ? 'questions' : 'document'
  );

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

  // Pre-validate file reachability so iframe never renders a 404 JSON error
  useEffect(() => {
    if (!resolvedFileUrl) return;

    let isMounted = true;
    setCheckingUrl(true);

    fetch(resolvedFileUrl, { method: 'GET' })
      .then(async (res) => {
        if (!isMounted) return;
        const cType = res.headers.get('content-type') || '';
        // If Express returned 404 or an application/json error payload, it's not a valid document
        if (!res.ok || cType.includes('application/json') || res.status === 404) {
          setLoadError(true);
          setViewMode('questions');
        } else {
          setLoadError(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(true);
          setViewMode('questions');
        }
      })
      .finally(() => {
        if (isMounted) setCheckingUrl(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedFileUrl]);

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
      {/* 1. Exam Metrics Banner */}
      <section className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs flex flex-wrap items-center justify-between gap-3 avoid-break">
        <div className="flex items-center gap-4 flex-wrap">
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
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Class &amp; Board</span>
            <span className="font-bold text-slate-800">{className} &bull; {boardName}</span>
          </div>
        </div>

        <div className="text-[11px] font-bold text-[#0A3622] bg-[#F0FDF4] px-2.5 py-1 rounded border border-[#166534]/30">
          Official Examination Paper
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

      {/* 3. Official Examination Question Content */}
      <section className="doc-section-card border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
        {/* Section Header with View Mode Switcher */}
        <div className="bg-[#F0FDF4] border-b border-[#166534]/30 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 doc-section-heading">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0A3622]" />
            <h3 className="font-black text-xs text-[#0A3622] uppercase tracking-wide">
              Official Examination Questions &amp; Problem Sets
            </h3>
          </div>

          <div className="no-print flex items-center gap-1.5">
            {matchingCurriculumPaper && (
              <button
                type="button"
                onClick={() => setViewMode('questions')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  viewMode === 'questions'
                    ? 'bg-[#0A3622] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <Award className="w-3 h-3 inline mr-1" /> Certified Paper
              </button>
            )}

            {resolvedFileUrl && (
              <button
                type="button"
                onClick={() => setViewMode('document')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  viewMode === 'document'
                    ? 'bg-[#0A3622] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                <FileText className="w-3 h-3 inline mr-1" /> Attached File
              </button>
            )}

            {test.testPaperName && (
              <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                {test.testPaperName}
              </span>
            )}
          </div>
        </div>

        {/* Paper Content Display Area */}
        <div className="p-4 space-y-4">
          {/* A. Document View Mode (Only if valid document and no load error) */}
          {viewMode === 'document' && resolvedFileUrl && !loadError ? (
            <div className="space-y-3">
              {/* Toolbar for File Actions */}
              <div className="no-print bg-slate-100 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
                    onError={() => {
                      setLoadError(true);
                      setViewMode('questions');
                    }}
                  />
                </div>
              ) : (
                <div className="w-full text-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <img
                    src={resolvedFileUrl}
                    alt={test.testPaperName || 'Question Paper Sheet'}
                    className="max-w-full h-auto mx-auto rounded shadow-xs"
                    onError={() => {
                      setLoadError(true);
                      setViewMode('questions');
                    }}
                  />
                </div>
              )}
            </div>
          ) : matchingCurriculumPaper ? (
            /* B. Certified Examination Paper (Universal Document Template) */
            <div className="space-y-4">
              {/* Notification if fallback was triggered from a missing file */}
              {loadError && test.testPaperName && (
                <div className="no-print p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      The uploaded file <strong>{test.testPaperName}</strong> was not found on remote storage.
                      Showing Infinite Tutorial certified examination questions below.
                    </span>
                  </div>
                </div>
              )}

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">Infinite Tutorial Certified Paper:</span> {matchingCurriculumPaper.title} ({matchingCurriculumPaper.academicYear})
                </div>
                <span className="font-mono font-bold text-emerald-800 text-[11px]">
                  Total Marks: {matchingCurriculumPaper.totalMarks}
                </span>
              </div>

              {matchingCurriculumPaper.sections.map((section, sIdx) => (
                <div key={sIdx} className="border border-slate-200 rounded-lg overflow-hidden avoid-break">
                  <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-black text-xs text-slate-800">{section.sectionName}</span>
                      {section.instructions && (
                        <span className="text-[10px] text-slate-500 ml-2 italic">
                          ({section.instructions})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-700">[{section.totalMarks} Marks]</span>
                  </div>
                  <div className="p-3 space-y-3 divide-y divide-slate-100">
                    {section.questions.map((q) => (
                      <div key={q.questionNumber} className="pt-2.5 first:pt-0 space-y-1.5 avoid-break">
                        <div className="flex items-start justify-between gap-3 text-xs">
                          <div className="flex-1 leading-relaxed">
                            <span className="font-black text-[#0A3622] mr-2">Q{q.questionNumber}.</span>
                            <FormulaRenderer content={q.text} inline />
                          </div>
                          <span className="font-mono font-bold text-slate-700 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 flex-shrink-0">
                            [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                          </span>
                        </div>

                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pl-6 pt-1 text-xs">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-slate-50 p-1.5 rounded border border-slate-200 font-mono text-[11px]">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {showAnswerKey && q.answerKey && (
                          <div className="ml-6 mt-1.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 font-mono">
                            <span className="font-bold block text-emerald-800 text-[10px]">Evaluation Key &amp; Solution:</span>
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
            /* C. Empty State if no questions and no document */
            <div className="text-center py-12 px-4 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">Test Paper Document Attachment</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {test.testPaperName
                  ? `File "${test.testPaperName}" could not be loaded from server storage.`
                  : 'No digital paper file has been uploaded for this test session yet.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </DocumentLayout>
  );
};
