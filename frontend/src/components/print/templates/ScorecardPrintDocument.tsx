import React from 'react';
import { PrintLayout } from '../PrintLayout';
import { StudentScorecard } from '../../../types/scorecard';
import { getAcademicGrade } from '../../../utils/printUtils';

export interface ScorecardPrintDocumentProps {
  scorecard: StudentScorecard;
  isForPreview?: boolean;
}

export const ScorecardPrintDocument: React.FC<ScorecardPrintDocumentProps> = ({
  scorecard,
  isForPreview = false,
}) => {
  const totalMaxMarks = scorecard.subjectList.reduce((acc, s) => acc + s.totalMaxMarks, 0);
  const totalObtainedMarks = scorecard.subjectList.reduce((acc, s) => acc + s.totalMarksObtained, 0);
  const overallPercentage =
    totalMaxMarks > 0
      ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1))
      : scorecard.overallPercentage;

  const overallGrade = getAcademicGrade(overallPercentage);
  const totalTests = scorecard.subjectList.reduce((acc, s) => acc + s.totalTests, 0);

  return (
    <PrintLayout
      documentTitle="OFFICIAL STUDENT ACADEMIC SCORECARD & EVALUATION REPORT"
      documentSubtitle="Certified Secondary Board Evaluation, Subject Ledger & Cumulative Breakdown"
      reportCategory="CERTIFIED SCORECARD"
      metadata={{
        studentName: scorecard.studentName,
        studentId: scorecard.studentRoll,
        className: scorecard.className,
        boardName: scorecard.boardName,
        batchName: scorecard.batchName,
        academicYear: 'AY 2024–2025 (Term 2)',
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Certified Academic Scorecard issued by Infinite Tutorial Academic Directorate. Certified Teacher and Parent evaluated record."
    >
      {/* 1. Student Identity Header & Overall Performance Hero */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-300 rounded-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center font-black text-xl text-slate-700 flex-shrink-0 overflow-hidden">
            {scorecard.photoUrl ? (
              <img src={scorecard.photoUrl} alt={scorecard.studentName} className="w-full h-full object-cover" />
            ) : (
              <span>{scorecard.studentName.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#0A3622]">{scorecard.studentName}</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800">
                {scorecard.studentRoll}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              {scorecard.className} &bull; {scorecard.boardName} &bull; Batch: {scorecard.batchName}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Secondary Board Coaching &bull; Total Conducted Assessments: {totalTests}
            </p>
          </div>
        </div>

        {/* Aggregate KPI */}
        <div className="text-right flex flex-col items-end border-l border-slate-200 pl-4 flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500">Aggregate Score</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#0A3622]">{overallPercentage}%</span>
            <span className="text-xs text-slate-500 font-bold">
              ({totalObtainedMarks}/{totalMaxMarks})
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-300 mt-1">
            Grade {overallGrade.grade} &bull; {overallGrade.label}
          </span>
        </div>
      </div>

      {/* 2. Executive 4-Subject Performance Ledger */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
            Subject-Wise Academic Performance Ledger
          </h4>
          <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            Status: Passed with Distinction
          </span>
        </div>

        <table className="w-full text-left text-xs border border-slate-300">
          <thead>
            <tr>
              <th className="py-2 px-3">Subject Name</th>
              <th className="py-2 px-3 text-center">Tests Conducted</th>
              <th className="py-2 px-3 text-center">Maximum Marks</th>
              <th className="py-2 px-3 text-center">Marks Scored</th>
              <th className="py-2 px-3 text-center">Average %</th>
              <th className="py-2 px-3 text-center">Highest %</th>
              <th className="py-2 px-3 text-center">Grade</th>
              <th className="py-2 px-3 text-center">Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {scorecard.subjectList.map((sub) => {
              const grade = getAcademicGrade(sub.averagePercentage);
              return (
                <tr key={sub.subjectName} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {sub.subjectName}
                  </td>
                  <td className="py-2 px-3 text-center text-slate-700">{sub.totalTests}</td>
                  <td className="py-2 px-3 text-center text-slate-700">{sub.totalMaxMarks}</td>
                  <td className="py-2 px-3 text-center font-bold text-slate-900">
                    {sub.totalMarksObtained}
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-[#0A3622]">
                    {sub.averagePercentage}%
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700">
                    {sub.highestPercentage}%
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="px-2 py-0.5 font-bold rounded bg-slate-100 border border-slate-300 text-slate-800 text-[10px]">
                      {grade.grade}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-[10px] font-semibold text-slate-700">
                      {grade.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
            <tr>
              <td className="py-2 px-3 font-black uppercase text-[#0A3622]">
                Total / Overall Aggregate
              </td>
              <td className="py-2 px-3 text-center">{totalTests}</td>
              <td className="py-2 px-3 text-center">{totalMaxMarks}</td>
              <td className="py-2 px-3 text-center font-black text-[#0A3622]">
                {totalObtainedMarks}
              </td>
              <td className="py-2 px-3 text-center font-black text-[#0A3622]">
                {overallPercentage}%
              </td>
              <td className="py-2 px-3 text-center text-emerald-800">
                {Math.max(...scorecard.subjectList.map((s) => s.highestPercentage))}%
              </td>
              <td className="py-2 px-3 text-center font-black">{overallGrade.grade}</td>
              <td className="py-2 px-3 text-center text-emerald-900">
                {overallGrade.label}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 3. Detailed Syllabus Tests & Evaluations Ledger */}
      {scorecard.subjectList.some((s) => s.tests && s.tests.length > 0) && (
        <div className="print-break-inside-avoid">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-black text-[#0A3622] uppercase tracking-wide">
              Detailed Assessment Breakdown by Subject &amp; Portion
            </h4>
          </div>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead>
              <tr>
                <th className="py-1.5 px-2.5">Date</th>
                <th className="py-1.5 px-2.5">Subject</th>
                <th className="py-1.5 px-2.5">Test Code &amp; Name</th>
                <th className="py-1.5 px-2.5">Chapter / Syllabus Portion</th>
                <th className="py-1.5 px-2.5 text-center">Max Marks</th>
                <th className="py-1.5 px-2.5 text-center">Scored</th>
                <th className="py-1.5 px-2.5 text-center">Percentage</th>
                <th className="py-1.5 px-2.5 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {scorecard.subjectList.flatMap((s) =>
                s.tests.map((test) => {
                  const testGrade = getAcademicGrade(test.percentage);
                  return (
                    <tr key={test.testId} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-2.5 font-mono text-[10px] text-slate-700">{test.date}</td>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-900">{s.subjectName}</td>
                      <td className="py-1.5 px-2.5">
                        <span className="font-bold text-slate-900">{test.testName}</span>
                        <span className="font-mono text-[9px] text-slate-500 block">{test.testCode}</span>
                      </td>
                      <td className="py-1.5 px-2.5 text-slate-700">{test.chapter || 'Prescribed Syllabus'}</td>
                      <td className="py-1.5 px-2.5 text-center text-slate-600">{test.maxMarks}</td>
                      <td className="py-1.5 px-2.5 text-center font-bold text-slate-900">{test.marksObtained}</td>
                      <td className="py-1.5 px-2.5 text-center font-bold text-[#0A3622]">{test.percentage}%</td>
                      <td className="py-1.5 px-2.5 text-center font-bold">{testGrade.grade}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Board Grading Scheme Reference Matrix */}
      <div className="p-2.5 bg-slate-50 border border-slate-300 rounded print-break-inside-avoid">
        <span className="text-[9px] font-black text-slate-700 uppercase tracking-wider block mb-1">
          Secondary Board Reference Grading Scale:
        </span>
        <div className="grid grid-cols-7 gap-1 text-center text-[8.5px]">
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">O (90-100%)</span>
            <span className="text-emerald-700 font-semibold">Outstanding</span>
          </div>
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">A+ (80-89%)</span>
            <span className="text-blue-700 font-semibold">Excellent</span>
          </div>
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">A (70-79%)</span>
            <span className="text-indigo-700 font-semibold">Very Good</span>
          </div>
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">B+ (60-69%)</span>
            <span className="text-amber-700 font-semibold">Good</span>
          </div>
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">B (50-59%)</span>
            <span className="text-orange-700 font-semibold">Above Average</span>
          </div>
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">C (35-49%)</span>
            <span className="text-slate-600 font-semibold">Pass</span>
          </div>
          <div className="p-1 bg-white border border-slate-200 rounded">
            <span className="font-bold text-slate-900 block">F (&lt;35%)</span>
            <span className="text-rose-700 font-semibold">Needs Focus</span>
          </div>
        </div>
      </div>
    </PrintLayout>
  );
};
