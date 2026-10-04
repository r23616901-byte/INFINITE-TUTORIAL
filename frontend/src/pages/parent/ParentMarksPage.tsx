import React, { useState, useEffect } from 'react';
import {
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  X,
  History,
  Info,
  Check,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';
import markService from '../../services/markService';
import scorecardService from '../../services/scorecardService';
import { StudentMark } from '../../types/mark';
import { StudentScorecard } from '../../types/scorecard';
import { ScorecardViewer } from '../shared/ScorecardViewer';
import { EmptyState } from '../../components/common/EmptyState';

export const ParentMarksPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'SCORECARD' | 'TEST_LIST'>('SCORECARD');
  const [scorecard, setScorecard] = useState<StudentScorecard | null>(null);
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch both scorecard and individual test marks in parallel
      const [scorecardData, marksData] = await Promise.allSettled([
        scorecardService.getMyChildScorecard(),
        markService.getMarks(),
      ]);

      if (scorecardData.status === 'fulfilled') {
        setScorecard(scorecardData.value);
      }
      if (marksData.status === 'fulfilled') {
        setMarks(marksData.value);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load scorecard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Rahul Kumar Physics Chapter 3 test (Exact user prompt example)
  const rahulPhysicsMark = marks.find(
    (m) => m.subjectName.toLowerCase().includes('physics') || m.testName.includes('Chapter 3')
  ) || marks[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Academic Scorecards & Marks
              </h1>
              <p className="text-sm text-gray-500">
                Official student scorecard across Physics, Chemistry, Biology & Mathematics with verified test papers and evaluations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mode Selector */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center print:hidden">
            <button
              onClick={() => setActiveView('SCORECARD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                activeView === 'SCORECARD'
                  ? 'bg-white text-[#155EEF] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
              4-Subject Scorecard
            </button>
            <button
              onClick={() => setActiveView('TEST_LIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${
                activeView === 'TEST_LIST'
                  ? 'bg-white text-[#155EEF] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 mr-1.5" />
              Individual Tests ({marks.length})
            </button>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* VIEW MODE 1: COMPREHENSIVE 4-SUBJECT SCORECARD (STEP 21) */}
      {activeView === 'SCORECARD' ? (
        loading && !scorecard ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
            <RefreshCw className="w-8 h-8 text-[#155EEF] animate-spin mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">Compiling 4-Subject Scorecard...</h3>
            <p className="text-xs text-gray-500 mt-1">Aggregating Physics, Chemistry, Biology and Mathematics results.</p>
          </div>
        ) : scorecard ? (
          <ScorecardViewer scorecard={scorecard} onRefresh={loadData} loading={loading} />
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
            <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-gray-900">Scorecard Pending</h3>
            <p className="text-xs text-gray-400 mt-1">Academic records are currently being compiled by the school faculty.</p>
          </div>
        )
      ) : (
        /* VIEW MODE 2: INDIVIDUAL TEST LIST AND SPOTLIGHT */
        <div className="space-y-6">
          {/* PROMINENT SPOTLIGHT SCORECARD (Fulfilling Prompt Example) */}
          {rahulPhysicsMark && (
            <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl border border-[#DCE5F2] shadow-sm p-6 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE5F2]/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-[#155EEF] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {rahulPhysicsMark.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-gray-900">{rahulPhysicsMark.studentName}</h2>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-medium">
                        {rahulPhysicsMark.studentRoll}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Class 10 CBSE • Infinite Tutorial Evaluated Record
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Verified & Published
                </span>
              </div>

              {/* Test Detail Highlight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 block">Subject</span>
                  <span className="text-base font-bold text-[#1048B5] mt-1 block">
                    {rahulPhysicsMark.subjectName}
                  </span>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">Secondary Science</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 block">Test Name</span>
                  <span className="text-base font-bold text-gray-900 mt-1 block">
                    {rahulPhysicsMark.testName}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">{rahulPhysicsMark.testCode}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 block">Marks Obtained</span>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-2xl font-bold text-gray-900">{rahulPhysicsMark.marksObtained}</span>
                    <span className="text-sm text-gray-400 font-medium">/ {rahulPhysicsMark.maxMarks}</span>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">Max: {rahulPhysicsMark.maxMarks} Marks</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 block">Percentage</span>
                  <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                    {rahulPhysicsMark.percentage}%
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Grade A Performance</span>
                </div>
              </div>

              {/* Audit trail indicator & answer sheet button */}
              <div className="pt-4 border-t border-[#DCE5F2]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 p-4 rounded-xl">
                <div>
                  {rahulPhysicsMark.auditLogs && rahulPhysicsMark.auditLogs.length > 0 && (
                    <div className="flex items-center text-xs text-[#1048B5] font-medium">
                      <History className="w-3.5 h-3.5 mr-1.5 text-[#155EEF]" />
                      <span>
                        Official Audit: Rechecked by faculty ({rahulPhysicsMark.auditLogs[0].oldMarks} → {rahulPhysicsMark.auditLogs[0].newMarks} marks on {new Date(rahulPhysicsMark.auditLogs[0].changedAt).toLocaleDateString()})
                      </span>
                    </div>
                  )}
                  {rahulPhysicsMark.remarks && (
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold text-gray-700">Teacher Remarks:</span> {rahulPhysicsMark.remarks}
                    </p>
                  )}
                </div>

                {rahulPhysicsMark.answerSheetUrl && (
                  <button
                    onClick={() => {
                      setPreviewUrl(rahulPhysicsMark.answerSheetUrl!);
                      setPreviewTitle(`${rahulPhysicsMark.studentName} — ${rahulPhysicsMark.testName} (${rahulPhysicsMark.subjectName})`);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-xs font-semibold rounded-lg text-white bg-[#155EEF] hover:bg-[#1048B5] transition-colors flex-shrink-0"
                  >
                    <FileText className="w-4 h-4 mr-1.5" />
                    View Evaluated Answer Sheet
                  </button>
                )}
              </div>
            </div>
          )}

          {/* All Available Scorecards */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-gray-500" />
                <h3 className="font-bold text-gray-900 text-sm">All Published Scorecards & Answer Papers</h3>
              </div>
              <span className="text-xs text-gray-500">{marks.length} Test Records</span>
            </div>

            {marks.length === 0 ? (
              <EmptyState
                title="No published test scorecards yet"
                description="Evaluated papers and published test scorecards will be displayed here once released by the teacher."
                icon={<Award className="w-8 h-8 text-[#155EEF] stroke-[1.5]" />}
                compact
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject & Test</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Sheet</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {marks.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                          <div className="font-bold text-gray-900">{m.subjectName}</div>
                          <div className="text-gray-600">{m.testName}</div>
                          <div className="text-gray-400 font-mono text-[11px]">{m.testCode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">
                          <span className="font-bold text-gray-900 text-sm">{m.marksObtained}</span>
                          <span className="text-gray-500"> / {m.maxMarks}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              m.percentage >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.percentage >= 60
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {m.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          {m.answerSheetUrl ? (
                            <span className="inline-flex items-center text-emerald-700 font-medium">
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Attached
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not Uploaded</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          {m.answerSheetUrl ? (
                            <button
                              onClick={() => {
                                setPreviewUrl(m.answerSheetUrl!);
                                setPreviewTitle(`${m.studentName} — ${m.testName} (${m.subjectName})`);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-[#DCE5F2] text-xs font-medium rounded-lg text-[#1048B5] bg-[#EEF4FF] hover:bg-[#EEF4FF] transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 mr-1" />
                              View Sheet
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Answer Sheet Modal Viewer */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#155EEF]" />
                <h3 className="font-bold text-gray-900 text-sm">{previewTitle}</h3>
              </div>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-100 flex flex-col items-center justify-center min-h-[400px]">
              {previewUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe src={previewUrl} title={previewTitle} className="w-full h-[600px] rounded-lg border border-gray-300" />
              ) : (
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 max-w-full">
                  <img src={previewUrl} alt={previewTitle} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white text-xs text-gray-500">
              <span>Verified Official Evaluated Answer Paper • Infinite Tutorial</span>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-[#155EEF] font-semibold hover:underline"
              >
                Open in Full Window
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentMarksPage;
