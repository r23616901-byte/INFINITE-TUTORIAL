import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  TrendingUp,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
} from 'lucide-react';
import { PrintTemplateHeader } from '../../components/common/PrintTemplateHeader';
import { PrintButton } from '../../components/print/PrintButton';
import { PrintPreviewModal } from '../../components/print/PrintPreviewModal';
import { PortionCompletionPrintDocument } from '../../components/print/templates/PortionCompletionPrintDocument';
import { QuestionPaperPrintDocument } from '../../components/print/templates/QuestionPaperPrintDocument';
import {
  CurriculumChapter,
  QuestionPaper,
  getCurriculumApi,
  getQuestionPapersApi,
  KARNATAKA_CLASS_9_CHAPTERS,
} from '../../services/curriculumService';
import { fetchMyStudentProfile, StudentDto } from '../../services/studentService';

export const CURRICULUM_TRACKS = [
  {
    id: 'ksb-9',
    label: 'Karnataka State Board — Class 9',
    shortLabel: 'Class 9 (KSB)',
    classId: 'cls-9',
    boardId: 'brd-ksb',
    className: 'Class 9',
    boardName: 'Karnataka State Board',
  },
  {
    id: 'ksb-10',
    label: 'Karnataka State Board — Class 10',
    shortLabel: 'Class 10 (KSB)',
    classId: 'cls-10',
    boardId: 'brd-ksb',
    className: 'Class 10',
    boardName: 'Karnataka State Board',
  },
  {
    id: 'cbse-9',
    label: 'CBSE Board — Class 9 (2026–27)',
    shortLabel: 'Class 9 (CBSE)',
    classId: 'cls-9',
    boardId: 'brd-cbse',
    className: 'Class 9',
    boardName: 'CBSE',
  },
  {
    id: 'cbse-10',
    label: 'CBSE Board — Class 10 (2026–27)',
    shortLabel: 'Class 10 (CBSE)',
    classId: 'cls-10',
    boardId: 'brd-cbse',
    className: 'Class 10',
    boardName: 'CBSE',
  },
];

export const ParentPortionCompletionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SYLLABUS' | 'QUESTION_PAPERS'>('SYLLABUS');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('ksb-9');
  const [student, setStudent] = useState<StudentDto | null>(null);

  // Curriculum & Question Papers
  const [chapters, setChapters] = useState<CurriculumChapter[]>(KARNATAKA_CLASS_9_CHAPTERS);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Question Paper Print / Preview
  const [previewPaper, setPreviewPaper] = useState<QuestionPaper | null>(null);
  const [showSyllabusPrint, setShowSyllabusPrint] = useState<boolean>(false);

  // Load student profile & resolve enrolled track
  useEffect(() => {
    const initData = async () => {
      try {
        const studentProfile = await fetchMyStudentProfile();
        if (studentProfile) {
          setStudent(studentProfile);
          let detected = 'ksb-9';
          if (studentProfile.boardId === 'brd-ksb') {
            detected = studentProfile.classId === 'cls-10' ? 'ksb-10' : 'ksb-9';
          } else {
            detected = studentProfile.classId === 'cls-9' ? 'cbse-9' : 'cbse-10';
          }
          setSelectedTrackId(detected);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    initData();
  }, []);

  const activeTrack = CURRICULUM_TRACKS.find((t) => t.id === selectedTrackId) || CURRICULUM_TRACKS[0];

  useEffect(() => {
    const loadCurriculum = async () => {
      const chList = await getCurriculumApi({
        classId: activeTrack.classId,
        boardId: activeTrack.boardId,
      });
      setChapters(chList);

      const qpList = await getQuestionPapersApi({
        classId: activeTrack.classId,
        boardId: activeTrack.boardId,
      });
      setQuestionPapers(qpList);
    };
    loadCurriculum();
  }, [selectedTrackId]);

  const toggleTopics = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const boardName = activeTrack.boardName;
  const className = activeTrack.className;

  const filteredChapters = chapters.filter((ch) => {
    if (selectedSubject !== 'ALL' && ch.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) {
      return false;
    }
    return true;
  });

  const filteredPapers = questionPapers.filter((qp) => {
    if (selectedSubject !== 'ALL' && qp.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
      return false;
    }
    return true;
  });

  const completedCount = chapters.filter((c) => c.status === 'COMPLETED').length;
  const inProgressCount = chapters.filter((c) => c.status === 'IN_PROGRESS').length;
  const totalCount = chapters.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 print:space-y-0 print:pb-0">
      {/* Official Institutional Print Header */}
      <PrintTemplateHeader
        documentTitle={`STUDENT SYLLABUS & PORTION COMPLETION REPORT — ${className.toUpperCase()}`}
        documentSubtitle={`Official Curriculum Delivery & Board Chapter Progress Tracker (${boardName})`}
        reportCategory="PORTION COMPLETION REPORT"
        academicYear="AY 2024–25"
        subject={selectedSubject !== 'ALL' ? selectedSubject : 'Physics, Chemistry, Biology & Mathematics'}
        className={`${className} (${boardName})`}
      />

      {/* Top Header & Student Class Resolution Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Portion &amp; Syllabus Completion
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {className} &bull; {boardName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Curriculum progression and chapter-by-chapter outline for {className} ({boardName}).
            </p>
          </div>
        </div>

        {/* Curriculum Track Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 flex-wrap">
            {CURRICULUM_TRACKS.map((t) => {
              const isSelected = selectedTrackId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrackId(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-400/30'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.shortLabel}
                </button>
              );
            })}
          </div>

          <PrintButton
            onClick={() => setShowSyllabusPrint(true)}
            label="Print Syllabus (A4)"
            title="Print official syllabus completion tracker in A4 Sheet format"
            variant="academic"
            size="sm"
          />
        </div>
      </div>

      {/* Student Link Notice Bar */}
      {student && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover border border-blue-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                {student.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm">{student.name}</span>
                <span className="font-mono text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {student.studentId}
                </span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Enrolled in: <strong className="text-slate-800">{student.className}</strong> &bull;{' '}
                <strong className="text-slate-800">{student.boardName}</strong> &bull; Batch:{' '}
                <strong className="text-slate-800">{student.batchName}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Linked Parent:
            </span>
            <span className="font-bold text-slate-800">{student.parentName}</span>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Completion</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900">{completionPercentage}%</span>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              {completedCount} of {totalCount} Chapters Complete
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">In Progress</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900">{inProgressCount} Chapters</span>
            <span className="text-xs text-amber-600 font-semibold block mt-1">Active syllabus delivery</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Finished Chapters</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900">{completedCount} Chapters</span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">Fully completed &amp; reviewed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Question Papers</span>
            <span className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2]">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900">{questionPapers.length} Papers</span>
            <span className="text-xs text-[#155EEF] font-semibold block mt-1">
              Ready in A4 Sheet Print format
            </span>
          </div>
        </div>
      </div>

      {/* Main Mode Toggle: Syllabus vs Question Papers */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-2 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SYLLABUS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'SYLLABUS'
                ? 'bg-[#0B1F4D] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Syllabus &amp; Chapter Outline ({chapters.length})
          </button>
          <button
            onClick={() => setActiveTab('QUESTION_PAPERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'QUESTION_PAPERS'
                ? 'bg-[#0B1F4D] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Official Question Papers (4 Subjects)
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-black">
              A4 Format
            </span>
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Physics', 'Chemistry', 'Biology', 'Mathematics'].map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSubject.toUpperCase() === subj.toUpperCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {subj === 'ALL' ? 'All Subjects' : subj}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SYLLABUS & CHAPTER OUTLINE */}
      {activeTab === 'SYLLABUS' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">
                {selectedSubject === 'ALL' ? 'All Subjects' : selectedSubject} Curriculum Outline ({filteredChapters.length} Chapters)
              </h2>
              <p className="text-xs text-gray-500">
                {boardName} &bull; {className} Complete Chapter-wise Topic Distribution
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click a chapter to expand covered topics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold">Ch #</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Chapter &amp; Detailed Topics</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Subject &amp; Faculty</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Lectures</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Target / Completion</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredChapters.map((ch) => {
                  const isExpanded = !!expandedTopics[ch.id];
                  return (
                    <React.Fragment key={ch.id}>
                      <tr className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-gray-400">
                          {ch.chapterNumber}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900 text-sm">{ch.title}</div>
                          {ch.topics && ch.topics.length > 0 && (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              {ch.topics.slice(0, 2).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {t}
                                </span>
                              ))}
                              {ch.topics.length > 2 && (
                                <button
                                  onClick={() => toggleTopics(ch.id)}
                                  className="text-[10px] text-blue-600 font-bold hover:underline"
                                >
                                  {isExpanded ? 'Hide' : `+${ch.topics.length - 2} more`}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              ch.subjectName === 'Physics'
                                ? 'bg-blue-100 text-blue-800'
                                : ch.subjectName === 'Chemistry'
                                ? 'bg-amber-100 text-amber-800'
                                : ch.subjectName === 'Biology'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {ch.subjectName}
                          </span>
                          <div className="text-[11px] text-gray-500 font-medium mt-1">
                            {ch.facultyName}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center font-mono font-medium text-gray-700">
                          <span className="font-bold text-gray-900">{ch.completedLectures}</span> / {ch.totalLectures}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              ch.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : ch.status === 'IN_PROGRESS'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {ch.status === 'COMPLETED' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : ch.status === 'IN_PROGRESS' ? (
                              <Clock className="w-3 h-3 text-amber-600" />
                            ) : (
                              <Calendar className="w-3 h-3 text-gray-400" />
                            )}
                            {ch.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {ch.completionDate ? (
                            <span className="text-emerald-700 font-bold">{ch.completionDate}</span>
                          ) : (
                            <span className="text-slate-600">{ch.targetDate || 'TBD'}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleTopics(ch.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            title="View all topics"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Topics Detail Box */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={7} className="px-8 py-3.5 border-t border-b border-slate-200">
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Detailed Curriculum Topics Covered in this Chapter:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {ch.topics.map((topic, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="bg-white p-2 rounded-lg border border-slate-200 text-xs text-slate-800 font-medium flex items-center gap-2"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <span>{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OFFICIAL QUESTION PAPERS (A4 SHEET FORMAT) */}
      {activeTab === 'QUESTION_PAPERS' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg border border-blue-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Karnataka State Board — Class 9 Official Exam Papers
                </span>
                <h2 className="text-2xl font-black">
                  Official 40-Mark Periodic Assessment Papers
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Strictly aligned with the Karnataka State Board Class 9 curriculum for Physics, Chemistry, Biology, and Mathematics. Designed to be printed in standard ISO 216 A4 Sheet format.
                </p>
              </div>
            </div>
          </div>

          {/* Grid of Question Papers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPapers.map((paper) => {
              const totalQuestions = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
              return (
                <div
                  key={paper.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {paper.subjectCode} &bull; {paper.className}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-1">{paper.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{paper.boardName}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                        {paper.totalMarks} Marks
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs text-slate-700 border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Duration</span>
                        <span className="font-bold text-slate-900">{paper.duration}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Sections</span>
                        <span className="font-bold text-slate-900">{paper.sections.length} Sections</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Questions</span>
                        <span className="font-bold text-slate-900">{totalQuestions} Qs</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Included Sections:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {paper.sections.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium"
                          >
                            {s.sectionName.split(' ')[0]} ({s.totalMarks}M)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewPaper(paper)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Paper
                    </button>

                    <button
                      onClick={() => setPreviewPaper(paper)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print A4 Sheet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUESTION PAPER A4 PRINT PREVIEW MODAL */}
      {previewPaper && (
        <PrintPreviewModal
          isOpen={!!previewPaper}
          onClose={() => setPreviewPaper(null)}
          title={`Question Paper — ${previewPaper.subject} (${previewPaper.className} ${previewPaper.boardName})`}
          defaultOrientation="portrait"
        >
          <QuestionPaperPrintDocument
            paper={previewPaper}
            showAnswerKey={false}
            studentName={student?.name}
            rollNumber={student?.studentId}
            isForPreview
          />
        </PrintPreviewModal>
      )}

      {/* SYLLABUS TRACKER A4 PRINT PREVIEW MODAL */}
      {showSyllabusPrint && (
        <PrintPreviewModal
          isOpen={showSyllabusPrint}
          onClose={() => setShowSyllabusPrint(false)}
          title={`Official Syllabus Completion Tracker — ${className} (${boardName})`}
          defaultOrientation="portrait"
        >
          <PortionCompletionPrintDocument
            chapters={chapters.map((c) => ({
              id: c.id,
              chapterNumber: c.chapterNumber,
              title: c.title,
              subject: c.subjectName,
              totalLectures: c.totalLectures,
              completedLectures: c.completedLectures,
              status: c.status,
              faculty: c.facultyName,
              targetDate: c.targetDate,
              completionDate: c.completionDate,
              weightageMarks: c.weightageMarks,
              verifiedByAdmin: c.verifiedByAdmin,
            }))}
            className={className}
            boardName={boardName}
            batchName={student?.batchName || `${className} - Morning & Evening`}
            selectedSubject={selectedSubject === 'ALL' ? 'All Core Subjects' : selectedSubject}
            academicYear="AY 2024–2025"
            isForPreview
          />
        </PrintPreviewModal>
      )}
    </div>
  );
};

export default ParentPortionCompletionPage;
