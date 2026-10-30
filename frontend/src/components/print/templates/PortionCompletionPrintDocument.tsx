import React from 'react';
import { PrintLayout } from '../PrintLayout';

export interface PortionChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  subject: string;
  totalLectures: number;
  completedLectures: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | string;
  faculty?: string;
  targetDate?: string;
  completionDate?: string;
  weightageMarks?: number;
  verifiedByAdmin?: boolean;
}

export interface PortionCompletionPrintDocumentProps {
  chapters: PortionChapterItem[];
  batchName?: string;
  className?: string;
  boardName?: string;
  selectedSubject?: string;
  academicYear?: string;
  isForPreview?: boolean;
}

export const PortionCompletionPrintDocument: React.FC<PortionCompletionPrintDocumentProps> = ({
  chapters,
  batchName = 'Class 10 CBSE - Morning & Evening',
  className: studentClass = 'Class 10',
  boardName = 'CBSE',
  selectedSubject = 'All Subjects',
  academicYear = 'AY 2024–2025',
  isForPreview = false,
}) => {
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((c) => c.status === 'COMPLETED').length;
  const inProgressChapters = chapters.filter((c) => c.status === 'IN_PROGRESS').length;
  const scheduledChapters = chapters.filter((c) => c.status === 'SCHEDULED').length;

  const totalPortions = chapters.reduce((acc, c) => acc + (c.totalLectures || 0), 0);
  const completedPortions = chapters.reduce((acc, c) => acc + (c.completedLectures || 0), 0);
  const pendingPortions = totalPortions - completedPortions;
  const overallPercentage =
    totalPortions > 0 ? Number(((completedPortions / totalPortions) * 100).toFixed(1)) : 0;

  return (
    <PrintLayout
      documentTitle="OFFICIAL SYLLABUS & PORTION COMPLETION TRACKING REPORT"
      documentSubtitle="Curriculum Delivery Audit, Chapter Milestones & Board Examination Readiness"
      reportCategory="PORTION COMPLETION REPORT"
      metadata={{
        className: studentClass,
        boardName,
        batchName,
        subjectName: selectedSubject,
        academicYear,
      }}
      isForPreview={isForPreview}
      customFooterNote="Official Syllabus and Portion Completion Record of Infinite Tutorial Academic ERP. Verified against secondary board curriculum guidelines."
    >
      {/* 1. Milestone Audit KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Overall Portion Progress</span>
          <span className="text-lg sm:text-xl font-black text-[#0A3622] mt-0.5 block">{overallPercentage}%</span>
          <span className="text-[8.5px] font-semibold text-slate-600">
            {completedPortions} of {totalPortions} Portions
          </span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Completed Chapters</span>
          <span className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5 block">{completedChapters}</span>
          <span className="text-[8.5px] font-semibold text-slate-600">Verified Finished</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">In Progress</span>
          <span className="text-lg sm:text-xl font-black text-blue-800 mt-0.5 block">{inProgressChapters}</span>
          <span className="text-[8.5px] font-semibold text-slate-600">Active in Classroom</span>
        </div>

        <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-300 rounded-lg">
          <span className="text-[9px] font-bold uppercase text-slate-500 block">Upcoming / Scheduled</span>
          <span className="text-lg sm:text-xl font-black text-amber-800 mt-0.5 block">{scheduledChapters}</span>
          <span className="text-[8.5px] font-semibold text-slate-600">Targeted for Term End</span>
        </div>
      </div>

      {/* 2. Visual Progress Bar (Printer and Grayscale Safe) */}
      <div className="p-2.5 bg-white border border-slate-300 rounded-lg">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 mb-1">
          <span>Curriculum Coverage Progress</span>
          <span className="font-mono">{overallPercentage}% ({completedPortions}/{totalPortions} Portions)</span>
        </div>
        <div className="w-full h-3.5 bg-slate-200 rounded overflow-hidden border border-slate-300 flex">
          <div
            style={{ width: `${overallPercentage}%` }}
            className="bg-[#0A3622] h-full text-white text-[8px] font-bold flex items-center justify-center print:bg-slate-800"
          >
            {overallPercentage > 10 ? `${overallPercentage}%` : ''}
          </div>
        </div>
      </div>

      {/* 3. Detailed Syllabus Chapters Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs border border-slate-300">
          <thead>
            <tr>
              <th className="py-2 px-2 text-center w-10 whitespace-nowrap">S.No</th>
              <th className="py-2 px-3 whitespace-nowrap">Subject</th>
              <th className="py-2 px-3 whitespace-nowrap">Chapter / Syllabus Unit</th>
              <th className="py-2 px-2 text-center whitespace-nowrap">Total Portions</th>
              <th className="py-2 px-2 text-center whitespace-nowrap">Completed</th>
              <th className="py-2 px-2 text-center whitespace-nowrap">Pending</th>
              <th className="py-2 px-2 text-center whitespace-nowrap">Progress %</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Status</th>
              <th className="py-2 px-3 text-center whitespace-nowrap">Target / Completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {chapters.map((ch, idx) => {
              const chTotal = ch.totalLectures || 0;
              const chDone = ch.completedLectures || 0;
              const chPending = Math.max(chTotal - chDone, 0);
              const chPct = chTotal > 0 ? Math.round((chDone / chTotal) * 100) : 0;

              return (
                <tr key={ch.id} className="hover:bg-slate-50/50">
                  <td className="py-2 px-2 text-center font-mono text-slate-500 whitespace-nowrap">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">{ch.subject}</td>
                  <td className="py-2 px-3 min-w-[160px]">
                    <span className="font-bold text-slate-900 block">
                      Ch {ch.chapterNumber}: {ch.title}
                    </span>
                    {ch.faculty && (
                      <span className="text-[9.5px] text-slate-500 block font-normal">
                        Faculty: {ch.faculty}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center text-slate-700 whitespace-nowrap">{chTotal}</td>
                  <td className="py-2 px-2 text-center font-bold text-emerald-800 whitespace-nowrap">{chDone}</td>
                  <td className="py-2 px-2 text-center text-slate-600 whitespace-nowrap">{chPending}</td>
                  <td className="py-2 px-2 text-center font-bold text-[#0A3622] whitespace-nowrap">{chPct}%</td>
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold border ${
                        ch.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : ch.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-900 border-blue-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {ch.status === 'COMPLETED'
                        ? 'Completed'
                        : ch.status === 'IN_PROGRESS'
                        ? 'In Progress'
                        : 'Scheduled'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center text-[10px] text-slate-600 font-mono whitespace-nowrap">
                    {ch.completionDate || ch.targetDate || 'TBD'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
            <tr>
              <td colSpan={3} className="py-2 px-3 text-right uppercase font-black text-[#0A3622] whitespace-nowrap">
                Curriculum Totals:
              </td>
              <td className="py-2 px-2 text-center font-black whitespace-nowrap">{totalPortions}</td>
              <td className="py-2 px-2 text-center font-black text-emerald-800 whitespace-nowrap">{completedPortions}</td>
              <td className="py-2 px-2 text-center font-black whitespace-nowrap">{pendingPortions}</td>
              <td className="py-2 px-2 text-center font-black text-[#0A3622] whitespace-nowrap">{overallPercentage}%</td>
              <td colSpan={2} className="py-2 px-3 text-center text-[10px] text-slate-600 whitespace-nowrap">
                {completedChapters} Finished / {totalChapters} Chapters
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </PrintLayout>
  );
};
