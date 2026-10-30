import React, { useState, useEffect, useMemo } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  Trash2,
  RefreshCw,
  X,
  Award,
  FileCheck,
  ExternalLink,
  Paperclip,
} from 'lucide-react';
import markService from '../../services/markService';
import { StudentMark } from '../../types/mark';
import { getTestsApi } from '../../services/testService';
import { getSubjectsApi } from '../../services/academicService';

export const StudentAnswerSheetsPage: React.FC = () => {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [selectedTestFilter, setSelectedTestFilter] = useState('ALL');
  const [sheetStatusFilter, setSheetStatusFilter] = useState<'ALL' | 'ATTACHED' | 'PENDING'>('ALL');

  // Upload/Attach Modal State
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [targetMark, setTargetMark] = useState<StudentMark | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // PDF Preview Modal State
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfTitle, setPreviewPdfTitle] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const [marksData, subjectsRes, testsRes] = await Promise.all([
        markService.getMarks({
          subjectName: selectedSubjectFilter === 'ALL' ? undefined : selectedSubjectFilter,
          testId: selectedTestFilter === 'ALL' ? undefined : selectedTestFilter,
        }),
        getSubjectsApi().catch(() => []),
        getTestsApi().catch(() => []),
      ]);

      setMarks(marksData);
      setSubjects(subjectsRes || []);
      setTests(testsRes || []);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load evaluated test marks and answer sheets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSubjectFilter, selectedTestFilter]);

  // Filtered List
  const filteredMarks = useMemo(() => {
    let list = [...marks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.studentName.toLowerCase().includes(q) ||
          m.studentRoll.toLowerCase().includes(q) ||
          m.testName.toLowerCase().includes(q) ||
          m.testCode.toLowerCase().includes(q) ||
          (m.answerSheetName && m.answerSheetName.toLowerCase().includes(q))
      );
    }

    if (sheetStatusFilter === 'ATTACHED') {
      list = list.filter((m) => Boolean(m.answerSheetUrl));
    } else if (sheetStatusFilter === 'PENDING') {
      list = list.filter((m) => !m.answerSheetUrl);
    }

    return list;
  }, [marks, searchQuery, sheetStatusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = marks.length;
    const attached = marks.filter((m) => Boolean(m.answerSheetUrl)).length;
    const pending = total - attached;
    const percentage = total > 0 ? Math.round((attached / total) * 100) : 0;
    return { total, attached, pending, percentage };
  }, [marks]);

  // Open Attach/Replace Modal for a specific mark record
  const handleOpenAttachModal = (mark: StudentMark) => {
    setTargetMark(mark);
    setSelectedFile(null);
    setErrorMsg('');
    setIsAttachModalOpen(true);
  };

  // Submit Answer Sheet Attachment
  const handleAttachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMark) return;
    if (!selectedFile) {
      setErrorMsg('Please select a PDF file of the evaluated answer sheet.');
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setErrorMsg('Invalid file format. Please upload evaluated answer sheets in PDF format only.');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg('');

      // 1. Upload PDF
      const uploadRes = await markService.uploadAnswerSheet(selectedFile);

      // 2. Attach to mark record with reason for audit
      await markService.updateMark(targetMark.id, {
        reason: targetMark.answerSheetUrl
          ? `Replaced evaluated answer sheet PDF (${selectedFile.name})`
          : `Attached evaluated answer sheet PDF (${selectedFile.name})`,
        answerSheetUrl: uploadRes.fileUrl,
        answerSheetName: uploadRes.fileName,
        answerSheetSize: uploadRes.fileSize,
        mimeType: 'application/pdf',
      });

      setSuccessMsg(
        `Answer sheet PDF successfully attached for ${targetMark.studentName} (${targetMark.testName})!`
      );
      setTimeout(() => setSuccessMsg(''), 4500);

      setIsAttachModalOpen(false);
      setTargetMark(null);
      setSelectedFile(null);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to attach answer sheet.');
    } finally {
      setUploading(false);
    }
  };

  // Detach / Remove Answer Sheet
  const handleRemoveSheet = async (mark: StudentMark) => {
    if (
      !window.confirm(
        `Are you sure you want to detach the answer sheet PDF for ${mark.studentName}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await markService.updateMark(mark.id, {
        reason: 'Detached evaluated answer sheet PDF',
        answerSheetUrl: '',
        answerSheetName: '',
      });
      setSuccessMsg(`Answer sheet detached for ${mark.studentName}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to detach answer sheet.');
    } finally {
      setLoading(false);
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (mark: StudentMark) => {
    if (!mark.answerSheetUrl) return;
    setPreviewPdfUrl(mark.answerSheetUrl);
    setPreviewPdfTitle(`${mark.studentName} (${mark.studentRoll}) — ${mark.testName}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] flex items-center justify-center text-white shadow-md flex-shrink-0">
            <UploadCloud className="w-7 h-7 text-[#00B8F8]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#0B1F4D] tracking-tight">
                Student Answer Sheets
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F8FF] text-[#008BBF] border border-[#BAE6FD]">
                EVALUATED PAPERS (PDF)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Attach, view, and manage evaluated student answer sheet PDFs linked to entered test scores.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Evaluated Records</span>
            <div className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2]">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D]">{stats.total}</span>
            <span className="text-xs text-slate-500 font-semibold block mt-1">Tests & Marks Linked</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">PDFs Attached</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{stats.attached}</span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">Ready for Parent/Student View</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Uploads</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <UploadCloud className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.pending}</span>
            <span className="text-xs text-amber-700 font-semibold block mt-1">Awaiting PDF Answer Sheet</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008BBF]">Attachment Rate</span>
            <div className="p-2 bg-[#E0F8FF] text-[#008BBF] rounded-xl border border-[#BAE6FD]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-[#0B1F4D]">{stats.percentage}%</span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#155EEF] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, roll number, test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-700 font-medium"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((sub: any) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Test Filter */}
          <select
            value={selectedTestFilter}
            onChange={(e) => setSelectedTestFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-700 font-medium max-w-[200px] truncate"
          >
            <option value="ALL">All Tests</option>
            {tests.map((t: any) => (
              <option key={t.id || t.testId} value={t.id || t.testId}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSheetStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              sheetStatusFilter === 'ALL'
                ? 'bg-white text-[#0B1F4D] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({marks.length})
          </button>
          <button
            onClick={() => setSheetStatusFilter('ATTACHED')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              sheetStatusFilter === 'ATTACHED'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            PDF Attached ({stats.attached})
          </button>
          <button
            onClick={() => setSheetStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              sheetStatusFilter === 'PENDING'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending ({stats.pending})
          </button>
        </div>
      </div>

      {/* Main Answer Sheets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-[#155EEF]" />
            <p className="text-xs font-semibold">Loading student answer sheet records...</p>
          </div>
        ) : filteredMarks.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No student records found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || sheetStatusFilter !== 'ALL'
                ? 'Try adjusting your search query or filter selection.'
                : 'Enter student marks first to generate answer sheet records.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student Details</th>
                  <th className="py-3.5 px-4">Test & Subject</th>
                  <th className="py-3.5 px-4">Score & Performance</th>
                  <th className="py-3.5 px-4">Answer Sheet (PDF)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarks.map((mark) => {
                  const hasSheet = Boolean(mark.answerSheetUrl);
                  return (
                    <tr
                      key={mark.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Student info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1F4D] to-[#155EEF] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                            {mark.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors">
                              {mark.studentName}
                            </div>
                            <div className="text-[11px] font-mono font-medium text-slate-500">
                              Roll: {mark.studentRoll}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Test & Subject */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{mark.testName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]">
                            {mark.subjectName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {mark.testCode}
                          </span>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-slate-900">
                            {mark.marksObtained}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">
                            / {mark.maxMarks}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                            mark.percentage >= 80
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : mark.percentage >= 60
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {mark.percentage}% Grade {mark.percentage >= 90 ? 'A+' : mark.percentage >= 80 ? 'A' : mark.percentage >= 60 ? 'B' : 'C'}
                        </span>
                      </td>

                      {/* Answer Sheet Status */}
                      <td className="py-3.5 px-4">
                        {hasSheet ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <FileCheck className="w-3 h-3 text-emerald-600" />
                                PDF Attached
                              </span>
                              {mark.answerSheetSize && (
                                <span className="text-[10px] text-slate-400">
                                  {Math.round(mark.answerSheetSize / 1024)} KB
                                </span>
                              )}
                            </div>
                            <p
                              className="text-[11px] text-slate-600 font-mono truncate max-w-[220px]"
                              title={mark.answerSheetName || 'answer-sheet.pdf'}
                            >
                              {mark.answerSheetName || 'Evaluated_Sheet.pdf'}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              Pending PDF
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasSheet ? (
                            <>
                              <button
                                onClick={() => handleOpenPreview(mark)}
                                className="px-2.5 py-1 text-xs font-semibold text-[#155EEF] hover:bg-[#EEF4FF] rounded-lg transition-colors flex items-center gap-1"
                                title="Preview Answer Sheet"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View PDF</span>
                              </button>

                              <button
                                onClick={() => handleOpenAttachModal(mark)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Replace Answer Sheet PDF"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleRemoveSheet(mark)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Detach Answer Sheet"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleOpenAttachModal(mark)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#0B1F4D] to-[#155EEF] hover:opacity-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-[#00B8F8]" />
                              <span>Attach PDF</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attach / Replace PDF Modal */}
      {isAttachModalOpen && targetMark && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative animate-scaleIn">
            <button
              onClick={() => {
                setIsAttachModalOpen(false);
                setTargetMark(null);
                setSelectedFile(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E0F8FF] text-[#008BBF] border border-[#BAE6FD] flex items-center justify-center font-bold">
                <Paperclip className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {targetMark.answerSheetUrl ? 'Replace Answer Sheet (PDF)' : 'Attach Answer Sheet (PDF)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Link an evaluated question-by-question scan to the student test record.
                </p>
              </div>
            </div>

            {/* Target Student & Test Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">
                  {targetMark.studentName} ({targetMark.studentRoll})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test:</span>
                <span className="font-bold text-slate-800">{targetMark.testName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Score Recorded:</span>
                <span className="font-bold text-emerald-700">
                  {targetMark.marksObtained} / {targetMark.maxMarks} ({targetMark.percentage}%)
                </span>
              </div>
            </div>

            <form onSubmit={handleAttachSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Evaluated Answer Sheet File (PDF only)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-[#155EEF] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-[#EEF4FF]/30 relative">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-10 h-10 mx-auto text-[#155EEF] mb-2" />
                  {selectedFile ? (
                    <div>
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-xs mx-auto">
                        📄 {selectedFile.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {Math.round(selectedFile.size / 1024)} KB &bull; Ready to upload
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">
                        Click or drag & drop student answer sheet PDF here
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Format: .pdf (Max size: 10MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAttachModalOpen(false);
                    setTargetMark(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-5 py-2 bg-gradient-to-r from-[#0B1F4D] to-[#155EEF] text-white rounded-xl text-xs font-bold hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading & Attaching PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-3.5 h-3.5 text-[#00B8F8]" />
                      <span>Attach Answer Sheet PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Viewer / Preview Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#155EEF]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 truncate max-w-lg">
                    {previewPdfTitle}
                  </h3>
                  <span className="text-[10px] text-slate-500 block">
                    Evaluated Answer Paper Scan
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#155EEF] bg-[#EEF4FF] hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Screen / Download</span>
                </a>
                <button
                  onClick={() => setPreviewPdfUrl(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Iframe */}
            <div className="flex-1 bg-slate-100 p-2">
              <iframe
                src={previewPdfUrl}
                title="Evaluated Answer Sheet Preview"
                className="w-full h-full rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnswerSheetsPage;
