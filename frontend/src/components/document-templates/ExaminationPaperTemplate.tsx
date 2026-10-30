import React from 'react';
import { DocumentLayout } from './DocumentLayout';
import { FormulaRenderer } from './FormulaRenderer';
import {
  ExaminationPaperData,
  AnswerSpaceType,
  DocumentMetadata,
} from '../../types/documentTemplates';
import {
  getDefaultInstructionsForSubject,
  getAnswerLinesForMarks,
} from '../../utils/documentPrintUtils';

export interface ExaminationPaperTemplateProps {
  paper: ExaminationPaperData;
  showAnswerKey?: boolean;
  studentName?: string;
  rollNumber?: string;
  className?: string;
  customInstructions?: string[];
  answerSpacePreference?: AnswerSpaceType;
  showCandidateFillIn?: boolean;
  isForPreview?: boolean;
}

export const ExaminationPaperTemplate: React.FC<ExaminationPaperTemplateProps> = ({
  paper,
  showAnswerKey = false,
  studentName: _studentName,
  rollNumber: _rollNumber,
  className: _candidateClass,
  customInstructions,
  answerSpacePreference = 'none',
  showCandidateFillIn: _showCandidateFillIn = false,
  isForPreview: _isForPreview = false,
}) => {
  const isTeacherVersion = Boolean(showAnswerKey);

  const documentTitle = isTeacherVersion
    ? `TEACHER EVALUATION SCHEME — ${paper.boardName.toUpperCase()} ${paper.className.toUpperCase()}`
    : `${paper.boardName.toUpperCase()} — ${paper.className.toUpperCase()} EXAMINATION`;

  const documentSubtitle = `${paper.title} • Subject: ${paper.subject} (${paper.subjectCode})`;

  const reportCategory = isTeacherVersion
    ? 'TEACHER ANSWER KEY & SCHEME'
    : 'OFFICIAL STUDENT QUESTION PAPER';

  const metadata: DocumentMetadata = {
    className: paper.className,
    boardName: paper.boardName,
    batchName: paper.batchName,
    subjectName: paper.subject,
    subjectCode: paper.subjectCode,
    academicYear: paper.academicYear,
    duration: paper.duration,
    maxMarks: paper.totalMarks,
    examNumber: paper.id,
    testDate: paper.examDate || new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };

  const instructionsToDisplay =
    customInstructions && customInstructions.length > 0
      ? customInstructions
      : paper.generalInstructions && paper.generalInstructions.length > 0
      ? paper.generalInstructions
      : getDefaultInstructionsForSubject(paper.subject);

  return (
    <DocumentLayout
      documentTitle={documentTitle}
      documentSubtitle={documentSubtitle}
      reportCategory={reportCategory}
      metadata={metadata}
      isTeacherVersion={isTeacherVersion}
      showSignatures={isTeacherVersion ? true : false}
      signatureLabels={['Subject Teacher / Evaluator', 'Head of Department', 'Academic Principal']}
      customFooterNote={`${paper.boardName} Curriculum Benchmark Assessment &bull; Official Examination of Infinite Tutorial`}
    >
      {/* 1. Exam Metrics Summary Bar */}
      <section className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs flex flex-wrap items-center justify-between gap-2.5 avoid-break">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-4 flex-1">
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Allotted Time</span>
            <span className="font-bold text-slate-900">{paper.duration}</span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Maximum Marks</span>
            <span className="font-bold text-[#0A3622] text-sm">{paper.totalMarks} Marks</span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Subject Code</span>
            <span className="font-mono font-bold text-slate-800">{paper.subjectCode}</span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Class &amp; Board</span>
            <span className="font-bold text-slate-800">{paper.className} &bull; {paper.boardName}</span>
          </div>
        </div>

        <div className="text-[10.5px] sm:text-[11px] font-bold text-[#0A3622] bg-[#F0FDF4] px-2.5 py-1 rounded border border-[#166534]/30 whitespace-nowrap shrink-0">
          {isTeacherVersion ? 'Teacher Evaluation Copy' : 'Official Examination Paper'}
        </div>
      </section>

      {/* 3. General Instructions Banner */}
      <section className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 avoid-break">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 doc-section-heading">
          <span className="w-2 h-2 rounded-full bg-[#0A3622] inline-block" />
          General Examination Instructions:
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] pl-1 leading-relaxed">
          {instructionsToDisplay.map((inst, idx) => (
            <li key={idx} className="pl-1">
              {inst}
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Question Paper Sections */}
      <div className="space-y-4">
        {paper.sections.map((section, sIdx) => {
          const effectiveAnswerSpace = section.defaultAnswerSpace || answerSpacePreference;

          return (
            <section
              key={sIdx}
              className="doc-section-card border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs"
            >
              {/* Section Header */}
              <div className="bg-[#F0FDF4] border-b border-[#166534]/30 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 doc-section-heading">
                <div>
                  <h3 className="font-black text-xs text-[#0A3622] uppercase tracking-wide">
                    {section.sectionName}
                  </h3>
                  {section.instructions && (
                    <p className="text-[10.5px] text-slate-600 font-medium italic mt-0.5">
                      {section.instructions}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-white border border-[#166534]/40 text-[#0A3622] font-mono shrink-0 whitespace-nowrap">
                  Total: {section.totalMarks} Marks
                </span>
              </div>

              {/* Questions List */}
              <div className="p-3.5 space-y-3.5 divide-y divide-slate-100">
                {section.questions.map((q) => {
                  const questionAnswerSpace = q.answerSpace || effectiveAnswerSpace;
                  const lineCount = q.answerSpaceLines || getAnswerLinesForMarks(q.marks, questionAnswerSpace);

                  return (
                    <div
                      key={q.questionNumber}
                      className="question-card pt-3 first:pt-0 space-y-2"
                    >
                      {/* Question Number, Text and Marks */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs text-slate-900 leading-relaxed flex-1">
                          <span className="font-black text-[#0A3622] mr-2">
                            Q{q.questionNumber}.
                          </span>
                          <FormulaRenderer
                            content={q.text}
                            inline
                            className="font-medium"
                          />
                        </div>
                        <span className="text-[10.5px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 shrink-0 font-mono">
                          [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                        </span>
                      </div>

                      {/* Optional Diagram / Illustration Image */}
                      {q.diagramUrl && (
                        <div className="pl-6 pt-1">
                          <figure className="inline-block border border-slate-300 rounded p-1 bg-white">
                            <img
                              src={q.diagramUrl}
                              alt={q.diagramCaption || `Diagram for Q${q.questionNumber}`}
                              className="max-h-48 max-w-full object-contain"
                            />
                            {q.diagramCaption && (
                              <figcaption className="text-[10px] text-slate-500 text-center mt-1">
                                {q.diagramCaption}
                              </figcaption>
                            )}
                          </figure>
                        </div>
                      )}

                      {/* Subquestions (a), (b), (c) */}
                      {q.subQuestions && q.subQuestions.length > 0 && (
                        <div className="pl-6 space-y-2 pt-1">
                          {q.subQuestions.map((sq, sqIdx) => (
                            <div key={sqIdx} className="flex items-start justify-between gap-2 text-xs">
                              <div className="flex-1">
                                <span className="font-bold text-slate-800 mr-1.5">{sq.subNumber}</span>
                                <FormulaRenderer content={sq.text} inline />
                              </div>
                              <span className="text-[10px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                                [{sq.marks} M]
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Multiple Choice Options Grid */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className="text-xs text-slate-800 bg-slate-50/70 border border-slate-200 rounded px-2.5 py-1 flex items-center gap-1.5"
                            >
                              <FormulaRenderer content={opt} inline />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Configurable Student Answer Space (Only when NOT in Answer Key mode) */}
                      {!isTeacherVersion && (
                        <>
                          {/* Ruled Writing Lines */}
                          {questionAnswerSpace === 'lines' && lineCount > 0 && (
                            <div className="pl-6 pt-2 space-y-1">
                              {Array.from({ length: lineCount }).map((_, lIdx) => (
                                <div key={lIdx} className="ruled-answer-line" />
                              ))}
                            </div>
                          )}

                          {/* Blank Answer Box */}
                          {questionAnswerSpace === 'box' && (
                            <div className="pl-6 pt-2">
                              <div
                                className="border border-slate-300 rounded p-2 bg-slate-50/30"
                                style={{ minHeight: `${Math.max(60, q.marks * 25)}px` }}
                              />
                            </div>
                          )}

                          {/* Diagram Drawing Workspace */}
                          {(questionAnswerSpace === 'diagram' || q.requiresDiagram) && (
                            <div className="pl-6 pt-2">
                              <div className="diagram-workspace">
                                <span>Draw and label neat scientific diagram here</span>
                              </div>
                            </div>
                          )}

                          {/* Calculation / Rough Work Space */}
                          {questionAnswerSpace === 'calculation' && (
                            <div className="pl-6 pt-2">
                              <div className="calculation-workspace" />
                            </div>
                          )}
                        </>
                      )}

                      {/* Chapter Reference Tag (Small Subtle Metadata) */}
                      {q.chapter && (
                        <div className="flex items-center justify-between text-[9.5px] text-slate-400 pl-6 pt-0.5">
                          <span>Chapter: {q.chapter}</span>
                        </div>
                      )}

                      {/* Teacher Evaluation Scheme & Answer Key (Visible ONLY in Teacher Version) */}
                      {isTeacherVersion && q.answerKey && (
                        <div className="ml-6 mt-2 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                              Official Evaluation Scheme &amp; Solution Key:
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-800">
                              [Allocation: {q.marks} Marks]
                            </span>
                          </div>
                          <FormulaRenderer
                            content={q.answerKey}
                            className="text-[11px] text-emerald-950 font-mono leading-relaxed bg-white/70 p-2 rounded border border-emerald-200"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </DocumentLayout>
  );
};
