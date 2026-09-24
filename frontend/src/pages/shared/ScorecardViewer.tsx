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
} from 'lucide-react';
import { StudentScorecard } from '../../types/scorecard';
import { BrandLogo } from '../../components/common/BrandLogo';

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
  const [activeTab, setActiveTab] = useState<'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'ALL'>('Physics');
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState('');

  const subjectTabs = [
    { name: 'Physics', icon: '⚛️', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { name: 'Chemistry', icon: '🧪', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { name: 'Biology', icon: '🧬', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { name: 'Mathematics', icon: '📐', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { name: 'ALL', label: 'All Subjects View', icon: '📊', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  ];

  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (pct >= 70) return 'text-blue-700 bg-blue-100 border-blue-300';
    if (pct >= 50) return 'text-amber-700 bg-amber-100 border-amber-300';
    return 'text-rose-700 bg-rose-100 border-rose-300';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0 print:m-0">
      {/* Official Institutional Report Header (Step 64: Logo in PDF / Reports) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs print:border-b-2 print:border-slate-800 print:rounded-none print:shadow-none">
        <BrandLogo size="md" />
        <div className="text-center sm:text-right">
          <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full print:border-slate-400 print:text-black">
            OFFICIAL ACADEMIC PROGRESS REPORT &bull; AY 2024–25
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            Generated on {new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      {/* 1. STUDENT PROFILE HEADER (Step 21 Requirement: Student, Class, Board) */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:bg-white print:text-black print:border print:border-gray-300">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-extrabold text-white shadow-inner overflow-hidden print:border-gray-400 print:text-gray-900">
              {scorecard.photoUrl ? (
                <img src={scorecard.photoUrl} alt={scorecard.studentName} className="w-full h-full object-cover" />
              ) : (
                scorecard.studentName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{scorecard.studentName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/20 text-white border border-white/30 print:text-black">
                  {scorecard.studentRoll}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 print:border-emerald-600 print:text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Read-Only Record
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-sm text-indigo-200 print:text-gray-700 font-medium">
                <span className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1 text-indigo-300 print:text-gray-700" />
                  <strong>Class:</strong>&nbsp;{scorecard.className}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1 text-indigo-300 print:text-gray-700" />
                  <strong>Board:</strong>&nbsp;{scorecard.boardName}
                </span>
                <span>•</span>
                <span>Batch: {scorecard.batchName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center print:border-gray-400">
              <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold block print:text-gray-600">
                Overall GPA
              </span>
              <div className="flex items-baseline justify-center space-x-1 mt-0.5">
                <span className="text-3xl font-black">{scorecard.overallPercentage}%</span>
                <span className="text-xs font-bold text-emerald-300 print:text-emerald-700">({scorecard.overallGrade})</span>
              </div>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={loading}
                className="print:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-colors"
                title="Refresh Scorecard"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}

            <button
              onClick={handlePrint}
              className="print:hidden p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-colors"
              title="Print Scorecard"
            >
              <Printer className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* Ambient Gradient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. SUBJECT TABS (Physics, Chemistry, Biology, Mathematics) */}
      <div className="print:hidden flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {subjectTabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label || tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SUBJECT-WISE SECTIONS */}
      {scorecard.subjectList
        .filter((sub) => activeTab === 'ALL' || activeTab === sub.subjectName)
        .map((subScorecard) => (
          <div
            key={subScorecard.subjectName}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 page-break-inside-avoid"
          >
            {/* Subject Section Header & Stats */}
            <div className="p-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">
                    {subScorecard.subjectName} Scorecard
                  </h2>
                  <p className="text-xs text-gray-500">
                    Conducted tests, evaluated answer sheets, and faculty assessment.
                  </p>
                </div>
              </div>

              {/* Subject KPIs */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-center">
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase">Total Tests</span>
                  <span className="text-sm font-bold text-gray-900">{subScorecard.totalTests} Tests</span>
                </div>
                <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-center">
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase">Average Score</span>
                  <span className="text-sm font-bold text-indigo-700">{subScorecard.averagePercentage}%</span>
                </div>
                <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-center">
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase">Highest Score</span>
                  <span className="text-sm font-bold text-emerald-700">{subScorecard.highestPercentage}%</span>
                </div>
                <div className="bg-white px-3.5 py-2 rounded-xl border border-gray-200 text-center">
                  <span className="text-[11px] font-semibold text-gray-400 block uppercase">Marks Total</span>
                  <span className="text-sm font-bold text-gray-900">
                    {subScorecard.totalMarksObtained} / {subScorecard.totalMaxMarks}
                  </span>
                </div>
              </div>
            </div>

            {/* Comprehensive Table showing all 9 required fields */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Test Name & Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Chapter / Portion
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Max Marks
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Obtained Marks
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider print:hidden">
                      Answer Sheet
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider print:hidden">
                      Test Paper
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {subScorecard.tests.map((testItem, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      {/* 1. Test Name & 2. Date */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                        <div className="font-bold text-gray-900 text-sm">{testItem.testName}</div>
                        <div className="text-gray-500 flex items-center mt-0.5 font-medium">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          {testItem.date}
                        </div>
                      </td>

                      {/* 6. Chapter */}
                      <td className="px-5 py-3.5 text-xs text-gray-700 max-w-xs">
                        <div className="font-semibold text-gray-900 line-clamp-1">{testItem.chapter}</div>
                        {testItem.remarks && (
                          <div className="text-[11px] text-gray-500 italic mt-0.5 line-clamp-1">
                            Note: {testItem.remarks}
                          </div>
                        )}
                      </td>

                      {/* 3. Maximum Marks */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-gray-600">
                        {testItem.maxMarks}
                      </td>

                      {/* 4. Obtained Marks */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                        <span className="font-black text-gray-900 text-sm">{testItem.marksObtained}</span>
                      </td>

                      {/* 5. Percentage */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border ${getPercentageColor(
                            testItem.percentage
                          )}`}
                        >
                          {testItem.percentage}%
                        </span>
                      </td>

                      {/* 7. Teacher */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-600 font-medium">
                        {testItem.teacher}
                      </td>

                      {/* 8. Answer Sheet (scanned copy) */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-center text-xs print:hidden">
                        {testItem.answerSheetUrl ? (
                          <button
                            onClick={() => {
                              setPreviewDocUrl(testItem.answerSheetUrl!);
                              setPreviewDocTitle(`Scanned Answer Sheet • ${testItem.testName} (${scorecard.studentName})`);
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold border border-indigo-200 transition-colors"
                          >
                            <FileCheck className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                            Answer Sheet
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">Not Uploaded</span>
                        )}
                      </td>

                      {/* 9. Test Paper (original questions) */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-center text-xs print:hidden">
                        {testItem.testPaperUrl ? (
                          <button
                            onClick={() => {
                              setPreviewDocUrl(testItem.testPaperUrl!);
                              setPreviewDocTitle(`Test Question Paper • ${testItem.testName} (${subScorecard.subjectName})`);
                            }}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold border border-emerald-200 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Question Paper
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      {/* DOCUMENT PREVIEW MODAL (Test Paper or Answer Sheet) */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] p-6 shadow-2xl flex flex-col relative animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-base">{previewDocTitle}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open External
                </a>
                <button
                  onClick={() => setPreviewDocUrl(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
              {previewDocUrl.endsWith('.pdf') ? (
                <iframe src={previewDocUrl} className="w-full h-full border-0" title="Document Viewer" />
              ) : (
                <img src={previewDocUrl} alt="Document Viewer" className="max-h-full object-contain mx-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScorecardViewer;
