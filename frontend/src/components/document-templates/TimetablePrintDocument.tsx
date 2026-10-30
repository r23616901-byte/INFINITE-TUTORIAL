import React from 'react';
import { DocumentLayout } from './DocumentLayout';
import { DocumentMetadata } from '../../types/documentTemplates';

export interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  faculty: string;
  room: string;
  sessionType: string;
  badgeColor?: string;
}

export interface TimetablePrintDocumentProps {
  slots: TimetableSlot[];
  batchName?: string;
  className?: string;
  boardName?: string;
  academicYear?: string;
  centerLocation?: string;
  studentName?: string;
  studentId?: string;
  orientation?: 'portrait' | 'landscape';
  isForPreview?: boolean;
}

/**
 * Official Institutional Timetable Document Template
 * Standardized ISO A4 layout with Dark Academic Green branding (#0A3622),
 * guaranteed column widths preventing awkward text wrapping,
 * clean session badges, guidelines, and verified institutional signature blocks.
 */
export const TimetablePrintDocument: React.FC<TimetablePrintDocumentProps> = ({
  slots,
  batchName = 'Batch 10A Evening',
  className = 'Class 10',
  boardName = 'CBSE',
  academicYear = 'AY 2024–25 (Term 2)',
  centerLocation = 'Main Center Wing',
  studentName,
  studentId,
  orientation = 'portrait',
  isForPreview: _isForPreview = false,
}) => {
  const metadata: DocumentMetadata = {
    className,
    boardName,
    batchName,
    academicYear,
    facultyName: 'Infinite Academic Directorate',
    studentName,
    studentId,
  };

  const formatSessionType = (type: string) => {
    const upper = type.toUpperCase().trim();
    if (upper === 'LECTURE') return 'Lecture';
    if (upper === 'DOUBT_CLEARING' || upper === 'DOUBT_CLEAR') return 'Doubt Clearing';
    if (upper === 'TEST') return 'Assessment Test';
    if (upper === 'PRACTICE') return 'Practice Drill';
    return type.replace(/_/g, ' ');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.replace('-', '–');
  };

  return (
    <DocumentLayout
      documentTitle="STUDENT TIMETABLE & WEEKLY TUITION SCHEDULE"
      documentSubtitle={`Official Academic Schedule • ${batchName} (${className} ${boardName})`}
      reportCategory="OFFICIAL TIMETABLE ROSTER"
      metadata={metadata}
      orientation={orientation}
      showSignatures={true}
      signatureLabels={['Faculty In-Charge', 'Academic Coordinator', 'Director / Principal']}
      customFooterNote="Official Student Timetable Schedule of Infinite Tutorial. Please retain a printed copy at home study desk."
    >
      {/* 1. Timetable Metrics Strip */}
      <section className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3 avoid-break">
        <div>
          <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Assigned Batch</span>
          <span className="font-bold text-[#0A3622]">{batchName}</span>
        </div>
        <div>
          <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Class &amp; Board</span>
          <span className="font-bold text-slate-900">{className} &bull; {boardName}</span>
        </div>
        <div>
          <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Weekly Cycles</span>
          <span className="font-bold text-slate-900">Monday to Saturday</span>
        </div>
        <div>
          <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Tuition Location</span>
          <span className="font-semibold text-slate-800">{centerLocation}</span>
        </div>
      </section>

      {/* 2. Structured Timetable Schedule Table */}
      <section className="doc-section-card border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs avoid-break">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A3622] text-white text-[10px] uppercase font-bold tracking-wider">
              <th className="py-2.5 px-3 border-r border-[#166534] whitespace-nowrap min-w-[85px]">
                Day
              </th>
              <th className="py-2.5 px-3 border-r border-[#166534] whitespace-nowrap min-w-[155px]">
                Timing
              </th>
              <th className="py-2.5 px-3 border-r border-[#166534] whitespace-nowrap min-w-[110px]">
                Subject
              </th>
              <th className="py-2.5 px-3 border-r border-[#166534]">
                Curriculum Topic / Module
              </th>
              <th className="py-2.5 px-3 border-r border-[#166534] whitespace-nowrap min-w-[125px]">
                Faculty
              </th>
              <th className="py-2.5 px-3 border-r border-[#166534] text-center whitespace-nowrap min-w-[90px]">
                Room
              </th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap min-w-[105px]">
                Session Type
              </th>
            </tr>
          </thead>
          <tbody className="text-[11px] divide-y divide-slate-200">
            {slots.map((slot, index) => {
              const sessionLabel = formatSessionType(slot.sessionType);
              const isTest = slot.sessionType.toUpperCase() === 'TEST';
              const isDoubt = slot.sessionType.toUpperCase().includes('DOUBT');

              return (
                <tr
                  key={slot.id || index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                    {slot.day}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap text-[10.5px]">
                    {formatTime(slot.time)}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#0A3622] border-r border-slate-200 whitespace-nowrap">
                    {slot.subject}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200 leading-snug">
                    {slot.topic}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 border-r border-slate-200 whitespace-nowrap">
                    {slot.faculty}
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-200 whitespace-nowrap font-medium text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                      {slot.room}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isTest
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isDoubt
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {sessionLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* 3. Institutional Guidelines for Students & Parents */}
      <section className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 avoid-break">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 doc-section-heading">
          <span className="w-2 h-2 rounded-full bg-[#0A3622] inline-block" />
          Academic Timetable Instructions &amp; Attendance Policy:
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px] pl-1 leading-relaxed">
          <li>
            <strong>Punctuality:</strong> Students are required to reach the assigned lecture hall 10 minutes prior to session commencement.
          </li>
          <li>
            <strong>Weekly Assessments:</strong> Saturday assessment sessions are compulsory for all enrolled students; evaluations are published within 48 hours.
          </li>
          <li>
            <strong>Doubt Clearing &amp; Problem Solving:</strong> Friday tutorial periods are reserved for homework verification, formula reinforcement, and one-on-one faculty doubt resolution.
          </li>
          <li>
            <strong>Schedule Changes:</strong> Any institutional adjustments or holiday revisions are communicated via the parent portal announcement bulletin.
          </li>
        </ol>
      </section>
    </DocumentLayout>
  );
};
