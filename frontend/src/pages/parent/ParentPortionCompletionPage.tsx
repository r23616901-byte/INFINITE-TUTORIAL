import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  Download,
  TrendingUp,
} from 'lucide-react';

interface ChapterItem {
  id: string;
  chapterNumber: number;
  chapterName: string;
  subject: 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics';
  teacher: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  completionDate?: string;
  targetDate?: string;
  weightage: string;
  revisionStatus: 'REVISED' | 'SCHEDULED' | 'PENDING';
  totalLectures: number;
}

export const ParentPortionCompletionPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  const chapters: ChapterItem[] = [
    // PHYSICS (Prof. Rajesh Sharma)
    {
      id: 'phy-1',
      chapterNumber: 1,
      chapterName: 'Electricity & Electric Circuits',
      subject: 'Physics',
      teacher: 'Prof. Rajesh Sharma',
      status: 'COMPLETED',
      completionDate: '15 Aug 2026',
      weightage: '7 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 14,
    },
    {
      id: 'phy-2',
      chapterNumber: 2,
      chapterName: 'Magnetic Effects of Electric Current',
      subject: 'Physics',
      teacher: 'Prof. Rajesh Sharma',
      status: 'COMPLETED',
      completionDate: '02 Sept 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 12,
    },
    {
      id: 'phy-3',
      chapterNumber: 3,
      chapterName: 'Light: Reflection and Refraction',
      subject: 'Physics',
      teacher: 'Prof. Rajesh Sharma',
      status: 'COMPLETED',
      completionDate: '20 Sept 2026',
      weightage: '7 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 16,
    },
    {
      id: 'phy-4',
      chapterNumber: 4,
      chapterName: 'The Human Eye and the Colourful World',
      subject: 'Physics',
      teacher: 'Prof. Rajesh Sharma',
      status: 'IN_PROGRESS',
      targetDate: '10 Oct 2026',
      weightage: '5 Marks',
      revisionStatus: 'SCHEDULED',
      totalLectures: 8,
    },
    {
      id: 'phy-5',
      chapterNumber: 5,
      chapterName: 'Sources of Energy (Review)',
      subject: 'Physics',
      teacher: 'Prof. Rajesh Sharma',
      status: 'UPCOMING',
      targetDate: '25 Oct 2026',
      weightage: '3 Marks',
      revisionStatus: 'PENDING',
      totalLectures: 6,
    },

    // CHEMISTRY (Dr. Anita Deshmukh)
    {
      id: 'chm-1',
      chapterNumber: 1,
      chapterName: 'Chemical Reactions and Equations',
      subject: 'Chemistry',
      teacher: 'Dr. Anita Deshmukh',
      status: 'COMPLETED',
      completionDate: '18 Aug 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 12,
    },
    {
      id: 'chm-2',
      chapterNumber: 2,
      chapterName: 'Acids, Bases and Salts',
      subject: 'Chemistry',
      teacher: 'Dr. Anita Deshmukh',
      status: 'COMPLETED',
      completionDate: '05 Sept 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 14,
    },
    {
      id: 'chm-3',
      chapterNumber: 3,
      chapterName: 'Metals and Non-Metals',
      subject: 'Chemistry',
      teacher: 'Dr. Anita Deshmukh',
      status: 'COMPLETED',
      completionDate: '22 Sept 2026',
      weightage: '7 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 14,
    },
    {
      id: 'chm-4',
      chapterNumber: 4,
      chapterName: 'Carbon and its Compounds',
      subject: 'Chemistry',
      teacher: 'Dr. Anita Deshmukh',
      status: 'IN_PROGRESS',
      targetDate: '15 Oct 2026',
      weightage: '6 Marks',
      revisionStatus: 'SCHEDULED',
      totalLectures: 16,
    },
    {
      id: 'chm-5',
      chapterNumber: 5,
      chapterName: 'Periodic Classification of Elements',
      subject: 'Chemistry',
      teacher: 'Dr. Anita Deshmukh',
      status: 'UPCOMING',
      targetDate: '30 Oct 2026',
      weightage: '5 Marks',
      revisionStatus: 'PENDING',
      totalLectures: 8,
    },

    // BIOLOGY (Dr. Vikram Rao)
    {
      id: 'bio-1',
      chapterNumber: 1,
      chapterName: 'Life Processes (Nutrition, Respiration, Transport)',
      subject: 'Biology',
      teacher: 'Dr. Vikram Rao',
      status: 'COMPLETED',
      completionDate: '20 Aug 2026',
      weightage: '9 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 18,
    },
    {
      id: 'bio-2',
      chapterNumber: 2,
      chapterName: 'Control and Coordination',
      subject: 'Biology',
      teacher: 'Dr. Vikram Rao',
      status: 'COMPLETED',
      completionDate: '08 Sept 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 12,
    },
    {
      id: 'bio-3',
      chapterNumber: 3,
      chapterName: 'How do Organisms Reproduce?',
      subject: 'Biology',
      teacher: 'Dr. Vikram Rao',
      status: 'COMPLETED',
      completionDate: '23 Sept 2026',
      weightage: '7 Marks',
      revisionStatus: 'SCHEDULED',
      totalLectures: 14,
    },
    {
      id: 'bio-4',
      chapterNumber: 4,
      chapterName: 'Heredity and Evolution',
      subject: 'Biology',
      teacher: 'Dr. Vikram Rao',
      status: 'IN_PROGRESS',
      targetDate: '12 Oct 2026',
      weightage: '6 Marks',
      revisionStatus: 'PENDING',
      totalLectures: 10,
    },

    // MATHEMATICS (Mrs. Priya Sundaram)
    {
      id: 'mat-1',
      chapterNumber: 1,
      chapterName: 'Real Numbers & Fundamental Theorem',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'COMPLETED',
      completionDate: '10 Aug 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 10,
    },
    {
      id: 'mat-2',
      chapterNumber: 2,
      chapterName: 'Polynomials & Zeros Analysis',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'COMPLETED',
      completionDate: '22 Aug 2026',
      weightage: '5 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 10,
    },
    {
      id: 'mat-3',
      chapterNumber: 3,
      chapterName: 'Pair of Linear Equations in Two Variables',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'COMPLETED',
      completionDate: '05 Sept 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 14,
    },
    {
      id: 'mat-4',
      chapterNumber: 4,
      chapterName: 'Quadratic Equations & Nature of Roots',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'COMPLETED',
      completionDate: '19 Sept 2026',
      weightage: '6 Marks',
      revisionStatus: 'REVISED',
      totalLectures: 12,
    },
    {
      id: 'mat-5',
      chapterNumber: 5,
      chapterName: 'Arithmetic Progressions (AP)',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'IN_PROGRESS',
      targetDate: '05 Oct 2026',
      weightage: '7 Marks',
      revisionStatus: 'SCHEDULED',
      totalLectures: 14,
    },
    {
      id: 'mat-6',
      chapterNumber: 6,
      chapterName: 'Triangles (Similarity & Theorems)',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'UPCOMING',
      targetDate: '22 Oct 2026',
      weightage: '8 Marks',
      revisionStatus: 'PENDING',
      totalLectures: 16,
    },
    {
      id: 'mat-7',
      chapterNumber: 7,
      chapterName: 'Introduction to Trigonometry',
      subject: 'Mathematics',
      teacher: 'Mrs. Priya Sundaram',
      status: 'UPCOMING',
      targetDate: '10 Nov 2026',
      weightage: '8 Marks',
      revisionStatus: 'PENDING',
      totalLectures: 14,
    },
  ];

  const filteredChapters = chapters.filter(
    (c) => selectedSubject === 'ALL' || c.subject.toUpperCase() === selectedSubject.toUpperCase()
  );

  const completedCount = chapters.filter((c) => c.status === 'COMPLETED').length;
  const inProgressCount = chapters.filter((c) => c.status === 'IN_PROGRESS').length;
  const totalCount = chapters.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Portion &amp; Syllabus Completion
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Curriculum progression and chapter-by-chapter completion status for Class 10 (CBSE).
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-xs text-xs font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4 mr-1.5 text-gray-500" />
          Print Syllabus Tracker
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <span className="text-xs text-amber-600 font-semibold block mt-1">
              Active classroom lectures
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Revised in Tuition</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900">12 Chapters</span>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              Post-assessment revision done
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Syllabus End</span>
            <span className="p-2 bg-[#EEF4FF] text-[#155EEF] rounded-xl border border-[#DCE5F2]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-gray-900">15 Nov 2026</span>
            <span className="text-xs text-[#155EEF] font-semibold block mt-1">
              Before Pre-Board Mock Exams
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {['ALL', 'Physics', 'Chemistry', 'Biology', 'Mathematics'].map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedSubject.toUpperCase() === subj.toUpperCase()
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {subj === 'ALL' ? 'All Subjects' : subj}
          </button>
        ))}
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm">
            {selectedSubject === 'ALL' ? 'All Core Subjects' : selectedSubject} Chapters ({filteredChapters.length})
          </h2>
          <span className="text-xs text-gray-500">Class 10 CBSE Board Syllabus</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5 text-left font-semibold">Ch #</th>
                <th className="px-6 py-3.5 text-left font-semibold">Chapter &amp; Topic</th>
                <th className="px-6 py-3.5 text-left font-semibold">Subject &amp; Faculty</th>
                <th className="px-6 py-3.5 text-left font-semibold">Weightage</th>
                <th className="px-6 py-3.5 text-left font-semibold">Status</th>
                <th className="px-6 py-3.5 text-left font-semibold">Date</th>
                <th className="px-6 py-3.5 text-left font-semibold">Revision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredChapters.map((ch) => (
                <tr key={ch.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">Ch {ch.chapterNumber}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    <div>{ch.chapterName}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{ch.totalLectures} Lectures Allotted</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800 block">{ch.subject}</span>
                    <span className="text-[11px] text-gray-500 block">{ch.teacher}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1048B5]">{ch.weightage}</td>
                  <td className="px-6 py-4">
                    {ch.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                    {ch.status === 'IN_PROGRESS' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 animate-spin" /> In Progress
                      </span>
                    )}
                    {ch.status === 'UPCOMING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                        Upcoming
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {ch.completionDate ? (
                      <span className="text-emerald-700 font-medium">{ch.completionDate}</span>
                    ) : (
                      <span className="text-gray-400">Target: {ch.targetDate}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        ch.revisionStatus === 'REVISED'
                          ? 'bg-blue-100 text-blue-800'
                          : ch.revisionStatus === 'SCHEDULED'
                          ? 'bg-[#EEF4FF] text-[#155EEF] border border-[#DCE5F2]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {ch.revisionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentPortionCompletionPage;
