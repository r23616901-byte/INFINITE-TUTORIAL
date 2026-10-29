import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { QuestionPaper } from '../../../services/curriculumService';

export interface QuestionPaperPrintDocumentProps {
  paper: QuestionPaper;
  showAnswerKey?: boolean;
  studentName?: string;
  rollNumber?: string;
  isForPreview?: boolean;
}

export const QuestionPaperPrintDocument: React.FC<QuestionPaperPrintDocumentProps> = ({
  paper,
  showAnswerKey = false,
  studentName,
  rollNumber,
  isForPreview = false,
}) => {
  return (
    <PrintLayout
      documentTitle={`${paper.boardName.toUpperCase()} — ${paper.className.toUpperCase()} EXAMINATION`}
      documentSubtitle={`${paper.title} • Subject: ${paper.subject} (${paper.subjectCode})`}
      reportCategory="OFFICIAL QUESTION PAPER"
      metadata={{
        className: paper.className,
        boardName: paper.boardName,
        subjectName: `${paper.subject} (${paper.subjectCode})`,
        academicYear: paper.academicYear,
        duration: paper.duration,
      }}
      customDate={new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}
      isForPreview={isForPreview}
      customFooterNote="Karnataka Secondary Education Curriculum Benchmark Examination. Official Question Paper of Infinite Tutorial."
    >
      {/* Exam Details Strip */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Duration</span>
            <span className="font-bold text-slate-900">{paper.duration}</span>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Maximum Marks</span>
            <span className="font-bold text-[#0A3622] text-sm">{paper.totalMarks} Marks</span>
          </div>
          <div className="h-6 w-px bg-slate-300" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Subject Code</span>
            <span className="font-mono font-bold text-slate-800">{paper.subjectCode}</span>
          </div>
        </div>

        {/* Candidate Fill-in Area */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="border border-dashed border-slate-400 rounded px-2.5 py-1 bg-white">
            <span className="text-slate-500">Student: </span>
            <span className="font-bold text-slate-900">{studentName || '____________________'}</span>
          </div>
          <div className="border border-dashed border-slate-400 rounded px-2.5 py-1 bg-white">
            <span className="text-slate-500">Roll No: </span>
            <span className="font-mono font-bold text-slate-900">{rollNumber || '__________'}</span>
          </div>
        </div>
      </div>

      {/* General Instructions */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
          General Instructions:
        </h4>
        <ol className="list-decimal list-inside space-y-0.5 text-slate-700 text-[11px] pl-1 leading-relaxed">
          {paper.generalInstructions.map((instruction, idx) => (
            <li key={idx}>{instruction}</li>
          ))}
        </ol>
      </div>

      {/* Question Paper Sections */}
      <div className="space-y-4">
        {paper.sections.map((section, sIdx) => (
          <div key={sIdx} className="border border-slate-300 rounded-lg overflow-hidden bg-white">
            {/* Section Header */}
            <div className="bg-slate-100 border-b border-slate-300 px-3 py-2 flex items-center justify-between">
              <div>
                <h3 className="font-black text-xs text-slate-900 uppercase tracking-wide">
                  {section.sectionName}
                </h3>
                <p className="text-[10px] text-slate-600 font-medium italic mt-0.5">
                  {section.instructions}
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-mono">
                Total: {section.totalMarks} Marks
              </span>
            </div>

            {/* Questions List */}
            <div className="p-3 space-y-3 divide-y divide-slate-100">
              {section.questions.map((q) => (
                <div key={q.questionNumber} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs text-slate-900 leading-relaxed flex-1">
                      <span className="font-black text-slate-800 mr-2">Q{q.questionNumber}.</span>
                      <span className="whitespace-pre-line font-medium">{q.text}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0 font-mono">
                      [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                    </span>
                  </div>

                  {/* MCQ Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pl-6 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded px-2.5 py-1"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chapter badge */}
                  <div className="flex items-center justify-between text-[9.5px] text-slate-400 pl-6">
                    <span>Chapter: {q.chapter}</span>
                  </div>

                  {/* Answer Key / Evaluation Scheme */}
                  {showAnswerKey && (
                    <div className="ml-6 mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                        Official Evaluation Solution &amp; Key:
                      </span>
                      <p className="text-[11px] text-emerald-950 font-mono whitespace-pre-line leading-relaxed">
                        {q.answerKey}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PrintLayout>
  );
};
