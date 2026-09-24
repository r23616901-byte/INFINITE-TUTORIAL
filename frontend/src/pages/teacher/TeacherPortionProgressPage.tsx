import React, { useState } from 'react';
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
  Printer,
  Edit2,
  Save,
  X,
} from 'lucide-react';

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

const INITIAL_SYLLABUS: SyllabusChapter[] = [
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

export const TeacherPortionProgressPage: React.FC = () => {
  const [chapters, setChapters] = useState<SyllabusChapter[]>(INITIAL_SYLLABUS);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editCompletedLectures, setEditCompletedLectures] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'>('IN_PROGRESS');
  const [notification, setNotification] = useState<string | null>(null);

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
  const overallPercentage = Math.round((completedLecturesCount / totalLecturesCount) * 100);

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
            completionDate: isDone ? '24 Sep 2026' : ch.completionDate,
          };
        }
        return ch;
      })
    );
    setEditingChapterId(null);
    setNotification('Portion progress updated successfully and synced with parent portal.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BookOpen className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-emerald-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              CBSE Class 10 Syllabus & Portion Milestone Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Syllabus & Portion Progress
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl">
              Track lecture delivery, chapter completion milestones, and topic coverage for Batch 10A (Morning & Evening sessions). Synchronized in real time with parent scorecards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Syllabus Tracker
            </Button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          icon={<Layers className="w-5 h-5 text-purple-600" />}
        />
      </div>

      {/* Progress Bar Header Card */}
      <Card className="p-6">
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
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '90%' }} />
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Mathematics</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-gray-800">88% Complete</span>
              <span className="text-xs text-emerald-600 font-medium">5/6 Ch</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Filters and Search Bar */}
      <Card className="p-4">
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

      {/* Chapters Table & Cards */}
      <div className="space-y-4">
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
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
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
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
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
                        : 'bg-purple-50 text-purple-700 border-purple-200'
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
                      : 'bg-purple-300'
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
    </div>
  );
};
export default TeacherPortionProgressPage;
