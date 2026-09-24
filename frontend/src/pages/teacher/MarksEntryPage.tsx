import React, { useState, useEffect } from 'react';
import {
  Award,
  FileText,
  UploadCloud,
  History,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  X,
  Plus,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import markService from '../../services/markService';
import { StudentMark, MarkAuditLog } from '../../types/mark';
import { fetchStudents } from '../../services/studentService';
import { getTestsApi } from '../../services/testService';
import { getSubjectsApi } from '../../services/academicService';

export const MarksEntryPage: React.FC = () => {
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');

  // Entry Modal State (Sequential Workflow 19)
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formStudentId, setFormStudentId] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formTestId, setFormTestId] = useState('');
  const [formMarksObtained, setFormMarksObtained] = useState<number | ''>('');
  const [formMaxMarks, setFormMaxMarks] = useState<number>(50);
  const [formRemarks, setFormRemarks] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [answerSheetFile, setAnswerSheetFile] = useState<File | null>(null);
  const [uploadedAnswerSheetUrl, setUploadedAnswerSheetUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Edit Modal State (Audit Trail Workflow 20)
  const [editingMark, setEditingMark] = useState<StudentMark | null>(null);
  const [editMarksValue, setEditMarksValue] = useState<number | ''>('');
  const [editReason, setEditReason] = useState('Rechecking');
  const [editRemarks, setEditRemarks] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Audit History Modal State
  const [viewingAuditMark, setViewingAuditMark] = useState<StudentMark | null>(null);
  const [auditLogs, setAuditLogs] = useState<MarkAuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Answer Sheet Preview Modal State (Workflow 18)
  const [previewSheetUrl, setPreviewSheetUrl] = useState<string | null>(null);
  const [previewSheetTitle, setPreviewSheetTitle] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const [marksData, studentsRes, subjectsRes, testsRes] = await Promise.all([
        markService.getMarks({
          subjectName: selectedSubjectFilter === 'ALL' ? undefined : selectedSubjectFilter,
          search: searchQuery.trim() || undefined,
        }),
        fetchStudents({ limit: 100 }).catch(() => ({ students: [] })),
        getSubjectsApi().catch(() => []),
        getTestsApi().catch(() => []),
      ]);

      setMarks(marksData);
      setStudents(studentsRes.students || []);
      setSubjects(subjectsRes || []);
      setTests(testsRes || []);

      if (studentsRes.students?.length && !formStudentId) {
        setFormStudentId(studentsRes.students[0].id);
      }
      if (subjectsRes?.length && !formSubjectId) {
        setFormSubjectId(subjectsRes[0].id);
      }
      if (testsRes?.length && !formTestId) {
        setFormTestId(testsRes[0].id);
        setFormMaxMarks(testsRes[0].maxMarks || 50);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load marks and academic data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedSubjectFilter]);

  const handleTestSelection = (testId: string) => {
    setFormTestId(testId);
    const selectedTest = tests.find((t) => t.id === testId || t.testId === testId);
    if (selectedTest) {
      setFormMaxMarks(selectedTest.maxMarks || 50);
      if (selectedTest.subjectId) {
        setFormSubjectId(selectedTest.subjectId);
      }
    }
  };

  // Upload scanned answer sheet file
  const handleAnswerSheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnswerSheetFile(file);
    try {
      setUploadingFile(true);
      setErrorMsg('');
      const res = await markService.uploadAnswerSheet(file);
      setUploadedAnswerSheetUrl(res.fileUrl);
      setSuccessMsg(`Answer sheet uploaded: ${res.fileName} (${res.isCloudinary ? 'Cloudinary Cloud' : 'Storage'})`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload answer sheet');
    } finally {
      setUploadingFile(false);
    }
  };

  // Workflow 19: Save Marks
  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMarksObtained === '') {
      setErrorMsg('Please enter marks obtained.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await markService.createMark({
        studentId: formStudentId,
        subjectId: formSubjectId,
        testId: formTestId,
        marksObtained: Number(formMarksObtained),
        maxMarks: formMaxMarks,
        answerSheetUrl: uploadedAnswerSheetUrl || undefined,
        answerSheetName: answerSheetFile?.name || undefined,
        answerSheetSize: answerSheetFile?.size || undefined,
        isPublished: formIsPublished,
        remarks: formRemarks.trim() || undefined,
      });

      setSuccessMsg(`Marks recorded successfully for ${res.studentName} (${res.marksObtained}/${res.maxMarks} - ${res.percentage}%)`);
      setIsEntryModalOpen(false);
      setFormMarksObtained('');
      setFormRemarks('');
      setUploadedAnswerSheetUrl('');
      setAnswerSheetFile(null);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to record marks.');
    } finally {
      setSubmitting(false);
    }
  };

  // Workflow 20: Edit Marks with Audit Reason
  const openEditModal = (mark: StudentMark) => {
    setEditingMark(mark);
    setEditMarksValue(mark.marksObtained);
    setEditReason('Rechecking');
    setEditRemarks(mark.remarks || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMark) return;
    if (editMarksValue === '') {
      setErrorMsg('Please enter updated marks.');
      return;
    }
    if (!editReason.trim()) {
      setErrorMsg('Reason for change is mandatory to maintain an audit trail (e.g. "Rechecking").');
      return;
    }

    try {
      setSubmittingEdit(true);
      setErrorMsg('');

      await markService.updateMark(editingMark.id, {
        marksObtained: Number(editMarksValue),
        reason: editReason.trim(),
        remarks: editRemarks.trim() || undefined,
      });

      setSuccessMsg(`Marks updated for ${editingMark.studentName}. Audit trail record created.`);
      setEditingMark(null);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update marks.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Open Audit Trail History
  const openAuditModal = async (mark: StudentMark) => {
    setViewingAuditMark(mark);
    try {
      setLoadingAudit(true);
      const logs = await markService.getAuditTrail(mark.id);
      setAuditLogs(logs);
    } catch {
      setAuditLogs(mark.auditLogs || []);
    } finally {
      setLoadingAudit(false);
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (mark: StudentMark) => {
    try {
      const nextStatus = !mark.isPublished;
      await markService.toggleVisibility(mark.id, nextStatus);
      setMarks((prev) =>
        prev.map((m) => (m.id === mark.id ? { ...m, isPublished: nextStatus } : m))
      );
      setSuccessMsg(
        `Answer sheet visibility set to ${nextStatus ? 'Published to Parent' : 'Hidden from Parent'}`
      );
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to toggle visibility');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Marks Entry & Answer Sheets Desk
              </h1>
              <p className="text-sm text-gray-500">
                Record student marks, upload scanned answer sheets to Cloudinary, and maintain audit trails.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center px-3.5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsEntryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Marks Entry
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 text-sm">Dismiss</button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 text-sm">Dismiss</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Filter Records</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student, roll, test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-52"
            />
          </div>

          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ALL">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Chemistry">Chemistry</option>
          </select>
        </div>
      </div>

      {/* Marks Master Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject & Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer Sheet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marks.map((mark) => (
                <tr key={mark.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-bold text-gray-900">{mark.studentName}</div>
                    <div className="text-xs text-gray-500 font-mono">{mark.studentRoll}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <div className="font-semibold text-indigo-700">{mark.subjectName}</div>
                    <div className="text-gray-900 font-medium">{mark.testName}</div>
                    <div className="text-gray-400 font-mono text-[11px]">{mark.testCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-bold text-gray-900 text-base">{mark.marksObtained}</span>
                    <span className="text-gray-400 font-normal"> / {mark.maxMarks}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        mark.percentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : mark.percentage >= 60
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mark.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {mark.answerSheetUrl ? (
                      <button
                        onClick={() => {
                          setPreviewSheetUrl(mark.answerSheetUrl!);
                          setPreviewSheetTitle(`${mark.studentName} - ${mark.testName}`);
                        }}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        Scanned Sheet
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">Not Uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleVisibility(mark)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        mark.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {mark.isPublished ? 'Published to Parent' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs space-x-2">
                    <button
                      onClick={() => openEditModal(mark)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200"
                      title="Edit marks with audit record"
                    >
                      <Edit3 className="w-3 h-3 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => openAuditModal(mark)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200"
                      title="View audit trail"
                    >
                      <History className="w-3 h-3 mr-1" /> Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEQUENTIAL MARKS ENTRY MODAL (Workflow 19) */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsEntryModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-5 border-b border-gray-100 pb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Sequential Marks Entry</h3>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4">
              {/* Step 1: Select Student */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  1. Select Student
                </label>
                <select
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.studentId}) — {st.batchName || 'Grade 10'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Subject */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  2. Select Subject
                </label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                  <option value="sub-phy">Physics</option>
                  <option value="sub-mat">Mathematics</option>
                </select>
              </div>

              {/* Step 3: Select Test */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  3. Select Test
                </label>
                <select
                  value={formTestId}
                  onChange={(e) => handleTestSelection(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.testId}) — Max: {t.maxMarks} marks
                    </option>
                  ))}
                  <option value="tst-cbse10-phy-003">Chapter 3 Test (TST-10-PHY-003) — Max: 50 marks</option>
                </select>
              </div>

              {/* Step 4: Enter Marks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    4. Marks Obtained
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formMaxMarks}
                    step="0.5"
                    value={formMarksObtained}
                    onChange={(e) => setFormMarksObtained(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 42"
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Maximum Marks
                  </label>
                  <input
                    type="number"
                    value={formMaxMarks}
                    readOnly
                    className="w-full text-sm px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600 font-semibold"
                  />
                </div>
              </div>

              {/* Live percentage preview */}
              {formMarksObtained !== '' && (
                <div className="p-3 bg-indigo-50 rounded-lg flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-900">Computed Percentage:</span>
                  <span className="font-bold text-indigo-700 text-sm">
                    {((Number(formMarksObtained) / formMaxMarks) * 100).toFixed(1)}%
                  </span>
                </div>
              )}

              {/* Step 5: Upload Answer Sheet (Step 18) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  5. Upload Scanned Answer Sheet (Cloudinary / Storage)
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-lg p-3 text-xs text-gray-600 transition-colors">
                    <UploadCloud className="w-4 h-4 mr-2 text-indigo-600" />
                    <span>{answerSheetFile ? answerSheetFile.name : 'Choose scanned PDF or image'}</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleAnswerSheetUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadingFile && <span className="text-xs text-indigo-600 mt-1 block">Uploading to storage...</span>}
              </div>

              {/* Step 6: Remarks */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  6. Faculty Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="e.g. Excellent presentation in Section B"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  id="publish-check"
                  type="checkbox"
                  checked={formIsPublished}
                  onChange={(e) => setFormIsPublished(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="publish-check" className="text-xs text-gray-700 cursor-pointer">
                  Make marks and answer sheet available to parent & student immediately
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingFile}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  {submitting ? 'Saving...' : 'Save Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MARK EDITING & AUDIT MODAL (Workflow 20) */}
      {editingMark && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setEditingMark(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-3">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Edit Marks & Log Audit</h3>
            </div>

            <div className="mb-4 bg-gray-50 p-3 rounded-lg text-xs space-y-1">
              <div><span className="font-semibold text-gray-700">Student:</span> {editingMark.studentName} ({editingMark.studentRoll})</div>
              <div><span className="font-semibold text-gray-700">Test:</span> {editingMark.testName} ({editingMark.subjectName})</div>
              <div><span className="font-semibold text-gray-700">Current Marks:</span> <span className="font-bold text-indigo-700">{editingMark.marksObtained}</span> / {editingMark.maxMarks}</div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  New Marks Obtained
                </label>
                <input
                  type="number"
                  min="0"
                  max={editingMark.maxMarks}
                  step="0.5"
                  value={editMarksValue}
                  onChange={(e) => setEditMarksValue(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Reason for Change (Mandatory Audit Trail)
                </label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Rechecking, Totalling correction"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  * Prevents silent modification of academic records. Recorded permanently in audit log.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Faculty Note / Remarks
                </label>
                <input
                  type="text"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="e.g. Rechecked question 4 (+4 marks)"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingMark(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  {submittingEdit ? 'Saving...' : 'Update & Log Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT TRAIL MODAL (Prompt 20) */}
      {viewingAuditMark && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setViewingAuditMark(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-3">
              <History className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Marks Revision Audit Trail</h3>
            </div>

            <div className="text-xs text-gray-600 mb-4">
              <strong>{viewingAuditMark.studentName}</strong> • {viewingAuditMark.testName} ({viewingAuditMark.subjectName})
            </div>

            {loadingAudit ? (
              <div className="p-8 text-center text-sm text-gray-500">Loading audit history...</div>
            ) : auditLogs.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700">
                        Marks Changed: {log.oldMarks} → {log.newMarks}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(log.changedAt).toLocaleString()}
                      </span>
                    </div>
                    <div><span className="font-semibold text-gray-600">Changed By:</span> {log.changedByName} ({log.changedByRole})</div>
                    <div><span className="font-semibold text-gray-600">Reason:</span> <span className="text-gray-900 font-medium">{log.reason}</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400 bg-gray-50 rounded-xl">
                No revisions made yet. Original marks entry remains unchanged.
              </div>
            )}
          </div>
        </div>
      )}

      {/* EMBEDDED ANSWER SHEET PREVIEW MODAL (Prompt 18) */}
      {previewSheetUrl && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] p-6 shadow-2xl flex flex-col relative">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-base">{previewSheetTitle}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={previewSheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open External
                </a>
                <button
                  onClick={() => setPreviewSheetUrl(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
              {previewSheetUrl.endsWith('.pdf') ? (
                <iframe src={previewSheetUrl} className="w-full h-full border-0" title="Scanned Answer Sheet" />
              ) : (
                <img src={previewSheetUrl} alt="Scanned Answer Sheet" className="max-h-full object-contain mx-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntryPage;
