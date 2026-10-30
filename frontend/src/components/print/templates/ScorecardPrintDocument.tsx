import React from 'react';
import { Calendar } from 'lucide-react';
import { PrintLayout } from '../PrintLayout';
import { StudentScorecard } from '../../../types/scorecard';

export interface ScorecardPrintDocumentProps {
  scorecard: StudentScorecard;
  selectedSubject?: 'ALL' | 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | string;
  isForPreview?: boolean;
}

export const ScorecardPrintDocument: React.FC<ScorecardPrintDocumentProps> = ({
  scorecard,
  selectedSubject,
  isForPreview = false,
}) => {
  const isSubjectFiltered = Boolean(selectedSubject && selectedSubject !== 'ALL');
  const targetSubject = isSubjectFiltered
    ? scorecard.subjectList.find(
        (s) => s.subjectName.toLowerCase() === selectedSubject?.toLowerCase()
      )
    : null;

  // Filtered subject list: either just targetSubject, or all subjects
  const subjectListToDisplay = targetSubject
    ? [targetSubject]
    : scorecard.subjectList;

  const totalMaxMarks = subjectListToDisplay.reduce((acc, s) => acc + s.totalMaxMarks, 0);
  const totalObtainedMarks = subjectListToDisplay.reduce((acc, s) => acc + s.totalMarksObtained, 0);
  const overallPercentage =
    totalMaxMarks > 0
      ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1))
      : targetSubject
      ? targetSubject.averagePercentage
      : scorecard.overallPercentage;

  const documentTitle = isSubjectFiltered && targetSubject
    ? `OFFICIAL STUDENT ACADEMIC SCORECARD — ${targetSubject.subjectName.toUpperCase()}`
    : 'OFFICIAL STUDENT ACADEMIC SCORECARD & EVALUATION REPORT';

  const documentSubtitle = isSubjectFiltered && targetSubject
    ? `Certified Secondary Board Evaluation, ${targetSubject.subjectName} Test Ledger & Faculty Assessment`
    : 'Certified Secondary Board Evaluation, Subject Ledger & Cumulative Breakdown';

  const reportCategory = isSubjectFiltered && targetSubject
    ? `${targetSubject.subjectName.toUpperCase()} SCORECARD`
    : 'CERTIFIED SCORECARD';

  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (pct >= 70) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (pct >= 50) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case 'physics':
        return { icon: '⚛️', bg: 'bg-purple-100 border-purple-200 text-purple-700' };
      case 'chemistry':
        return { icon: '🧪', bg: 'bg-emerald-100 border-emerald-200 text-emerald-700' };
      case 'biology':
        return { icon: '🧬', bg: 'bg-rose-100 border-rose-200 text-rose-700' };
      case 'mathematics':
      case 'maths':
        return { icon: '📐', bg: 'bg-blue-100 border-blue-200 text-blue-700' };
      default:
        return { icon: '📚', bg: 'bg-slate-100 border-slate-200 text-slate-700' };
    }
  };

  return (
    <PrintLayout
      documentTitle={documentTitle}
      documentSubtitle={documentSubtitle}
      reportCategory={reportCategory}
      metadata={{
        studentName: scorecard.studentName,
        studentId: scorecard.studentRoll,
        className: scorecard.className,
        boardName: scorecard.boardName,
        batchName: scorecard.batchName,
        academicYear: 'AY 2024–2025 (Term 2)',
        ...(isSubjectFiltered && targetSubject ? { subject: targetSubject.subjectName } : {}),
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Certified Academic Scorecard issued by Infinite Tutorial Academic Directorate. Certified Teacher and Parent evaluated record."
    >
      {/* Student Identity Brief Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-50 border border-slate-300 rounded-xl mb-4 gap-2.5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center font-black text-base sm:text-lg text-slate-700 flex-shrink-0 overflow-hidden">
            {scorecard.photoUrl ? (
              <img src={scorecard.photoUrl} alt={scorecard.studentName} className="w-full h-full object-cover" />
            ) : (
              <span>{scorecard.studentName.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-[#0A3622]">{scorecard.studentName}</h3>
              <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800">
                {scorecard.studentRoll}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">
              Class: <strong>{scorecard.className}</strong> &bull; Board: <strong>{scorecard.boardName}</strong> &bull; Batch: <strong>{scorecard.batchName}</strong>
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className="text-[9px] uppercase font-bold text-slate-500 block">
            {isSubjectFiltered && targetSubject ? `${targetSubject.subjectName} Overall` : 'Cumulative Score'}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5 justify-start sm:justify-end">
            <span className="text-lg sm:text-xl font-black text-[#0A3622]">{overallPercentage}%</span>
            <span className="text-[10px] text-slate-500 font-bold">
              ({totalObtainedMarks}/{totalMaxMarks})
            </span>
          </div>
        </div>
      </div>

      {/* EXACT CARDS MATCHING USER DESIGN */}
      {subjectListToDisplay.map((subScorecard) => {
        const iconMeta = getSubjectIcon(subScorecard.subjectName);
        return (
          <div
            key={subScorecard.subjectName}
            className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden mb-5 break-inside-avoid"
          >
            {/* Subject Section Header & Stats (Exact layout from user screenshot) */}
            <div className="p-3 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-9 sm:w-11 h-9 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl border shadow-xs flex-shrink-0 ${iconMeta.bg}`}>
                  <span>{iconMeta.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight">
                    {subScorecard.subjectName} Test Evaluation Ledger
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Syllabus portion tests, certified evaluations, and faculty notes.
                  </p>
                </div>
              </div>

              {/* Subject KPIs */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                <div className="bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-center min-w-[55px] shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">TESTS</span>
                  <span className="text-xs font-black text-slate-900">{subScorecard.totalTests}</span>
                </div>
                <div className="bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-center min-w-[65px] shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">AVERAGE</span>
                  <span className="text-xs font-black text-blue-700">{subScorecard.averagePercentage}%</span>
                </div>
                <div className="bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-center min-w-[65px] shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">HIGHEST</span>
                  <span className="text-xs font-black text-emerald-700">{subScorecard.highestPercentage}%</span>
                </div>
                <div className="bg-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-center min-w-[80px] shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">MARKS TOTAL</span>
                  <span className="text-xs font-black text-slate-900">
                    {subScorecard.totalMarksObtained} / {subScorecard.totalMaxMarks}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Ledger Table (Exact columns & rows from user screenshot) */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase text-[10.5px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">TEST NAME &amp; DATE</th>
                    <th className="px-4 py-3 text-left">CHAPTER / PORTION</th>
                    <th className="px-4 py-3 text-center">MAX MARKS</th>
                    <th className="px-4 py-3 text-center">OBTAINED</th>
                    <th className="px-4 py-3 text-center">PERCENTAGE</th>
                    <th className="px-4 py-3 text-left">FACULTY IN-CHARGE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {subScorecard.tests.map((testItem, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      {/* Test Name & Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs">{testItem.testName}</div>
                        <div className="text-slate-500 flex items-center mt-0.5 text-[10.5px] font-medium">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {testItem.date}
                        </div>
                      </td>

                      {/* Chapter / Portion with Note */}
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <div className="font-semibold text-slate-900">{testItem.chapter}</div>
                        {testItem.remarks && (
                          <div className="text-[10px] text-slate-500 italic mt-0.5">
                            Note: {testItem.remarks}
                          </div>
                        )}
                      </td>

                      {/* Max Marks */}
                      <td className="px-4 py-3 whitespace-nowrap text-center font-semibold text-slate-600">
                        {testItem.maxMarks}
                      </td>

                      {/* Marks Obtained */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="font-black text-slate-900 text-xs">{testItem.marksObtained}</span>
                      </td>

                      {/* Percentage Pill */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPercentageColor(
                            testItem.percentage
                          )}`}
                        >
                          {testItem.percentage}%
                        </span>
                      </td>

                      {/* Faculty In-Charge */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium text-xs">
                        {testItem.teacher || `Prof. Rajesh Sharma (${subScorecard.subjectName})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </PrintLayout>
  );
};
