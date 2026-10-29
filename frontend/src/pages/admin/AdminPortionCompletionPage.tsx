import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Edit2,
  Save,
  X,
  ShieldCheck,
} from 'lucide-react';
import { PrintTemplateHeader } from '../../components/common/PrintTemplateHeader';
import { PrintTemplateFooter } from '../../components/common/PrintTemplateFooter';
import { PrintButton } from '../../components/print/PrintButton';
import { PrintPreviewModal } from '../../components/print/PrintPreviewModal';
import { PortionCompletionPrintDocument } from '../../components/print/templates/PortionCompletionPrintDocument';
import { QuestionPaperPrintDocument } from '../../components/print/templates/QuestionPaperPrintDocument';
import {
  KARNATAKA_CLASS_9_CHAPTERS,
  getCurriculumApi,
  getCurriculumByBatchApi,
  getQuestionPapersApi,
  CurriculumChapter,
  QuestionPaper,
} from '../../services/curriculumService';
import { FileText, Printer, HelpCircle, Eye } from 'lucide-react';

interface AdminChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  subject: string;
  totalLectures: number;
  completedLectures: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  faculty: string;
  targetDate: string;
  completionDate?: string;
  weightageMarks: number;
  verifiedByAdmin: boolean;
}

// Fallback chapters
export const INITIAL_ADMIN_CHAPTERS: AdminChapterItem[] = [
  {
    id: 'adm-ch-phy-10',
    chapterNumber: 10,
    title: 'Light - Reflection and Refraction',
    subject: 'Physics',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '15 Aug 2026',
    completionDate: '15 Aug 2026',
    weightageMarks: 10,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-phy-11',
    chapterNumber: 11,
    title: 'The Human Eye and the Colourful World',
    subject: 'Physics',
    totalLectures: 10,
    completedLectures: 10,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '05 Sep 2026',
    completionDate: '05 Sep 2026',
    weightageMarks: 5,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-phy-12',
    chapterNumber: 12,
    title: 'Electricity',
    subject: 'Physics',
    totalLectures: 16,
    completedLectures: 12,
    status: 'IN_PROGRESS',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '30 Sep 2026',
    weightageMarks: 8,
    verifiedByAdmin: false,
  },
  {
    id: 'adm-ch-phy-13',
    chapterNumber: 13,
    title: 'Magnetic Effects of Electric Current',
    subject: 'Physics',
    totalLectures: 12,
    completedLectures: 0,
    status: 'SCHEDULED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '25 Oct 2026',
    weightageMarks: 6,
    verifiedByAdmin: false,
  },

  // Chemistry
  {
    id: 'adm-ch-chm-01',
    chapterNumber: 1,
    title: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    faculty: 'Dr. Anita Joshi',
    targetDate: '10 Aug 2026',
    completionDate: '10 Aug 2026',
    weightageMarks: 6,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-chm-02',
    chapterNumber: 2,
    title: 'Acids, Bases and Salts',
    subject: 'Chemistry',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    faculty: 'Dr. Anita Joshi',
    targetDate: '02 Sep 2026',
    completionDate: '02 Sep 2026',
    weightageMarks: 8,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-chm-03',
    chapterNumber: 3,
    title: 'Metals and Non-metals',
    subject: 'Chemistry',
    totalLectures: 14,
    completedLectures: 10,
    status: 'IN_PROGRESS',
    faculty: 'Dr. Anita Joshi',
    targetDate: '05 Oct 2026',
    weightageMarks: 7,
    verifiedByAdmin: false,
  },
  {
    id: 'adm-ch-chm-04',
    chapterNumber: 4,
    title: 'Carbon and its Compounds',
    subject: 'Chemistry',
    totalLectures: 16,
    completedLectures: 0,
    status: 'SCHEDULED',
    faculty: 'Dr. Anita Joshi',
    targetDate: '15 Nov 2026',
    weightageMarks: 9,
    verifiedByAdmin: false,
  },

  // Biology
  {
    id: 'adm-ch-bio-06',
    chapterNumber: 6,
    title: 'Life Processes',
    subject: 'Biology',
    totalLectures: 18,
    completedLectures: 18,
    status: 'COMPLETED',
    faculty: 'Dr. Vikram Rao',
    targetDate: '20 Aug 2026',
    completionDate: '20 Aug 2026',
    weightageMarks: 10,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-bio-07',
    chapterNumber: 7,
    title: 'Control and Coordination',
    subject: 'Biology',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    faculty: 'Dr. Vikram Rao',
    targetDate: '12 Sep 2026',
    completionDate: '12 Sep 2026',
    weightageMarks: 6,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-bio-08',
    chapterNumber: 8,
    title: 'How do Organisms Reproduce?',
    subject: 'Biology',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    faculty: 'Dr. Vikram Rao',
    targetDate: '22 Sep 2026',
    completionDate: '22 Sep 2026',
    weightageMarks: 8,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-bio-09',
    chapterNumber: 9,
    title: 'Heredity and Evolution',
    subject: 'Biology',
    totalLectures: 12,
    completedLectures: 6,
    status: 'IN_PROGRESS',
    faculty: 'Dr. Vikram Rao',
    targetDate: '10 Oct 2026',
    weightageMarks: 5,
    verifiedByAdmin: false,
  },
  {
    id: 'adm-ch-bio-15',
    chapterNumber: 15,
    title: 'Our Environment',
    subject: 'Biology',
    totalLectures: 8,
    completedLectures: 0,
    status: 'SCHEDULED',
    faculty: 'Dr. Vikram Rao',
    targetDate: '30 Oct 2026',
    weightageMarks: 4,
    verifiedByAdmin: false,
  },

  // Mathematics
  {
    id: 'adm-ch-mat-01',
    chapterNumber: 1,
    title: 'Real Numbers',
    subject: 'Mathematics',
    totalLectures: 8,
    completedLectures: 8,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '05 Aug 2026',
    completionDate: '05 Aug 2026',
    weightageMarks: 6,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-mat-02',
    chapterNumber: 2,
    title: 'Polynomials',
    subject: 'Mathematics',
    totalLectures: 10,
    completedLectures: 10,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '18 Aug 2026',
    completionDate: '18 Aug 2026',
    weightageMarks: 5,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-mat-03',
    chapterNumber: 3,
    title: 'Pair of Linear Equations in Two Variables',
    subject: 'Mathematics',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '02 Sep 2026',
    completionDate: '02 Sep 2026',
    weightageMarks: 7,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-mat-04',
    chapterNumber: 4,
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '16 Sep 2026',
    completionDate: '16 Sep 2026',
    weightageMarks: 6,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-mat-05',
    chapterNumber: 5,
    title: 'Arithmetic Progressions',
    subject: 'Mathematics',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '24 Sep 2026',
    completionDate: '24 Sep 2026',
    weightageMarks: 6,
    verifiedByAdmin: true,
  },
  {
    id: 'adm-ch-mat-06',
    chapterNumber: 6,
    title: 'Triangles',
    subject: 'Mathematics',
    totalLectures: 16,
    completedLectures: 6,
    status: 'IN_PROGRESS',
    faculty: 'Mrs. Priya Sundaram',
    targetDate: '12 Oct 2026',
    weightageMarks: 8,
    verifiedByAdmin: false,
  },
];

const KSB_CLASS_9_ADMIN_CHAPTERS: AdminChapterItem[] = KARNATAKA_CLASS_9_CHAPTERS.map((ch) => ({
  id: ch.id,
  chapterNumber: ch.chapterNumber,
  title: ch.title,
  subject: ch.subjectName,
  totalLectures: ch.totalLectures,
  completedLectures: ch.completedLectures,
  status: ch.status,
  faculty: ch.facultyName,
  targetDate: ch.targetDate,
  completionDate: ch.completionDate,
  weightageMarks: ch.weightageMarks,
  verifiedByAdmin: ch.verifiedByAdmin,
}));

export const ADMIN_CURRICULUM_TRACKS = [
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

export const AdminPortionCompletionPage: React.FC = () => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('ksb-9');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'SYLLABUS' | 'QUESTION_PAPERS'>('SYLLABUS');

  const [chapters, setChapters] = useState<AdminChapterItem[]>(KSB_CLASS_9_ADMIN_CHAPTERS);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);

  // Question Paper Preview & Print Modal
  const [previewPaper, setPreviewPaper] = useState<QuestionPaper | null>(null);
  const [showAnswerKeyInPrint, setShowAnswerKeyInPrint] = useState<boolean>(false);
  const [answerSpacePreference, setAnswerSpacePreference] = useState<'none' | 'lines' | 'box' | 'diagram' | 'calculation'>('none');

  const activeTrack = ADMIN_CURRICULUM_TRACKS.find((t) => t.id === selectedTrackId) || ADMIN_CURRICULUM_TRACKS[0];
  const isClass9 = activeTrack.classId === 'cls-9';

  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLectures, setEditLectures] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'>('IN_PROGRESS');
  const [notification, setNotification] = useState<string | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      let chList: CurriculumChapter[] = [];
      if (selectedBatchId !== 'ALL') {
        chList = await getCurriculumByBatchApi(selectedBatchId);
      } else {
        chList = await getCurriculumApi({
          classId: activeTrack.classId,
          boardId: activeTrack.boardId,
        });
      }
      setChapters(
        chList.map((ch) => ({
          id: ch.id,
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          subject: ch.subjectName,
          totalLectures: ch.totalLectures,
          completedLectures: ch.completedLectures,
          status: ch.status,
          faculty: ch.facultyName,
          targetDate: ch.targetDate,
          completionDate: ch.completionDate,
          weightageMarks: ch.weightageMarks,
          verifiedByAdmin: ch.verifiedByAdmin,
        }))
      );

      const qpList = await getQuestionPapersApi({
        classId: activeTrack.classId,
        boardId: activeTrack.boardId,
      });
      setQuestionPapers(qpList);
    };
    loadData();
  }, [selectedTrackId, selectedBatchId]);

  const subjects = ['ALL', 'Physics', 'Chemistry', 'Biology', 'Mathematics'];

  const filteredChapters = chapters.filter((ch) => {
    if (selectedSubject !== 'ALL' && ch.subject !== selectedSubject) return false;
    if (selectedStatus !== 'ALL' && ch.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ch.title.toLowerCase().includes(q) ||
        ch.subject.toLowerCase().includes(q) ||
        ch.faculty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.status === 'COMPLETED').length;
  const inProgressChapters = chapters.filter((c) => c.status === 'IN_PROGRESS').length;
  const scheduledChapters = chapters.filter((c) => c.status === 'SCHEDULED').length;

  const totalLecturesCount = chapters.reduce((acc, c) => acc + c.totalLectures, 0);
  const completedLecturesCount = chapters.reduce((acc, c) => acc + c.completedLectures, 0);
  const overallPercentage = Math.round((completedLecturesCount / totalLecturesCount) * 100);

  const handleVerify = (id: string) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verifiedByAdmin: true } : c))
    );
    setNotification('Curriculum milestone officially verified by Administrator.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartEdit = (ch: AdminChapterItem) => {
    setEditingId(ch.id);
    setEditLectures(ch.completedLectures);
    setEditStatus(ch.status);
  };

  const handleSaveEdit = (id: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const isDone = editStatus === 'COMPLETED' || editLectures >= ch.totalLectures;
          return {
            ...ch,
            completedLectures: editLectures,
            status: isDone ? 'COMPLETED' : editStatus,
            completionDate: isDone ? '24 Sep 2026' : ch.completionDate,
            verifiedByAdmin: isDone,
          };
        }
        return ch;
      })
    );
    setEditingId(null);
    setNotification('Curriculum record updated and published across portals.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Official Institutional Print Header */}
      <PrintTemplateHeader
        documentTitle="CURRICULUM & SYLLABUS PORTION COMPLETION REPORT"
        documentSubtitle="Official Institutional Syllabus Delivery, Verified Lectures & Board Milestone Log"
        reportCategory="PORTION COMPLETION REPORT"
        academicYear="AY 2024–25 (Term 2)"
        subject={selectedSubject !== 'ALL' ? selectedSubject : 'Physics, Chemistry, Biology & Mathematics'}
        facultyName="Mrs. Priya Sundaram, Dr. Vikram Rao, Dr. Anita Deshmukh"
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <CheckSquare className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#155EEF]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Administrative Curriculum & Milestone Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Portion & Syllabus Completion Tracker
            </h1>
            <p className="text-indigo-100/90 text-sm mt-1 max-w-2xl">
              Monitor academic delivery timelines, verified lecture logs, and board syllabus completion targets across Physics, Chemistry, Biology, and Mathematics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PrintButton
              onClick={() => setShowPrintPreview(true)}
              label="Print Syllabus Report"
              title="Print official syllabus completion report"
              variant="white"
              size="md"
            />
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Classes & Batches Selector Row (Admin) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Class &amp; Batch:
          </span>

          {/* Class Toggle */}
          {/* Track Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 flex-wrap">
            {ADMIN_CURRICULUM_TRACKS.map((t) => {
              const isSelected = selectedTrackId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTrackId(t.id);
                    setSelectedBatchId('ALL');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Batch Selector Dropdown */}
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white text-slate-800"
          >
            <option value="ALL">All Batches (Composite View)</option>
            {selectedTrackId === 'ksb-9' && (
              <>
                <option value="batch-9a-morning">Batch 9-A Morning (07:00 AM - 08:30 AM)</option>
                <option value="batch-9a-evening">Batch 9-A Evening (05:00 PM - 06:30 PM)</option>
              </>
            )}
            {selectedTrackId === 'cbse-9' && (
              <>
                <option value="batch-9b-morning">Batch 9-B Morning (07:00 AM - 08:30 AM)</option>
                <option value="batch-9b-evening">Batch 9-B Evening (05:00 PM - 06:30 PM)</option>
              </>
            )}
            {selectedTrackId === 'ksb-10' && (
              <>
                <option value="batch-10b-morning">Batch 10-B Morning (07:00 AM - 08:30 AM)</option>
                <option value="batch-10b-evening">Batch 10-B Evening (05:30 PM - 07:00 PM)</option>
              </>
            )}
            {selectedTrackId === 'cbse-10' && (
              <>
                <option value="batch-10a-morning">Batch 10-A Morning (07:00 AM - 08:30 AM)</option>
                <option value="batch-10a-evening">Batch 10-A Evening (05:30 PM - 07:00 PM)</option>
              </>
            )}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('SYLLABUS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'SYLLABUS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Curriculum Tracker ({chapters.length})
          </button>
          <button
            onClick={() => setActiveTab('QUESTION_PAPERS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'QUESTION_PAPERS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            Official Question Papers ({questionPapers.length})
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <StatCard
          title="Overall Syllabus Progress"
          value={`${overallPercentage}%`}
          subtitle={`${completedLecturesCount} of ${totalLecturesCount} Lectures Delivered`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Completed Chapters"
          value={completedChapters}
          subtitle={`Out of ${totalChapters} Total Chapters`}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Under Active Delivery"
          value={inProgressChapters}
          subtitle="4 Chapters in Progress"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Scheduled Milestones"
          value={scheduledChapters}
          subtitle="3 Chapters Target by Nov 15"
          icon={<Layers className="w-5 h-5 text-[#00B8F8]" />}
        />
      </div>

      {/* Subject-Wise Progress Meter */}
      <Card className="p-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Class 10 CBSE Board Syllabus Coverage
            </h3>
            <p className="text-xs text-gray-500">
              Institutional benchmark target: 100% syllabus delivered before 15 November 2026.
            </p>
          </div>
          <span className="text-2xl font-black text-[#155EEF]">{overallPercentage}% Overall</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#155EEF] via-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Physics</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-gray-800">85% Complete</span>
              <span className="text-xs text-emerald-600 font-medium">3/4 Ch</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Chemistry</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-gray-800">80% Complete</span>
              <span className="text-xs text-emerald-600 font-medium">2/4 Ch</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Biology</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-gray-800">90% Complete</span>
              <span className="text-xs text-emerald-600 font-medium">3/5 Ch</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
              <div className="bg-[#00B8F8] h-1.5 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Mathematics</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-gray-800">88% Complete</span>
              <span className="text-xs text-emerald-600 font-medium">5/6 Ch</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
              <div className="bg-[#155EEF] h-1.5 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="p-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Subject:
            </span>
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSubject === sub
                    ? 'bg-[#155EEF] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapter, faculty, topic..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#155EEF]"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Chapters Table (Screen Interactive View) */}
      {activeTab === 'SYLLABUS' && (
        <div className="space-y-3 print:hidden">
        {filteredChapters.map((ch) => {
          const isEditing = editingId === ch.id;
          const pct = Math.round((ch.completedLectures / ch.totalLectures) * 100);

          return (
            <Card key={ch.id} className="p-5 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 ${
                      ch.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ch.status === 'IN_PROGRESS'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]'
                    }`}
                  >
                    Ch {ch.chapterNumber}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                        {ch.subject}
                      </span>
                      <span className="text-xs text-gray-400">&bull;</span>
                      <span className="text-xs text-gray-600 font-medium">Faculty: {ch.faculty}</span>
                      <span className="text-xs text-gray-400">&bull;</span>
                      <span className="text-xs font-semibold text-[#155EEF] bg-[#EEF4FF] border border-[#DCE5F2] px-2 py-0.5 rounded">
                        Weightage: {ch.weightageMarks} Marks
                      </span>
                      {ch.verifiedByAdmin && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Admin Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{ch.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Lectures: {ch.completedLectures}/{ch.totalLectures} ({pct}%)
                      </span>
                      {ch.completionDate ? (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Delivered by {ch.completionDate}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Calendar className="w-3.5 h-3.5" />
                          Target Completion: {ch.targetDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                  {!isEditing ? (
                    <>
                      {!ch.verifiedByAdmin && ch.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerify(ch.id)}
                          className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                          Verify Milestone
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(ch)}
                        className="text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit Record
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-gray-500 font-medium">Lectures:</label>
                        <input
                          type="number"
                          min={0}
                          max={ch.totalLectures}
                          value={editLectures}
                          onChange={(e) => setEditLectures(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                        />
                      </div>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded bg-white"
                      >
                        <option value="COMPLETED">Completed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="SCHEDULED">Scheduled</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(ch.id)}
                        className="bg-[#155EEF] hover:bg-[#1048B5] text-white text-xs px-2.5 py-1"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        Save
                      </Button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                <div
                  className={`h-1.5 rounded-full ${
                    ch.status === 'COMPLETED'
                      ? 'bg-emerald-500'
                      : ch.status === 'IN_PROGRESS'
                      ? 'bg-amber-500'
                      : 'bg-blue-300'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>
          );
        })}
        </div>
      )}

      {/* TAB 2: QUESTION PAPERS VIEW (Admin Portal) */}
      {activeTab === 'QUESTION_PAPERS' && (
        <div className="space-y-5 print:hidden">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                {isClass9 ? 'Karnataka State Board' : 'CBSE'} {isClass9 ? 'Class 9' : 'Class 10'} Question Papers
              </span>
              <h2 className="text-xl font-bold">
                Periodic Assessment Master Papers ({questionPapers.length} Total)
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                Official institutional test copies with full marking schemes and question keys, formatted in ISO 216 standard A4 sheet print specifications.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionPapers.map((paper) => {
              const qCount = paper.sections.reduce((acc, s) => acc + s.questions.length, 0);
              return (
                <div
                  key={paper.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {paper.subjectCode} &bull; {paper.className}
                        </span>
                        <h4 className="font-black text-slate-900 text-base mt-1">{paper.title}</h4>
                        <span className="text-xs text-slate-500 font-medium">{paper.boardName}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                        {paper.totalMarks} Marks
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700 border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Time</span>
                        <span className="font-bold text-slate-800">{paper.duration}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Sections</span>
                        <span className="font-bold text-slate-800">{paper.sections.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Questions</span>
                        <span className="font-bold text-slate-800">{qCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setPreviewPaper(paper);
                        setShowAnswerKeyInPrint(false);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Paper
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPreviewPaper(paper);
                          setShowAnswerKeyInPrint(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Solutions (A4)
                      </button>

                      <button
                        onClick={() => {
                          setPreviewPaper(paper);
                          setShowAnswerKeyInPrint(false);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print A4
                      </button>
                    </div>
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
          {/* Top Interactive Configuration Strip */}
          <div className="no-print bg-slate-100 border border-slate-300 rounded-lg p-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Format Toggle: Student Paper vs Teacher Key */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
              <button
                type="button"
                onClick={() => setShowAnswerKeyInPrint(false)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  !showAnswerKeyInPrint
                    ? 'bg-[#0A3622] text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Student Paper (Clean)
              </button>
              <button
                type="button"
                onClick={() => setShowAnswerKeyInPrint(true)}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  showAnswerKeyInPrint
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Teacher Answer Key &amp; Scheme
              </button>
            </div>

            {/* Answer Space Selector (when in Student Paper mode) */}
            {!showAnswerKeyInPrint && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 text-[11px]">Answer Space:</span>
                <select
                  value={answerSpacePreference}
                  onChange={(e) => setAnswerSpacePreference(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold text-slate-800"
                >
                  <option value="none">Compact (Questions Only)</option>
                  <option value="lines">Ruled Answer Lines</option>
                  <option value="box">Blank Writing Box</option>
                  <option value="calculation">Calculations / Rough Work</option>
                </select>
              </div>
            )}
          </div>

          <QuestionPaperPrintDocument
            paper={previewPaper}
            showAnswerKey={showAnswerKeyInPrint}
            answerSpacePreference={answerSpacePreference}
            isForPreview
          />
        </PrintPreviewModal>
      )}

      {/* ========================================================= */}
      {/* SYSTEMATIC INSTITUTIONAL PRINTABLE TABLE (Print Only)     */}
      {/* ========================================================= */}
      <div className="hidden print:block w-full">
        <table className="w-full text-left border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-black text-[9pt] uppercase font-bold border-b border-slate-300">
              <th className="p-1.5 border border-slate-300 text-center w-12">Ch #</th>
              <th className="p-1.5 border border-slate-300 w-24">Subject</th>
              <th className="p-1.5 border border-slate-300">Chapter / Curriculum Unit</th>
              <th className="p-1.5 border border-slate-300 w-32">Faculty In-Charge</th>
              <th className="p-1.5 border border-slate-300 text-center w-24">Lectures</th>
              <th className="p-1.5 border border-slate-300 text-center w-20">Weightage</th>
              <th className="p-1.5 border border-slate-300 w-24">Target Date</th>
              <th className="p-1.5 border border-slate-300 w-24">Delivered On</th>
              <th className="p-1.5 border border-slate-300 text-center w-20">Status</th>
            </tr>
          </thead>
          <tbody className="text-[8.5pt] divide-y divide-slate-200">
            {filteredChapters.map((ch, index) => {
              const pct = Math.round((ch.completedLectures / ch.totalLectures) * 100);
              return (
                <tr key={ch.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="p-1.5 text-center font-bold text-black border border-slate-300">
                    {ch.chapterNumber}
                  </td>
                  <td className="p-1.5 font-bold text-[#155EEF] border border-slate-300">
                    {ch.subject}
                  </td>
                  <td className="p-1.5 font-bold text-slate-900 border border-slate-300">
                    {ch.title}
                  </td>
                  <td className="p-1.5 text-slate-800 border border-slate-300">
                    {ch.faculty}
                  </td>
                  <td className="p-1.5 text-center font-mono font-semibold text-black border border-slate-300">
                    {ch.completedLectures} / {ch.totalLectures} ({pct}%)
                  </td>
                  <td className="p-1.5 text-center font-semibold text-slate-800 border border-slate-300">
                    {ch.weightageMarks} Marks
                  </td>
                  <td className="p-1.5 text-slate-700 border border-slate-300">
                    {ch.targetDate}
                  </td>
                  <td className="p-1.5 text-slate-700 border border-slate-300">
                    {ch.completionDate || '—'}
                  </td>
                  <td className="p-1.5 text-center border border-slate-300">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[8.5pt] font-bold ${
                        ch.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ch.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ch.status === 'COMPLETED' ? 'COMPLETED' : ch.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'SCHEDULED'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Print Summary Statistics */}
        <div className="mt-2.5 flex items-center justify-between text-[8.5pt] bg-slate-50 p-2 border border-slate-300 rounded">
          <span><strong>Total Syllabus Delivered:</strong> {overallPercentage}% Complete</span>
          <span><strong>Delivered Lectures:</strong> {completedLecturesCount} of {totalLecturesCount} Hours</span>
          <span><strong>Admin Verification:</strong> Certified Institutional Log</span>
        </div>

        {/* Official Letterhead Footer with Signatures */}
        <PrintTemplateFooter customNote="Official Syllabus and Portion Completion Record of Infinite Tutorial. Generated from Academic ERP." />
      </div>

      {/* UNIVERSAL PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        title="Syllabus & Portion Completion Report"
        defaultOrientation="portrait"
      >
        <PortionCompletionPrintDocument
          chapters={filteredChapters}
          batchName={isClass9 ? 'Class 9 Karnataka State Board - Composite' : 'Class 10 CBSE - Composite'}
          className={isClass9 ? 'Class 9' : 'Class 10'}
          boardName={isClass9 ? 'Karnataka State Board' : 'CBSE'}
          selectedSubject={selectedSubject}
          isForPreview
        />
      </PrintPreviewModal>
    </div>
  );
};
export default AdminPortionCompletionPage;
