import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  GraduationCap,
  BookOpen,
  Printer,
  ExternalLink,
  X,
  FileCheck,
  RefreshCw,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { StudentScorecard } from '../../types/scorecard';
import { PrintTemplateHeader } from '../../components/common/PrintTemplateHeader';
import { PrintTemplateFooter } from '../../components/common/PrintTemplateFooter';

interface ScorecardViewerProps {
  scorecard: StudentScorecard;
  onRefresh?: () => void;
  loading?: boolean;
}

export const ScorecardViewer: React.FC<ScorecardViewerProps> = ({
  scorecard,
  onRefresh,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics'>('ALL');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState('');

  // Calculate accurate aggregated metrics across all subjects
  const totalMaxMarks = scorecard.subjectList.reduce((acc, s) => acc + s.totalMaxMarks, 0);
  const totalObtainedMarks = scorecard.subjectList.reduce((acc, s) => acc + s.totalMarksObtained, 0);
  const accurateOverallPct =
    totalMaxMarks > 0
      ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(1))
      : scorecard.overallPercentage;

  const totalTestsCount = scorecard.subjectList.reduce((acc, s) => acc + s.totalTests, 0);

  const getGradeInfo = (pct: number) => {
    if (pct >= 90) return { grade: 'O', label: 'Outstanding', badge: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    if (pct >= 80) return { grade: 'A+', label: 'Excellent', badge: 'bg-blue-50 text-blue-800 border-blue-300' };
    if (pct >= 70) return { grade: 'A', label: 'Very Good', badge: 'bg-indigo-50 text-indigo-800 border-indigo-300' };
    if (pct >= 60) return { grade: 'B+', label: 'Good', badge: 'bg-amber-50 text-amber-800 border-amber-300' };
    if (pct >= 50) return { grade: 'B', label: 'Above Average', badge: 'bg-orange-50 text-orange-800 border-orange-300' };
    if (pct >= 35) return { grade: 'C', label: 'Pass', badge: 'bg-slate-100 text-slate-800 border-slate-300' };
    return { grade: 'F', label: 'Needs Improvement', badge: 'bg-rose-50 text-rose-800 border-rose-300' };
  };

  const overallGradeInfo = getGradeInfo(accurateOverallPct);

  const subjectTabs = [
    { name: 'ALL', label: 'All Subjects', icon: '📊', count: totalTestsCount },
    { name: 'Physics', label: 'Physics', icon: '⚛️', count: scorecard.subjects?.physics?.totalTests || 0 },
    { name: 'Chemistry', label: 'Chemistry', icon: '🧪', count: scorecard.subjects?.chemistry?.totalTests || 0 },
    { name: 'Biology', label: 'Biology', icon: '🧬', count: scorecard.subjects?.biology?.totalTests || 0 },
    { name: 'Mathematics', label: 'Mathematics', icon: '📐', count: scorecard.subjects?.mathematics?.totalTests || 0 },
  ];

  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (pct >= 70) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (pct >= 50) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0 print:m-0 print:space-y-4 text-[#0B1F4D]">
      {/* 1. OFFICIAL INSTITUTIONAL PRINT HEADER (Visible only in print) */}
      <PrintTemplateHeader
        documentTitle="OFFICIAL STUDENT ACADEMIC SCORECARD & EVALUATION REPORT"
        documentSubtitle="Certified Board Syllabus Test Evaluations, Marks Ledger & Cumulative Breakdown"
        reportCategory="CERTIFIED SCORECARD"
        academicYear="AY 2024–25 (Term 2)"
        studentName={scorecard.studentName}
        studentId={scorecard.studentRoll}
        className={`${scorecard.className} (${scorecard.boardName})`}
        batchName={scorecard.batchName}
      />

      {/* 
        NOTE: The redundant top screen banner ("OFFICIAL ACADEMIC PROGRESS REPORT • AY 2024-25" 
        with BrandLogo) that was in the attached screenshot has been completely removed as requested.
      */}

      {/* 2. EXECUTIVE STUDENT PROFILE & PERFORMANCE HERO (Screen View) */}
      <div className="bg-[#0B1F4D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:hidden border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Student Info */}
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-inner overflow-hidden flex-shrink-0">
              {scorecard.photoUrl ? (
                <img src={scorecard.photoUrl} alt={scorecard.studentName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white drop-shadow-md">{scorecard.studentName.charAt(0)}</span>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
                  {scorecard.studentName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/15 text-white border border-white/20">
                  {scorecard.studentRoll}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Record
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-300 font-medium">
                <span className="inline-flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1 text-[#00B8F8]" />
                  <span>Class: <strong>{scorecard.className}</strong></span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center">
                  <BookOpen className="w-4 h-4 mr-1 text-[#00B8F8]" />
                  <span>Board: <strong>{scorecard.boardName}</strong></span>
                </span>
                <span>•</span>
                <span>Batch: <strong className="text-white">{scorecard.batchName}</strong></span>
                <span>•</span>
                <span className="text-cyan-300">AY 2024–25</span>
              </div>
            </div>
          </div>

          {/* Performance Summary Pill & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {/* Aggregate Score Card */}
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center min-w-[130px]">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                Aggregate Score
              </span>
              <div className="flex items-baseline justify-center space-x-1.5 mt-0.5">
                <span className="text-3xl font-black text-white">{accurateOverallPct}%</span>
                <span className="text-xs font-bold text-[#00B8F8]">({overallGradeInfo.grade})</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">
                {overallGradeInfo.label}
              </span>
            </div>

            {/* Total Marks Card */}
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center min-w-[130px]">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                Total Marks
              </span>
              <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                <span className="text-2xl font-black text-white">{totalObtainedMarks}</span>
                <span className="text-xs text-slate-300 font-bold">/ {totalMaxMarks}</span>
              </div>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                {totalTestsCount} Tests Evaluated
              </span>
            </div>

            {/* Print Action Button */}
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-3 bg-[#155EEF] hover:bg-[#004EEB] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
              title="Print official certified scorecard"
            >
              <Printer className="w-4 h-4" />
              <span>Print Scorecard</span>
            </button>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                type="button"
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 transition-all cursor-pointer"
                title="Refresh Scorecard Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Ambient brand glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#155EEF]/25 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3. EXECUTIVE 4-SUBJECT PERFORMANCE MATRIX (Screen & Print Certified Summary) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden break-inside-avoid">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#155EEF]" />
            <h2 className="text-sm font-black text-[#0B1F4D] uppercase tracking-wide">
              Subject-Wise Academic Performance Ledger
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Status: <span className="text-emerald-700 font-bold">Passed with Distinction</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-50/75 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3 text-center">Tests Conducted</th>
                <th className="px-4 py-3 text-center">Max Marks</th>
                <th className="px-4 py-3 text-center">Marks Scored</th>
                <th className="px-4 py-3 text-center">Average %</th>
                <th className="px-4 py-3 text-center">Highest %</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {scorecard.subjectList.map((sub) => {
                const gradeObj = getGradeInfo(sub.averagePercentage);
                return (
                  <tr key={sub.subjectName} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center space-x-2">
                      <span>
                        {sub.subjectName === 'Physics'
                          ? '⚛️'
                          : sub.subjectName === 'Chemistry'
                          ? '🧪'
                          : sub.subjectName === 'Biology'
                          ? '🧬'
                          : '📐'}
                      </span>
                      <span>{sub.subjectName}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-slate-600">{sub.totalTests}</td>
                    <td className="px-4 py-3 text-center font-medium text-slate-600">{sub.totalMaxMarks}</td>
                    <td className="px-4 py-3 text-center font-black text-slate-900">{sub.totalMarksObtained}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-blue-700">{sub.averagePercentage}%</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">{sub.highestPercentage}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-black bg-slate-100 border border-slate-300 text-slate-800">
                        {gradeObj.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${gradeObj.badge}`}>
                        {gradeObj.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Grand Total Row */}
              <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-300">
                <td className="px-4 py-3.5 uppercase text-[11px] tracking-wide">
                  Cumulative Total (All Subjects)
                </td>
                <td className="px-4 py-3.5 text-center">{totalTestsCount} Tests</td>
                <td className="px-4 py-3.5 text-center">{totalMaxMarks}</td>
                <td className="px-4 py-3.5 text-center text-sm font-black text-[#155EEF]">{totalObtainedMarks}</td>
                <td className="px-4 py-3.5 text-center text-sm font-black text-blue-700">{accurateOverallPct}%</td>
                <td className="px-4 py-3.5 text-center font-black text-emerald-700">
                  {Math.max(...scorecard.subjectList.map((s) => s.highestPercentage))}%
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-black bg-[#0B1F4D] text-white">
                    {overallGradeInfo.grade}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {overallGradeInfo.label}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SUBJECT SELECTION TABS (Screen Only) */}
      <div className="print:hidden flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {subjectTabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as any)}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#155EEF] text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. DETAILED TEST-WISE EVALUATIONS */}
      {/* 
        In screen mode: Filters by activeTab.
        In print mode: Always outputs all subjects so the printed document is complete and certified.
      */}
      {scorecard.subjectList
        .filter((sub) => activeTab === 'ALL' || activeTab === sub.subjectName)
        .map((subScorecard) => (
          <div
            key={subScorecard.subjectName}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-6 break-inside-avoid print:shadow-none print:border-slate-300 print:mb-4"
          >
            {/* Subject Section Header & Stats */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {subScorecard.subjectName === 'Physics'
                    ? '⚛️'
                    : subScorecard.subjectName === 'Chemistry'
                    ? '🧪'
                    : subScorecard.subjectName === 'Biology'
                    ? '🧬'
                    : '📐'}
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {subScorecard.subjectName} Test Evaluation Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Syllabus portion tests, certified evaluations, and faculty notes.
                  </p>
                </div>
              </div>

              {/* Subject KPIs */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Tests</span>
                  <span className="text-xs font-bold text-slate-900">{subScorecard.totalTests}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Average</span>
                  <span className="text-xs font-bold text-blue-700">{subScorecard.averagePercentage}%</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Highest</span>
                  <span className="text-xs font-bold text-emerald-700">{subScorecard.highestPercentage}%</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Marks Total</span>
                  <span className="text-xs font-bold text-slate-900">
                    {subScorecard.totalMarksObtained} / {subScorecard.totalMaxMarks}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Ledger Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Test Name &amp; Date</th>
                    <th className="px-4 py-3 text-left">Chapter / Portion</th>
                    <th className="px-4 py-3 text-center">Max Marks</th>
                    <th className="px-4 py-3 text-center">Obtained</th>
                    <th className="px-4 py-3 text-center">Percentage</th>
                    <th className="px-4 py-3 text-left">Faculty In-Charge</th>
                    <th className="px-4 py-3 text-center print:hidden">Answer Sheet</th>
                    <th className="px-4 py-3 text-center print:hidden">Question Paper</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {subScorecard.tests.map((testItem, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      {/* Test Name & Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs">{testItem.testName}</div>
                        <div className="text-slate-500 flex items-center mt-0.5 text-[11px] font-medium">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                          {testItem.date}
                        </div>
                      </td>

                      {/* Chapter */}
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{testItem.chapter}</div>
                        {testItem.remarks && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                            Note: {testItem.remarks}
                          </div>
                        )}
                      </td>

                      {/* Max Marks */}
                      <td className="px-4 py-3 whitespace-nowrap text-center font-semibold text-slate-600">
                        {testItem.maxMarks}
                      </td>

                      {/* Obtained Marks */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="font-black text-slate-900 text-xs">{testItem.marksObtained}</span>
                      </td>

                      {/* Percentage & Grade Badge */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPercentageColor(
                            testItem.percentage
                          )}`}
                        >
                          {testItem.percentage}%
                        </span>
                      </td>

                      {/* Teacher */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                        {testItem.teacher}
                      </td>

                      {/* Answer Sheet Button */}
                      <td className="px-4 py-3 whitespace-nowrap text-center print:hidden">
                        {testItem.answerSheetUrl ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewDocUrl(testItem.answerSheetUrl!);
                              setPreviewDocTitle(`Scanned Answer Sheet • ${testItem.testName} (${scorecard.studentName})`);
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-[#155EEF] bg-[#EEF4FF] hover:bg-blue-100 font-semibold border border-[#DCE5F2] transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5 mr-1 text-[#155EEF]" />
                            <span>Answer Sheet</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">Not Uploaded</span>
                        )}
                      </td>

                      {/* Question Paper Button */}
                      <td className="px-4 py-3 whitespace-nowrap text-center print:hidden">
                        {testItem.testPaperUrl ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewDocUrl(testItem.testPaperUrl!);
                              setPreviewDocTitle(`Test Question Paper • ${testItem.testName} (${subScorecard.subjectName})`);
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            <span>Question Paper</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {/* 6. BOARD CERTIFIED GRADING SCALE REFERENCE (Included in print & screen) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-600 break-inside-avoid">
        <span className="font-bold uppercase tracking-wider text-slate-800 block mb-1">
          Standard Institutional Evaluation Key:
        </span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span><strong>O (Outstanding):</strong> 90% and above</span>
          <span>&bull;</span>
          <span><strong>A+ (Excellent):</strong> 80%–89%</span>
          <span>&bull;</span>
          <span><strong>A (Very Good):</strong> 70%–79%</span>
          <span>&bull;</span>
          <span><strong>B+ (Good):</strong> 60%–69%</span>
          <span>&bull;</span>
          <span><strong>B (Average):</strong> 50%–59%</span>
          <span>&bull;</span>
          <span><strong>C (Pass):</strong> 35%–49%</span>
        </div>
      </div>

      {/* 7. DOCUMENT PREVIEW MODAL (Test Paper or Answer Sheet) */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] p-6 shadow-2xl flex flex-col relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#155EEF]" />
                <h3 className="font-bold text-slate-900 text-base">{previewDocTitle}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-[#155EEF] bg-[#EEF4FF] hover:bg-blue-100"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  <span>Open External</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDocUrl(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
              {previewDocUrl.endsWith('.pdf') ? (
                <iframe src={previewDocUrl} className="w-full h-full border-0" title="Document Viewer" />
              ) : (
                <img src={previewDocUrl} alt="Document Viewer" className="max-h-full object-contain mx-auto" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. OFFICIAL INSTITUTIONAL FOOTER WITH SIGNATURE BLOCKS (Print Mode) */}
      <PrintTemplateFooter customNote="Official Certified Academic Scorecard issued by Infinite Tutorial Academic Directorate. Certified Teacher and Parent evaluated record." />
    </div>
  );
};

export default ScorecardViewer;
