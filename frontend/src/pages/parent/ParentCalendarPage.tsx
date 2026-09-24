import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "20 Sept 2026"
  day: string;
  time: string;
  type: 'EXAM' | 'PTM' | 'HOLIDAY' | 'SCORECARD' | 'WORKSHOP';
  description: string;
  location: string;
  isMandatory: boolean;
}

export const ParentCalendarPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<'SEPT' | 'OCT' | 'NOV'>('SEPT');

  const events: CalendarEvent[] = [
    // September 2026
    {
      id: 'evt-1',
      title: 'Term 1 Chapter Diagnostic Assessments',
      date: '2026-09-05',
      displayDate: '01 - 06 Sept 2026',
      day: 'Monday - Saturday',
      time: '05:30 PM - 07:30 PM',
      type: 'EXAM',
      description: 'Comprehensive diagnostic tests in Physics (Ch 1) and Chemistry (Ch 1).',
      location: 'Main Examination Hall',
      isMandatory: true,
    },
    {
      id: 'evt-2',
      title: 'Mid-Term Unit Tests (Physics, Chem, Bio, Maths)',
      date: '2026-09-18',
      displayDate: '15 - 18 Sept 2026',
      day: 'Tuesday - Friday',
      time: '05:30 PM - 08:00 PM',
      type: 'EXAM',
      description: 'Half-yearly periodic unit assessment covering 40% syllabus.',
      location: 'Main Examination Hall',
      isMandatory: true,
    },
    {
      id: 'evt-3',
      title: 'Parent-Teacher Meeting (PTM Term 1)',
      date: '2026-09-20',
      displayDate: '20 Sept 2026',
      day: 'Saturday',
      time: '10:00 AM - 01:30 PM',
      type: 'PTM',
      description: 'Individual progress review with Subject Faculty and Director Dr. Ramesh Sharma.',
      location: 'Auditorium & Faculty Rooms',
      isMandatory: true,
    },
    {
      id: 'evt-4',
      title: 'Official Scorecard & Evaluated Papers Distribution',
      date: '2026-09-24',
      displayDate: '24 Sept 2026',
      day: 'Wednesday',
      time: '06:00 PM',
      type: 'SCORECARD',
      description: 'Digital portal publication of verified marks and audited answer sheets.',
      location: 'Parent Portal & Center Office',
      isMandatory: false,
    },
    {
      id: 'evt-5',
      title: 'Ganesh Chaturthi Holiday',
      date: '2026-09-27',
      displayDate: '27 Sept 2026',
      day: 'Sunday',
      time: 'All Day',
      type: 'HOLIDAY',
      description: 'Institute closed on account of festive holiday. Self-study assignments shared.',
      location: 'Institute Premises Closed',
      isMandatory: false,
    },

    // October 2026
    {
      id: 'evt-6',
      title: 'Gandhi Jayanti Holiday',
      date: '2026-10-02',
      displayDate: '02 Oct 2026',
      day: 'Friday',
      time: 'All Day',
      type: 'HOLIDAY',
      description: 'National holiday observed.',
      location: 'Center Closed',
      isMandatory: false,
    },
    {
      id: 'evt-7',
      title: 'Science Practical Demonstration & Lab Workshop',
      date: '2026-10-10',
      displayDate: '10 Oct 2026',
      day: 'Saturday',
      time: '03:00 PM - 06:00 PM',
      type: 'WORKSHOP',
      description: 'Hands-on Optics ray tracing and chemical reaction verification for Class 10.',
      location: 'Science Laboratory 1 & 2',
      isMandatory: true,
    },
    {
      id: 'evt-8',
      title: 'Pre-Board Mock Series - Round 1',
      date: '2026-10-25',
      displayDate: '22 - 28 Oct 2026',
      day: 'Thursday - Wednesday',
      time: '09:00 AM - 12:00 PM',
      type: 'EXAM',
      description: 'Simulated CBSE Board exam condition testing for Mathematics and Science.',
      location: 'Examination Wing',
      isMandatory: true,
    },

    // November 2026
    {
      id: 'evt-9',
      title: 'Diwali Festive Break',
      date: '2026-11-01',
      displayDate: '01 - 04 Nov 2026',
      day: 'Sunday - Wednesday',
      time: 'All Day',
      type: 'HOLIDAY',
      description: 'Diwali holidays. Regular lectures resume on 05 November.',
      location: 'Center Closed',
      isMandatory: false,
    },
    {
      id: 'evt-10',
      title: 'Complete Syllabus Wrap-Up & Revision Kickoff',
      date: '2026-11-15',
      displayDate: '15 Nov 2026',
      day: 'Sunday',
      time: '10:00 AM - 01:00 PM',
      type: 'WORKSHOP',
      description: 'Target completion of 100% CBSE syllabus and distribution of Question Bank.',
      location: 'Auditorium',
      isMandatory: true,
    },
  ];

  const getBadgeStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'EXAM':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PTM':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HOLIDAY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SCORECARD':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WORKSHOP':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const filteredEvents = events.filter((e) => {
    if (selectedMonth === 'SEPT') return e.date.startsWith('2026-09');
    if (selectedMonth === 'OCT') return e.date.startsWith('2026-10');
    return e.date.startsWith('2026-11');
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Academic Calendar 2026–27
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Exam schedules, parent-teacher meetings, scorecard releases, and holidays.
            </p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setSelectedMonth('SEPT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === 'SEPT'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            September 2026
          </button>
          <button
            onClick={() => setSelectedMonth('OCT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === 'OCT'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            October 2026
          </button>
          <button
            onClick={() => setSelectedMonth('NOV')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === 'NOV'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            November 2026
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getBadgeStyle(evt.type)}`}>
                  {evt.type}
                </span>
                {evt.isMandatory && (
                  <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    Mandatory Attendance
                  </span>
                )}
                <span className="text-xs font-semibold text-gray-500">
                  {evt.displayDate} ({evt.day})
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-900">{evt.title}</h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">{evt.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col justify-between items-start md:items-end gap-2 text-xs text-gray-500 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {evt.time}
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {evt.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentCalendarPage;
