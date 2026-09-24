import React, { useState } from 'react';
import {
  Clock,
  BookOpen,
  MapPin,
  User,
  CheckCircle2,
  Printer,
} from 'lucide-react';

interface TimetableSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  faculty: string;
  room: string;
  sessionType: 'LECTURE' | 'PRACTICE' | 'TEST' | 'DOUBT_CLEARING';
  badgeColor: string;
}

export const ParentTimetablePage: React.FC = () => {
  const [activeSession, setActiveSession] = useState<'MORNING' | 'EVENING'>('EVENING');

  const eveningSlots: TimetableSlot[] = [
    {
      id: 'e-mon',
      day: 'Monday',
      time: '05:30 PM - 08:00 PM',
      subject: 'Physics',
      topic: 'Light - Reflection, Ray Tracing & Mirror Formula',
      faculty: 'Prof. Rajesh Sharma',
      room: 'Lecture Hall 2',
      sessionType: 'LECTURE',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'e-tue',
      day: 'Tuesday',
      time: '05:30 PM - 08:00 PM',
      subject: 'Chemistry',
      topic: 'Metals & Non-Metals Metallurgy Reactions',
      faculty: 'Dr. Anita Deshmukh',
      room: 'Chemistry Lab / Room 3',
      sessionType: 'LECTURE',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'e-wed',
      day: 'Wednesday',
      time: '05:30 PM - 08:00 PM',
      subject: 'Mathematics',
      topic: 'Arithmetic Progressions & Word Problems',
      faculty: 'Mrs. Priya Sundaram',
      room: 'Lecture Hall 1',
      sessionType: 'LECTURE',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'e-thu',
      day: 'Thursday',
      time: '05:30 PM - 08:00 PM',
      subject: 'Biology',
      topic: 'Heredity & Monohybrid Cross Analysis',
      faculty: 'Dr. Vikram Rao',
      room: 'Bio-Science Wing 1',
      sessionType: 'LECTURE',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'e-fri',
      day: 'Friday',
      time: '05:30 PM - 08:00 PM',
      subject: 'Science Problem Solving',
      topic: 'Physics Ray Diagrams & Chemistry Balancing Drills',
      faculty: 'Prof. Rajesh Sharma & Dr. Anita Deshmukh',
      room: 'Discussion Hall A',
      sessionType: 'DOUBT_CLEARING',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'e-sat',
      day: 'Saturday',
      time: '05:30 PM - 07:30 PM',
      subject: 'Weekly Proctored Assessment',
      topic: 'Subject Periodic Test Series & Immediate Answer Evaluation',
      faculty: 'Academic Examination Board',
      room: 'Examination Center',
      sessionType: 'TEST',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  const morningSlots: TimetableSlot[] = [
    {
      id: 'm-mon',
      day: 'Monday',
      time: '07:00 AM - 09:30 AM',
      subject: 'Physics',
      topic: 'Electricity & Circuits Formula Derivations',
      faculty: 'Prof. Rajesh Sharma',
      room: 'Lecture Hall 1',
      sessionType: 'LECTURE',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'm-tue',
      day: 'Tuesday',
      time: '07:00 AM - 09:30 AM',
      subject: 'Chemistry',
      topic: 'Chemical Reactions & Balancing Drill',
      faculty: 'Dr. Anita Deshmukh',
      room: 'Chemistry Lab',
      sessionType: 'LECTURE',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'm-wed',
      day: 'Wednesday',
      time: '07:00 AM - 09:30 AM',
      subject: 'Mathematics',
      topic: 'Quadratic Equations & Polynomials Proofs',
      faculty: 'Mrs. Priya Sundaram',
      room: 'Lecture Hall 2',
      sessionType: 'LECTURE',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'm-thu',
      day: 'Thursday',
      time: '07:00 AM - 09:30 AM',
      subject: 'Biology',
      topic: 'Life Processes & Plant Transportation',
      faculty: 'Dr. Vikram Rao',
      room: 'Bio-Science Wing 1',
      sessionType: 'LECTURE',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'm-fri',
      day: 'Friday',
      time: '07:00 AM - 09:30 AM',
      subject: 'Maths Advanced Drills',
      topic: 'NCERT Exemplar & Board HOTS Questions',
      faculty: 'Mrs. Priya Sundaram',
      room: 'Discussion Hall B',
      sessionType: 'PRACTICE',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'm-sat',
      day: 'Saturday',
      time: '07:00 AM - 09:00 AM',
      subject: 'Weekly Unit Assessment',
      topic: 'Maths & Science Combined Test',
      faculty: 'Academic Examination Board',
      room: 'Examination Center',
      sessionType: 'TEST',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  const currentSlots = activeSession === 'EVENING' ? eveningSlots : morningSlots;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Class Timetable &amp; Weekly Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Batch 10A Academic Timings, assigned tuition rooms, and subject faculty.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-xs text-xs font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-4 h-4 mr-1.5 text-gray-500" />
          Print Timetable
        </button>
      </div>

      {/* Session Switcher & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Select Batch Session:</span>
          <div className="flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveSession('EVENING')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSession === 'EVENING'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Batch 10A Evening (Current)
            </button>
            <button
              onClick={() => setActiveSession('MORNING')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSession === 'MORNING'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Batch 10A Morning
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" /> Main Center Wing
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Classes Active
          </span>
        </div>
      </div>

      {/* Weekly Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentSlots.map((slot) => (
          <div
            key={slot.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-base font-bold text-gray-900">{slot.day}</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${slot.badgeColor}`}>
                  {slot.sessionType}
                </span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{slot.time}</span>
                </div>

                <div>
                  <span className="text-sm font-bold text-blue-900 block">{slot.subject}</span>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{slot.topic}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-gray-400" />
                {slot.faculty}
              </span>
              <span className="font-semibold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                {slot.room}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tuition Notes */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-xs text-blue-900 space-y-1.5">
        <h4 className="font-bold flex items-center gap-1.5 text-blue-950">
          <BookOpen className="w-4 h-4 text-blue-600" /> Timetable Guidelines for Parents
        </h4>
        <p className="text-blue-800">
          • Students are requested to reach the institute 10 minutes prior to class start time.
        </p>
        <p className="text-blue-800">
          • Saturday test sessions are mandatory for all enrolled students; evaluations are published within 48 hours.
        </p>
      </div>
    </div>
  );
};

export default ParentTimetablePage;
