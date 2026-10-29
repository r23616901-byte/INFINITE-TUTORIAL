import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Edit2,
  Save,
  X,
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

interface SyllabusChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subject: string;
  totalLectures: number;
  completedLectures: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  completionDate?: string;
  targetDate: string;
  topicsCovered: string[];
  pendingTopics: string[];
  facultyName: string;
  weightageMarks: number;
}

export const INITIAL_SYLLABUS: SyllabusChapter[] = [
  // Physics (Class 10 CBSE)
  {
    id: 'ch-phy-10',
    chapterNumber: 10,
    title: 'Light - Reflection and Refraction',
    subject: 'Physics',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    completionDate: '15 Aug 2026',
    targetDate: '15 Aug 2026',
    topicsCovered: [
      'Spherical mirrors, mirror formula & magnification',
      'Refraction through glass slab, Snell’s law',
      'Lens formula, magnification & power of lens',
      'Ray diagrams for convex & concave lenses',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 10,
  },
  {
    id: 'ch-phy-11',
    chapterNumber: 11,
    title: 'The Human Eye and the Colourful World',
    subject: 'Physics',
    totalLectures: 10,
    completedLectures: 10,
    status: 'COMPLETED',
    completionDate: '05 Sep 2026',
    targetDate: '05 Sep 2026',
    topicsCovered: [
      'Structure of human eye & power of accommodation',
      'Defects of vision (Myopia, Hypermetropia, Presbyopia)',
      'Refraction through glass prism & dispersion',
      'Atmospheric refraction & scattering of light (Tyndall effect)',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 5,
  },
  {
    id: 'ch-phy-12',
    chapterNumber: 12,
    title: 'Electricity',
    subject: 'Physics',
    totalLectures: 16,
    completedLectures: 12,
    status: 'IN_PROGRESS',
    targetDate: '30 Sep 2026',
    topicsCovered: [
      'Electric current, potential difference & Ohm’s law',
      'Resistance, factors affecting resistance, resistivity',
      'Resistors in series and parallel combinations',
    ],
    pendingTopics: [
      'Joule’s law of heating & applications',
      'Electric power & commercial units of electrical energy',
    ],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 8,
  },
  {
    id: 'ch-phy-13',
    chapterNumber: 13,
    title: 'Magnetic Effects of Electric Current',
    subject: 'Physics',
    totalLectures: 12,
    completedLectures: 0,
    status: 'SCHEDULED',
    targetDate: '25 Oct 2026',
    topicsCovered: [],
    pendingTopics: [
      'Magnetic field & field lines, Right-hand thumb rule',
      'Force on a current-carrying conductor in a magnetic field',
      'Fleming’s Left-Hand Rule & electric motor principle',
      'Electromagnetic induction & domestic electric circuits',
    ],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 6,
  },

  // Chemistry (Class 10 CBSE)
  {
    id: 'ch-chm-01',
    chapterNumber: 1,
    title: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    completionDate: '10 Aug 2026',
    targetDate: '10 Aug 2026',
    topicsCovered: [
      'Writing and balancing chemical equations',
      'Combination, Decomposition & Displacement reactions',
      'Double displacement & precipitation reactions',
      'Oxidation, reduction, rancidity & corrosion',
    ],
    pendingTopics: [],
    facultyName: 'Dr. Anita Joshi',
    weightageMarks: 6,
  },
  {
    id: 'ch-chm-02',
    chapterNumber: 2,
    title: 'Acids, Bases and Salts',
    subject: 'Chemistry',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    completionDate: '02 Sep 2026',
    targetDate: '02 Sep 2026',
    topicsCovered: [
      'Chemical properties of acids and bases with indicators',
      'pH scale and importance in everyday life',
      'Preparation of Bleaching Powder, Baking Soda, Washing Soda',
      'Plaster of Paris and Water of Crystallization',
    ],
    pendingTopics: [],
    facultyName: 'Dr. Anita Joshi',
    weightageMarks: 8,
  },
  {
    id: 'ch-chm-03',
    chapterNumber: 3,
    title: 'Metals and Non-metals',
    subject: 'Chemistry',
    totalLectures: 14,
    completedLectures: 10,
    status: 'IN_PROGRESS',
    targetDate: '05 Oct 2026',
    topicsCovered: [
      'Physical & chemical properties of metals and non-metals',
      'Reactivity series & ionic compounds formation',
    ],
    pendingTopics: [
      'Occurrence of metals & metallurgy extraction processes',
      'Corrosion prevention and alloying methods',
    ],
    facultyName: 'Dr. Anita Joshi',
    weightageMarks: 7,
  },
  {
    id: 'ch-chm-04',
    chapterNumber: 4,
    title: 'Carbon and its Compounds',
    subject: 'Chemistry',
    totalLectures: 16,
    completedLectures: 0,
    status: 'SCHEDULED',
    targetDate: '15 Nov 2026',
    topicsCovered: [],
    pendingTopics: [
      'Covalent bonding in carbon compounds',
      'Versatile nature of carbon & homologous series',
      'IUPAC nomenclature & functional groups',
      'Properties of Ethanol & Ethanoic acid',
      'Soaps and Detergents cleaning action',
    ],
    facultyName: 'Dr. Anita Joshi',
    weightageMarks: 9,
  },

  // Biology (Class 10 CBSE)
  {
    id: 'ch-bio-06',
    chapterNumber: 6,
    title: 'Life Processes',
    subject: 'Biology',
    totalLectures: 18,
    completedLectures: 18,
    status: 'COMPLETED',
    completionDate: '20 Aug 2026',
    targetDate: '20 Aug 2026',
    topicsCovered: [
      'Nutrition in plants & human digestive system',
      'Respiration in plants and humans (Aerobic vs Anaerobic)',
      'Transportation in humans (Heart & Double circulation)',
      'Excretion in human beings and nephron function',
    ],
    pendingTopics: [],
    facultyName: 'Dr. Vikram Rao',
    weightageMarks: 10,
  },
  {
    id: 'ch-bio-07',
    chapterNumber: 7,
    title: 'Control and Coordination',
    subject: 'Biology',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    completionDate: '12 Sep 2026',
    targetDate: '12 Sep 2026',
    topicsCovered: [
      'Nervous system & Reflex arcs in human body',
      'Human brain structure and functions',
      'Plant hormones & directional movements (Tropic)',
      'Endocrine glands and human hormones',
    ],
    pendingTopics: [],
    facultyName: 'Dr. Vikram Rao',
    weightageMarks: 6,
  },
  {
    id: 'ch-bio-08',
    chapterNumber: 8,
    title: 'How do Organisms Reproduce?',
    subject: 'Biology',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    completionDate: '22 Sep 2026',
    targetDate: '22 Sep 2026',
    topicsCovered: [
      'Asexual reproduction modes (Fission, Budding, Spores)',
      'Sexual reproduction in flowering plants',
      'Human male & female reproductive systems',
      'Reproductive health, contraceptives & STDs',
    ],
    pendingTopics: [],
    facultyName: 'Dr. Vikram Rao',
    weightageMarks: 8,
  },
  {
    id: 'ch-bio-09',
    chapterNumber: 9,
    title: 'Heredity and Evolution',
    subject: 'Biology',
    totalLectures: 12,
    completedLectures: 6,
    status: 'IN_PROGRESS',
    targetDate: '10 Oct 2026',
    topicsCovered: [
      'Heredity & Mendel’s laws of inheritance',
      'Monohybrid and Dihybrid crosses',
    ],
    pendingTopics: [
      'Sex determination in humans',
      'Acquired vs inherited traits overview',
    ],
    facultyName: 'Dr. Vikram Rao',
    weightageMarks: 5,
  },
  {
    id: 'ch-bio-15',
    chapterNumber: 15,
    title: 'Our Environment',
    subject: 'Biology',
    totalLectures: 8,
    completedLectures: 0,
    status: 'SCHEDULED',
    targetDate: '30 Oct 2026',
    topicsCovered: [],
    pendingTopics: [
      'Eco-system, food chains and food webs',
      '10% energy flow law & biological magnification',
      'Ozone layer depletion & garbage management',
    ],
    facultyName: 'Dr. Vikram Rao',
    weightageMarks: 4,
  },

  // Mathematics (Class 10 CBSE)
  {
    id: 'ch-mat-01',
    chapterNumber: 1,
    title: 'Real Numbers',
    subject: 'Mathematics',
    totalLectures: 8,
    completedLectures: 8,
    status: 'COMPLETED',
    completionDate: '05 Aug 2026',
    targetDate: '05 Aug 2026',
    topicsCovered: [
      'Fundamental Theorem of Arithmetic',
      'Proof of irrationality of √2, √3, √5',
      'Applications of HCF and LCM',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 6,
  },
  {
    id: 'ch-mat-02',
    chapterNumber: 2,
    title: 'Polynomials',
    subject: 'Mathematics',
    totalLectures: 10,
    completedLectures: 10,
    status: 'COMPLETED',
    completionDate: '18 Aug 2026',
    targetDate: '18 Aug 2026',
    topicsCovered: [
      'Geometrical meaning of zeroes of a polynomial',
      'Relationship between zeroes and coefficients of quadratic polynomials',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 5,
  },
  {
    id: 'ch-mat-03',
    chapterNumber: 3,
    title: 'Pair of Linear Equations in Two Variables',
    subject: 'Mathematics',
    totalLectures: 14,
    completedLectures: 14,
    status: 'COMPLETED',
    completionDate: '02 Sep 2026',
    targetDate: '02 Sep 2026',
    topicsCovered: [
      'Graphical method of solution of a pair of linear equations',
      'Substitution & Elimination algebraic methods',
      'Word problems on upstream/downstream and ages',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 7,
  },
  {
    id: 'ch-mat-04',
    chapterNumber: 4,
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    completionDate: '16 Sep 2026',
    targetDate: '16 Sep 2026',
    topicsCovered: [
      'Standard form ax² + bx + c = 0',
      'Solutions by factorisation and quadratic formula',
      'Discriminant and nature of roots',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 6,
  },
  {
    id: 'ch-mat-05',
    chapterNumber: 5,
    title: 'Arithmetic Progressions',
    subject: 'Mathematics',
    totalLectures: 12,
    completedLectures: 12,
    status: 'COMPLETED',
    completionDate: '24 Sep 2026',
    targetDate: '24 Sep 2026',
    topicsCovered: [
      'General term of an A.P. (nth term)',
      'Sum of first n terms of an A.P.',
      'Real life word problems on AP',
    ],
    pendingTopics: [],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 6,
  },
  {
    id: 'ch-mat-06',
    chapterNumber: 6,
    title: 'Triangles',
    subject: 'Mathematics',
    totalLectures: 16,
    completedLectures: 6,
    status: 'IN_PROGRESS',
    targetDate: '12 Oct 2026',
    topicsCovered: [
      'Basic Proportionality Theorem (Thales theorem) and its converse',
      'Criteria for similarity of triangles (AAA, SSS, SAS)',
    ],
    pendingTopics: [
      'Areas of similar triangles theorem proof and riders',
      'Pythagoras theorem applications',
    ],
    facultyName: 'Mrs. Priya Sundaram',
    weightageMarks: 8,
  },
];

const KSB_CLASS_9_SYLLABUS: SyllabusChapter[] = KARNATAKA_CLASS_9_CHAPTERS.map((ch) => ({
  id: ch.id,
  chapterNumber: ch.chapterNumber,
  title: ch.title,
  subject: ch.subjectName,
  totalLectures: ch.totalLectures,
  completedLectures: ch.completedLectures,
  status: ch.status,
  completionDate: ch.completionDate,
  targetDate: ch.targetDate,
  topicsCovered: ch.topics,
  pendingTopics: ch.status === 'COMPLETED' ? [] : ['Periodic chapter exercises & mock practice problems'],
  facultyName: ch.facultyName,
  weightageMarks: ch.weightageMarks,
}));

export const TEACHER_CURRICULUM_TRACKS = [
  {
    id: 'ksb-9',
    label: 'Karnataka State Board — Class 9',
    shortLabel: 'Class 9 (KSB)',
    classId: 'cls-9',
    boardId: 'brd-ksb',
    className: 'Class 9',
    boardName: 'Karnataka State Board',
    defaultBatch: 'batch-9a-morning',
  },
  {
    id: 'ksb-10',
    label: 'Karnataka State Board — Class 10',
    shortLabel: 'Class 10 (KSB)',
    classId: 'cls-10',
    boardId: 'brd-ksb',
    className: 'Class 10',
    boardName: 'Karnataka State Board',
    defaultBatch: 'batch-10b-morning',
  },
  {
    id: 'cbse-9',
    label: 'CBSE Board — Class 9 (2026–27)',
    shortLabel: 'Class 9 (CBSE)',
    classId: 'cls-9',
    boardId: 'brd-cbse',
    className: 'Class 9',
    boardName: 'CBSE',
    defaultBatch: 'batch-9b-morning',
  },
  {
    id: 'cbse-10',
    label: 'CBSE Board — Class 10 (2026–27)',
    shortLabel: 'Class 10 (CBSE)',
    classId: 'cls-10',
    boardId: 'brd-cbse',
    className: 'Class 10',
    boardName: 'CBSE',
    defaultBatch: 'batch-10a-morning',
  },
];

export const TeacherPortionProgressPage: React.FC = () => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('ksb-9');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch-9a-morning');
  const [activeTab, setActiveTab] = useState<'PORTIONS' | 'QUESTION_PAPERS'>('PORTIONS');

  const [chapters, setChapters] = useState<SyllabusChapter[]>(KSB_CLASS_9_SYLLABUS);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);

  // Question Paper Preview & Print Modal
  const [previewPaper, setPreviewPaper] = useState<QuestionPaper | null>(null);
  const [showAnswerKeyInPrint, setShowAnswerKeyInPrint] = useState<boolean>(false);
  const [answerSpacePreference, setAnswerSpacePreference] = useState<'none' | 'lines' | 'box' | 'diagram' | 'calculation'>('none');

  const activeTrack = TEACHER_CURRICULUM_TRACKS.find((t) => t.id === selectedTrackId) || TEACHER_CURRICULUM_TRACKS[0];

  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editCompletedLectures, setEditCompletedLectures] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'>('IN_PROGRESS');
  const [notification, setNotification] = useState<string | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      let chList: CurriculumChapter[] = [];
      if (selectedBatchId) {
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
          completionDate: ch.completionDate,
          targetDate: ch.targetDate,
          topicsCovered: ch.topics,
          pendingTopics: ch.status === 'COMPLETED' ? [] : ['Periodic chapter exercises & mock practice problems'],
          facultyName: ch.facultyName,
          weightageMarks: ch.weightageMarks,
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
        ch.facultyName.toLowerCase().includes(q)
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
  const overallPercentage = totalLecturesCount > 0 ? Math.round((completedLecturesCount / totalLecturesCount) * 100) : 0;

  const handleStartEdit = (ch: SyllabusChapter) => {
    setEditingChapterId(ch.id);
    setEditCompletedLectures(ch.completedLectures);
    setEditStatus(ch.status);
  };

  const handleSaveEdit = (id: string) => {
    setChapters((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const isDone = editStatus === 'COMPLETED' || editCompletedLectures >= ch.totalLectures;
          return {
            ...ch,
            completedLectures: editCompletedLectures,
            status: isDone ? 'COMPLETED' : editStatus,
            completionDate: isDone ? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ch.completionDate,
          };
        }
        return ch;
      })
    );
    setEditingChapterId(null);
    setNotification('Portion progress updated successfully and synced with parent portal.');
    setTimeout(() => setNotification(null), 4000);
  };

  const currentClassName = activeTrack.className;
  const currentBoardName = activeTrack.boardName;
  const currentBatchLabel = selectedBatchId.toUpperCase();

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Official Institutional Print Header */}
      <PrintTemplateHeader
        documentTitle={`SYLLABUS & PORTION COMPLETION REPORT — ${currentClassName.toUpperCase()}`}
        documentSubtitle={`Official Lecture Delivery, Milestone Logs & Topic Coverage Tracker (${currentBoardName})`}
        reportCategory="PORTION COMPLETION REPORT"
        academicYear="AY 2024–25"
        subject={selectedSubject !== 'ALL' ? selectedSubject : 'Physics, Chemistry, Biology & Mathematics'}
        batchName={`${currentBatchLabel} (${currentBoardName})`}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#071633] via-[#0B1F4D] to-[#155EEF] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#155EEF]/30 print:hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BookOpen className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155EEF]/30 text-[#00B8F8] text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-[#00B8F8]/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {currentBoardName} {currentClassName} Syllabus &amp; Portion Milestone Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Syllabus &amp; Portion Progress
            </h1>
            <p className="text-blue-100/90 text-sm mt-1 max-w-2xl">
              Track lecture delivery, chapter completion milestones, and topic coverage for {currentBatchLabel}. Synchronized in real time with parent scorecards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PrintButton
              onClick={() => setShowPrintPreview(true)}
              label="Print Syllabus (A4)"
              title="Print official syllabus tracking report in A4 Sheet format"
              variant="white"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Classes & Batches Selector Row */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Class &amp; Batch:
          </span>

          {/* Track Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 flex-wrap">
            {TEACHER_CURRICULUM_TRACKS.map((t) => {
              const isSelected = selectedTrackId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTrackId(t.id);
                    setSelectedBatchId(t.defaultBatch);
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
            onClick={() => setActiveTab('PORTIONS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'PORTIONS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
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
            Question Papers ({questionPapers.length})
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
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
          title="In Progress"
          value={inProgressChapters}
          subtitle="Currently Under Active Teaching"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Scheduled / Upcoming"
          value={scheduledChapters}
          subtitle="Planned for Term 2 Final Stretch"
          icon={<Layers className="w-5 h-5 text-[#00B8F8]" />}
          iconBg="bg-[#E0F8FF]"
        />
      </div>

      {/* Progress Bar Header Card */}
      <Card className="p-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Batch 10A Curriculum Delivery Status
            </h3>
            <p className="text-xs text-gray-500">
              Target completion of 100% CBSE Board syllabus: 15 November 2026 before Mock Board Examinations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-emerald-600">{overallPercentage}%</span>
            <span className="text-xs text-gray-500">Overall Target Achieved</span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-700"
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

      {/* Filters and Search Bar */}
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
                    ? 'bg-emerald-600 text-white shadow-sm'
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
                placeholder="Search chapter or topic..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Chapters Table & Cards (Screen Interactive View) */}
      {activeTab === 'PORTIONS' && (
        <div className="space-y-4 print:hidden">
        {filteredChapters.map((ch) => {
          const isEditing = editingChapterId === ch.id;
          const pct = Math.round((ch.completedLectures / ch.totalLectures) * 100);

          return (
            <Card key={ch.id} className="p-5 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Chapter Info */}
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
                      <span className="text-xs text-gray-500">{ch.facultyName}</span>
                      <span className="text-xs text-gray-400">&bull;</span>
                      <span className="text-xs font-semibold text-[#155EEF] bg-[#EEF4FF] border border-[#DCE5F2] px-2 py-0.5 rounded">
                        Weightage: {ch.weightageMarks} Marks
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{ch.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        Lectures: {ch.completedLectures}/{ch.totalLectures} ({pct}%)
                      </span>
                      {ch.completionDate ? (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed on {ch.completionDate}
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

                {/* Status & Actions */}
                <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      ch.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : ch.status === 'IN_PROGRESS'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-[#EEF4FF] text-[#155EEF] border-[#DCE5F2]'
                    }`}
                  >
                    {ch.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {ch.status === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5 animate-spin" />}
                    {ch.status === 'SCHEDULED' && <Calendar className="w-3.5 h-3.5" />}
                    {ch.status === 'COMPLETED'
                      ? 'Completed'
                      : ch.status === 'IN_PROGRESS'
                      ? 'In Progress'
                      : 'Scheduled'}
                  </span>

                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartEdit(ch)}
                      className="text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Update Portion
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <label className="text-xs text-gray-500 font-medium">Lectures:</label>
                        <input
                          type="number"
                          min={0}
                          max={ch.totalLectures}
                          value={editCompletedLectures}
                          onChange={(e) => setEditCompletedLectures(Number(e.target.value))}
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        Save
                      </Button>
                      <button
                        onClick={() => setEditingChapterId(null)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar for the chapter */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                <div
                  className={`h-1.5 rounded-full ${
                    ch.status === 'COMPLETED'
                      ? 'bg-emerald-500'
                      : ch.status === 'IN_PROGRESS'
                      ? 'bg-amber-500'
                      : 'bg-[#155EEF]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Topics Breakdown */}
              <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {ch.topicsCovered.length > 0 && (
                  <div>
                    <span className="font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Topics Delivered:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                      {ch.topicsCovered.map((tpc, i) => (
                        <li key={i}>{tpc}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {ch.pendingTopics.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-800 flex items-center gap-1 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Upcoming Topics to Cover:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                      {ch.pendingTopics.map((tpc, i) => (
                        <li key={i}>{tpc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        </div>
      )}

      {/* TAB 2: QUESTION PAPERS VIEW (Teacher Portal) */}
      {activeTab === 'QUESTION_PAPERS' && (
        <div className="space-y-5 print:hidden">
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                {currentBoardName} {currentClassName} Assessment Papers
              </span>
              <h2 className="text-xl font-bold">
                Official 40-Mark Examination Question Papers ({questionPapers.length} Total)
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                Teacher question papers with detailed marking schemes and solutions formatted for ISO 216 standard A4 sheet printing.
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
              <th className="p-1.5 border border-slate-300">Chapter / Unit Title</th>
              <th className="p-1.5 border border-slate-300 w-32">Faculty</th>
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
                    {ch.facultyName}
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

        {/* Print Summary Metrics */}
        <div className="mt-2.5 flex items-center justify-between text-[8.5pt] bg-slate-50 p-2 border border-slate-300 rounded">
          <span><strong>Delivered Syllabus:</strong> {overallPercentage}% Complete ({completedLecturesCount} Lectures)</span>
          <span><strong>Completed Modules:</strong> {completedChapters} Chapters Verified</span>
          <span><strong>Academic Delivery:</strong> On-Track for Board Prep</span>
        </div>

        {/* Official Letterhead Footer with Signatures */}
        <PrintTemplateFooter customNote="Official Curriculum Progress Report of Infinite Tutorial. Teacher and Parent record verified." />
      </div>

      {/* UNIVERSAL PRINT PREVIEW MODAL */}
      <PrintPreviewModal
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        title="Teacher Syllabus & Portion Milestone Report"
        defaultOrientation="portrait"
      >
        <PortionCompletionPrintDocument
          chapters={filteredChapters.map((c) => ({
            id: c.id,
            chapterNumber: c.chapterNumber,
            title: c.title,
            subject: c.subject,
            totalLectures: c.totalLectures,
            completedLectures: c.completedLectures,
            status: c.status,
            faculty: c.facultyName,
            targetDate: c.targetDate,
            completionDate: c.completionDate,
          }))}
          batchName="CBSE Class 10 - Batch 10A"
          className="Class 10"
          boardName="CBSE"
          selectedSubject={selectedSubject}
          isForPreview
        />
      </PrintPreviewModal>
    </div>
  );
};
export default TeacherPortionProgressPage;
