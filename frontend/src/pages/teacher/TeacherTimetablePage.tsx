import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import {
  Clock,
  BookOpen,
  MapPin,
  Users,
  CheckCircle2,
  Printer,
  Sparkles,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface FacultySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  session: 'MORNING' | 'AFTERNOON' | 'EVENING';
  batch: string;
  subject: string;
  topic: string;
  room: string;
  studentCount: number;
  type: 'LECTURE' | 'PROBLEM_SOLVING' | 'DOUBT_CLEARING' | 'TEST_INVIGILATION';
}

const WEEKLY_FACULTY_SCHEDULE: FacultySlot[] = [
  // Monday
  {
    id: 'mon-01',
    day: 'Monday',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    session: 'MORNING',
    batch: 'Batch 10A Morning',
    subject: 'Physics',
    topic: 'Chapter 12: Electricity - Ohm’s Law & Resistance Factors',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
    type: 'LECTURE',
  },
  {
    id: 'mon-02',
    day: 'Monday',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    session: 'AFTERNOON',
    batch: 'Batch 10A / 10B Combined',
    subject: 'Physics & Maths',
    topic: 'Weekly Doubt Clearing Desk & Homework Review',
    room: 'Room 104 (Tutorial Room)',
    studentCount: 18,
    type: 'DOUBT_CLEARING',
  },
  {
    id: 'mon-03',
    day: 'Monday',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    session: 'EVENING',
    batch: 'Batch 10A Evening',
    subject: 'Physics',
    topic: 'Chapter 12: Electricity - Resistance in Series & Parallel',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
    type: 'LECTURE',
  },

  // Tuesday
  {
    id: 'tue-01',
    day: 'Tuesday',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    session: 'MORNING',
    batch: 'Batch 10A Morning',
    subject: 'Mathematics',
    topic: 'Chapter 6: Triangles - Criteria for Similarity (AAA, SSS, SAS)',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
    type: 'LECTURE',
  },
  {
    id: 'tue-02',
    day: 'Tuesday',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    session: 'EVENING',
    batch: 'Batch 10A Evening',
    subject: 'Mathematics',
    topic: 'Chapter 6: Triangles - Similar Triangles Riders & Proofs',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
    type: 'LECTURE',
  },

  // Wednesday
  {
    id: 'wed-01',
    day: 'Wednesday',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    session: 'MORNING',
    batch: 'Batch 10A Morning',
    subject: 'Physics',
    topic: 'Chapter 12: Electricity - Numerical Problem Solving (Joule’s Heating)',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
    type: 'PROBLEM_SOLVING',
  },
  {
    id: 'wed-02',
    day: 'Wednesday',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    session: 'AFTERNOON',
    batch: 'Batch 9A Morning / Foundation',
    subject: 'Physics',
    topic: 'Foundation Motion & Force Advanced Problem Practice',
    room: 'Room 104 (Tutorial Room)',
    studentCount: 20,
    type: 'LECTURE',
  },
  {
    id: 'wed-03',
    day: 'Wednesday',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    session: 'EVENING',
    batch: 'Batch 10A Evening',
    subject: 'Physics',
    topic: 'Chapter 12: Electricity - Numerical Problem Solving (Circuit Analysis)',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
    type: 'PROBLEM_SOLVING',
  },

  // Thursday
  {
    id: 'thu-01',
    day: 'Thursday',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    session: 'MORNING',
    batch: 'Batch 10A Morning',
    subject: 'Mathematics',
    topic: 'Chapter 6: Triangles - Areas of Similar Triangles & Pythagoras Theorem',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
    type: 'LECTURE',
  },
  {
    id: 'thu-02',
    day: 'Thursday',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    session: 'EVENING',
    batch: 'Batch 10A Evening',
    subject: 'Mathematics',
    topic: 'Chapter 6: Triangles - Advanced Proofs & NCERT Exemplar Problems',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
    type: 'LECTURE',
  },

  // Friday
  {
    id: 'fri-01',
    day: 'Friday',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    session: 'MORNING',
    batch: 'Batch 10A Morning',
    subject: 'Physics',
    topic: 'Chapter 10 & 11: Rapid Flash Revision for Upcoming Unit Test',
    room: 'Room 101 (Main Lecture Hall)',
    studentCount: 42,
    type: 'LECTURE',
  },
  {
    id: 'fri-02',
    day: 'Friday',
    startTime: '04:00 PM',
    endTime: '05:00 PM',
    session: 'AFTERNOON',
    batch: 'Batch 10A All',
    subject: 'Science & Maths',
    topic: 'Parent Progress Updates & Student Remedial Mentoring',
    room: 'Staff Room 2B',
    studentCount: 12,
    type: 'DOUBT_CLEARING',
  },
  {
    id: 'fri-03',
    day: 'Friday',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    session: 'EVENING',
    batch: 'Batch 10A Evening',
    subject: 'Physics',
    topic: 'Chapter 10 & 11: Formula Revision & Board Question Bank Analysis',
    room: 'Room 102 (Science Wing)',
    studentCount: 38,
    type: 'LECTURE',
  },

  // Saturday
  {
    id: 'sat-01',
    day: 'Saturday',
    startTime: '06:30 AM',
    endTime: '08:30 AM',
    session: 'MORNING',
    batch: 'Batch 10A Morning',
    subject: 'Internal Assessment',
    topic: 'Physics Chapter 12 Test (50 Marks, 90 mins invigilation)',
    room: 'Examination Hall A',
    studentCount: 42,
    type: 'TEST_INVIGILATION',
  },
  {
    id: 'sat-02',
    day: 'Saturday',
    startTime: '05:30 PM',
    endTime: '07:30 PM',
    session: 'EVENING',
    batch: 'Batch 10A Evening',
    subject: 'Internal Assessment',
    topic: 'Physics Chapter 12 Test (50 Marks, 90 mins invigilation)',
    room: 'Examination Hall B',
    studentCount: 38,
    type: 'TEST_INVIGILATION',
  },
];

const DAYS = ['ALL', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TeacherTimetablePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedSession, setSelectedSession] = useState<string>('ALL');

  const filteredSlots = WEEKLY_FACULTY_SCHEDULE.filter((slot) => {
    if (selectedDay !== 'ALL' && slot.day !== selectedDay) return false;
    if (selectedSession !== 'ALL' && slot.session !== selectedSession) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Clock className="w-80 h-80 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-emerald-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Academic Year 2024-25 &bull; Term 2 Schedule
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Faculty Timetable & Class Allocations
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1 max-w-2xl">
              Official teaching roster for Mrs. Priya Sundaram (Senior Faculty, Physics & Mathematics). View batch schedules, room numbers, and session categories.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Weekly Teaching Hours"
          value="26 Hours"
          subtitle="13 Active Class Sessions / Week"
          icon={<Clock className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Assigned Batches"
          value="3 Batches"
          subtitle="Batch 10A Morning, 10A Eve, 9A Found"
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Classroom Venues"
          value="3 Venues"
          subtitle="Room 101, Room 102, Hall A"
          icon={<MapPin className="w-5 h-5 text-purple-600" />}
        />
        <StatCard
          title="Total Students Taught"
          value="80 Students"
          subtitle="Active Roster Across Classes"
          icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Day:
            </span>
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDay === day
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Session:</span>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Sessions</option>
              <option value="MORNING">Morning (06:30 - 08:30)</option>
              <option value="AFTERNOON">Afternoon (04:00 - 05:00)</option>
              <option value="EVENING">Evening (05:30 - 07:30)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Slots List */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No classes scheduled</h3>
            <p className="text-xs text-gray-400 mt-1">Try selecting another day or session filter.</p>
          </Card>
        ) : (
          filteredSlots.map((slot) => (
            <Card
              key={slot.id}
              className="p-5 border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-24 text-center py-2 px-3 bg-emerald-50 border border-emerald-100 rounded-xl flex-shrink-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {slot.day}
                  </span>
                  <span className="block text-xs font-extrabold text-gray-900 mt-0.5">
                    {slot.startTime}
                  </span>
                  <span className="block text-[10px] text-gray-400">to {slot.endTime}</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                      {slot.batch}
                    </span>
                    <span className="text-xs text-gray-400">&bull;</span>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {slot.subject}
                    </span>
                    <span className="text-xs text-gray-400">&bull;</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        slot.type === 'LECTURE'
                          ? 'bg-blue-50 text-blue-700'
                          : slot.type === 'PROBLEM_SOLVING'
                          ? 'bg-amber-50 text-amber-700'
                          : slot.type === 'TEST_INVIGILATION'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {slot.type === 'LECTURE'
                        ? 'Lecture'
                        : slot.type === 'PROBLEM_SOLVING'
                        ? 'Numerical Problem Solving'
                        : slot.type === 'TEST_INVIGILATION'
                        ? 'Test Invigilation'
                        : 'Doubt Clearing Desk'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{slot.topic}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1 text-gray-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {slot.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      {slot.studentCount} Students Enrolled
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Attendance Logged
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.location.href = '/teacher/attendance'}
                >
                  Take Attendance
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
export default TeacherTimetablePage;
