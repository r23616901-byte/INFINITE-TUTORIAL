import React, { useState } from 'react';
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
  Printer,
  Search,
  Filter,
  Edit2,
  Save,
  X,
  ShieldCheck,
} from 'lucide-react';

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

const INITIAL_ADMIN_CHAPTERS: AdminChapterItem[] = [
  // Physics
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

export const AdminPortionCompletionPage: React.FC = () => {
  const [chapters, setChapters] = useState<AdminChapterItem[]>(INITIAL_ADMIN_CHAPTERS);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLectures, setEditLectures] = useState<number>(0);
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <CheckSquare className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-indigo-400/20 mb-3">
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
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Syllabus Report
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

      {/* Stat Cards */}
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
          title="Under Active Delivery"
          value={inProgressChapters}
          subtitle="4 Chapters in Progress"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Scheduled Milestones"
          value={scheduledChapters}
          subtitle="3 Chapters Target by Nov 15"
          icon={<Layers className="w-5 h-5 text-purple-600" />}
        />
      </div>

      {/* Subject-Wise Progress Meter */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Class 10 CBSE Board Syllabus Coverage
            </h3>
            <p className="text-xs text-gray-500">
              Institutional benchmark target: 100% syllabus delivered before 15 November 2026.
            </p>
          </div>
          <span className="text-2xl font-black text-indigo-600">{overallPercentage}% Overall</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-700"
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

      {/* Filter and Search Bar */}
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
                    ? 'bg-indigo-600 text-white shadow-sm'
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
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Chapters Table */}
      <div className="space-y-3">
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
                      <span className="text-xs text-gray-600 font-medium">Faculty: {ch.faculty}</span>
                      <span className="text-xs text-gray-400">&bull;</span>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
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
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 py-1"
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
                      : 'bg-purple-300'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default AdminPortionCompletionPage;
